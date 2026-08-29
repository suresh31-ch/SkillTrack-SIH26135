-- =========================================================================
-- SKILLTRACK — SUPABASE POSTGRESQL MIGRATION 2
-- Milestone: AI Skill Gap Engine + Personalized Micro-Roadmaps
-- =========================================================================

-- 1. JOB ROLES TABLE
CREATE TABLE IF NOT EXISTS public.job_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    icon_name TEXT,
    avg_salary_lpa NUMERIC DEFAULT 6.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. JOB ROLE SKILLS (REQUIREMENTS MATRIX)
CREATE TABLE IF NOT EXISTS public.job_role_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_role_id UUID NOT NULL REFERENCES public.job_roles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    required_proficiency TEXT NOT NULL DEFAULT 'Intermediate' CHECK (required_proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    importance TEXT NOT NULL DEFAULT 'High' CHECK (importance IN ('Critical', 'High', 'Medium', 'Low')),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_job_role_skill UNIQUE (job_role_id, skill_id)
);

-- 3. LEARNING ROADMAPS (SKILL & ROLE PATHWAYS)
CREATE TABLE IF NOT EXISTS public.learning_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    target_job TEXT,
    title TEXT NOT NULL,
    description TEXT,
    estimated_hours INTEGER DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ROADMAP ITEMS (MICRO-ROADMAP TOPICS & PRACTICE LABS)
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

-- 5. CANDIDATE ROADMAP PROGRESS (PERSISTED TASK COMPLETION)
CREATE TABLE IF NOT EXISTS public.candidate_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    roadmap_item_id UUID NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_candidate_roadmap_item UNIQUE (candidate_id, roadmap_item_id)
);

-- =========================================================================
-- INDEXES FOR INSTANT SKILL GAP QUERIES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_job_roles_name ON public.job_roles(name);
CREATE INDEX IF NOT EXISTS idx_job_roles_category ON public.job_roles(category);

