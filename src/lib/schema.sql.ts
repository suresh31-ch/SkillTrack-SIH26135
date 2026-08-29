// =========================================================================
// SKILLTRACK — SUPABASE POSTGRESQL DATABASE FOUNDATION & RLS POLICIES
// Problem Statement: SIH26135 (Skilling Outcomes, Skill Gaps & Retention)
// =========================================================================

export const SUPABASE_SCHEMA_SQL = `-- =========================================================================
-- SKILLTRACK — SUPABASE POSTGRESQL DATABASE FOUNDATION
-- Milestone: Candidate Profile + Skills & Core Multi-Tenant Architecture
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Organizations Table (Tenants)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT,
    logo_url TEXT,
    contact_email TEXT,
    state TEXT,
    location TEXT,
    subscription_plan TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Profiles Table (Users & Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter', 'training_center', 'organization_admin')),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    district TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Candidate Profiles Table
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    education TEXT,
    degree TEXT,
    graduation_year INTEGER,
    experience_years NUMERIC DEFAULT 0,
    employment_status TEXT,
    target_job TEXT,
    readiness_score NUMERIC DEFAULT 0,
    profile_completion NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Skills Table (Master Taxonomy)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Candidate Skills Table
CREATE TABLE IF NOT EXISTS public.candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level TEXT NOT NULL DEFAULT 'Beginner',
    verified BOOLEAN NOT NULL DEFAULT false,
    verification_source TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_candidate_skill UNIQUE (candidate_id, skill_id)
);

-- High Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

CREATE INDEX IF NOT EXISTS idx_candidate_profiles_profile_id ON public.candidate_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_org_id ON public.candidate_profiles(organization_id);

CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);

CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate_id ON public.candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_skill_id ON public.candidate_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_verified ON public.candidate_skills(verified);

-- Seed Skills Catalog
INSERT INTO public.skills (name, category, description) VALUES
    ('Python', 'Programming Languages', 'High-level programming language widely used in AI, web backends, and data science'),
    ('Java', 'Programming Languages', 'Object-oriented language for enterprise applications, Android development, and systems'),
    ('C++', 'Programming Languages', 'High-performance systems programming language for game engines and core algorithms'),
    ('JavaScript', 'Web Development', 'Dynamic scripting language powering interactive frontend web applications and Node.js'),
    ('TypeScript', 'Web Development', 'Statically typed superset of JavaScript providing compile-time type safety'),
    ('React', 'Frontend Frameworks', 'Declarative component-based UI library for modern single-page web applications'),
    ('Node.js', 'Backend Engineering', 'Asynchronous event-driven JavaScript runtime for scalable network applications'),
    ('Express.js', 'Backend Engineering', 'Fast, unopinionated, minimalist web framework for Node.js REST API servers'),
    ('SQL', 'Database & Storage', 'Standard language for storing, manipulating, and retrieving data in relational databases'),
    ('PostgreSQL', 'Database & Storage', 'Advanced open-source object-relational database system with high extensibility and RLS'),
    ('MongoDB', 'Database & Storage', 'Document-oriented NoSQL database for flexible JSON-like data storage'),
    ('Data Structures', 'Computer Science Fundamentals', 'Arrays, Linked Lists, Stacks, Queues, Trees, and Graph data organization'),
    ('Algorithms', 'Computer Science Fundamentals', 'Sorting, searching, dynamic programming, and algorithm complexity optimization'),
    ('Problem Solving', 'Aptitude & Logic', 'Analytical thinking, debugging methodology, and systematic problem decomposition'),
    ('HTML', 'Web Development', 'Standard markup language for document structuring across the World Wide Web'),
    ('CSS', 'Web Development', 'Cascading style sheets and modern styling for responsive web user interfaces'),
    ('Git', 'DevOps & Tooling', 'Distributed version control system for tracking changes in source code repositories'),
    ('GitHub', 'DevOps & Tooling', 'Cloud platform for code hosting, pull request reviews, and collaborative workflows'),
    ('Docker', 'DevOps & Cloud', 'Containerization platform to build, ship, and run distributed applications'),
    ('AWS', 'Cloud Computing', 'Amazon Web Services cloud computing platform and managed services infrastructure'),
    ('Azure', 'Cloud Computing', 'Microsoft Azure cloud computing platform and enterprise services'),
    ('Cloud Computing', 'Cloud Computing', 'Cloud architecture principles, microservices, scalability, and distributed systems'),
    ('DevOps', 'DevOps & Cloud', 'CI/CD pipeline automation, infrastructure monitoring, and site reliability'),
    ('Cybersecurity', 'Security & Infrastructure', 'Network security, vulnerability assessment, encryption, and secure coding practices'),
    ('Data Analytics', 'Data & Analytics', 'Statistical data processing, exploratory analysis, and business insight derivation'),
    ('Power BI', 'Data & Analytics', 'Interactive data visualization software for business intelligence and dashboards'),
    ('Excel', 'Data & Analytics', 'Spreadsheet modeling, lookup formulas, pivot tables, and statistical summaries'),
    ('Statistics', 'Data & Analytics', 'Descriptive and inferential statistics, probability distributions, and hypothesis testing'),
    ('Artificial Intelligence', 'AI & Machine Learning', 'Core AI principles, expert systems, search trees, and heuristic modeling'),
    ('Machine Learning', 'AI & Machine Learning', 'Supervised/unsupervised learning, regression, classification, and model evaluation'),
    ('Deep Learning', 'AI & Machine Learning', 'Artificial neural networks, backpropagation, CNNs, and Transformer models'),
    ('Communication', 'Soft Skills', 'Clear verbal articulation, technical presentation, and active workplace listening'),
    ('Leadership', 'Soft Skills', 'Team mentoring, initiative ownership, decision making, and conflict resolution'),
    ('Teamwork', 'Soft Skills', 'Cross-functional collaboration, empathy, and agile sprint participation')
ON CONFLICT (name) DO UPDATE SET
    category = EXCLUDED.category,
    description = EXCLUDED.description;

-- Seed Example Organization: Government of Maharashtra
INSERT INTO public.organizations (
    id,
    name,
    type,
    logo_url,
    contact_email,
    state,
    location,
    subscription_plan,
    status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Government of Maharashtra',
    'Government State Department',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=256',
    'contact@maharashtra.gov.in',
    'Maharashtra',
    'Mantralaya, Mumbai, Maharashtra',
    'State Enterprise Tier',
    'active'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    contact_email = EXCLUDED.contact_email,
    state = EXCLUDED.state,
    location = EXCLUDED.location;

-- Auth Registration Trigger (Safe Role Assignment)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    target_role TEXT;
    target_org_id UUID;
    user_name TEXT;
    new_profile_id UUID;
BEGIN
    target_role := COALESCE(NEW.raw_user_meta_data->>'role', 'candidate');

    -- Prevent automatic creation of organization_admin via public registration
    IF target_role = 'organization_admin' THEN
        target_role := 'candidate';
    END IF;

    IF (NEW.raw_user_meta_data->>'organization_id') IS NOT NULL AND (NEW.raw_user_meta_data->>'organization_id') != '' THEN
        target_org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
    ELSE
        SELECT id INTO target_org_id FROM public.organizations WHERE name = 'Government of Maharashtra' LIMIT 1;
        IF target_org_id IS NULL THEN
            target_org_id := '00000000-0000-0000-0000-000000000001'::UUID;
        END IF;
    END IF;

    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

    INSERT INTO public.profiles (
        auth_user_id,
        full_name,
        email,
        phone,
        role,
        organization_id,
        district,
        avatar_url
    ) VALUES (
        NEW.id,
        user_name,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
        target_role,
        target_org_id,
        COALESCE(NEW.raw_user_meta_data->>'district', 'Pune'),
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256'
    )
    ON CONFLICT (auth_user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW()
    RETURNING id INTO new_profile_id;

    IF target_role = 'candidate' AND new_profile_id IS NOT NULL THEN
        INSERT INTO public.candidate_profiles (
            profile_id,
            organization_id,
            education,
            degree,
            graduation_year,
            experience_years,
            employment_status,
            target_job,
            readiness_score,
            profile_completion
        ) VALUES (
            new_profile_id,
            target_org_id,
            COALESCE(NEW.raw_user_meta_data->>'education', 'Bachelor of Technology (B.Tech)'),
            COALESCE(NEW.raw_user_meta_data->>'degree', 'Computer Engineering / Technology'),
            COALESCE((NEW.raw_user_meta_data->>'graduation_year')::INTEGER, 2025),
            COALESCE((NEW.raw_user_meta_data->>'experience_years')::NUMERIC, 0),
            COALESCE(NEW.raw_user_meta_data->>'employment_status', 'in_training'),
            COALESCE(NEW.raw_user_meta_data->>'target_job', 'Full Stack Web Developer'),
            75,
            80
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

-- Row Level Security (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;

-- Master Skills Read Policy
DROP POLICY IF EXISTS "Allow read access for skills catalog" ON public.skills;
CREATE POLICY "Allow read access for skills catalog"
    ON public.skills FOR SELECT
    USING (true);

-- Organizations Policy
DROP POLICY IF EXISTS "Users can read own organization" ON public.organizations;
CREATE POLICY "Users can read own organization"
    ON public.organizations FOR SELECT
    USING (true);

-- Profiles Policies
DROP POLICY IF EXISTS "Users can read profiles in same organization or self" ON public.profiles;
CREATE POLICY "Users can read profiles in same organization or self"
    ON public.profiles FOR SELECT
    USING (
        auth.uid() = auth_user_id OR
        organization_id IN (
            SELECT organization_id FROM public.profiles WHERE auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = auth_user_id);

-- Candidate Profiles Policies
DROP POLICY IF EXISTS "Read candidate profiles" ON public.candidate_profiles;
CREATE POLICY "Read candidate profiles"
    ON public.candidate_profiles FOR SELECT
    USING (
        profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()) OR
        organization_id IN (SELECT organization_id FROM public.profiles WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Candidates can update own candidate profile" ON public.candidate_profiles;
CREATE POLICY "Candidates can update own candidate profile"
    ON public.candidate_profiles FOR UPDATE
    USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Candidates can insert own candidate profile" ON public.candidate_profiles;
CREATE POLICY "Candidates can insert own candidate profile"
    ON public.candidate_profiles FOR INSERT
    WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

-- Candidate Skills Policies
DROP POLICY IF EXISTS "Read candidate skills" ON public.candidate_skills;
CREATE POLICY "Read candidate skills"
    ON public.candidate_skills FOR SELECT
    USING (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        ) OR
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.organization_id = p.organization_id
            WHERE p.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidates can insert self-declared skills" ON public.candidate_skills;
CREATE POLICY "Candidates can insert self-declared skills"
    ON public.candidate_skills FOR INSERT
    WITH CHECK (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        ) AND
        verified = FALSE
    );

DROP POLICY IF EXISTS "Candidates can update proficiency of own skills" ON public.candidate_skills;
CREATE POLICY "Candidates can update proficiency of own skills"
    ON public.candidate_skills FOR UPDATE
    USING (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        ) AND
        verified = FALSE
    );

DROP POLICY IF EXISTS "Candidates can delete own skills" ON public.candidate_skills;
CREATE POLICY "Candidates can delete own skills"
    ON public.candidate_skills FOR DELETE
    USING (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- =========================================================================
-- MILESTONE 2: AI SKILL GAP ENGINE & MICRO-ROADMAP SCHEMA
-- =========================================================================

-- 6. Job Roles Table
CREATE TABLE IF NOT EXISTS public.job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    icon_name TEXT,
    avg_salary_lpa NUMERIC DEFAULT 6.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Job Role Skills Table (Requirements Matrix)
CREATE TABLE IF NOT EXISTS public.job_role_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_role_id UUID NOT NULL REFERENCES public.job_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_proficiency TEXT NOT NULL DEFAULT 'Intermediate' CHECK (required_proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    importance TEXT NOT NULL DEFAULT 'High' CHECK (importance IN ('Critical', 'High', 'Medium', 'Low')),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_job_role_skill UNIQUE (job_role_id, skill_id)
);

-- 8. Learning Roadmaps Table
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    target_job TEXT,
    title TEXT NOT NULL,
    description TEXT,
    estimated_hours INTEGER DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Roadmap Items Table (Micro-Roadmap Topics)
CREATE TABLE IF NOT EXISTS public.roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 1,
    estimated_time TEXT NOT NULL DEFAULT '3 Hours',
    resource_type TEXT NOT NULL DEFAULT 'Interactive Lab' CHECK (resource_type IN ('Interactive Lab', 'Video Tutorial', 'Documentation', 'Hands-on Project', 'Code Practice')),
    practice_requirement TEXT NOT NULL,
    assessment_ready BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Candidate Roadmap Progress Table
CREATE TABLE IF NOT EXISTS public.candidate_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    roadmap_item_id UUID NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_candidate_roadmap_item UNIQUE (candidate_id, roadmap_item_id)
);

-- RLS for Job Roles & Roadmap Progress
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_roadmap_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for job roles" ON public.job_roles FOR SELECT USING (true);
CREATE POLICY "Allow read access for job role skills" ON public.job_role_skills FOR SELECT USING (true);
CREATE POLICY "Allow read access for roadmaps" ON public.learning_roadmaps FOR SELECT USING (true);
CREATE POLICY "Allow read access for roadmap items" ON public.roadmap_items FOR SELECT USING (true);

CREATE POLICY "Candidates manage own roadmap progress" ON public.candidate_roadmap_progress
    FOR ALL USING (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );
`;
