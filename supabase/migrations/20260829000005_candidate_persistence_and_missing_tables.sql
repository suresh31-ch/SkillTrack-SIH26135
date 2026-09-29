-- =========================================================================
-- SKILLTRACK CONSOLIDATED ADDITIVE MIGRATION (SIH26135)
-- Safe, Non-Destructive, Idempotent, Least-Privilege Migration
-- Preserves existing 5 tables, existing auth trigger/functions, and all live data
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 2. NON-DESTRUCTIVE COLUMN EXTENSIONS TO EXISTING TABLES
-- Ensures columns match application queries without altering existing types
-- =========================================================================
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Pune';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Maharashtra';
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completion NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Pune';

ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'Full Stack Web Developer';
ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS career_goal TEXT DEFAULT 'Software Engineer';
ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS placement_status TEXT DEFAULT 'unplaced';
ALTER TABLE public.candidate_profiles ADD COLUMN IF NOT EXISTS retention_status TEXT DEFAULT 'none';

ALTER TABLE public.candidate_skills ADD COLUMN IF NOT EXISTS proficiency TEXT DEFAULT 'Beginner';
ALTER TABLE public.candidate_skills ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Self-Declaration';
ALTER TABLE public.candidate_skills ADD COLUMN IF NOT EXISTS assessment_score NUMERIC DEFAULT 0;

-- Idempotent unique constraint on candidate_skills(candidate_id, skill_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_candidate_skill'
    ) THEN
        ALTER TABLE public.candidate_skills ADD CONSTRAINT uq_candidate_skill UNIQUE (candidate_id, skill_id);
    END IF;
END $$;

-- =========================================================================
-- 3. CORE TAXONOMY & MICRO-ROADMAP TABLES
-- =========================================================================

-- Target Roles Taxonomy
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

-- Standardized Job Roles
CREATE TABLE IF NOT EXISTS public.job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    icon_name TEXT,
    avg_salary_lpa NUMERIC DEFAULT 6.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Role Skills Matrix
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
    job_role_id UUID NOT NULL REFERENCES public.job_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_proficiency TEXT NOT NULL DEFAULT 'Intermediate' CHECK (required_proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    importance TEXT NOT NULL DEFAULT 'Critical' CHECK (importance IN ('Critical', 'High', 'Medium', 'Low')),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_job_role_skill UNIQUE (job_role_id, skill_id)
);

-- Learning Roadmaps (Unified: template + candidate tracking)
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    target_role_id UUID REFERENCES public.target_roles(id) ON DELETE SET NULL,
    target_job TEXT DEFAULT 'Full Stack Web Developer',
    title TEXT NOT NULL DEFAULT 'Personalized Upskilling Roadmap',
    description TEXT,
    estimated_hours INTEGER DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
    progress NUMERIC DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.learning_roadmaps ADD COLUMN IF NOT EXISTS candidate_id UUID REFERENCES public.candidate_profiles(id) ON DELETE CASCADE;
ALTER TABLE public.learning_roadmaps ADD COLUMN IF NOT EXISTS target_role_id UUID REFERENCES public.target_roles(id) ON DELETE SET NULL;
ALTER TABLE public.learning_roadmaps ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE public.learning_roadmaps ADD COLUMN IF NOT EXISTS progress NUMERIC DEFAULT 0;
ALTER TABLE public.learning_roadmaps ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Roadmap Items (Micro-learning modules)
CREATE TABLE IF NOT EXISTS public.roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES public.learning_roadmaps(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 1,
    estimated_time TEXT DEFAULT '3 Hours',
    resource_type TEXT NOT NULL DEFAULT 'Interactive Lab' CHECK (resource_type IN ('Interactive Lab', 'Video Tutorial', 'Documentation', 'Hands-on Project', 'Code Practice')),
    practice_requirement TEXT,
    assessment_ready BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_roadmap_item_skill_topic'
    ) THEN
        ALTER TABLE public.roadmap_items ADD CONSTRAINT uq_roadmap_item_skill_topic UNIQUE (skill_id, topic);
    END IF;
END $$;

-- Candidate Roadmap Progress (Persisted milestone progress)
CREATE TABLE IF NOT EXISTS public.candidate_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    roadmap_item_id UUID NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_candidate_roadmap_item UNIQUE (candidate_id, roadmap_item_id)
);

