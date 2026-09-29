-- =========================================================================
-- SKILLTRACK — COMPLETE SUPABASE BACKEND FOUNDATION & STRICT RLS
-- Problem Statement: SIH26135 (Skilling Outcomes, Skill Gaps & Retention)
-- Milestone: Complete Schema with 20 Core Entities, Multi-Tenant RLS & Triggers
-- =========================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. ORGANIZATIONS / TENANTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Government Program',
    logo_url TEXT,
    contact_email TEXT,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Pune',
    location TEXT DEFAULT 'Mantralaya, Nariman Point, Mumbai - 400032',
    subscription_plan TEXT DEFAULT 'Enterprise',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'trial', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure district column exists if table was pre-created
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Pune';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Maharashtra';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- =========================================================================
-- 2. PROFILES (Users & Roles - strictly linked to auth.users.id)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter', 'training_center', 'organization_admin')),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    district TEXT DEFAULT 'Pune',
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    profile_completion NUMERIC DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_profile_email UNIQUE (email),
    CONSTRAINT uq_profile_auth_user UNIQUE (auth_user_id)
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completion NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Pune';

-- =========================================================================
-- 3. CANDIDATE PROFILES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    target_role TEXT DEFAULT 'Full Stack Web Developer',
    career_goal TEXT DEFAULT 'Software Engineer in IT/Tech Sector',
    target_job TEXT DEFAULT 'Full Stack Web Developer',
    readiness_score NUMERIC DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
    profile_completion NUMERIC DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
    employment_status TEXT DEFAULT 'unemployed' CHECK (employment_status IN ('unemployed', 'in_training', 'placed', 'verified_employed', 'seeking_upgrade')),
    placement_status TEXT DEFAULT 'unplaced' CHECK (placement_status IN ('unplaced', 'screening', 'interviewing', 'placed', 'retention_verified')),
    retention_status TEXT DEFAULT 'none' CHECK (retention_status IN ('none', '3_month_verified', '6_month_verified', '12_month_verified', 'failed_retention')),
    education TEXT DEFAULT 'Bachelor of Technology (B.Tech)',
    degree TEXT DEFAULT 'Computer Science & Engineering',
    graduation_year INTEGER DEFAULT 2025,
    experience_years NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'Full Stack Web Developer';
ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS career_goal TEXT DEFAULT 'Software Engineer';
ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS placement_status TEXT DEFAULT 'unplaced';
ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS retention_status TEXT DEFAULT 'none';

-- =========================================================================
-- 4. SKILLS (Master Taxonomy)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 5. CANDIDATE SKILLS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level TEXT NOT NULL DEFAULT 'Beginner' CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    proficiency TEXT NOT NULL DEFAULT 'Beginner',
    source TEXT DEFAULT 'Self-Declaration',
    verified BOOLEAN NOT NULL DEFAULT false,
    verification_source TEXT DEFAULT 'Self-Declaration',
    assessment_score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_candidate_skill UNIQUE (candidate_id, skill_id)
);

ALTER TABLE public.candidate_skills ADD COLUMN IF NOT EXISTS proficiency TEXT DEFAULT 'Beginner';
ALTER TABLE public.candidate_skills ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Self-Declaration';
ALTER TABLE public.candidate_skills ADD COLUMN IF NOT EXISTS assessment_score NUMERIC DEFAULT 0;

-- =========================================================================
-- 6. TARGET ROLES (Job Roles Taxonomy)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.target_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    name TEXT,
    description TEXT,
    category TEXT NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    avg_salary_lpa NUMERIC DEFAULT 4.5,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Backward compatibility with job_roles
