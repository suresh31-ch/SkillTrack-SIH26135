import {
  Organization,
  Profile,
  CandidateProfile,
  Skill,
  JobRole,
  JobRoleSkill,
  RoadmapItem,
  CandidateRoadmapProgress,
  CandidateSkill,
  Job,
  Application,
  TrainingCenter,
  Course,
  Batch,
  Enrollment,
  Attendance,
  Certification,
  Assessment,
  AssessmentResult,
  Placement,
  EmploymentVerification,
  DistrictAnalytics,
  SkillDemand,
  AnomalyAlert
} from '../types';

export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-maha-001',
    name: 'Government of Maharashtra',
    type: 'Government Program',
    logo_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=128&auto=format&fit=crop&q=80',
    contact_email: 'skilling.mission@maharashtra.gov.in',
    state: 'Maharashtra',
    location: 'Mantralaya, Nariman Point, Mumbai - 400032',
    subscription_plan: 'Enterprise',
    status: 'active',
    created_at: '2025-01-15T00:00:00.000Z',
    updated_at: '2026-08-01T00:00:00.000Z'
  },
  {
    id: 'org-tech-002',
    name: 'TechSkills India Foundation',
    type: 'Corporate',
    logo_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80',
    contact_email: 'contact@techskillsfoundation.org',
    state: 'Maharashtra',
    location: 'Hinjawadi Phase 1, Pune - 411057',
    subscription_plan: 'Pro',
    status: 'active',
    created_at: '2025-03-10T00:00:00.000Z',
    updated_at: '2026-07-20T00:00:00.000Z'
  },
  {
    id: 'org-rural-003',
    name: 'Vidarbha Rural Livelihood Mission',
    type: 'Skilling NGO',
    contact_email: 'rural.empower@vidarbha-skilling.in',
    state: 'Maharashtra',
    location: 'Civil Lines, Nagpur - 440001',
    subscription_plan: 'Government Tier',
    status: 'active',
    created_at: '2025-05-12T00:00:00.000Z',
    updated_at: '2026-06-15T00:00:00.000Z'
  }
];

export const SEED_PROFILES: Profile[] = [
  {
    id: 'prof-cand-001',
    auth_user_id: 'auth-cand-001',
    full_name: 'Aarav Patil',
    email: 'candidate@skilltrack.io',
    phone: '+91 98230 45678',
    role: 'candidate',
    organization_id: 'org-maha-001',
    district: 'Pune',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z'
  },
  {
    id: 'prof-recr-001',
    auth_user_id: 'auth-recr-001',
    full_name: 'Pooja Deshmukh',
    email: 'recruiter@skilltrack.io',
    phone: '+91 98450 11223',
    role: 'recruiter',
    organization_id: 'org-maha-001',
    district: 'Mumbai Suburban',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z'
  },
  {
    id: 'prof-tc-001',
    auth_user_id: 'auth-tc-001',
    full_name: 'Prof. Rajesh Kulkarni',
    email: 'training@skilltrack.io',
    phone: '+91 94220 78901',
    role: 'training_center',
    organization_id: 'org-maha-001',
    district: 'Chhatrapati Sambhajinagar',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z'
  },
  {
    id: 'prof-admin-001',
    auth_user_id: 'auth-admin-001',
    full_name: 'Dr. Sunita Shinde, IAS',
    email: 'admin@skilltrack.io',
    phone: '+91 99887 66554',
    role: 'organization_admin',
    organization_id: 'org-maha-001',
    district: 'Mumbai',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=80',
    created_at: '2025-01-15T00:00:00.000Z',
    updated_at: '2026-08-28T00:00:00.000Z'
  }
];

export const SEED_CANDIDATE_PROFILES: CandidateProfile[] = [
  {
    id: 'cand-prof-001',
    profile_id: 'prof-cand-001',
    organization_id: 'org-maha-001',
    education: 'Bachelor of Technology (B.Tech)',
    degree: 'Computer Engineering',
    graduation_year: 2025,
    experience_years: 1,
    employment_status: 'placed',
    target_job: 'Full Stack Web Developer',
    readiness_score: 84,
    profile_completion: 92,
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2026-08-25T00:00:00.000Z'
  }
];