CREATE INDEX IF NOT EXISTS idx_job_role_skills_job_id ON public.job_role_skills(job_role_id);
CREATE INDEX IF NOT EXISTS idx_job_role_skills_skill_id ON public.job_role_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_roadmap_items_skill_id ON public.roadmap_items(skill_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_order ON public.roadmap_items(order_index);

CREATE INDEX IF NOT EXISTS idx_candidate_roadmap_progress_cand ON public.candidate_roadmap_progress(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_roadmap_progress_item ON public.candidate_roadmap_progress(roadmap_item_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_role_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- 1. Job Roles: Public read
DROP POLICY IF EXISTS "Allow read access for job roles" ON public.job_roles;
CREATE POLICY "Allow read access for job roles" ON public.job_roles FOR SELECT USING (true);

-- 2. Job Role Skills: Public read
DROP POLICY IF EXISTS "Allow read access for job role skills" ON public.job_role_skills;
CREATE POLICY "Allow read access for job role skills" ON public.job_role_skills FOR SELECT USING (true);

-- 3. Learning Roadmaps & Items: Public read
DROP POLICY IF EXISTS "Allow read access for roadmaps" ON public.learning_roadmaps;
CREATE POLICY "Allow read access for roadmaps" ON public.learning_roadmaps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow read access for roadmap items" ON public.roadmap_items;
CREATE POLICY "Allow read access for roadmap items" ON public.roadmap_items FOR SELECT USING (true);

-- 4. Candidate Roadmap Progress: Candidate owns their progress
DROP POLICY IF EXISTS "Candidates can read own roadmap progress" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidates can read own roadmap progress"
    ON public.candidate_roadmap_progress FOR SELECT
    USING (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidates can insert own roadmap progress" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidates can insert own roadmap progress"
    ON public.candidate_roadmap_progress FOR INSERT
    WITH CHECK (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidates can update own roadmap progress" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidates can update own roadmap progress"
    ON public.candidate_roadmap_progress FOR UPDATE
    USING (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidates can delete own roadmap progress" ON public.candidate_roadmap_progress;
CREATE POLICY "Candidates can delete own roadmap progress"
    ON public.candidate_roadmap_progress FOR DELETE
    USING (
        candidate_id IN (
            SELECT cp.id FROM public.candidate_profiles cp
            JOIN public.profiles p ON cp.profile_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- =========================================================================
-- SEED DATA: 7 DEMO JOB ROLES
-- =========================================================================
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

-- =========================================================================
-- SEED DATA: JOB ROLE SKILL REQUIREMENTS (MAPPING 34 EXISTING SKILLS)
-- =========================================================================

-- 1. Full Stack Developer requirements
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000001',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('React', 'Advanced', 'Critical'),
        ('JavaScript', 'Advanced', 'Critical'),
        ('TypeScript', 'Intermediate', 'High'),
        ('Node.js', 'Intermediate', 'Critical'),
        ('Express.js', 'Intermediate', 'High'),
        ('HTML', 'Intermediate', 'Medium'),
        ('CSS', 'Intermediate', 'Medium'),
        ('SQL', 'Intermediate', 'High'),
        ('PostgreSQL', 'Intermediate', 'High'),
        ('Git', 'Intermediate', 'High'),
        ('Problem Solving', 'Intermediate', 'High')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name = req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- 2. Software Engineer requirements
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000002',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('Data Structures', 'Advanced', 'Critical'),
        ('Algorithms', 'Advanced', 'Critical'),
        ('Problem Solving', 'Advanced', 'Critical'),
        ('Java', 'Intermediate', 'High'),
        ('C++', 'Intermediate', 'High'),
        ('Python', 'Intermediate', 'High'),
        ('SQL', 'Intermediate', 'High'),
        ('Git', 'Intermediate', 'Medium'),
        ('Teamwork', 'Intermediate', 'Medium')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name = req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- 3. Frontend Developer requirements
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000003',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('React', 'Advanced', 'Critical'),
        ('JavaScript', 'Advanced', 'Critical'),
        ('TypeScript', 'Advanced', 'High'),
        ('HTML', 'Advanced', 'Critical'),
        ('CSS', 'Advanced', 'Critical'),
        ('Git', 'Intermediate', 'Medium'),
        ('Communication', 'Intermediate', 'Medium')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name = req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- 4. Backend Developer requirements
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000004',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('Node.js', 'Advanced', 'Critical'),
        ('Express.js', 'Advanced', 'High'),
        ('PostgreSQL', 'Advanced', 'Critical'),
        ('SQL', 'Advanced', 'Critical'),
        ('MongoDB', 'Intermediate', 'Medium'),
        ('Docker', 'Intermediate', 'High'),
        ('Cybersecurity', 'Intermediate', 'High'),
        ('Git', 'Intermediate', 'Medium')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name = req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- 5. Data Analyst requirements
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000005',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('SQL', 'Advanced', 'Critical'),
        ('Python', 'Intermediate', 'High'),
        ('Data Analytics', 'Advanced', 'Critical'),
        ('Power BI', 'Advanced', 'Critical'),
        ('Excel', 'Advanced', 'High'),
        ('Statistics', 'Intermediate', 'High'),
        ('Communication', 'Intermediate', 'Medium')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name = req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- 6. Machine Learning Engineer requirements
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000006',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('Python', 'Advanced', 'Critical'),
        ('Machine Learning', 'Advanced', 'Critical'),
        ('Deep Learning', 'Intermediate', 'High'),
        ('Artificial Intelligence', 'Advanced', 'Critical'),
        ('Statistics', 'Advanced', 'High'),
        ('Algorithms', 'Intermediate', 'High'),
        ('SQL', 'Intermediate', 'Medium')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name = req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- 7. Cloud / DevOps Engineer requirements
INSERT INTO public.job_role_skills (job_role_id, skill_id, required_proficiency, importance)
SELECT 
    '10000000-0000-0000-0000-000000000007',
    s.id,
    req.prof,
    req.imp
FROM (
    VALUES
        ('Docker', 'Advanced', 'Critical'),
        ('DevOps', 'Advanced', 'Critical'),
        ('AWS', 'Intermediate', 'High'),
        ('Azure', 'Intermediate', 'Medium'),
        ('Cloud Computing', 'Advanced', 'Critical'),
        ('Cybersecurity', 'Intermediate', 'High'),
        ('Git', 'Advanced', 'High')
) AS req(skill_name, prof, imp)
JOIN public.skills s ON s.name = req.skill_name
ON CONFLICT (job_role_id, skill_id) DO UPDATE SET
    required_proficiency = EXCLUDED.required_proficiency,
    importance = EXCLUDED.importance;

-- =========================================================================
-- SEED DATA: MICRO-ROADMAP MODULES FOR KEY SKILLS
-- =========================================================================

-- React Roadmap
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
        ('API Integration & Asynchronous State', 'RESTful API integration, JWT bearer authorization headers, optimistic updates, and error handling.', 4, '6 Hours', 'Hands-on Project', 'Implement real-time CRUD candidate skill management syncing to PostgreSQL API endpoints.', false),
        ('Mini Capstone: Candidate Dashboard Widget', 'Full end-to-end integration combining state, custom components, responsive Tailwind CSS, and chart visualizers.', 5, '8 Hours', 'Hands-on Project', 'Create a complete skill gap radar chart with live proficiency level toggles.', false),
        ('React Competency Validation Assessment', 'Practical competency assessment validating knowledge of concurrent React, hooks, and clean architecture.', 6, '1 Hour', 'Code Practice', 'Complete the 10-question timed assessment and practical code sandbox challenge.', true)
) AS t(topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
JOIN public.skills s ON s.name = 'React';

-- Node.js / Express Roadmap
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
        ('Authentication & JWT Security', 'Bcrypt password hashing, JSON Web Token generation/verification, token expiration, and secure cookie headers.', 3, '5 Hours', 'Hands-on Project', 'Build an authentication middleware verifying Bearer tokens and decoding user identity claims.', false),
        ('Database Integration with PostgreSQL', 'Connection pooling, parameterized queries preventing SQL injection, transaction rollback, and error handling.', 4, '6 Hours', 'Hands-on Project', 'Connect Express API routes to PostgreSQL with connection pooling and typed response schemas.', false),
        ('Node.js Backend Competency Assessment', 'Validation assessment verifying RESTful API architecture, security practices, and async programming.', 5, '1 Hour', 'Code Practice', 'Pass the timed backend assessment with minimum 75% score.', true)
) AS t(topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
JOIN public.skills s ON s.name = 'Node.js';

-- SQL / PostgreSQL Roadmap
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
        ('Relational Database Design & Normalization', 'Entity-relationship diagrams, primary keys, foreign keys, 3NF normalization, and data integrity constraints.', 1, '3 Hours', 'Documentation', 'Design a normalized 4-table schema for multi-tenant organizations, profiles, and candidate skills.', false),
        ('Advanced SQL Queries & JOIN Operations', 'INNER/LEFT/RIGHT JOINs, GROUP BY aggregations, HAVING clauses, subqueries, and window functions (RANK, ROW_NUMBER).', 2, '5 Hours', 'Interactive Lab', 'Write complex analytical queries calculating candidate skill readiness distributions by district.', false),
        ('Indexing & Query Performance Optimization', 'B-tree indexes, composite indexes, EXPLAIN ANALYZE execution plans, and query performance tuning.', 3, '4 Hours', 'Interactive Lab', 'Optimize a slow query across 100k candidate records using targeted multi-column indexes.', false),
        ('Row Level Security (RLS) & Multi-Tenant Policies', 'Defining granular tenant isolation rules in PostgreSQL using auth.uid() and role checks.', 4, '4 Hours', 'Hands-on Project', 'Implement RLS policies ensuring candidates can only modify their own profile records.', false),
        ('PostgreSQL Database Competency Assessment', 'Practical assessment validating SQL mastery, index strategies, and multi-tenant security architecture.', 5, '1 Hour', 'Code Practice', 'Execute required SQL queries and pass the automated validation test.', true)
) AS t(topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
JOIN public.skills s ON s.name = 'PostgreSQL';

-- Docker Roadmap
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
        ('Containerization Concepts & Docker Architecture', 'Containers vs virtual machines, Docker daemon, image layers, registries, and container lifecycle.', 1, '2 Hours', 'Documentation', 'Run, inspect, stop, and prune local Docker containers from terminal CLI.', false),
        ('Multi-Stage Dockerfiles & Image Optimization', 'Writing minimal production Dockerfiles using multi-stage builds, Alpine bases, and non-root users.', 2, '4 Hours', 'Hands-on Project', 'Build a lightweight multi-stage Docker image for a Vite + Node.js full-stack app under 120MB.', false),
        ('Docker Compose for Multi-Service Environments', 'Defining web, database, and Redis cache services, volume mounting for persistent data, and internal networks.', 3, '4 Hours', 'Interactive Lab', 'Configure a docker-compose.yml running the full application with PostgreSQL database service.', false),
        ('Cloud Run & Container Deployment', 'Building container images, tagging with artifact registry, and deploying to managed serverless Cloud Run.', 4, '5 Hours', 'Hands-on Project', 'Deploy containerized web service to Cloud Run with environment variables and health check probes.', false),
        ('Docker & DevOps Validation Assessment', 'Competency check verifying Dockerfile authoring, multi-stage builds, and deployment readiness.', 5, '1 Hour', 'Code Practice', 'Pass the 8-question containerization and deployment check.', true)
) AS t(topic, description, order_index, estimated_time, resource_type, practice_requirement, assessment_ready)
JOIN public.skills s ON s.name = 'Docker';
