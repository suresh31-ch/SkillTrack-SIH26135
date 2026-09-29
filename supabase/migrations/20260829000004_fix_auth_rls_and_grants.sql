-- =========================================================================
-- SKILLTRACK AUTHENTICATION & MULTI-TENANT RLS POLICIES & SCHEMA GRANTS
-- =========================================================================

-- 1. Explicitly grant schema and table access to anon, authenticated, and service_role
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 2. Organizations access: Public / Authenticated read
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read on organizations" ON public.organizations;
DROP POLICY IF EXISTS "organizations_select_policy" ON public.organizations;

CREATE POLICY "Allow read on organizations"
    ON public.organizations
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. Profiles access: Self-access with strict multi-tenant boundaries
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id OR auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = id OR auth.uid() = auth_user_id);

-- 4. Candidate Profiles access: Self-access
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Candidate can view own candidate profile" ON public.candidate_profiles;
DROP POLICY IF EXISTS "Candidate can update own candidate profile" ON public.candidate_profiles;
DROP POLICY IF EXISTS "Candidate can insert own candidate profile" ON public.candidate_profiles;

CREATE POLICY "Candidate can view own candidate profile"
    ON public.candidate_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = profile_id);

CREATE POLICY "Candidate can insert own candidate profile"
    ON public.candidate_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Candidate can update own candidate profile"
    ON public.candidate_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

-- 5. Trigger: Reliable Profile Provisioning
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_org_id UUID;
    user_role TEXT;
    user_full_name TEXT;
    user_phone TEXT;
    user_district TEXT;
BEGIN
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'candidate');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    user_phone := NEW.raw_user_meta_data->>'phone';
    user_district := COALESCE(NEW.raw_user_meta_data->>'district', 'Pune');

    BEGIN
        assigned_org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        assigned_org_id := NULL;
    END;

    IF assigned_org_id IS NULL THEN
        SELECT id INTO assigned_org_id FROM public.organizations LIMIT 1;
    END IF;

    -- Upsert profile with 1:1 ID mapping
    INSERT INTO public.profiles (
        id,
        auth_user_id,
        full_name,
        email,
        phone,
        role,
        organization_id,
        district,
        verification_status,
        profile_completion,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.id,
        user_full_name,
        NEW.email,
        user_phone,
        user_role,
        assigned_org_id,
        user_district,
        CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN 'verified' ELSE 'pending' END,
        CASE WHEN user_role = 'candidate' THEN 80 ELSE 60 END,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        district = EXCLUDED.district,
        verification_status = CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN 'verified' ELSE public.profiles.verification_status END,
        updated_at = now();

    -- If candidate, create candidate_profiles record
    IF user_role = 'candidate' THEN
        INSERT INTO public.candidate_profiles (
            profile_id,
            organization_id,
            target_role,
            career_goal,
            target_job,
            readiness_score,
            profile_completion,
            employment_status,
            placement_status,
            retention_status
        ) VALUES (
            NEW.id,
            assigned_org_id,
            'Full Stack Web Developer',
            'Full Stack Developer in Technology Sector',
            'Full Stack Web Developer',
            75,
            80,
            'in_training',
            'unplaced',
            'none'
        )
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