export const SEED_SKILLS: Skill[] = [
  // Software & Web Development
  { id: 'sk-01', name: 'React.js & TypeScript', category: 'Frontend Web Development', description: 'Modern UI components, React hooks, type safety, state management and Vite tooling', created_at: '2025-01-01' },
  { id: 'sk-02', name: 'Node.js & Express API', category: 'Backend Architecture', description: 'RESTful API creation, JWT authentication, middleware chains, async flows', created_at: '2025-01-01' },
  { id: 'sk-03', name: 'PostgreSQL & Database Design', category: 'Databases & SQL', description: 'Relational data modeling, RLS policies, indexing, joins and query optimization', created_at: '2025-01-01' },
  { id: 'sk-04', name: 'Python & Data Analytics', category: 'Data Science & AI', description: 'NumPy, Pandas data wrangling, Matplotlib visual analytics, statistical modeling', created_at: '2025-01-01' },
  { id: 'sk-08', name: 'Cloud Infrastructure (GCP/AWS)', category: 'DevOps & Cloud', description: 'Containerization with Docker, Google Cloud Run, VPC security and CI/CD pipelines', created_at: '2025-01-01' },
  { id: 'sk-09', name: 'Tailwind CSS & Responsive UI', category: 'Frontend Web Development', description: 'Utility-first styling, responsive layouts, design systems and animations', created_at: '2025-01-01' },
  { id: 'sk-10', name: 'Next.js & Server Components', category: 'Frontend Web Development', description: 'App router, server-side rendering, API routes and static generation', created_at: '2025-01-01' },
  { id: 'sk-11', name: 'GraphQL & Apollo Client', category: 'Backend Architecture', description: 'Schema design, resolvers, queries, mutations and cache management', created_at: '2025-01-01' },
  { id: 'sk-12', name: 'MongoDB & NoSQL Modeling', category: 'Databases & SQL', description: 'Document schemas, aggregation pipelines, replica sets and indexing', created_at: '2025-01-01' },
  { id: 'sk-13', name: 'Docker & Kubernetes', category: 'DevOps & Cloud', description: 'Container builds, orchestration, pods, services and Helm deployments', created_at: '2025-01-01' },
  { id: 'sk-14', name: 'Machine Learning with Scikit-Learn', category: 'Data Science & AI', description: 'Classification, regression, cross-validation, feature engineering', created_at: '2025-01-01' },
  { id: 'sk-15', name: 'Cybersecurity Fundamentals', category: 'DevOps & Cloud', description: 'OWASP Top 10, penetration testing basics, network firewalls, IAM policies', created_at: '2025-01-01' },

  // Green Energy & Automotive
  { id: 'sk-05', name: 'Electric Vehicle (EV) Diagnostics', category: 'Green Tech & Automotive', description: 'Battery management systems (BMS), high-voltage safety, powertrain diagnostics', created_at: '2025-01-01' },
  { id: 'sk-07', name: 'Solar PV Installation & Grid Tie', category: 'Renewable Energy', description: 'Rooftop solar mounting, inverter wiring, net metering synchronization and safety compliance', created_at: '2025-01-01' },
  { id: 'sk-16', name: 'EV Charging Station Commissioning', category: 'Green Tech & Automotive', description: 'CCS2 / Type 2 AC & DC fast chargers, OCPP protocol, earthing protocols', created_at: '2025-01-01' },
  { id: 'sk-17', name: 'Battery Pack Assembly & Testing', category: 'Green Tech & Automotive', description: 'Li-ion cell sorting, spot welding, thermal management and cycle life testing', created_at: '2025-01-01' },
  { id: 'sk-18', name: 'Wind Turbine Maintenance', category: 'Renewable Energy', description: 'Gearbox inspection, blade maintenance, yaw system diagnostics and SCADA monitoring', created_at: '2025-01-01' },

  // Industrial Automation & Electronics
  { id: 'sk-06', name: 'CNC Machine Programming', category: 'Industrial Automation', description: 'G-code / M-code generation, Fanuc/Siemens controller operation, 3-axis milling', created_at: '2025-01-01' },
  { id: 'sk-19', name: 'PLC & SCADA Automation', category: 'Industrial Automation', description: 'Ladder logic programming, Allen-Bradley/Siemens PLCs, HMI dashboard configuration', created_at: '2025-01-01' },
  { id: 'sk-20', name: 'Industrial Robotics & Arm Calibration', category: 'Industrial Automation', description: 'Robotic pick-and-place, teach pendant operation, safety interlocks', created_at: '2025-01-01' },
  { id: 'sk-21', name: 'Embedded Systems & IoT (ESP32/STM32)', category: 'Electronics & IoT', description: 'Microcontroller programming in C/C++, sensor interfacing, MQTT/HTTP protocols', created_at: '2025-01-01' },
  { id: 'sk-22', name: 'PCB Design with KiCad/Altium', category: 'Electronics & IoT', description: 'Schematic capture, multi-layer board routing, DRC rules and Gerber output', created_at: '2025-01-01' },

  // Healthcare, Logistics & Operations
  { id: 'sk-23', name: 'Medical Equipment Maintenance', category: 'Healthcare Technology', description: 'Calibration of patient monitors, ECG machines, ventilators and autoclave systems', created_at: '2025-01-01' },
  { id: 'sk-24', name: 'Supply Chain & Warehouse Management', category: 'Logistics & Operations', description: 'Inventory tracking, WMS software, barcode/RFID scanning and fleet routing', created_at: '2025-01-01' },
  { id: 'sk-25', name: 'Quality Assurance & Six Sigma (QA/QC)', category: 'Industrial Automation', description: 'Root cause analysis, statistical process control, 5S methodology and ISO standards', created_at: '2025-01-01' }
];

export const SEED_CANDIDATE_SKILLS: CandidateSkill[] = [
  { id: 'cs-01', candidate_id: 'prof-cand-001', skill_id: 'sk-01', proficiency_level: 'Advanced', verified: true, created_at: '2025-07-01' },
  { id: 'cs-02', candidate_id: 'prof-cand-001', skill_id: 'sk-02', proficiency_level: 'Intermediate', verified: true, created_at: '2025-07-15' },
  { id: 'cs-03', candidate_id: 'prof-cand-001', skill_id: 'sk-03', proficiency_level: 'Intermediate', verified: false, created_at: '2025-08-01' },
  { id: 'cs-04', candidate_id: 'prof-cand-001', skill_id: 'sk-08', proficiency_level: 'Beginner', verified: false, created_at: '2025-08-10' }
];