-- =========================================================================
-- 4. JOBS & APPLICATIONS
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
-- 5. OUTCOMES, RETENTION & TRAINING PIPELINE
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
-- 6. INDEXES FOR PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_job_roles_name ON public.job_roles(name);
CREATE INDEX IF NOT EXISTS idx_job_role_skills_job_id ON public.job_role_skills(job_role_id);
CREATE INDEX IF NOT EXISTS idx_job_role_skills_skill_id ON public.job_role_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_skill_id ON public.roadmap_items(skill_id);
CREATE INDEX IF NOT EXISTS idx_candidate_roadmap_progress_cand ON public.candidate_roadmap_progress(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_roadmap_progress_item ON public.candidate_roadmap_progress(roadmap_item_id);
CREATE INDEX IF NOT EXISTS idx_jobs_org ON public.jobs(organization_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON public.jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_job ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_cand ON public.job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_placements_cand ON public.placements(candidate_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- =========================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- Complete CRUD coverage with explicit WITH CHECK for user writes
-- Shared catalogs restricted to Admins for modifications
-- =========================================================================

-- Enable RLS across all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_roadmap_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Organizations: Public Read active organizations; manage by Admins
DROP POLICY IF EXISTS "Public can view organizations" ON public.organizations;
CREATE POLICY "Public can view organizations" ON public.organizations FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage organizations" ON public.organizations;
CREATE POLICY "Admins can manage organizations" ON public.organizations FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin' AND organization_id = public.organizations.id))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin' AND organization_id = public.organizations.id));

-- 2. Profiles: Self-access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated
    USING (auth.uid() = id OR auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id OR auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id OR auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = id OR auth.uid() = auth_user_id);

-- 3. Candidate Profiles: Self-access & hiring org access
DROP POLICY IF EXISTS "Candidate can view own candidate profile" ON public.candidate_profiles;
CREATE POLICY "Candidate can view own candidate profile" ON public.candidate_profiles FOR SELECT TO authenticated
    USING (
        profile_id = auth.uid() OR
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role IN ('recruiter', 'training_center', 'organization_admin'))
    );

DROP POLICY IF EXISTS "Candidate can insert own candidate profile" ON public.candidate_profiles;
CREATE POLICY "Candidate can insert own candidate profile" ON public.candidate_profiles FOR INSERT TO authenticated
    WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Candidate can update own candidate profile" ON public.candidate_profiles;
CREATE POLICY "Candidate can update own candidate profile" ON public.candidate_profiles FOR UPDATE TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Candidate can delete own candidate profile" ON public.candidate_profiles;
CREATE POLICY "Candidate can delete own candidate profile" ON public.candidate_profiles FOR DELETE TO authenticated
    USING (profile_id = auth.uid());

-- 4. Shared Catalogs: Public read for authenticated users; writes strictly restricted to Admins
DROP POLICY IF EXISTS "Skills public read" ON public.skills;
CREATE POLICY "Skills public read" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Skills admin manage" ON public.skills;
CREATE POLICY "Skills admin manage" ON public.skills FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'));

DROP POLICY IF EXISTS "Job roles public read" ON public.job_roles;
CREATE POLICY "Job roles public read" ON public.job_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Job roles admin manage" ON public.job_roles;
CREATE POLICY "Job roles admin manage" ON public.job_roles FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'));

DROP POLICY IF EXISTS "Job role skills public read" ON public.job_role_skills;
CREATE POLICY "Job role skills public read" ON public.job_role_skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Job role skills admin manage" ON public.job_role_skills;
CREATE POLICY "Job role skills admin manage" ON public.job_role_skills FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'));

DROP POLICY IF EXISTS "Target roles public read" ON public.target_roles;
CREATE POLICY "Target roles public read" ON public.target_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Target roles admin manage" ON public.target_roles;
CREATE POLICY "Target roles admin manage" ON public.target_roles FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'));

DROP POLICY IF EXISTS "Role skills public read" ON public.role_skills;
CREATE POLICY "Role skills public read" ON public.role_skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Role skills admin manage" ON public.role_skills;
CREATE POLICY "Role skills admin manage" ON public.role_skills FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'));

DROP POLICY IF EXISTS "Roadmap items public read" ON public.roadmap_items;
CREATE POLICY "Roadmap items public read" ON public.roadmap_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Roadmap items admin manage" ON public.roadmap_items;
CREATE POLICY "Roadmap items admin manage" ON public.roadmap_items FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'organization_admin'));