CREATE TABLE IF NOT EXISTS public.job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    icon_name TEXT,
    avg_salary_lpa NUMERIC DEFAULT 4.5,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 7. ROLE SKILLS (Required Skills per Target Role)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.role_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_role_id UUID REFERENCES public.target_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_level TEXT NOT NULL DEFAULT 'Intermediate' CHECK (required_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    required_proficiency TEXT DEFAULT 'Intermediate',
    importance TEXT NOT NULL DEFAULT 'Critical' CHECK (importance IN ('Critical', 'High', 'Medium', 'Low')),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_role_skill UNIQUE (target_role_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.job_role_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_role_id UUID REFERENCES public.job_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_proficiency TEXT NOT NULL DEFAULT 'Intermediate' CHECK (required_proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    importance TEXT NOT NULL DEFAULT 'Critical' CHECK (importance IN ('Critical', 'High', 'Medium', 'Low')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 8. LEARNING ROADMAPS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    target_role_id UUID REFERENCES public.target_roles(id) ON DELETE SET NULL,
    target_job TEXT DEFAULT 'Full Stack Web Developer',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
    progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    title TEXT DEFAULT 'Personalized Upskilling Roadmap',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 9. LEARNING ITEMS (Roadmap Topics & Modules)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.learning_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID NOT NULL REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    resource_url TEXT,
    completion_status TEXT NOT NULL DEFAULT 'pending' CHECK (completion_status IN ('pending', 'in_progress', 'completed')),
    progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Compatibility with roadmap_items
CREATE TABLE IF NOT EXISTS public.roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    estimated_time TEXT DEFAULT '4 Hours',
    resource_type TEXT DEFAULT 'Interactive Lab',
    practice_requirement TEXT,
    assessment_ready BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 10. ASSESSMENTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    score NUMERIC DEFAULT 0,
    max_score NUMERIC DEFAULT 100,
    percentage NUMERIC DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 11. ASSESSMENT RESULTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL DEFAULT 0,
    identified_gap BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 12. JOBS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL DEFAULT 'Partner Employer',
    description TEXT,
    location TEXT NOT NULL DEFAULT 'Pune, Maharashtra',
    employment_type TEXT DEFAULT 'Full-time' CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote / Hybrid')),
    required_skills JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paused', 'draft')),
    salary_min NUMERIC DEFAULT 350000,
    salary_max NUMERIC DEFAULT 600000,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 13. JOB APPLICATIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected')),
    skill_match_score NUMERIC DEFAULT 0,
    recruiter_notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_job_candidate UNIQUE (job_id, candidate_id)
);

-- =========================================================================
-- 14. PLACEMENTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    employer TEXT NOT NULL,
    job_role TEXT NOT NULL DEFAULT 'Junior Software Engineer',
    salary NUMERIC DEFAULT 420000,
    placement_date DATE DEFAULT CURRENT_DATE,
    joining_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'active', 'in_review', 'resigned', 'terminated')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'in_review', 'verified', 'flagged', 'needs_review', 'failed')),
    verification_method TEXT DEFAULT 'EPFO_Simulator',
    retention_3m TEXT DEFAULT 'pending',
    retention_6m TEXT DEFAULT 'pending',
    retention_12m TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 15. EMPLOYMENT RECORDS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.employment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    employer TEXT NOT NULL,
    job_role TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'resigned', 'terminated')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 16. RETENTION MILESTONES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.retention_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    employment_record_id UUID REFERENCES public.employment_records(id) ON DELETE CASCADE,
    milestone TEXT NOT NULL CHECK (milestone IN ('3_month', '6_month', '12_month')),
    milestone_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'failed', 'needs_review', 'simulated_epfo_verified')),
    verification_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 17. TRAINING CENTERS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.training_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'Pune',
    taluka TEXT DEFAULT 'Haveli',
    address TEXT NOT NULL DEFAULT 'Pune Vocational Training Center, Shivajinagar, Pune - 411005',
    contact_email TEXT NOT NULL DEFAULT 'pune.center@skilltrack.gov.in',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'audit_pending', 'suspended')),
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'flagged')),
    capacity INTEGER DEFAULT 120,
    placement_rate NUMERIC DEFAULT 82.5,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 18. TRAINING ENROLLMENTS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.training_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    training_center_id UUID NOT NULL REFERENCES public.training_centers(id) ON DELETE CASCADE,
    course TEXT NOT NULL DEFAULT 'Certified Full Stack Web Engineering',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
    completion NUMERIC DEFAULT 0 CHECK (completion >= 0 AND completion <= 100),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 19. CERTIFICATIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuing_organization TEXT NOT NULL DEFAULT 'Maharashtra State Skill Development Society (MSSDS)',
    issue_date DATE DEFAULT CURRENT_DATE,
    certificate_number TEXT UNIQUE,
    certificate_url TEXT,
    verification_status TEXT NOT NULL DEFAULT 'valid' CHECK (verification_status IN ('valid', 'revoked', 'pending')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 20. NOTIFICATIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- HIGH PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_org_name ON public.organizations(name);
CREATE INDEX IF NOT EXISTS idx_org_district ON public.organizations(district);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_profile ON public.candidate_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_org ON public.candidate_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_cand ON public.candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_skill ON public.candidate_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_jobs_org ON public.jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON public.jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_job ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_cand ON public.job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_placements_cand ON public.placements(candidate_id);
CREATE INDEX IF NOT EXISTS idx_training_centers_org ON public.training_centers(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- =========================================================================
-- TRIGGER: RELIABLE PROFILE AUTO-PROVISIONING (auth.users -> profiles)
-- Ensures: auth.users.id = profiles.id and avoids duplicate profiles
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_org_id UUID;
    user_role TEXT;
    user_full_name TEXT;
    user_phone TEXT;
    user_district TEXT;
BEGIN
    -- Extract user metadata passed via supabase.auth.signUp()
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'candidate');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
    user_phone := NEW.raw_user_meta_data->>'phone';
    user_district := COALESCE(NEW.raw_user_meta_data->>'district', 'Pune');

    -- Resolve organization ID or fallback to Government of Maharashtra
    BEGIN
        assigned_org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
        assigned_org_id := NULL;
    END;

    IF assigned_org_id IS NULL THEN
        SELECT id INTO assigned_org_id FROM public.organizations WHERE name = 'Government of Maharashtra' LIMIT 1;
    END IF;

    -- Upsert profile with profiles.id = NEW.id (strict 1:1 mapping)
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
        CASE WHEN user_role = 'candidate' THEN 75 ELSE 50 END,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        district = EXCLUDED.district,
        verification_status = CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN 'verified' ELSE public.profiles.verification_status END,
        updated_at = now();

    -- If candidate, automatically provision candidate_profiles record
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

-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- STRICT ROW-LEVEL SECURITY (RLS) POLICIES
-- Enforces strict multi-tenant boundaries. NO USING(true) on sensitive data.
-- =========================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Organizations: Public Read for tenant selection during registration; Write only for Admins
DROP POLICY IF EXISTS "Public can view organizations" ON public.organizations;
CREATE POLICY "Public can view organizations" ON public.organizations
    FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage organizations" ON public.organizations;
CREATE POLICY "Admins can manage organizations" ON public.organizations
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin' AND organization_id = public.organizations.id)
    );