export const SEED_JOBS: Job[] = [
  {
    id: 'job-001',
    recruiter_id: 'prof-recr-001',
    organization_id: 'org-maha-001',
    company_name: 'Apex Infotech Solutions',
    title: 'Junior Full Stack Engineer',
    description: 'Looking for enthusiastic developers trained under state skilling initiatives with React, Node.js and SQL proficiency. Great learning culture and rapid career progression.',
    location: 'Pune, Maharashtra (Hybrid)',
    experience_required: 1,
    education_required: 'B.Tech / BCA / Diploma in CS',
    salary_min: 420000,
    salary_max: 600000,
    status: 'open',
    created_at: '2026-07-15T00:00:00.000Z',
    updated_at: '2026-08-20T00:00:00.000Z',
    required_skills: [
      { id: 'jrs-01', job_id: 'job-001', skill_id: 'sk-01', skill_name: 'React.js & TypeScript', required_level: 'Intermediate', is_required: true },
      { id: 'jrs-02', job_id: 'job-001', skill_id: 'sk-02', skill_name: 'Node.js & Express API', required_level: 'Intermediate', is_required: true },
      { id: 'jrs-03', job_id: 'job-001', skill_id: 'sk-03', skill_name: 'PostgreSQL & Database Design', required_level: 'Beginner', is_required: true }
    ]
  },
  {
    id: 'job-002',
    recruiter_id: 'prof-recr-001',
    organization_id: 'org-maha-001',
    company_name: 'Mahindra Green Energy Ltd',
    title: 'Solar & EV Field Technician',
    description: 'Commissioning, routine diagnostic testing, and rooftop solar synchronization for commercial buildings across Western Maharashtra.',
    location: 'Chhatrapati Sambhajinagar, MH',
    experience_required: 0,
    education_required: 'ITI / Diploma in Electrical',
    salary_min: 300000,
    salary_max: 420000,
    status: 'open',
    created_at: '2026-08-01T00:00:00.000Z',
    updated_at: '2026-08-25T00:00:00.000Z',
    required_skills: [
      { id: 'jrs-04', job_id: 'job-002', skill_id: 'sk-05', skill_name: 'Electric Vehicle (EV) Diagnostics', required_level: 'Intermediate', is_required: true },
      { id: 'jrs-05', job_id: 'job-002', skill_id: 'sk-07', skill_name: 'Solar PV Installation & Grid Tie', required_level: 'Intermediate', is_required: true }
    ]
  },
  {
    id: 'job-003',
    recruiter_id: 'prof-recr-001',
    organization_id: 'org-maha-001',
    company_name: 'Kalyani Advanced Precision',
    title: 'CNC Multi-Axis Operator & Programmer',
    description: 'Precision machining operations for aerospace components. Immediate joining with guaranteed 3-year career path.',
    location: 'Nagpur MIDC, Maharashtra',
    experience_required: 1,
    education_required: 'ITI / Diploma Mechanical',
    salary_min: 360000,
    salary_max: 480000,
    status: 'open',
    created_at: '2026-08-10T00:00:00.000Z',
    updated_at: '2026-08-28T00:00:00.000Z',
    required_skills: [
      { id: 'jrs-06', job_id: 'job-003', skill_id: 'sk-06', skill_name: 'CNC Machine Programming', required_level: 'Advanced', is_required: true }
    ]
  }
];

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    candidate_id: 'prof-cand-001',
    job_id: 'job-001',
    recruiter_id: 'prof-recr-001',
    organization_id: 'org-maha-001',
    skill_match_score: 92,
    readiness_score: 84,
    overall_match_score: 88,
    status: 'Selected',
    candidate: {
      full_name: 'Aarav Patil',
      email: 'candidate@skilltrack.io',
      target_job: 'Full Stack Web Developer',
      readiness_score: 84,
      district: 'Pune'
    },
    job: {
      title: 'Junior Full Stack Engineer',
      company_name: 'Apex Infotech Solutions',
      location: 'Pune, Maharashtra (Hybrid)'
    },
    applied_at: '2026-07-20T10:30:00.000Z',
    updated_at: '2026-08-15T14:00:00.000Z'
  },
  {
    id: 'app-002',
    candidate_id: 'prof-cand-001',
    job_id: 'job-002',
    recruiter_id: 'prof-recr-001',
    organization_id: 'org-maha-001',
    skill_match_score: 45,
    readiness_score: 84,
    overall_match_score: 60,
    status: 'Applied',
    candidate: {
      full_name: 'Aarav Patil',
      email: 'candidate@skilltrack.io',
      target_job: 'Full Stack Web Developer',
      readiness_score: 84,
      district: 'Pune'
    },
    job: {
      title: 'Solar & EV Field Technician',
      company_name: 'Mahindra Green Energy Ltd',
      location: 'Chhatrapati Sambhajinagar, MH'
    },
    applied_at: '2026-08-05T09:15:00.000Z',
    updated_at: '2026-08-05T09:15:00.000Z'
  }
];

export const SEED_TRAINING_CENTERS: TrainingCenter[] = [
  {
    id: 'tc-001',
    organization_id: 'org-maha-001',
    name: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
    district: 'Pune',
    taluka: 'Haveli',
    address: 'Shivajinagar Skilling Complex, FC Road, Pune - 411005',
    contact_email: 'pune.center@msias.edu.in',
    status: 'active',
    created_at: '2025-01-20'
  },
  {
    id: 'tc-002',
    organization_id: 'org-maha-001',
    name: 'Marathwada Center for Industrial Excellence',
    district: 'Chhatrapati Sambhajinagar',
    taluka: 'Aurangabad',
    address: 'MIDC Waluj Area, Plot 44-B, Sambhajinagar - 431136',
    contact_email: 'waluj.center@mcie.org.in',
    status: 'active',
    created_at: '2025-02-15'
  },
  {
    id: 'tc-003',
    organization_id: 'org-maha-001',
    name: 'Vidarbha Skill Innovation Academy',
    district: 'Nagpur',
    taluka: 'Nagpur Urban',
    address: 'IT Park Road, Parsodi, Nagpur - 440022',
    contact_email: 'nagpur@vsia.gov.in',
    status: 'active',
    created_at: '2025-03-01'
  }
];

export const SEED_COURSES: Course[] = [
  {
    id: 'crs-001',
    training_center_id: 'tc-001',
    organization_id: 'org-maha-001',
    name: 'Full Stack Cloud Application Engineering',
    description: 'Comprehensive 16-week immersive boot camp covering React 19, TypeScript, Express, PostgreSQL, and Google Cloud Run deployment with CI/CD.',
    duration: '4 Months (480 Hours)',
    skills: ['React.js & TypeScript', 'Node.js & Express API', 'PostgreSQL & Database Design', 'Cloud Infrastructure (GCP/AWS)'],
    status: 'active'
  },
  {
    id: 'crs-002',
    training_center_id: 'tc-002',
    organization_id: 'org-maha-001',
    name: 'Electric Mobility & High-Voltage Battery Technician',
    description: 'Diagnostic troubleshooting of BMS, motor controllers, thermal runaway prevention, and fast DC charging station integration.',
    duration: '3 Months (360 Hours)',
    skills: ['Electric Vehicle (EV) Diagnostics', 'Solar PV Installation & Grid Tie'],
    status: 'active'
  },
  {
    id: 'crs-003',
    training_center_id: 'tc-003',
    organization_id: 'org-maha-001',
    name: 'Advanced CNC Machining & Automation 4.0',
    description: 'Hands-on G-code generation, Fanuc controller setup, multi-axis milling, coordinate measuring machine (CMM) verification.',
    duration: '3 Months (360 Hours)',
    skills: ['CNC Machine Programming'],
    status: 'active'
  }
];

export const SEED_BATCHES: Batch[] = [
  {
    id: 'batch-001',
    course_id: 'crs-001',
    course_name: 'Full Stack Cloud Application Engineering',
    training_center_id: 'tc-001',
    organization_id: 'org-maha-001',
    name: 'Batch 2025-Q3 (Alpha)',
    start_date: '2025-07-01',
    end_date: '2025-10-31',
    capacity: 35,
    enrolled_count: 32,
    created_at: '2025-06-15'
  },
  {
    id: 'batch-002',
    course_id: 'crs-002',
    course_name: 'Electric Mobility & High-Voltage Battery Technician',
    training_center_id: 'tc-002',
    organization_id: 'org-maha-001',
    name: 'EV Tech Batch 14',
    start_date: '2025-08-01',
    end_date: '2025-10-31',
    capacity: 30,
    enrolled_count: 28,
    created_at: '2025-07-10'
  }
];