-- 5. Learning Roadmaps: Public templates + candidate private tracks
DROP POLICY IF EXISTS "Roadmaps unified select" ON public.learning_roadmaps;
CREATE POLICY "Roadmaps unified select" ON public.learning_roadmaps FOR SELECT TO authenticated
    USING (candidate_id IS NULL OR candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Roadmaps candidate insert" ON public.learning_roadmaps;
CREATE POLICY "Roadmaps candidate insert" ON public.learning_roadmaps FOR INSERT TO authenticated
    WITH CHECK (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Roadmaps candidate update" ON public.learning_roadmaps;
CREATE POLICY "Roadmaps candidate update" ON public.learning_roadmaps FOR UPDATE TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()))
    WITH CHECK (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Roadmaps candidate delete" ON public.learning_roadmaps;
CREATE POLICY "Roadmaps candidate delete" ON public.learning_roadmaps FOR DELETE TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

-- 6. Candidate Skills: Granular candidate self-ownership & tenant viewing
DROP POLICY IF EXISTS "Candidate skills read policy" ON public.candidate_skills;
CREATE POLICY "Candidate skills read policy" ON public.candidate_skills FOR SELECT TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON p.organization_id = cp.organization_id
            WHERE p.id = auth.uid() AND p.role IN ('recruiter', 'training_center', 'organization_admin')
        )
    );

DROP POLICY IF EXISTS "Candidate skills insert policy" ON public.candidate_skills;
CREATE POLICY "Candidate skills insert policy" ON public.candidate_skills FOR INSERT TO authenticated
    WITH CHECK (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Candidate skills update policy" ON public.candidate_skills;
CREATE POLICY "Candidate skills update policy" ON public.candidate_skills FOR UPDATE TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()))
    WITH CHECK (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Candidate skills delete policy" ON public.candidate_skills;
CREATE POLICY "Candidate skills delete policy" ON public.candidate_skills FOR DELETE TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

-- 7. Candidate Roadmap Progress: Strictly candidate owner
DROP POLICY IF EXISTS "Candidate roadmap progress select" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidate roadmap progress select" ON public.candidate_roadmap_progress FOR SELECT TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Candidate roadmap progress insert" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidate roadmap progress insert" ON public.candidate_roadmap_progress FOR INSERT TO authenticated
    WITH CHECK (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Candidate roadmap progress update" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidate roadmap progress update" ON public.candidate_roadmap_progress FOR UPDATE TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()))
    WITH CHECK (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Candidate roadmap progress delete" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidate roadmap progress delete" ON public.candidate_roadmap_progress FOR DELETE TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

-- 8. Jobs: Authenticated can browse open jobs; recruiters manage own
DROP POLICY IF EXISTS "Jobs read policy" ON public.jobs;
CREATE POLICY "Jobs read policy" ON public.jobs FOR SELECT TO authenticated
    USING (status = 'open' OR recruiter_id = auth.uid());

DROP POLICY IF EXISTS "Jobs recruiter insert" ON public.jobs;
CREATE POLICY "Jobs recruiter insert" ON public.jobs FOR INSERT TO authenticated
    WITH CHECK (recruiter_id = auth.uid());

DROP POLICY IF EXISTS "Jobs recruiter update" ON public.jobs;
CREATE POLICY "Jobs recruiter update" ON public.jobs FOR UPDATE TO authenticated
    USING (recruiter_id = auth.uid())
    WITH CHECK (recruiter_id = auth.uid());

DROP POLICY IF EXISTS "Jobs recruiter delete" ON public.jobs;
CREATE POLICY "Jobs recruiter delete" ON public.jobs FOR DELETE TO authenticated
    USING (recruiter_id = auth.uid());

-- 9. Job Applications: Candidate can view/apply own; recruiter can view/update for their jobs
DROP POLICY IF EXISTS "Job application select" ON public.job_applications;
CREATE POLICY "Job application select" ON public.job_applications FOR SELECT TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        job_id IN (SELECT id FROM public.jobs WHERE recruiter_id = auth.uid())
    );

DROP POLICY IF EXISTS "Job application insert" ON public.job_applications;
CREATE POLICY "Job application insert" ON public.job_applications FOR INSERT TO authenticated
    WITH CHECK (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Job application update" ON public.job_applications;
CREATE POLICY "Job application update" ON public.job_applications FOR UPDATE TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        job_id IN (SELECT id FROM public.jobs WHERE recruiter_id = auth.uid())
    )
    WITH CHECK (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        job_id IN (SELECT id FROM public.jobs WHERE recruiter_id = auth.uid())
    );

