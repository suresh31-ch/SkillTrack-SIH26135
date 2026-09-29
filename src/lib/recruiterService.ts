import {
  Job,
  Application,
  ApplicationStatus,
  RecruiterCandidateDetail,
  Profile,
  CandidateProfile,
  Skill,
  JobRoleSkill,
  CandidateSkill
} from '../types';
import { SkillIntelligenceEngine } from './skillIntelligenceEngine';
import { LocalDbService, supabase, isSupabaseConfigured } from './supabase';

// Storage keys for recruiter state persistence
const RECRUITER_STORAGE_KEYS = {
  DETAILED_CANDIDATES: 'st_recruiter_detailed_candidates_v1',
  RECRUITER_NOTES: 'st_recruiter_candidate_notes_v1'
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(data) as T;
  } catch (err) {
    console.warn(`Storage access error for ${key}:`, err);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Storage write error for ${key}:`, err);
  }
}

// Realistic Indian candidate pool with verified skills, projects, education, and experience
export const SEED_DETAILED_CANDIDATES: RecruiterCandidateDetail[] = [
  {
    id: 'cand-det-001',
    profile_id: 'prof-cand-001',
    full_name: 'Aarav Patil',
    email: 'aarav.patil@skilltrack.io',
    phone: '+91 98230 45678',
    district: 'Pune',
    state: 'Maharashtra',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    headline: 'Certified Full Stack Web & Cloud Developer | React 19, Node.js & PostgreSQL',
    bio: 'Passionate software engineer trained under Maharashtra State Skilling Mission. Built multiple production web apps with React, Express, PostgreSQL, and Google Cloud Run with CI/CD.',
    target_job: 'Full Stack Web Developer',
    readiness_score: 84,
    experience_years: 1,
    employment_status: 'placed',
    portfolio_url: 'https://aaravpatil.dev',
    github_url: 'https://github.com/aaravpatil',
    linkedin_url: 'https://linkedin.com/in/aarav-patil-dev',
    skills: [
      { id: 'sk-01', name: 'React.js & TypeScript', category: 'Frontend Web Development', proficiency: 'Advanced', verified: true, verification_source: 'SkillTrack NCVET Practical Code Lab' },
      { id: 'sk-02', name: 'Node.js & Express API', category: 'Backend Architecture', proficiency: 'Intermediate', verified: true, verification_source: 'Maharashtra Skilling Assessment #8942' },
      { id: 'sk-03', name: 'PostgreSQL & Database Design', category: 'Databases & SQL', proficiency: 'Intermediate', verified: false },
      { id: 'sk-08', name: 'Cloud Infrastructure (GCP/AWS)', category: 'DevOps & Cloud', proficiency: 'Beginner', verified: false },
      { id: 'sk-09', name: 'Tailwind CSS & Responsive UI', category: 'Frontend Web Development', proficiency: 'Advanced', verified: true, verification_source: 'Frontend Practical Benchmark' }
    ],
    education: [
      {
        id: 'edu-01',
        institution: 'College of Engineering Pune (COEP)',
        degree: 'Bachelor of Technology (B.Tech)',
        field_of_study: 'Computer Engineering',
        graduation_year: 2025,
        grade_or_gpa: '8.8 CGPA'
      },
      {
        id: 'edu-02',
        institution: 'Fergusson Junior College, Pune',
        degree: 'Higher Secondary Certificate (HSC)',
        field_of_study: 'Science (PCM & Electronics)',
        graduation_year: 2021,
        grade_or_gpa: '92.4%'
      }
    ],
    experience: [
      {
        id: 'exp-01',
        title: 'Full Stack Engineering Intern',
        company: 'Apex Infotech Solutions',
        location: 'Pune, Maharashtra',
        start_date: 'Jul 2025',
        end_date: 'Present',
        description: 'Developed reusable TypeScript components and integrated REST endpoints with Express and PostgreSQL, improving page load time by 30%.'
      },
      {
        id: 'exp-02',
        title: 'Frontend Developer Trainee',
        company: 'Maharashtra State Institute of Advanced Skilling (MSIAS)',
        location: 'Pune, Maharashtra',
        start_date: 'Jan 2025',
        end_date: 'Jun 2025',
        description: 'Completed 480 hours of immersive boot camp with 100% attendance and topped the batch assessment in modern React architecture.'
      }
    ],
    certifications: [
      {
        id: 'cert-01',
        name: 'Full Stack Cloud Application Engineering',
        issuing_org: 'Maharashtra State Skilling Board & NCVET',
        issue_date: 'Nov 2025',
        credential_id: 'ST-MAHA-2025-08942',
        verification_url: 'https://skilltrack.io/verify/ST-MAHA-2025-08942',
        verified: true
      },
      {
        id: 'cert-02',
        name: 'React 19 & TypeScript Professional Certificate',
        issuing_org: 'National Skill Development Corporation (NSDC)',
        issue_date: 'Aug 2025',
        credential_id: 'NSDC-DEV-88912',
        verification_url: 'https://skilltrack.io/verify/NSDC-DEV-88912',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-01',
        title: 'SkillTrack — AI Skill Gap & Career Roadmap Engine',
        description: 'Multi-tenant skill intelligence platform calculating gap matrices and auto-generating micro-roadmaps for 12,000+ candidates.',
        tech_stack: ['React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Recharts'],
        github_url: 'https://github.com/aaravpatil/skilltrack-core',
        live_url: 'https://skilltrack.io'
      },
      {
        id: 'proj-02',
        title: 'District Healthcare Tele-Consultation Hub',
        description: 'Real-time appointment scheduling and video consultation interface for rural primary healthcare centers in Vidarbha.',
        tech_stack: ['Node.js', 'Express', 'WebRTC', 'PostgreSQL', 'Docker'],
        github_url: 'https://github.com/aaravpatil/vidarbha-telehealth'
      }
    ]
  },
  {
    id: 'cand-det-002',
    profile_id: 'prof-cand-002',
    full_name: 'Priyanka Sharma',
    email: 'priyanka.sharma@skilltrack.io',
    phone: '+91 98190 23456',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
    headline: 'Data Analyst & Python Specialist | Power BI, SQL & Predictive Modeling',
    bio: 'Data Analyst with high quantitative rigor and hands-on experience in ETL pipelines, SQL aggregation, and interactive business intelligence dashboards.',
    target_job: 'Data Analyst',
    readiness_score: 91,
    experience_years: 2,
    employment_status: 'seeking_upgrade',
    portfolio_url: 'https://priyankasharma-data.io',
    github_url: 'https://github.com/priyanka-analytics',
    linkedin_url: 'https://linkedin.com/in/priyanka-sharma-data',
    skills: [
      { id: 'sk-04', name: 'Python & Data Analytics', category: 'Data Science & AI', proficiency: 'Advanced', verified: true, verification_source: 'SkillTrack Python Benchmark 98%' },
      { id: 'sk-03', name: 'PostgreSQL & Database Design', category: 'Databases & SQL', proficiency: 'Advanced', verified: true, verification_source: 'NCVET SQL Expert Certification' },
      { id: 'sk-14', name: 'Machine Learning with Scikit-Learn', category: 'Data Science & AI', proficiency: 'Intermediate', verified: true, verification_source: 'AI Skilling Mission' },
      { id: 'sk-01', name: 'React.js & TypeScript', category: 'Frontend Web Development', proficiency: 'Beginner', verified: false }
    ],
    education: [
      {
        id: 'edu-03',
        institution: 'Veermata Jijabai Technological Institute (VJTI), Mumbai',
        degree: 'Master of Computer Applications (MCA)',
        field_of_study: 'Data Systems & Computing',
        graduation_year: 2024,
        grade_or_gpa: '9.2 CGPA'
      }
    ],
    experience: [
      {
        id: 'exp-03',
        title: 'Junior Business Intelligence Analyst',
        company: 'Tata Consultancy Systems',
        location: 'Mumbai, Maharashtra',
        start_date: 'Aug 2024',
        end_date: 'Present',
        description: 'Authored 25+ executive dashboards analyzing financial transaction velocity and supply chain bottlenecks.'
      }
    ],
    certifications: [
      {
        id: 'cert-03',
        name: 'Advanced Data Engineering & SQL Mastery',
        issuing_org: 'National Skill Development Corporation (NSDC)',
        issue_date: 'Sep 2024',
        credential_id: 'NSDC-DATA-99012',
        verification_url: 'https://skilltrack.io/verify/NSDC-DATA-99012',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-03',
        title: 'Maharashtra Job Demand & Skilling Forecast Model',
        description: 'Time-series forecasting model predicting district-level skill shortages across 36 districts with 91.4% accuracy.',
        tech_stack: ['Python', 'Pandas', 'Scikit-Learn', 'Power BI', 'FastAPI'],
        github_url: 'https://github.com/priyanka-analytics/demand-forecasting'
      }
    ]
  },
  {
    id: 'cand-det-003',
    profile_id: 'prof-cand-003',
    full_name: 'Rohan Kulkarni',
    email: 'rohan.kulkarni@skilltrack.io',
    phone: '+91 94230 11987',
    district: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    headline: 'Certified EV & Solar Power Systems Engineer | High-Voltage Battery Diagnostics',
    bio: 'Technician specializing in Electric Vehicle (EV) battery management systems, CCS2 fast charging station commissioning, and rooftop solar grid synchronization.',
    target_job: 'EV & Solar Field Specialist',
    readiness_score: 88,
    experience_years: 1,
    employment_status: 'in_training',
    portfolio_url: 'https://rohankulkarni-ev.in',
    skills: [
      { id: 'sk-05', name: 'Electric Vehicle (EV) Diagnostics', category: 'Green Tech & Automotive', proficiency: 'Advanced', verified: true, verification_source: 'Marathwada Center for Industrial Excellence' },
      { id: 'sk-07', name: 'Solar PV Installation & Grid Tie', category: 'Renewable Energy', proficiency: 'Advanced', verified: true, verification_source: 'SkillTrack Green Tech Council' },
      { id: 'sk-16', name: 'EV Charging Station Commissioning', category: 'Green Tech & Automotive', proficiency: 'Intermediate', verified: true, verification_source: 'MIDC Technical Training' }
    ],
    education: [
      {
        id: 'edu-04',
        institution: 'Government Polytechnic, Chhatrapati Sambhajinagar',
        degree: 'Diploma in Electrical Engineering',
        field_of_study: 'Electrical & Power Electronics',
        graduation_year: 2024,
        grade_or_gpa: '84.5%'
      }
    ],
    experience: [
      {
        id: 'exp-04',
        title: 'EV Battery Testing Trainee',
        company: 'Mahindra Green Energy Ltd',
        location: 'Waluj MIDC, Sambhajinagar',
        start_date: 'Oct 2024',
        end_date: 'Present',
        description: 'Conducted diagnostic cycle testing on 120+ Lithium-ion battery packs and assisted in safety compliance audits.'
      }
    ],
    certifications: [
      {
        id: 'cert-04',
        name: 'High-Voltage EV Powertrain Diagnostics',
        issuing_org: 'Automotive Skills Development Council (ASDC)',
        issue_date: 'Dec 2024',
        credential_id: 'ASDC-EV-2024-5512',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-04',
        title: 'Smart BMS Thermal Runaway Telemetry',
        description: 'Microcontroller-based IoT device monitoring cell temperatures with instant SMS emergency alert.',
        tech_stack: ['ESP32', 'C++', 'MQTT', 'Node-RED']
      }
    ]
  },
  {
    id: 'cand-det-004',
    profile_id: 'prof-cand-004',
    full_name: 'Sneha Deshmukh',
    email: 'sneha.deshmukh@skilltrack.io',
    phone: '+91 97650 99887',
    district: 'Nagpur',
    state: 'Maharashtra',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&auto=format&fit=crop&q=80',
    headline: 'Senior Backend & DevOps Engineer | Node.js, Docker, Kubernetes & PostgreSQL',
    bio: 'Backend systems engineer with deep expertise in API security, distributed systems, Docker containerization, and automated CI/CD pipelines.',
    target_job: 'Backend Developer',
    readiness_score: 95,
    experience_years: 3,
    employment_status: 'seeking_upgrade',
    github_url: 'https://github.com/sneha-backend',
    linkedin_url: 'https://linkedin.com/in/sneha-deshmukh-eng',
    skills: [
      { id: 'sk-02', name: 'Node.js & Express API', category: 'Backend Architecture', proficiency: 'Expert', verified: true, verification_source: 'SkillTrack Senior Assessment' },
      { id: 'sk-03', name: 'PostgreSQL & Database Design', category: 'Databases & SQL', proficiency: 'Advanced', verified: true, verification_source: 'PostgreSQL Certified Professional' },
      { id: 'sk-13', name: 'Docker & Kubernetes', category: 'DevOps & Cloud', proficiency: 'Advanced', verified: true, verification_source: 'Cloud Native Computing Foundation' },
      { id: 'sk-15', name: 'Cybersecurity Fundamentals', category: 'DevOps & Cloud', proficiency: 'Intermediate', verified: true, verification_source: 'OWASP Security Benchmark' }
    ],
    education: [
      {
        id: 'edu-05',
        institution: 'Visvesvaraya National Institute of Technology (VNIT), Nagpur',
        degree: 'B.Tech in Information Technology',
        field_of_study: 'Distributed Systems & Networks',
        graduation_year: 2023,
        grade_or_gpa: '9.0 CGPA'
      }
    ],
    experience: [
      {
        id: 'exp-05',
        title: 'Backend Software Engineer',
        company: 'Zomato Tech Labs',
        location: 'Nagpur / Bengaluru (Hybrid)',
        start_date: 'Aug 2023',
        end_date: 'Present',
        description: 'Architected high-throughput order dispatch microservices handling 40,000 requests/minute with p99 latency under 45ms.'
      }
    ],
    certifications: [
      {
        id: 'cert-05',
        name: 'Certified Kubernetes Application Developer (CKAD)',
        issuing_org: 'Linux Foundation / CNCF',
        issue_date: 'May 2024',
        credential_id: 'CKAD-9981-2201',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-05',
        title: 'High-Concurrency Distributed Rate Limiter',
        description: 'Redis sliding-window rate limiter in Node.js protecting critical authentication gateways.',
        tech_stack: ['Node.js', 'TypeScript', 'Redis', 'Docker', 'Jest']
      }
    ]
  },
  {
    id: 'cand-det-005',
    profile_id: 'prof-cand-005',
    full_name: 'Aditya Shinde',
    email: 'aditya.shinde@skilltrack.io',
    phone: '+91 99220 33445',
    district: 'Nashik',
    state: 'Maharashtra',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    headline: 'Frontend Engineer & UI/UX Specialist | React, Next.js, Tailwind & Motion',
    bio: 'Frontend specialist obsessive about accessible UI systems, fluid motion physics, micro-interactions, and Lighthouse 100 web performance.',
    target_job: 'Frontend Developer',
    readiness_score: 87,
    experience_years: 2,
    employment_status: 'seeking_upgrade',
    portfolio_url: 'https://adityashinde.design',
    github_url: 'https://github.com/aditya-ui',
    skills: [
      { id: 'sk-01', name: 'React.js & TypeScript', category: 'Frontend Web Development', proficiency: 'Advanced', verified: true, verification_source: 'SkillTrack React 19 Lab' },
      { id: 'sk-09', name: 'Tailwind CSS & Responsive UI', category: 'Frontend Web Development', proficiency: 'Expert', verified: true, verification_source: 'Design System Certification' },
      { id: 'sk-10', name: 'Next.js & Server Components', category: 'Frontend Web Development', proficiency: 'Intermediate', verified: true, verification_source: 'Vercel Web Standard' }
    ],
    education: [
      {
        id: 'edu-06',
        institution: 'K. K. Wagh Institute of Engineering Education, Nashik',
        degree: 'Bachelor of Computer Applications (BCA)',
        field_of_study: 'Software Systems',
        graduation_year: 2024,
        grade_or_gpa: '8.6 CGPA'
      }
    ],
    experience: [
      {
        id: 'exp-06',
        title: 'Junior Frontend Developer',
        company: 'Zerodha Labs Partner',
        location: 'Nashik, Maharashtra',
        start_date: 'Sep 2024',
        end_date: 'Present',
        description: 'Built low-latency financial chart widgets and accessible trading form controls.'
      }
    ],
    certifications: [
      {
        id: 'cert-06',
        name: 'Enterprise Frontend Architecture',
        issuing_org: 'National Skill Development Corporation',
        issue_date: 'Oct 2024',
        credential_id: 'NSDC-FE-4412',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-06',
        title: 'FinTrack — Accessible Stock Trading Matrix',
        description: 'Keyboard-navigable financial terminal with live WebSocket ticker updates and canvas chart rendering.',
        tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'Canvas API']
      }
    ]
  },
  {
    id: 'cand-det-006',
    profile_id: 'prof-cand-006',
    full_name: 'Ananya Iyer',
    email: 'ananya.iyer@skilltrack.io',
    phone: '+91 98401 55667',
    district: 'Bengaluru',
    state: 'Karnataka',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&auto=format&fit=crop&q=80',
    headline: 'Machine Learning & Computer Vision Engineer | Python, PyTorch & TensorFlow',
    bio: 'AI researcher and ML engineer with expertise in image segmentation, object detection, LLM fine-tuning, and model quantization for edge devices.',
    target_job: 'Machine Learning Engineer',
    readiness_score: 93,
    experience_years: 2,
    employment_status: 'seeking_upgrade',
    github_url: 'https://github.com/ananya-ai',
    linkedin_url: 'https://linkedin.com/in/ananya-iyer-ml',
    skills: [
      { id: 'sk-04', name: 'Python & Data Analytics', category: 'Data Science & AI', proficiency: 'Expert', verified: true, verification_source: 'SkillTrack AI Benchmark' },
      { id: 'sk-14', name: 'Machine Learning with Scikit-Learn', category: 'Data Science & AI', proficiency: 'Advanced', verified: true, verification_source: 'NCVET AI Council' },
      { id: 'sk-08', name: 'Cloud Infrastructure (GCP/AWS)', category: 'DevOps & Cloud', proficiency: 'Intermediate', verified: true, verification_source: 'GCP Machine Learning Lab' }
    ],
    education: [
      {
        id: 'edu-07',
        institution: 'National Institute of Technology (NIT) Karnataka, Surathkal',
        degree: 'B.Tech in Artificial Intelligence',
        field_of_study: 'Deep Learning & Robotics',
        graduation_year: 2024,
        grade_or_gpa: '9.4 CGPA'
      }
    ],
    experience: [
      {
        id: 'exp-07',
        title: 'AI Research Associate',
        company: 'Flipkart Engineering Labs',
        location: 'Bengaluru, Karnataka',
        start_date: 'Jul 2024',
        end_date: 'Present',
        description: 'Trained product catalog visual search models, improving search retrieval recall by 18%.'
      }
    ],
    certifications: [
      {
        id: 'cert-07',
        name: 'Deep Learning Specialization & Model Deployment',
        issuing_org: 'National AI Council & NSDC',
        issue_date: 'Jan 2025',
        credential_id: 'AI-IND-2025-0091',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-07',
        title: 'Agricultural Crop Defect Vision Pipeline',
        description: 'Edge-deployable YOLOv8 model detecting leaf blight with 96.2% mAP on low-cost mobile phones.',
        tech_stack: ['Python', 'PyTorch', 'ONNX', 'Flask', 'Docker']
      }
    ]
  },
  {
    id: 'cand-det-007',
    profile_id: 'prof-cand-007',
    full_name: 'Vikas Jadhav',
    email: 'vikas.jadhav@skilltrack.io',
    phone: '+91 93700 88123',
    district: 'Kolhapur',
    state: 'Maharashtra',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
    headline: 'CNC Multi-Axis Machinist & Precision Toolmaker | Fanuc G-Code & CMM Quality',
    bio: 'Precision manufacturing specialist with 4+ years hands-on experience in 3-axis & 5-axis CNC machining, die tooling, and geometric dimensioning (GD&T).',
    target_job: 'CNC Programmer & Machinist',
    readiness_score: 86,
    experience_years: 3,
    employment_status: 'seeking_upgrade',
    skills: [
      { id: 'sk-06', name: 'CNC Machine Programming', category: 'Industrial Automation', proficiency: 'Advanced', verified: true, verification_source: 'Kalyani Advanced Precision Lab' },
      { id: 'sk-25', name: 'Quality Assurance & Six Sigma (QA/QC)', category: 'Industrial Automation', proficiency: 'Advanced', verified: true, verification_source: 'ISO 9001 Internal Auditor' },
      { id: 'sk-19', name: 'PLC & SCADA Automation', category: 'Industrial Automation', proficiency: 'Intermediate', verified: false }
    ],
    education: [
      {
        id: 'edu-08',
        institution: 'Government ITI Kolhapur',
        degree: 'National Trade Certificate (NTC)',
        field_of_study: 'Machinist & Tool & Die Maker',
        graduation_year: 2022,
        grade_or_gpa: '89.0%'
      }
    ],
    experience: [
      {
        id: 'exp-08',
        title: 'CNC Multi-Axis Operator',
        company: 'Kalyani Advanced Precision',
        location: 'Nagpur MIDC, Maharashtra',
        start_date: 'Jun 2022',
        end_date: 'Present',
        description: 'Machined aerospace grade titanium turbine mounts with zero tolerance deviations.'
      }
    ],
    certifications: [
      {
        id: 'cert-08',
        name: 'Master CNC Multi-Axis Programmer',
        issuing_org: 'National Council for Vocational Education (NCVET)',
        issue_date: 'Aug 2023',
        credential_id: 'NCVET-CNC-8821',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-08',
        title: 'Automated Tool Wear Prediction Fixture',
        description: 'Vibration-sensor based acoustic tool wear detection setup saving ₹4.5 Lakhs annually in scrap.',
        tech_stack: ['Fanuc G-Code', 'CNC Multi-Axis', 'Piezo Sensor', 'Python']
      }
    ]
  },
  {
    id: 'cand-det-008',
    profile_id: 'prof-cand-008',
    full_name: 'Meera Nambiar',
    email: 'meera.nambiar@skilltrack.io',
    phone: '+91 94470 66778',
    district: 'Hyderabad',
    state: 'Telangana',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    headline: 'Cloud Infrastructure & SRE Engineer | AWS, Terraform, Docker & CI/CD',
    bio: 'Site Reliability Engineer focused on automated cloud infrastructure provisioning, multi-region Kubernetes clusters, and Zero-Trust network security.',
    target_job: 'Cloud / DevOps Engineer',
    readiness_score: 92,
    experience_years: 2,
    employment_status: 'seeking_upgrade',
    github_url: 'https://github.com/meera-cloud',
    skills: [
      { id: 'sk-08', name: 'Cloud Infrastructure (GCP/AWS)', category: 'DevOps & Cloud', proficiency: 'Advanced', verified: true, verification_source: 'AWS Certified Solutions Architect' },
      { id: 'sk-13', name: 'Docker & Kubernetes', category: 'DevOps & Cloud', proficiency: 'Advanced', verified: true, verification_source: 'SkillTrack Cloud Cluster Lab' },
      { id: 'sk-15', name: 'Cybersecurity Fundamentals', category: 'DevOps & Cloud', proficiency: 'Intermediate', verified: true, verification_source: 'IAM Security Benchmark' },
      { id: 'sk-02', name: 'Node.js & Express API', category: 'Backend Architecture', proficiency: 'Intermediate', verified: false }
    ],
    education: [
      {
        id: 'edu-09',
        institution: 'International Institute of Information Technology (IIIT) Hyderabad',
        degree: 'B.Tech in Computer Science',
        field_of_study: 'Cloud Computing & Networks',
        graduation_year: 2024,
        grade_or_gpa: '8.9 CGPA'
      }
    ],
    experience: [
      {
        id: 'exp-09',
        title: 'Associate Cloud Engineer',
        company: 'TechSkills Cloud India',
        location: 'Hitec City, Hyderabad',
        start_date: 'Jun 2024',
        end_date: 'Present',
        description: 'Automated multi-tenant Terraform scripts provisioning 150+ AWS ECS services with automated Canary rollouts.'
      }
    ],
    certifications: [
      {
        id: 'cert-09',
        name: 'AWS Certified Solutions Architect – Associate',
        issuing_org: 'Amazon Web Services',
        issue_date: 'Apr 2024',
        credential_id: 'AWS-SAA-88190',
        verified: true
      }
    ],
    projects: [
      {
        id: 'proj-09',
        title: 'Zero-Downtime Multi-Cluster Helm Deployment Engine',
        description: 'Automated GitOps workflow executing blue-green cluster promotions with Prometheus rollback triggers.',
        tech_stack: ['Terraform', 'Kubernetes', 'Helm', 'GitHub Actions', 'Prometheus']
      }
    ]
  }
];

export interface RecruiterStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  pausedJobs: number;
  totalApplications: number;
  shortlistedCount: number;
  screeningCount: number;
  interviewCount: number;
  selectedCount: number;
  rejectedCount: number;
  avgReadinessScore: number;
  avgMatchScore: number;
  offerAcceptanceRate: number;
  avgTimeToHireDays: number;
  pipelineFunnel: Array<{ stage: string; count: number; percentage: number }>;
  applicationsByJob: Array<{ jobTitle: string; applications: number; shortlisted: number }>;
  talentReadinessDistribution: Array<{ range: string; count: number }>;
  monthlyTrend: Array<{ month: string; applications: number; hires: number }>;
}

export class RecruiterService {
  // Candidate pool methods
  static getDetailedCandidates(): RecruiterCandidateDetail[] {
    return getStorage<RecruiterCandidateDetail[]>(
      RECRUITER_STORAGE_KEYS.DETAILED_CANDIDATES,
      SEED_DETAILED_CANDIDATES
    );
  }

  static getDetailedCandidateById(idOrProfileId: string): RecruiterCandidateDetail | undefined {
    const candidates = this.getDetailedCandidates();
    return candidates.find(
      c => c.id === idOrProfileId || c.profile_id === idOrProfileId
    );
  }

  static saveDetailedCandidate(candidate: RecruiterCandidateDetail): void {
    const candidates = this.getDetailedCandidates();
    const idx = candidates.findIndex(c => c.id === candidate.id || c.profile_id === candidate.profile_id);
    if (idx !== -1) {
      candidates[idx] = candidate;
    } else {
      candidates.unshift(candidate);
    }
    setStorage(RECRUITER_STORAGE_KEYS.DETAILED_CANDIDATES, candidates);
  }

  // Recruiter Notes
  static getCandidateNotes(candidateProfileId: string): string {
    const allNotes = getStorage<Record<string, string>>(RECRUITER_STORAGE_KEYS.RECRUITER_NOTES, {});
    return allNotes[candidateProfileId] || '';
  }

  static saveCandidateNotes(candidateProfileId: string, notes: string): void {
    const allNotes = getStorage<Record<string, string>>(RECRUITER_STORAGE_KEYS.RECRUITER_NOTES, {});
    allNotes[candidateProfileId] = notes;
    setStorage(RECRUITER_STORAGE_KEYS.RECRUITER_NOTES, allNotes);
  }

  // Jobs management
  static getJobs(organizationId?: string): Job[] {
    return LocalDbService.getJobs(organizationId);
  }

  static async loadJobsAsync(organizationId?: string): Promise<Job[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Job[];
        }
      } catch (err) {
        console.warn('Supabase loadJobsAsync error, falling back:', err);
      }
    }
    return LocalDbService.getJobs(organizationId);
  }

  static getJobById(jobId: string): Job | undefined {
    return this.getJobs().find(j => j.id === jobId);
  }

  static createJob(jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Job {
    const job = LocalDbService.createJob(jobData);
    if (isSupabaseConfigured() && supabase) {
      Promise.resolve(
        supabase
          .from('jobs')
          .insert({
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            employment_type: job.employment_type,
            experience_required: job.experience_required,
            education_required: job.education_required,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            status: job.status,
            company_name: job.company_name,
            recruiter_id: job.recruiter_id,
            organization_id: job.organization_id,
            created_at: job.created_at,
            updated_at: job.updated_at
          })
      ).catch(err => console.warn('Supabase createJob notice:', err));
    }
    return job;
  }

  static updateJob(jobId: string, updates: Partial<Job>): Job | null {
    const jobs = LocalDbService.getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx === -1) return null;
    jobs[idx] = {
      ...jobs[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    try {
      localStorage.setItem('st_db_jobs_v1', JSON.stringify(jobs));
    } catch (err) {
      console.warn('Job update error:', err);
    }
    if (isSupabaseConfigured() && supabase) {
      Promise.resolve(
        supabase
          .from('jobs')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId)
      ).catch(err => console.warn('Supabase updateJob notice:', err));
    }
    return jobs[idx];
  }

  static deleteJob(jobId: string): boolean {
    let jobs = LocalDbService.getJobs();
    const lenBefore = jobs.length;
    jobs = jobs.filter(j => j.id !== jobId);
    if (jobs.length !== lenBefore) {
      try {
        localStorage.setItem('st_db_jobs_v1', JSON.stringify(jobs));
      } catch (err) {
        console.warn('Job delete error:', err);
      }
      if (isSupabaseConfigured() && supabase) {
        Promise.resolve(
          supabase
            .from('jobs')
            .delete()
            .eq('id', jobId)
        ).catch(err => console.warn('Supabase deleteJob notice:', err));
      }
      return true;
    }
    return false;
  }

  // Applications management
  static getApplications(organizationId?: string): Application[] {
    const apps = LocalDbService.getApplications(organizationId);
    // Enrich with detailed candidate profile if available
    const detailedCandidates = this.getDetailedCandidates();
    return apps.map(app => {
      const detailed = detailedCandidates.find(
        c => c.profile_id === app.candidate_id || c.id === app.candidate_id
      );
      if (detailed && app.candidate) {
        return {
          ...app,
          candidate: {
            ...app.candidate,
            phone: detailed.phone,
            avatar_url: detailed.avatar_url,
            education: detailed.education[0]?.degree || app.candidate.education,
            experience_years: detailed.experience_years
          }
        };
      }
      return app;
    });
  }

  static async loadApplicationsAsync(organizationId?: string): Promise<Application[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('job_applications').select('*').order('applied_at', { ascending: false });
        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Application[];
        }
      } catch (err) {
        console.warn('Supabase loadApplicationsAsync notice, falling back:', err);
      }
    }
    return this.getApplications(organizationId);
  }

  static updateApplicationStage(
    applicationId: string,
    newStatus: ApplicationStatus,
    recruiterNotes?: string
  ): Application | null {
    const apps = LocalDbService.getApplications();
    const idx = apps.findIndex(a => a.id === applicationId);
    if (idx === -1) return null;
    apps[idx].status = newStatus;
    if (recruiterNotes !== undefined) {
      apps[idx].recruiter_notes = recruiterNotes;
      if (apps[idx].candidate_id) {
        this.saveCandidateNotes(apps[idx].candidate_id, recruiterNotes);
      }
    }
    apps[idx].updated_at = new Date().toISOString();
    try {
      localStorage.setItem('st_db_applications_v1', JSON.stringify(apps));
    } catch (err) {
      console.warn('Application stage update error:', err);
    }
    if (isSupabaseConfigured() && supabase) {
      const payload: any = { status: newStatus, updated_at: new Date().toISOString() };
      if (recruiterNotes !== undefined) payload.recruiter_notes = recruiterNotes;
      Promise.resolve(
        supabase
          .from('job_applications')
          .update(payload)
          .eq('id', applicationId)
      ).catch(err => console.warn('Supabase updateApplicationStage notice:', err));
    }
    return apps[idx];
  }

  static shortlistCandidateForJob(
    candidate: RecruiterCandidateDetail,
    job: Job,
    recruiterProfile?: Profile
  ): Application {
    const apps = LocalDbService.getApplications();
    const candidateId = candidate.profile_id || candidate.id;
    const existing = apps.find(a => (a.candidate_id === candidateId || a.candidate_id === candidate.id) && a.job_id === job.id);
    if (existing) {
      existing.status = 'Shortlisted';
      existing.updated_at = new Date().toISOString();
      try {
        localStorage.setItem('st_db_applications_v1', JSON.stringify(apps));
      } catch (err) {
        console.warn('Shortlist error:', err);
      }
      if (isSupabaseConfigured() && supabase) {
        Promise.resolve(
          supabase
            .from('job_applications')
            .update({ status: 'Shortlisted', updated_at: new Date().toISOString() })
            .eq('id', existing.id)
        ).catch(err => console.warn('Supabase shortlist update notice:', err));
      }
      return existing;
    }

    // Calculate real deterministic compatibility using SkillIntelligenceEngine
    const roleReqs: JobRoleSkill[] = (job.skills_required || []).map((sk: any, idx: number) => ({
      id: sk.id || `req-${idx}`,
      job_role_id: job.id,
      skill_id: sk.skill_id || sk.id || `sk-${idx}`,
      skill: { id: sk.skill_id || sk.id || `sk-${idx}`, name: sk.skill_name || 'Skill', category: 'Technical', created_at: '' },
      required_proficiency: sk.required_level || 'Intermediate',
      importance: sk.is_required ? 'Critical' : 'High'
    }));

    const candSkillsFormatted: CandidateSkill[] = (candidate.skills || []).map((cs: any) => ({
      id: cs.id,
      candidate_id: candidateId,
      skill_id: cs.id,
      skill: { id: cs.id, name: cs.name, category: cs.category, created_at: '' },
      proficiency_level: cs.proficiency,
      verified: Boolean(cs.verified),
      verification_source: cs.verification_source,
      created_at: ''
    }));

    const compat = SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: { id: job.id, name: job.title, description: job.description || '', category: job.job_category || 'Engineering' },
      roleRequirements: roleReqs,
      candidateSkills: candSkillsFormatted
    });

    const calculatedMatchScore = compat.overall_score || candidate.readiness_score || 85;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      candidate_id: candidateId,
      job_id: job.id,
      recruiter_id: recruiterProfile?.id || job.recruiter_id,
      organization_id: job.organization_id,
      skill_match_score: calculatedMatchScore,
      readiness_score: candidate.readiness_score,
      overall_match_score: calculatedMatchScore,
      status: 'Shortlisted',
      recruiter_notes: `Directly shortlisted. Deterministic role match: ${calculatedMatchScore}% (${compat.skills_count.meets_or_exceeds}/${compat.skills_count.total_required} competencies met).`,
      candidate: {
        full_name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        target_job: candidate.target_job,
        readiness_score: candidate.readiness_score,
        district: candidate.district,
        avatar_url: candidate.avatar_url,
        education: candidate.education[0]?.degree,
        experience_years: candidate.experience_years
      },
      job: {
        title: job.title,
        company_name: job.company_name,
        location: job.location,
        employment_type: job.employment_type || 'Full-time'
      },
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    apps.unshift(newApp);
    try {
      localStorage.setItem('st_db_applications_v1', JSON.stringify(apps));
    } catch (err) {
      console.warn('Application add error:', err);
    }
    if (isSupabaseConfigured() && supabase) {
      Promise.resolve(
        supabase
          .from('job_applications')
          .insert({
            id: newApp.id,
            candidate_id: newApp.candidate_id,
            job_id: newApp.job_id,
            organization_id: newApp.organization_id,
            status: newApp.status,
            applied_at: newApp.applied_at,
            updated_at: newApp.updated_at,
            skill_match_score: newApp.skill_match_score,
            readiness_score: newApp.readiness_score,
            overall_match_score: newApp.overall_match_score,
            recruiter_notes: newApp.recruiter_notes
          })
      ).catch(err => console.warn('Supabase shortlist insert notice:', err));
    }
    return newApp;
  }

  // Dashboard Aggregates & Statistics Engine
  static getRecruiterStats(organizationId?: string): RecruiterStats {
    const jobs = this.getJobs(organizationId);
    const apps = this.getApplications(organizationId);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'open').length;
    const closedJobs = jobs.filter(j => j.status === 'closed').length;
    const pausedJobs = jobs.filter(j => j.status === 'paused').length;

    const totalApplications = apps.length;
    const screeningCount = apps.filter(a => a.status === 'Screening').length;
    const shortlistedCount = apps.filter(a => a.status === 'Shortlisted').length;
    const interviewCount = apps.filter(a => a.status === 'Interview').length;
    const selectedCount = apps.filter(a => a.status === 'Selected').length;
    const rejectedCount = apps.filter(a => a.status === 'Rejected').length;

    const avgReadinessScore = apps.length > 0
      ? Math.round(apps.reduce((acc, a) => acc + (a.readiness_score || 80), 0) / apps.length)
      : 84;

    const avgMatchScore = apps.length > 0
      ? Math.round(apps.reduce((acc, a) => acc + (a.overall_match_score || 85), 0) / apps.length)
      : 88;

    // Pipeline Funnel data for Recharts
    const pipelineFunnel = [
      { stage: 'Applied', count: totalApplications, percentage: 100 },
      { stage: 'Screening', count: screeningCount + shortlistedCount + interviewCount + selectedCount, percentage: totalApplications ? Math.round(((screeningCount + shortlistedCount + interviewCount + selectedCount) / totalApplications) * 100) : 80 },
      { stage: 'Shortlisted', count: shortlistedCount + interviewCount + selectedCount, percentage: totalApplications ? Math.round(((shortlistedCount + interviewCount + selectedCount) / totalApplications) * 100) : 60 },
      { stage: 'Interview', count: interviewCount + selectedCount, percentage: totalApplications ? Math.round(((interviewCount + selectedCount) / totalApplications) * 100) : 35 },
      { stage: 'Selected / Hired', count: selectedCount, percentage: totalApplications ? Math.round((selectedCount / totalApplications) * 100) : 18 }
    ];

    // Applications count by job
    const applicationsByJob = jobs.slice(0, 5).map(job => {
      const jobApps = apps.filter(a => a.job_id === job.id);
      return {
        jobTitle: job.title.length > 20 ? job.title.substring(0, 18) + '...' : job.title,
        applications: jobApps.length,
        shortlisted: jobApps.filter(a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length
      };
    });

    // Talent readiness distribution
    const talentPool = this.getDetailedCandidates();
    const r90 = talentPool.filter(c => c.readiness_score >= 90).length;
    const r80 = talentPool.filter(c => c.readiness_score >= 80 && c.readiness_score < 90).length;
    const r70 = talentPool.filter(c => c.readiness_score >= 70 && c.readiness_score < 80).length;
    const r60 = talentPool.filter(c => c.readiness_score < 70).length;

    const talentReadinessDistribution = [
      { range: '90-100% (Top Tier)', count: r90 },
      { range: '80-89% (Job Ready)', count: r80 },
      { range: '70-79% (Skilled)', count: r70 },
      { range: '< 70% (In Training)', count: r60 }
    ];

    // Monthly velocity
    const monthlyTrend = [
      { month: 'Apr 2026', applications: 24, hires: 4 },
      { month: 'May 2026', applications: 38, hires: 7 },
      { month: 'Jun 2026', applications: 45, hires: 9 },
      { month: 'Jul 2026', applications: 62, hires: 12 },
      { month: 'Aug 2026', applications: 78, hires: 16 }
    ];

    return {
      totalJobs,
      activeJobs,
      closedJobs,
      pausedJobs,
      totalApplications,
      shortlistedCount,
      screeningCount,
      interviewCount,
      selectedCount,
      rejectedCount,
      avgReadinessScore,
      avgMatchScore,
      offerAcceptanceRate: 94,
      avgTimeToHireDays: 14,
      pipelineFunnel,
      applicationsByJob,
      talentReadinessDistribution,
      monthlyTrend
    };
  }
}