export const SEED_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-001',
    batch_id: 'batch-001',
    batch_name: 'Batch 2025-Q3 (Alpha)',
    course_name: 'Full Stack Cloud Application Engineering',
    candidate_id: 'prof-cand-001',
    candidate_name: 'Aarav Patil',
    organization_id: 'org-maha-001',
    enrollment_date: '2025-07-01',
    completion_status: 'completed',
    progress_percentage: 100
  }
];

export const SEED_ATTENDANCE: Attendance[] = [
  { id: 'att-01', batch_id: 'batch-001', candidate_id: 'prof-cand-001', candidate_name: 'Aarav Patil', organization_id: 'org-maha-001', attendance_date: '2025-10-20', status: 'present' },
  { id: 'att-02', batch_id: 'batch-001', candidate_id: 'prof-cand-001', candidate_name: 'Aarav Patil', organization_id: 'org-maha-001', attendance_date: '2025-10-21', status: 'present' },
  { id: 'att-03', batch_id: 'batch-001', candidate_id: 'prof-cand-001', candidate_name: 'Aarav Patil', organization_id: 'org-maha-001', attendance_date: '2025-10-22', status: 'present' },
  { id: 'att-04', batch_id: 'batch-001', candidate_id: 'prof-cand-001', candidate_name: 'Aarav Patil', organization_id: 'org-maha-001', attendance_date: '2025-10-23', status: 'present' }
];

export const SEED_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-001',
    candidate_id: 'prof-cand-001',
    training_center_id: 'tc-001',
    organization_id: 'org-maha-001',
    course_id: 'crs-001',
    course_name: 'Full Stack Cloud Application Engineering',
    certificate_number: 'ST-MAHA-2025-08942',
    issue_date: '2025-11-05',
    verification_status: 'valid',
    certificate_url: 'https://skilltrack.io/verify/ST-MAHA-2025-08942',
    created_at: '2025-11-05'
  }
];

export const SEED_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-001',
    organization_id: 'org-maha-001',
    title: 'React & TypeScript Practical Competency Test',
    skill_id: 'sk-01',
    skill_name: 'React.js & TypeScript',
    difficulty: 'Intermediate',
    created_at: '2025-06-01',
    questions: [
      {
        id: 1,
        question: 'Which React hook should be used to memoize an expensive calculation result between renders?',
        options: ['useEffect', 'useMemo', 'useCallback', 'useRef'],
        correctIndex: 1
      },
      {
        id: 2,
        question: 'In TypeScript, what is the key difference between an "interface" and a "type" alias?',
        options: [
          'Interfaces can be merged with declaration merging; types cannot be re-opened',
          'Types cannot represent primitives',
          'Interfaces cannot extend other interfaces',
          'There is no functional difference'
        ],
        correctIndex: 0
      },
      {
        id: 3,
        question: 'What is the recommended approach to prevent infinite loops in useEffect?',
        options: [
          'Never use dependency arrays',
          'Keep dependency arrays minimal and stabilize referenced functions or objects outside the effect',
          'Wrap the entire component in a try-catch block',
          'Always use setTimeout inside the effect'
        ],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'asm-002',
    organization_id: 'org-maha-001',
    title: 'PostgreSQL Relational Design & Indexing Assessment',
    skill_id: 'sk-03',
    skill_name: 'PostgreSQL & Database Design',
    difficulty: 'Intermediate',
    created_at: '2025-06-10',
    questions: [
      {
        id: 1,
        question: 'What type of PostgreSQL index is the default when creating an index on a scalar column?',
        options: ['GIN Index', 'B-Tree Index', 'BRIN Index', 'Hash Index'],
        correctIndex: 1
      },
      {
        id: 2,
        question: 'Which PostgreSQL security mechanism allows filtering row access per authenticated user or tenant?',
        options: ['Column Constraints', 'Row Level Security (RLS)', 'Materialized Views', 'Foreign Keys'],
        correctIndex: 1
      }
    ]
  }
];

export const SEED_ASSESSMENT_RESULTS: AssessmentResult[] = [
  {
    id: 'res-001',
    assessment_id: 'asm-001',
    assessment_title: 'React & TypeScript Practical Competency Test',
    candidate_id: 'prof-cand-001',
    organization_id: 'org-maha-001',
    score: 3,
    percentage: 100,
    completed_at: '2025-10-18T11:20:00Z'
  },
  {
    id: 'res-002',
    assessment_id: 'asm-002',
    assessment_title: 'PostgreSQL Relational Design & Indexing Assessment',
    candidate_id: 'prof-cand-001',
    organization_id: 'org-maha-001',
    score: 2,
    percentage: 100,
    completed_at: '2025-10-24T15:45:00Z'
  }
];

export const SEED_PLACEMENTS: Placement[] = [
  {
    id: 'plc-001',
    candidate_id: 'prof-cand-001',
    candidate_name: 'Aarav Patil',
    training_center_id: 'tc-001',
    organization_id: 'org-maha-001',
    company: 'Apex Infotech Solutions',
    job_role: 'Junior Full Stack Engineer',
    salary: 480000,
    joining_date: '2025-11-15',
    offer_letter_url: 'https://skilltrack.io/offers/OFFER-APEX-8821.pdf',
    verification_status: 'verified',
    employment_status: 'active',
    created_at: '2025-11-10T00:00:00.000Z',
    updated_at: '2026-08-15T00:00:00.000Z'
  }
];

export const SEED_EMPLOYMENT_VERIFICATIONS: EmploymentVerification[] = [
  {
    id: 'ev-001',
    placement_id: 'plc-001',
    candidate_id: 'prof-cand-001',
    candidate_name: 'Aarav Patil',
    organization_id: 'org-maha-001',
    verification_period: '3_month',
    status: 'simulated_epfo_verified',
    verification_method: 'EPFO_Simulator',
    verified_at: '2026-02-15T10:00:00Z',
    notes: 'Verified continuous monthly UAN salary contribution for Nov 2025, Dec 2025, and Jan 2026.'
  },
  {
    id: 'ev-002',
    placement_id: 'plc-001',
    candidate_id: 'prof-cand-001',
    candidate_name: 'Aarav Patil',
    organization_id: 'org-maha-001',
    verification_period: '6_month',
    status: 'simulated_epfo_verified',
    verification_method: 'EPFO_Simulator',
    verified_at: '2026-05-18T14:30:00Z',
    notes: 'Confirmed 6-month retention milestone via EPFO Electronic Challan Return credit stream.'
  },
  {
    id: 'ev-003',
    placement_id: 'plc-001',
    candidate_id: 'prof-cand-001',
    candidate_name: 'Aarav Patil',
    organization_id: 'org-maha-001',
    verification_period: '12_month',
    status: 'pending',
    verification_method: 'EPFO_Simulator',
    verified_at: '2026-08-29T00:00:00Z',
    notes: 'Scheduled for upcoming 12-month retention audit on Nov 15, 2026.'
  }
];