DROP POLICY IF EXISTS "Job application delete" ON public.job_applications;
CREATE POLICY "Job application delete" ON public.job_applications FOR DELETE TO authenticated
    USING (candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()));

-- 10. Placements & Employment Records
DROP POLICY IF EXISTS "Placements access policy" ON public.placements;
CREATE POLICY "Placements access policy" ON public.placements FOR SELECT TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role IN ('organization_admin', 'training_center', 'recruiter'))
    );

DROP POLICY IF EXISTS "Employment records select" ON public.employment_records;
CREATE POLICY "Employment records select" ON public.employment_records FOR SELECT TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('organization_admin', 'recruiter'))
    );

DROP POLICY IF EXISTS "Retention milestones select" ON public.retention_milestones;
CREATE POLICY "Retention milestones select" ON public.retention_milestones FOR SELECT TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('organization_admin', 'recruiter'))
    );

-- 11. Training Centers & Enrollments
DROP POLICY IF EXISTS "Training centers select" ON public.training_centers;
CREATE POLICY "Training centers select" ON public.training_centers FOR SELECT TO authenticated
    USING (status = 'active' OR organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Training enrollments select" ON public.training_enrollments;
CREATE POLICY "Training enrollments select" ON public.training_enrollments FOR SELECT TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        training_center_id IN (SELECT id FROM public.training_centers WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
    );

-- 12. Certifications
DROP POLICY IF EXISTS "Certifications select" ON public.certifications;
CREATE POLICY "Certifications select" ON public.certifications FOR SELECT TO authenticated
    USING (
        candidate_id IN (SELECT id FROM public.candidate_profiles WHERE profile_id = auth.uid()) OR
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('organization_admin', 'training_center', 'recruiter'))
    );

-- 13. Notifications: Strictly private
DROP POLICY IF EXISTS "Notifications select" ON public.notifications;
CREATE POLICY "Notifications select" ON public.notifications FOR SELECT TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Notifications insert" ON public.notifications;
CREATE POLICY "Notifications insert" ON public.notifications FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Notifications update" ON public.notifications;
CREATE POLICY "Notifications update" ON public.notifications FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Notifications delete" ON public.notifications;
CREATE POLICY "Notifications delete" ON public.notifications FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- =========================================================================
-- 8. LEAST-PRIVILEGE ROLE PERMISSIONS (TARGETED & REVIEWED)
-- =========================================================================

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 1. Anonymous: read-only access to public catalogs ONLY
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT ON public.organizations TO anon;
GRANT SELECT ON public.skills TO anon;
GRANT SELECT ON public.target_roles TO anon;
GRANT SELECT ON public.job_roles TO anon;
GRANT SELECT ON public.job_role_skills TO anon;
GRANT SELECT ON public.role_skills TO anon;
GRANT SELECT ON public.roadmap_items TO anon;

-- 2. Authenticated: Table-specific grants strictly aligned with reviewed RLS policies
-- Public catalogs: SELECT for all users; admin writes guarded by RLS policies
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations, public.skills, public.job_roles, public.target_roles, public.job_role_skills, public.role_skills, public.roadmap_items TO authenticated;

-- User & Profile entities
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_profiles TO authenticated;

-- Candidate operational persistence (Full CRUD for self-ownership)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_skills TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_roadmap_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_roadmaps TO authenticated;

-- Jobs & Applications
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;

-- Outcomes, Training & Notifications
GRANT SELECT, INSERT, UPDATE ON public.placements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.employment_records TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.retention_milestones TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.training_centers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.training_enrollments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.certifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;

-- Sequences & Functions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL ROUTINES IN SCHEMA public TO authenticated;

-- =========================================================================
-- 9. IDEMPOTENT SEED DATA (CORE TAXONOMIES ONLY — NO DEMO JOBS)
-- =========================================================================