-- 3. Profiles: Read own profile or same organization; Update only own profile
DROP POLICY IF EXISTS "Profiles isolation policy" ON public.profiles;
CREATE POLICY "Profiles isolation policy" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 4. Candidate Profiles: Read own or Recruiters/Centers/Admins in same organization
DROP POLICY IF EXISTS "Candidate profile read policy" ON public.candidate_profiles;
CREATE POLICY "Candidate profile read policy" ON public.candidate_profiles
    FOR SELECT USING (
        profile_id = auth.uid() OR
        organization_id IN (
            SELECT organization_id FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('recruiter', 'training_center', 'organization_admin')
        )
    );

DROP POLICY IF EXISTS "Candidate profile update policy" ON public.candidate_profiles;
CREATE POLICY "Candidate profile update policy" ON public.candidate_profiles
    FOR UPDATE USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- 5. Candidate Skills: Read same tenant, update only own
DROP POLICY IF EXISTS "Candidate skills read policy" ON public.candidate_skills;
CREATE POLICY "Candidate skills read policy" ON public.candidate_skills
    FOR SELECT USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON p.organization_id = cp.organization_id
            WHERE p.id = auth.uid() AND p.role IN ('recruiter', 'training_center', 'organization_admin')
        )
    );

DROP POLICY IF EXISTS "Candidate skills manage policy" ON public.candidate_skills;
CREATE POLICY "Candidate skills manage policy" ON public.candidate_skills
    FOR ALL USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid())
    );

-- 6. Skills: Publicly readable master catalog; writable only by Admins
DROP POLICY IF EXISTS "Skills public read" ON public.skills;
CREATE POLICY "Skills public read" ON public.skills FOR SELECT USING (true);

-- 7. Target Roles & Role Skills: Publicly readable; writable by Admins
DROP POLICY IF EXISTS "Target roles public read" ON public.target_roles;
CREATE POLICY "Target roles public read" ON public.target_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Role skills public read" ON public.role_skills;
CREATE POLICY "Role skills public read" ON public.role_skills FOR SELECT USING (true);

-- 8. Learning Roadmaps & Items: Candidate own access
DROP POLICY IF EXISTS "Roadmaps own access" ON public.learning_roadmaps;
CREATE POLICY "Roadmaps own access" ON public.learning_roadmaps
    FOR ALL USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Learning items own access" ON public.learning_items;
CREATE POLICY "Learning items own access" ON public.learning_items
    FOR ALL USING (roadmap_id IN (
        SELECT lr.id FROM public.learning_roadmaps lr
        JOIN public.candidate_profiles cp ON cp.id = lr.candidate_id
        WHERE cp.profile_id = auth.uid()
    ));

-- 9. Jobs: Readable by all authenticated users; manage by recruiters in same organization
DROP POLICY IF EXISTS "Jobs read policy" ON public.jobs;
CREATE POLICY "Jobs read policy" ON public.jobs FOR SELECT USING (status = 'open' OR recruiter_id = auth.uid());

DROP POLICY IF EXISTS "Jobs recruiter manage" ON public.jobs;
CREATE POLICY "Jobs recruiter manage" ON public.jobs
    FOR ALL USING (recruiter_id = auth.uid());