export const SEED_DISTRICT_ANALYTICS: DistrictAnalytics[] = [
  {
    id: 'da-01',
    organization_id: 'org-maha-001',
    district: 'Pune',
    state: 'Maharashtra',
    total_candidates: 12450,
    trained_count: 11200,
    placed_count: 9408,
    retention_rate_6m: 86.4,
    top_skill_demanded: 'Cloud & Full Stack Web Dev',
    skill_gap_index: 22,
    updated_at: '2026-08-25'
  },
  {
    id: 'da-02',
    organization_id: 'org-maha-001',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    total_candidates: 18900,
    trained_count: 16500,
    placed_count: 13860,
    retention_rate_6m: 84.1,
    top_skill_demanded: 'Data Analytics & AI Ops',
    skill_gap_index: 26,
    updated_at: '2026-08-25'
  },
  {
    id: 'da-03',
    organization_id: 'org-maha-001',
    district: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    total_candidates: 7800,
    trained_count: 6900,
    placed_count: 5313,
    retention_rate_6m: 78.5,
    top_skill_demanded: 'EV Diagnostics & Green Energy',
    skill_gap_index: 34,
    updated_at: '2026-08-25'
  },
  {
    id: 'da-04',
    organization_id: 'org-maha-001',
    district: 'Nagpur',
    state: 'Maharashtra',
    total_candidates: 9200,
    trained_count: 8100,
    placed_count: 6480,
    retention_rate_6m: 81.2,
    top_skill_demanded: 'CNC Machining & Precision Tech',
    skill_gap_index: 29,
    updated_at: '2026-08-25'
  },
  {
    id: 'da-05',
    organization_id: 'org-maha-001',
    district: 'Nashik',
    state: 'Maharashtra',
    total_candidates: 6400,
    trained_count: 5700,
    placed_count: 4332,
    retention_rate_6m: 76.8,
    top_skill_demanded: 'Solar PV & Agro-Tech IoT',
    skill_gap_index: 38,
    updated_at: '2026-08-25'
  },
  {
    id: 'da-06',
    organization_id: 'org-maha-001',
    district: 'Kolhapur',
    state: 'Maharashtra',
    total_candidates: 5100,
    trained_count: 4600,
    placed_count: 3634,
    retention_rate_6m: 79.0,
    top_skill_demanded: 'Foundry Automation & Robotics',
    skill_gap_index: 31,
    updated_at: '2026-08-25'
  }
];

export const SEED_SKILL_DEMAND: SkillDemand[] = [
  { id: 'sd-01', organization_id: 'org-maha-001', skill_name: 'Full Stack & TypeScript', demand_score: 96, job_postings_count: 480, avg_salary: 580000, growth_rate: 34.2 },
  { id: 'sd-02', organization_id: 'org-maha-001', skill_name: 'EV Diagnostics & Battery BMS', demand_score: 91, job_postings_count: 310, avg_salary: 420000, growth_rate: 48.6 },
  { id: 'sd-03', organization_id: 'org-maha-001', skill_name: 'CNC 5-Axis Programming', demand_score: 84, job_postings_count: 220, avg_salary: 450000, growth_rate: 19.4 },
  { id: 'sd-04', organization_id: 'org-maha-001', skill_name: 'Solar Grid-Tie Commissioning', demand_score: 88, job_postings_count: 275, avg_salary: 390000, growth_rate: 42.1 },
  { id: 'sd-05', organization_id: 'org-maha-001', skill_name: 'Cloud DevOps (Docker/K8s)', demand_score: 89, job_postings_count: 290, avg_salary: 650000, growth_rate: 28.5 }
];

export const SEED_ANOMALIES: AnomalyAlert[] = [
  {
    id: 'anm-001',
    organization_id: 'org-maha-001',
    training_center_id: 'tc-002',
    severity: 'medium',
    title: 'Rapid 100% Placement Turnaround Alert',
    description: 'Batch 12 reported 100% placement within 48 hours of course completion with identical joining dates at a newly registered vendor entity.',
    detected_pattern: 'Suspicious Bulk Placement Pattern vs Historical Industry Median (14-30 Days)',
    status: 'open',
    created_at: '2026-08-26T14:20:00Z'
  },
  {
    id: 'anm-002',
    organization_id: 'org-maha-001',
    training_center_id: 'tc-003',
    severity: 'high',
    title: 'Biometric Attendance Divergence',
    description: 'Attendance log shows 98% presence, but remote assessment submissions originated from duplicate IP subnets in a 10-minute window.',
    detected_pattern: 'Potential Proxy Attendance in Digital Skill Module',
    status: 'investigating',
    created_at: '2026-08-22T09:15:00Z'
  }
];

// =========================================================================
// MILESTONE 2 SEED DATA: 7 DEMO JOB ROLES, SKILL REQUIREMENTS & ROADMAPS
// =========================================================================

export const SEED_JOB_ROLES: JobRole[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Full Stack Developer',
    description: 'End-to-end web engineering covering modern React frontend, Node.js API servers, and relational PostgreSQL databases.',
    category: 'Web Development',
    avg_salary_lpa: 7.5,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Software Engineer',
    description: 'Core software systems engineering, data structures, algorithms, object-oriented design, and robust backend services.',
    category: 'Software Engineering',
    avg_salary_lpa: 8.2,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'Frontend Developer',
    description: 'Modern single-page applications, responsive interfaces, state architectures with React, TypeScript, and Tailwind CSS.',
    category: 'Frontend Engineering',
    avg_salary_lpa: 6.8,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'Backend Developer',
    description: 'Scalable server-side APIs, microservices, database modeling, authentication, security, and performance tuning.',
    category: 'Backend Engineering',
    avg_salary_lpa: 7.8,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    name: 'Data Analyst',
    description: 'Statistical analysis, business intelligence dashboards with Power BI, Excel modeling, SQL queries, and Python data pipelines.',
    category: 'Data & Analytics',
    avg_salary_lpa: 6.2,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    name: 'Machine Learning Engineer',
    description: 'Supervised/unsupervised models, predictive analytics, deep neural networks, Python AI stacks, and model evaluation.',
    category: 'AI & Machine Learning',
    avg_salary_lpa: 9.5,
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    name: 'Cloud / DevOps Engineer',
    description: 'Containerization with Docker, Kubernetes, CI/CD automated deployment, AWS/GCP infrastructure, and site reliability.',
    category: 'Cloud & Infrastructure',
    avg_salary_lpa: 8.8,
    created_at: '2025-01-01T00:00:00.000Z'
  }
];