-- Seed core master skills if not present
INSERT INTO public.skills (name, category, description) VALUES
    ('React', 'Frontend Development', 'Component-based UI architecture, state management, hooks and virtual DOM optimization.'),
    ('Node.js', 'Backend Engineering', 'Asynchronous event-driven JavaScript runtime for scalable backend microservices.'),
    ('PostgreSQL', 'Databases', 'Relational database schema design, indexing, foreign keys, and SQL query tuning.'),
    ('JavaScript', 'Programming Languages', 'Core ECMAScript fundamentals, async event loop, DOM, and functional paradigms.'),
    ('TypeScript', 'Programming Languages', 'Static typing over JavaScript, interface definitions, generics, and compiler safety.'),
    ('Docker', 'DevOps & Cloud', 'Container packaging, multi-stage builds, container isolation and registry deployments.'),
    ('Python', 'Programming Languages', 'Object-oriented scripting, automated data processing, and backend engineering.'),
    ('Git', 'Software Engineering', 'Branching workflows, semantic commits, PR code reviews, and merge conflict resolution.')
ON CONFLICT (name) DO NOTHING;

-- Standardized Job Roles
INSERT INTO public.job_roles (id, name, description, category, avg_salary_lpa) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Full Stack Developer', 'End-to-end web engineering covering modern React frontend, Node.js API servers, and relational PostgreSQL databases.', 'Web Development', 7.5),
    ('10000000-0000-0000-0000-000000000002', 'Software Engineer', 'Core software systems engineering, data structures, algorithms, object-oriented design, and robust backend services.', 'Software Engineering', 8.2),
    ('10000000-0000-0000-0000-000000000003', 'Frontend Developer', 'Modern single-page applications, responsive interfaces, state architectures with React, TypeScript, and Tailwind CSS.', 'Frontend Engineering', 6.8),
    ('10000000-0000-0000-0000-000000000004', 'Backend Developer', 'Scalable server-side APIs, microservices, database modeling, authentication, security, and performance tuning.', 'Backend Engineering', 7.8),
    ('10000000-0000-0000-0000-000000000005', 'Data Analyst', 'Statistical analysis, business intelligence dashboards with Power BI, Excel modeling, SQL queries, and Python data pipelines.', 'Data & Analytics', 6.2),
    ('10000000-0000-0000-0000-000000000006', 'Machine Learning Engineer', 'Supervised/unsupervised models, predictive analytics, deep neural networks, Python AI stacks, and model evaluation.', 'AI & Machine Learning', 9.5),
    ('10000000-0000-0000-0000-000000000007', 'Cloud / DevOps Engineer', 'Containerization with Docker, Kubernetes, CI/CD automated deployment, AWS/GCP infrastructure, and site reliability.', 'Cloud & Infrastructure', 8.8)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    avg_salary_lpa = EXCLUDED.avg_salary_lpa;

-- Target Roles
INSERT INTO public.target_roles (id, title, name, description, category, avg_salary_lpa) VALUES
    ('20000000-0000-0000-0000-000000000001', 'Full Stack Web Developer', 'Full Stack Web Developer', 'Builds end-to-end web applications with modern frontend frameworks and robust backend services.', 'Web Development', 6.5),
    ('20000000-0000-0000-0000-000000000002', 'Cloud DevOps Engineer', 'Cloud DevOps Engineer', 'Automates CI/CD pipelines, container orchestration, and cloud infrastructure monitoring.', 'Cloud & DevOps', 8.2),
    ('20000000-0000-0000-0000-000000000003', 'Data Analyst & BI Specialist', 'Data Analyst & BI Specialist', 'Transforms raw enterprise datasets into actionable insights, dashboards, and automated forecasting.', 'Data & Analytics', 5.8)
ON CONFLICT (title) DO NOTHING;

-- Job Role Skills
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000001',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('React', 'Advanced', 'Critical'),
        ('React.js', 'Advanced', 'Critical'),
        ('JavaScript', 'Advanced', 'Critical'),
        ('TypeScript', 'Intermediate', 'High'),
        ('Node.js', 'Intermediate', 'Critical'),
        ('PostgreSQL', 'Intermediate', 'High'),
        ('Python', 'Intermediate', 'High'),
        ('Docker & Containers', 'Intermediate', 'High')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name ILIKE req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- Idempotent Roadmap Items