-- 10. Job Applications: Candidate can view/apply own; recruiter can view for their jobs
DROP POLICY IF EXISTS "Job application candidate policy" ON public.job_applications;
CREATE POLICY "Job application candidate policy" ON public.job_applications
    FOR ALL USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        job_id IN (SELECT id FROM public.jobs WHERE recruiter_id = auth.uid())
    );

-- 11. Placements, Employment Records & Retention: Candidate and Org Admins/Auditors
DROP POLICY IF EXISTS "Placements access policy" ON public.placements;
CREATE POLICY "Placements access policy" ON public.placements
    FOR ALL USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role IN ('organization_admin', 'training_center', 'recruiter'))
    );

-- 12. Notifications: strictly private to recipient
DROP POLICY IF EXISTS "Notifications private" ON public.notifications;
CREATE POLICY "Notifications private" ON public.notifications
    FOR ALL USING (user_id = auth.uid());

-- =========================================================================
-- INITIAL SEED DATA
-- =========================================================================

-- Seed Organizations (Government of Maharashtra - Pune)
INSERT INTO public.organizations (id, name, type, state, district, location, contact_email, subscription_plan, status)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Government of Maharashtra', 'Government Program', 'Maharashtra', 'Pune', 'Mantralaya, Nariman Point, Mumbai - 400032', 'skilling.mission@maharashtra.gov.in', 'Enterprise', 'active'),
    ('00000000-0000-0000-0000-000000000002', 'TechSkills India Foundation', 'Corporate', 'Maharashtra', 'Mumbai Suburban', 'Hinjawadi Phase 1, Pune - 411057', 'contact@techskillsfoundation.org', 'Pro', 'active'),
    ('00000000-0000-0000-0000-000000000003', 'Vidarbha Rural Livelihood Mission', 'Skilling NGO', 'Maharashtra', 'Nagpur', 'Civil Lines, Nagpur - 440001', 'info@vidarbhaskills.org', 'Enterprise', 'active')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    district = EXCLUDED.district,
    state = EXCLUDED.state,
    status = EXCLUDED.status;

-- Seed Training Centers
INSERT INTO public.training_centers (id, organization_id, name, district, taluka, address, contact_email, status, verification_status, capacity, placement_rate)
VALUES
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Pune ITI & Tech Hub', 'Pune', 'Haveli', 'Shivajinagar, Pune - 411005', 'pune.iti@skilltrack.gov.in', 'active', 'verified', 250, 88.4),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Pimpri-Chinchwad Advanced Vocational Center', 'Pune', 'Pimpri-Chinchwad', 'MIDC Bhosari, Pune - 411026', 'pc.center@skilltrack.gov.in', 'active', 'verified', 180, 84.2)
ON CONFLICT (id) DO NOTHING;

-- Seed Master Skills Taxonomy
INSERT INTO public.skills (name, category, description) VALUES
    ('React.js', 'Frontend Development', 'Component-based UI architecture, state management, hooks and virtual DOM optimization.'),
    ('Node.js', 'Backend Engineering', 'Asynchronous event-driven JavaScript runtime for scalable backend microservices.'),
    ('TypeScript', 'Programming Languages', 'Static typing over JavaScript, interface definitions, generics, and compiler safety.'),
    ('PostgreSQL', 'Databases', 'Relational database schema design, indexing, foreign keys, and SQL query tuning.'),
    ('RESTful APIs', 'System Architecture', 'HTTP methods, JSON contracts, status code standards, and secure API gateways.'),
    ('Docker & Containers', 'DevOps & Cloud', 'Container packaging, multi-stage builds, container isolation and registry deployments.'),
    ('Python', 'Programming Languages', 'Object-oriented and functional scripting, automated data processing, and FastAPI/Flask.'),
    ('Git & Version Control', 'Software Engineering', 'Branching workflows, semantic commits, PR code reviews, and merge conflict resolution.')
ON CONFLICT (name) DO NOTHING;

-- Seed Target Roles
INSERT INTO public.target_roles (id, title, name, description, category, avg_salary_lpa) VALUES
    ('20000000-0000-0000-0000-000000000001', 'Full Stack Web Developer', 'Full Stack Web Developer', 'Builds end-to-end web applications with modern frontend frameworks and robust backend services.', 'Web Development', 6.5),
    ('20000000-0000-0000-0000-000000000002', 'Cloud DevOps Engineer', 'Cloud DevOps Engineer', 'Automates CI/CD pipelines, container orchestration, and cloud infrastructure monitoring.', 'Cloud & DevOps', 8.2),
    ('20000000-0000-0000-0000-000000000003', 'Data Analyst & BI Specialist', 'Data Analyst & BI Specialist', 'Transforms raw enterprise datasets into actionable insights, dashboards, and automated forecasting.', 'Data & Analytics', 5.8)
ON CONFLICT (title) DO NOTHING;