export const SEED_JOB_ROLE_SKILLS: JobRoleSkill[] = [
  // 1. Full Stack Developer
  { id: 'jrs-fs-01', job_role_id: '10000000-0000-0000-0000-000000000001', skill_id: 'sk-01', required_proficiency: 'Advanced', importance: 'Critical' }, // React / React.js & TypeScript
  { id: 'jrs-fs-02', job_role_id: '10000000-0000-0000-0000-000000000001', skill_id: 'sk-02', required_proficiency: 'Intermediate', importance: 'Critical' }, // Node.js
  { id: 'jrs-fs-03', job_role_id: '10000000-0000-0000-0000-000000000001', skill_id: 'sk-03', required_proficiency: 'Intermediate', importance: 'High' }, // PostgreSQL & SQL
  { id: 'jrs-fs-04', job_role_id: '10000000-0000-0000-0000-000000000001', skill_id: 'sk-09', required_proficiency: 'Intermediate', importance: 'Medium' }, // HTML / CSS / Tailwind
  { id: 'jrs-fs-05', job_role_id: '10000000-0000-0000-0000-000000000001', skill_id: 'sk-08', required_proficiency: 'Intermediate', importance: 'High' }, // Cloud / DevOps / Git
  { id: 'jrs-fs-06', job_role_id: '10000000-0000-0000-0000-000000000001', skill_id: 'sk-13', required_proficiency: 'Beginner', importance: 'Medium' }, // Docker

  // 2. Software Engineer
  { id: 'jrs-se-01', job_role_id: '10000000-0000-0000-0000-000000000002', skill_id: 'sk-04', required_proficiency: 'Intermediate', importance: 'High' }, // Python
  { id: 'jrs-se-02', job_role_id: '10000000-0000-0000-0000-000000000002', skill_id: 'sk-03', required_proficiency: 'Intermediate', importance: 'High' }, // SQL / Database
  { id: 'jrs-se-03', job_role_id: '10000000-0000-0000-0000-000000000002', skill_id: 'sk-01', required_proficiency: 'Intermediate', importance: 'Medium' }, // React / Frontend
  { id: 'jrs-se-04', job_role_id: '10000000-0000-0000-0000-000000000002', skill_id: 'sk-02', required_proficiency: 'Intermediate', importance: 'High' }, // Backend

  // 3. Frontend Developer
  { id: 'jrs-fe-01', job_role_id: '10000000-0000-0000-0000-000000000003', skill_id: 'sk-01', required_proficiency: 'Advanced', importance: 'Critical' }, // React & TypeScript
  { id: 'jrs-fe-02', job_role_id: '10000000-0000-0000-0000-000000000003', skill_id: 'sk-09', required_proficiency: 'Advanced', importance: 'Critical' }, // Tailwind CSS
  { id: 'jrs-fe-03', job_role_id: '10000000-0000-0000-0000-000000000003', skill_id: 'sk-10', required_proficiency: 'Intermediate', importance: 'High' }, // Next.js
  { id: 'jrs-fe-04', job_role_id: '10000000-0000-0000-0000-000000000003', skill_id: 'sk-02', required_proficiency: 'Beginner', importance: 'Low' }, // Basic API

  // 4. Backend Developer
  { id: 'jrs-be-01', job_role_id: '10000000-0000-0000-0000-000000000004', skill_id: 'sk-02', required_proficiency: 'Advanced', importance: 'Critical' }, // Node.js & Express
  { id: 'jrs-be-02', job_role_id: '10000000-0000-0000-0000-000000000004', skill_id: 'sk-03', required_proficiency: 'Advanced', importance: 'Critical' }, // PostgreSQL & SQL
  { id: 'jrs-be-03', job_role_id: '10000000-0000-0000-0000-000000000004', skill_id: 'sk-12', required_proficiency: 'Intermediate', importance: 'Medium' }, // MongoDB
  { id: 'jrs-be-04', job_role_id: '10000000-0000-0000-0000-000000000004', skill_id: 'sk-13', required_proficiency: 'Intermediate', importance: 'High' }, // Docker
  { id: 'jrs-be-05', job_role_id: '10000000-0000-0000-0000-000000000004', skill_id: 'sk-15', required_proficiency: 'Intermediate', importance: 'High' }, // Cybersecurity

  // 5. Data Analyst
  { id: 'jrs-da-01', job_role_id: '10000000-0000-0000-0000-000000000005', skill_id: 'sk-04', required_proficiency: 'Advanced', importance: 'Critical' }, // Python & Data Analytics
  { id: 'jrs-da-02', job_role_id: '10000000-0000-0000-0000-000000000005', skill_id: 'sk-03', required_proficiency: 'Advanced', importance: 'Critical' }, // SQL
  { id: 'jrs-da-03', job_role_id: '10000000-0000-0000-0000-000000000005', skill_id: 'sk-14', required_proficiency: 'Beginner', importance: 'Medium' }, // ML Scikit-Learn

  // 6. Machine Learning Engineer
  { id: 'jrs-ml-01', job_role_id: '10000000-0000-0000-0000-000000000006', skill_id: 'sk-04', required_proficiency: 'Advanced', importance: 'Critical' }, // Python
  { id: 'jrs-ml-02', job_role_id: '10000000-0000-0000-0000-000000000006', skill_id: 'sk-14', required_proficiency: 'Advanced', importance: 'Critical' }, // ML Scikit-Learn
  { id: 'jrs-ml-03', job_role_id: '10000000-0000-0000-0000-000000000006', skill_id: 'sk-03', required_proficiency: 'Intermediate', importance: 'High' }, // SQL
  { id: 'jrs-ml-04', job_role_id: '10000000-0000-0000-0000-000000000006', skill_id: 'sk-08', required_proficiency: 'Intermediate', importance: 'Medium' }, // Cloud Deploy

  // 7. Cloud / DevOps Engineer
  { id: 'jrs-cd-01', job_role_id: '10000000-0000-0000-0000-000000000007', skill_id: 'sk-13', required_proficiency: 'Advanced', importance: 'Critical' }, // Docker & K8s
  { id: 'jrs-cd-02', job_role_id: '10000000-0000-0000-0000-000000000007', skill_id: 'sk-08', required_proficiency: 'Advanced', importance: 'Critical' }, // Cloud (GCP/AWS)
  { id: 'jrs-cd-03', job_role_id: '10000000-0000-0000-0000-000000000007', skill_id: 'sk-15', required_proficiency: 'Intermediate', importance: 'High' }, // Cybersecurity
  { id: 'jrs-cd-04', job_role_id: '10000000-0000-0000-0000-000000000007', skill_id: 'sk-02', required_proficiency: 'Intermediate', importance: 'Medium' } // Node API
];