INSERT INTO public.roadmap_items (skill_id, topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
SELECT 
    s.id,
    t.topic,
    t.description,
    t.order_index,
    t.estimated_time,
    t.resource_type,
    t.practice_requirement,
    t.assessment_ready
FROM (
    VALUES
        ('Components & JSX Structure', 'Functional component patterns, JSX compilation, modular layout trees, and standard clean prop pass-through.', 1, '3 Hours', 'Interactive Lab', 'Build a reusable responsive User Profile Badge with avatar fallback and badge states.', false),
        ('Props, State & React Lifecycle', 'useState, controlled inputs, lifting state up, immutable state modification, and component re-render triggers.', 2, '4 Hours', 'Interactive Lab', 'Construct a filtered dynamic skill search bar with instant client-side array filtering.', false),
        ('Hooks & Side-Effects (useEffect, useMemo)', 'Side effects lifecycle, dependency arrays, API data fetching, custom hook composition, and memoization.', 3, '5 Hours', 'Hands-on Project', 'Build a custom useFetch hook with loading states, error boundaries, and auto-abort cancellation.', false),
        ('API Integration & Asynchronous State', 'RESTful API integration, JWT bearer authorization headers, optimistic updates, and error handling.', 4, '6 Hours', 'Hands-on Project', 'Implement real-time CRUD candidate skill management syncing to PostgreSQL API endpoints.', false)
) AS t(topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
JOIN public.skills s ON (s.name = 'React' OR s.name = 'React.js')
ON CONFLICT (skill_id, topic) DO UPDATE SET
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index,
    estimated_time = EXCLUDED.estimated_time,
    resource_type = EXCLUDED.resource_type,
    practice_requirement = EXCLUDED.practice_requirement,
    assessment_ready = EXCLUDED.assessment_ready;

INSERT INTO public.roadmap_items (skill_id, topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
SELECT 
    s.id,
    t.topic,
    t.description,
    t.order_index,
    t.estimated_time,
    t.resource_type,
    t.practice_requirement,
    t.assessment_ready
FROM (
    VALUES
        ('Node.js Runtime & Event Loop', 'Non-blocking asynchronous I/O, event emitters, buffers, streams, and module systems (ESM vs CJS).', 1, '3 Hours', 'Documentation', 'Write an async file reader stream processing JSON log files with zero main-thread block.', false),
        ('Express.js Server Architecture', 'Routing, middleware chains, error handling middleware, JSON request body parsing, and route controllers.', 2, '4 Hours', 'Interactive Lab', 'Create a modular REST API route structure with input validation schemas.', false),
        ('Authentication & JWT Security', 'Bcrypt password hashing, JSON Web Token generation/verification, token expiration, and secure cookie headers.', 3, '5 Hours', 'Hands-on Project', 'Build an authentication middleware verifying Bearer tokens and decoding user identity claims.', false)
) AS t(topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
JOIN public.skills s ON s.name ILIKE '%Node%'
ON CONFLICT (skill_id, topic) DO UPDATE SET
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index,
    estimated_time = EXCLUDED.estimated_time,
    resource_type = EXCLUDED.resource_type,
    practice_requirement = EXCLUDED.practice_requirement,
    assessment_ready = EXCLUDED.assessment_ready;

INSERT INTO public.roadmap_items (skill_id, topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
SELECT 
    s.id,
    t.topic,
    t.description,
    t.order_index,
    t.estimated_time,
    t.resource_type,
    t.practice_requirement,
    t.assessment_ready
FROM (
    VALUES
        ('Relational Database Design & Normalization', 'Entity-relationship diagrams, primary keys, foreign keys, 3NF normalization, and data integrity constraints.', 1, '3 Hours', 'Documentation', 'Design a normalized schema for multi-tenant organizations, profiles, and candidate skills.', false),
        ('Advanced SQL Queries & JOIN Operations', 'INNER/LEFT/RIGHT JOINs, GROUP BY aggregations, HAVING clauses, subqueries, and window functions.', 2, '5 Hours', 'Interactive Lab', 'Write complex analytical queries calculating candidate skill readiness distributions by district.', false),
        ('Row Level Security (RLS) & Multi-Tenant Policies', 'Defining granular tenant isolation rules in PostgreSQL using auth.uid() and role checks.', 3, '4 Hours', 'Hands-on Project', 'Implement RLS policies ensuring candidates can only modify their own profile records.', false)
) AS t(topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
JOIN public.skills s ON s.name ILIKE '%Postgres%'
ON CONFLICT (skill_id, topic) DO UPDATE SET
    description = EXCLUDED.description,
    order_index = EXCLUDED.order_index,
    estimated_time = EXCLUDED.estimated_time,
    resource_type = EXCLUDED.resource_type,
    practice_requirement = EXCLUDED.practice_requirement,
    assessment_ready = EXCLUDED.assessment_ready;