export const SEED_ROADMAP_ITEMS: RoadmapItem[] = [
  // React.js & TypeScript
  {
    id: 'rmi-react-01',
    skill_id: 'sk-01',
    topic: 'Components & JSX Structure',
    description: 'Functional component patterns, JSX compilation, modular layout trees, and clean prop pass-through.',
    order_index: 1,
    estimated_time: '3 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Build a reusable responsive User Profile Badge with avatar fallback and badge states.',
    assessment_ready: false
  },
  {
    id: 'rmi-react-02',
    skill_id: 'sk-01',
    topic: 'Props, State & React Lifecycle',
    description: 'useState, controlled inputs, lifting state up, immutable state modification, and component re-render triggers.',
    order_index: 2,
    estimated_time: '4 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Construct a filtered dynamic skill search bar with instant client-side array filtering.',
    assessment_ready: false
  },
  {
    id: 'rmi-react-03',
    skill_id: 'sk-01',
    topic: 'Hooks & Side-Effects (useEffect, useMemo)',
    description: 'Side effects lifecycle, dependency arrays, API data fetching, custom hook composition, and memoization.',
    order_index: 3,
    estimated_time: '5 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Build a custom useFetch hook with loading states, error boundaries, and auto-abort cancellation.',
    assessment_ready: false
  },
  {
    id: 'rmi-react-04',
    skill_id: 'sk-01',
    topic: 'API Integration & Asynchronous State',
    description: 'RESTful API integration, JWT bearer authorization headers, optimistic updates, and error handling.',
    order_index: 4,
    estimated_time: '6 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Implement real-time CRUD candidate skill management syncing to PostgreSQL API endpoints.',
    assessment_ready: false
  },
  {
    id: 'rmi-react-05',
    skill_id: 'sk-01',
    topic: 'Mini Capstone: Candidate Dashboard Widget',
    description: 'Full end-to-end integration combining state, custom components, responsive Tailwind CSS, and chart visualizers.',
    order_index: 5,
    estimated_time: '8 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Create a complete skill gap radar chart with live proficiency level toggles.',
    assessment_ready: false
  },
  {
    id: 'rmi-react-06',
    skill_id: 'sk-01',
    topic: 'React Competency Validation Assessment',
    description: 'Practical competency assessment validating knowledge of concurrent React, hooks, and clean architecture.',
    order_index: 6,
    estimated_time: '1 Hour',
    resource_type: 'Code Practice',
    practice_requirement: 'Complete the 10-question timed assessment and practical code sandbox challenge.',
    assessment_ready: true
  },

  // Node.js & Express API
  {
    id: 'rmi-node-01',
    skill_id: 'sk-02',
    topic: 'Node.js Runtime & Event Loop',
    description: 'Non-blocking asynchronous I/O, event emitters, buffers, streams, and module systems (ESM vs CJS).',
    order_index: 1,
    estimated_time: '3 Hours',
    resource_type: 'Documentation',
    practice_requirement: 'Write an async file reader stream processing JSON log files with zero main-thread block.',
    assessment_ready: false
  },
  {
    id: 'rmi-node-02',
    skill_id: 'sk-02',
    topic: 'Express.js Server Architecture',
    description: 'Routing, middleware chains, error handling middleware, JSON request body parsing, and route controllers.',
    order_index: 2,
    estimated_time: '4 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Create a modular REST API route structure with input validation schemas.',
    assessment_ready: false
  },
  {
    id: 'rmi-node-03',
    skill_id: 'sk-02',
    topic: 'Authentication & JWT Security',
    description: 'Bcrypt password hashing, JSON Web Token generation/verification, token expiration, and secure cookie headers.',
    order_index: 3,
    estimated_time: '5 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Build an authentication middleware verifying Bearer tokens and decoding user identity claims.',
    assessment_ready: false
  },
  {
    id: 'rmi-node-04',
    skill_id: 'sk-02',
    topic: 'Database Integration with PostgreSQL',
    description: 'Connection pooling, parameterized queries preventing SQL injection, transaction rollback, and error handling.',
    order_index: 4,
    estimated_time: '6 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Connect Express API routes to PostgreSQL with connection pooling and typed response schemas.',
    assessment_ready: false
  },
  {
    id: 'rmi-node-05',
    skill_id: 'sk-02',
    topic: 'Node.js Backend Competency Assessment',
    description: 'Validation assessment verifying RESTful API architecture, security practices, and async programming.',
    order_index: 5,
    estimated_time: '1 Hour',
    resource_type: 'Code Practice',
    practice_requirement: 'Pass the timed backend assessment with minimum 75% score.',
    assessment_ready: true
  },

  // PostgreSQL & Database Design
  {
    id: 'rmi-sql-01',
    skill_id: 'sk-03',
    topic: 'Relational Database Design & Normalization',
    description: 'Entity-relationship diagrams, primary keys, foreign keys, 3NF normalization, and data integrity constraints.',
    order_index: 1,
    estimated_time: '3 Hours',
    resource_type: 'Documentation',
    practice_requirement: 'Design a normalized schema for multi-tenant organizations, profiles, and candidate skills.',
    assessment_ready: false
  },
  {
    id: 'rmi-sql-02',
    skill_id: 'sk-03',
    topic: 'Advanced SQL Queries & JOIN Operations',
    description: 'INNER/LEFT/RIGHT JOINs, GROUP BY aggregations, HAVING clauses, subqueries, and window functions.',
    order_index: 2,
    estimated_time: '5 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Write complex analytical queries calculating candidate skill readiness distributions by district.',
    assessment_ready: false
  },
  {
    id: 'rmi-sql-03',
    skill_id: 'sk-03',
    topic: 'Indexing & Query Performance Optimization',
    description: 'B-tree indexes, composite indexes, EXPLAIN ANALYZE execution plans, and query performance tuning.',
    order_index: 3,
    estimated_time: '4 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Optimize a slow query across 100k candidate records using targeted multi-column indexes.',
    assessment_ready: false
  },
  {
    id: 'rmi-sql-04',
    skill_id: 'sk-03',
    topic: 'Row Level Security (RLS) & Multi-Tenant Isolation',
    description: 'Defining granular tenant isolation rules in PostgreSQL using auth.uid() and role checks.',
    order_index: 4,
    estimated_time: '4 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Implement RLS policies ensuring candidates can only modify their own profile records.',
    assessment_ready: false
  },
  {
    id: 'rmi-sql-05',
    skill_id: 'sk-03',
    topic: 'PostgreSQL Database Competency Assessment',
    description: 'Practical assessment validating SQL mastery, index strategies, and multi-tenant security architecture.',
    order_index: 5,
    estimated_time: '1 Hour',
    resource_type: 'Code Practice',
    practice_requirement: 'Execute required SQL queries and pass the automated validation test.',
    assessment_ready: true
  },

  // Cloud Infrastructure (GCP/AWS) / Docker
  {
    id: 'rmi-cloud-01',
    skill_id: 'sk-08',
    topic: 'Containerization Concepts & Docker Architecture',
    description: 'Containers vs virtual machines, Docker daemon, image layers, registries, and container lifecycle.',
    order_index: 1,
    estimated_time: '2 Hours',
    resource_type: 'Documentation',
    practice_requirement: 'Run, inspect, stop, and prune local Docker containers from terminal CLI.',
    assessment_ready: false
  },
  {
    id: 'rmi-cloud-02',
    skill_id: 'sk-08',
    topic: 'Multi-Stage Dockerfiles & Image Optimization',
    description: 'Writing minimal production Dockerfiles using multi-stage builds, Alpine bases, and non-root users.',
    order_index: 2,
    estimated_time: '4 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Build a lightweight multi-stage Docker image for a Vite + Node.js full-stack app under 120MB.',
    assessment_ready: false
  },
  {
    id: 'rmi-cloud-03',
    skill_id: 'sk-08',
    topic: 'Cloud Run & Container Deployment',
    description: 'Building container images, tagging with artifact registry, and deploying to managed serverless Cloud Run.',
    order_index: 3,
    estimated_time: '5 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Deploy containerized web service to Cloud Run with environment variables and health check probes.',
    assessment_ready: false
  },
  {
    id: 'rmi-cloud-04',
    skill_id: 'sk-08',
    topic: 'Cloud Infrastructure Validation Assessment',
    description: 'Competency check verifying Dockerfile authoring, multi-stage builds, and deployment readiness.',
    order_index: 4,
    estimated_time: '1 Hour',
    resource_type: 'Code Practice',
    practice_requirement: 'Pass the 8-question containerization and deployment check.',
    assessment_ready: true
  },

  // Docker & Kubernetes
  {
    id: 'rmi-k8s-01',
    skill_id: 'sk-13',
    topic: 'Kubernetes Core Architecture & Pods',
    description: 'Control plane, worker nodes, kubelet, pods, replica sets, and declarative YAML manifests.',
    order_index: 1,
    estimated_time: '4 Hours',
    resource_type: 'Documentation',
    practice_requirement: 'Write a deployment YAML manifest with 3 replicas and liveness probe configuration.',
    assessment_ready: false
  },
  {
    id: 'rmi-k8s-02',
    skill_id: 'sk-13',
    topic: 'Services, Ingress & Networking',
    description: 'ClusterIP, NodePort, LoadBalancer, Ingress controllers, TLS certificates, and DNS service discovery.',
    order_index: 2,
    estimated_time: '5 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Set up an Ingress rule routing path-based traffic to frontend and backend service ports.',
    assessment_ready: false
  },

  // Python & Data Analytics
  {
    id: 'rmi-py-01',
    skill_id: 'sk-04',
    topic: 'Python Fundamentals & Data Structures',
    description: 'Lists, dictionaries, sets, list comprehensions, lambda functions, and file I/O operations.',
    order_index: 1,
    estimated_time: '3 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Write a data transformer script cleaning raw CSV candidate records.',
    assessment_ready: false
  },
  {
    id: 'rmi-py-02',
    skill_id: 'sk-04',
    topic: 'Pandas & NumPy Data Wrangling',
    description: 'DataFrames, Series, filtering, grouping, pivot tables, handling missing values, and time-series.',
    order_index: 2,
    estimated_time: '5 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Aggregate district-level placement outcomes from raw survey tables.',
    assessment_ready: false
  },
  {
    id: 'rmi-py-03',
    skill_id: 'sk-04',
    topic: 'Exploratory Data Visualization',
    description: 'Matplotlib and Seaborn plotting, bar charts, heatmaps, distribution plots, and correlation matrices.',
    order_index: 3,
    estimated_time: '4 Hours',
    resource_type: 'Hands-on Project',
    practice_requirement: 'Build a visual analytical chart reporting skill demand vs candidate completion.',
    assessment_ready: false
  },

  // Tailwind CSS & Responsive UI
  {
    id: 'rmi-tw-01',
    skill_id: 'sk-09',
    topic: 'Utility-First Layouts with Tailwind CSS',
    description: 'Flexbox, CSS Grid, container sizing, responsive breakpoints (sm/md/lg/xl), and spacing math.',
    order_index: 1,
    estimated_time: '2 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Construct a responsive multi-card dashboard grid adapting from 1 to 4 columns.',
    assessment_ready: false
  },
  {
    id: 'rmi-tw-02',
    skill_id: 'sk-09',
    topic: 'Design Systems, Color Schemes & Accessibility',
    description: 'Semantic color tokens, focus rings, hover/active states, dark mode, and WCAG AA contrast.',
    order_index: 2,
    estimated_time: '3 Hours',
    resource_type: 'Interactive Lab',
    practice_requirement: 'Style an accessible modal component with keyboard focus traps and smooth animations.',
    assessment_ready: false
  }
];

export const SEED_CANDIDATE_ROADMAP_PROGRESS: CandidateRoadmapProgress[] = [
  { id: 'crp-01', candidate_id: 'cand-prof-001', roadmap_item_id: 'rmi-react-01', status: 'completed', completed_at: '2026-08-10T10:00:00Z' },
  { id: 'crp-02', candidate_id: 'cand-prof-001', roadmap_item_id: 'rmi-react-02', status: 'completed', completed_at: '2026-08-12T14:00:00Z' },
  { id: 'crp-03', candidate_id: 'cand-prof-001', roadmap_item_id: 'rmi-node-01', status: 'completed', completed_at: '2026-08-15T11:30:00Z' }
];

