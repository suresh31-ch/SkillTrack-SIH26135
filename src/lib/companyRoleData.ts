/**
 * SkillTrack - Company & Role Reference Catalog
 * Problem Statement: SIH26135
 * Grounded in verified industry job specifications, official career portals, and curriculum standards.
 */

import { TargetCompany, CompanyRoleProfile } from '../types/studentJourney';

export const TARGET_COMPANIES_CATALOG: TargetCompany[] = [
  {
    id: 'comp-google',
    name: 'Google',
    category: 'Product & Cloud',
    overview: 'Global technology leader specializing in search, cloud computing, artificial intelligence, operating systems, and consumer hardware.',
    officialCareersWebsite: 'https://careers.google.com',
    officialJobSearchLink: 'https://careers.google.com/jobs/results/?distance=50&employment_type=INTERN&employment_type=FULL_TIME',
    primaryLocations: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Mountain View', 'Sunnyvale', 'New York'],
    availableHiringTracks: [
      {
        name: 'SWE Summer Internship',
        description: '10-12 week full-time immersive software engineering internship for undergraduate and postgraduate students.',
        targetGraduation: '2026 - 2027',
        applicationWindow: 'July - November (Annual Cycle)'
      },
      {
        name: 'University Graduate SWE',
        description: 'Full-time campus & off-campus hiring for final year engineering students.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'August - February'
      }
    ],
    disclaimer: 'Career planning reference information. Official applications, eligibility, and interviews are conducted exclusively through Google Careers.',
    availableRoles: [
      {
        id: 'role-goog-swe-intern',
        companyId: 'comp-google',
        companyName: 'Google',
        roleTitle: 'Software Engineering Intern',
        roleCategory: 'Software Engineering',
        overview: 'Join an engineering team building scalable systems, cloud infrastructure, AI models, or consumer web applications serving billions of users.',
        dayToDayResponsibilities: [
          'Design, implement, test, and document robust software components in Python, C++, Java, or Go.',
          'Optimize code for computational efficiency, latency, and memory footprint in distributed systems.',
          'Collaborate with mentor and team leads through structured code reviews and architectural discussions.',
          'Present internship capstone deliverable to engineering stakeholders.'
        ],
        essentialSkills: [
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Python', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'C++', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' },
          { skillName: 'Problem Solving & Complexity Analysis', category: 'Data Structures & Algorithms', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'Distributed Systems', category: 'Cloud & DevOps', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Git & Version Control', category: 'Cloud & DevOps', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Relational Databases', category: 'Databases & Backend', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: [
          'Currently enrolled in a Bachelor’s, Master’s, or Dual Degree program in Computer Science or related technical field.',
          'Must be returning to a degree program following completion of the internship.',
          'Sound foundation in operating systems, networking fundamentals, and computer architecture.'
        ],
        experienceRequirements: 'Prior coding project experience or university coursework in data structures, algorithms, and systems.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'High-Concurrency In-Memory Key-Value Store',
            description: 'Implement a thread-safe, lock-free LRU cache or key-value store with benchmarked throughput measurements.',
            expectedArtifacts: ['GitHub Repository', 'Unit tests with >=85% coverage', 'Benchmark report with latency profiling']
          },
          {
            title: 'Distributed Task Queue System',
            description: 'Build a producer-consumer background worker system using Redis/Kafka with retry policies and dead-letter queues.',
            expectedArtifacts: ['Architecture diagram', 'Dockerized deployment', 'Fault recovery test suite']
          }
        ],
        recommendedCertifications: [
          { title: 'Google Cloud Associate Cloud Engineer', issuer: 'Google Cloud', isRequired: false },
          { title: 'Algorithmic Problem Solving Specialization', issuer: 'Coursera / UC San Diego', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Trees, Graphs & Dynamic Programming', questionsCount: 40, keyFocus: 'Optimal space/time trade-offs and recursive decompositions' },
          { topic: 'System Design Fundamentals', questionsCount: 15, keyFocus: 'Caching strategies, load balancing, horizontal scalability' }
        ],
        employmentType: 'Internship',
        locations: ['Bengaluru', 'Hyderabad', 'Pune'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Stipend',
          minAmount: '₹1,00,000',
          maxAmount: '₹1,30,000',
          currency: 'INR / month',
          sourceNotes: 'Representative university intern compensation based on published college placement reports.'
        },
        applicationDeadline: 'Rolling quarterly windows (Check Google Careers)',
        officialCareersLink: 'https://careers.google.com/students',
        officialJobSearchLink: 'https://careers.google.com/jobs/results/?q=software%20engineer%20intern',
        lastVerifiedDate: '2026-08-15'
      }
    ]
  },
  {
    id: 'comp-microsoft',
    name: 'Microsoft',
    category: 'Product & Cloud',
    overview: 'World leader in personal and enterprise computing, Azure cloud infrastructure, AI platforms, productivity tools, and developer technologies.',
    officialCareersWebsite: 'https://careers.microsoft.com',
    officialJobSearchLink: 'https://careers.microsoft.com/v2/global/en/home.html',
    primaryLocations: ['Bengaluru', 'Hyderabad', 'Noida', 'Pune', 'Redmond'],
    availableHiringTracks: [
      {
        name: 'Microsoft Explore / University Internships',
        description: 'Comprehensive software development and program management internships for university students.',
        targetGraduation: '2026 - 2027',
        applicationWindow: 'August - December'
      }
    ],
    disclaimer: 'Curated career roadmap reference. Official applications are hosted on Microsoft Careers portal.',
    availableRoles: [
      {
        id: 'role-msft-swe',
        companyId: 'comp-microsoft',
        companyName: 'Microsoft',
        roleTitle: 'Software Engineer',
        roleCategory: 'Software Engineering',
        overview: 'Develop scalable backend services, cloud-native Azure microservices, or client-side experiences for Office 365, Teams, and Azure services.',
        dayToDayResponsibilities: [
          'Build reliable, resilient, and enterprise-grade cloud services in C#, Java, Python, or TypeScript.',
          'Participate in Agile sprints, automated CI/CD pipeline deployment, and live-site incident investigations.',
          'Optimize cloud database access patterns, API rate limits, and zero-trust authentication workflows.',
          'Write automated integration and regression tests for high availability.'
        ],
        essentialSkills: [
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Java', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' },
          { skillName: 'RESTful API Design', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' },
          { skillName: 'SQL & Database Optimization', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'Azure Cloud Fundamentals', category: 'Cloud & DevOps', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Docker & Containers', category: 'Cloud & DevOps', requiredLevel: 'Intermediate', importance: 'Medium', source: 'Curated Reference Standards' },
          { skillName: 'Unit Testing & Mocking', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: [
          'B.E. / B.Tech / M.Tech in Computer Science, Information Technology, or closely related field.',
          'Minimum 70% or 7.0 CGPA throughout academic records.',
          'No active backlogs at time of selection.'
        ],
        experienceRequirements: '0-2 years of relevant software engineering or project experience.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Cloud-Native Enterprise Telemetry Pipeline',
            description: 'Build an event ingestion system that parses streaming telemetry events, stores aggregates in PostgreSQL, and alerts on anomalies.',
            expectedArtifacts: ['OpenAPI 3.0 Documentation', 'Docker-compose environment', 'Grafana dashboard integration']
          }
        ],
        recommendedCertifications: [
          { title: 'Microsoft Certified: Azure Fundamentals (AZ-900)', issuer: 'Microsoft', isRequired: false },
          { title: 'Microsoft Certified: Azure Developer Associate (AZ-204)', issuer: 'Microsoft', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Data Structures (Arrays, HashMaps, Graphs)', questionsCount: 35, keyFocus: 'Space-time efficiency and edge case handling' },
          { topic: 'Object-Oriented Design & SOLID Principles', questionsCount: 15, keyFocus: 'Extensibility, design patterns, clean code principles' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Hyderabad', 'Noida'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹18,00,000',
          maxAmount: '₹26,00,000',
          currency: 'INR',
          sourceNotes: 'Base salary plus standard joining bonuses and stock grants per official campus recruitment matrices.'
        },
        applicationDeadline: 'Autumn Campus Drive & Rolling Off-Campus',
        officialCareersLink: 'https://careers.microsoft.com/students/us/en',
        officialJobSearchLink: 'https://careers.microsoft.com/v2/global/en/home.html',
        lastVerifiedDate: '2026-08-10'
      }
    ]
  },
  {
    id: 'comp-amazon',
    name: 'Amazon',
    category: 'Product & Cloud',
    overview: 'Global e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence titan guided by 16 Leadership Principles.',
    officialCareersWebsite: 'https://amazon.jobs',
    officialJobSearchLink: 'https://amazon.jobs/en/job_categories/software-development',
    primaryLocations: ['Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Seattle', 'Arlington'],
    availableHiringTracks: [
      {
        name: 'SDE Intern',
        description: '6-month and 2-month internships across AWS, Retail, Prime Video, and Alexa.',
        targetGraduation: '2026 - 2027',
        applicationWindow: 'July - February'
      },
      {
        name: 'Full-Time SDE-1',
        description: 'Entry-level software development engineer opportunities across India tech hubs.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'Year-round'
      }
    ],
    disclaimer: 'Curated reference profile for skill preparation. Refer to Amazon.jobs for official application pipelines.',
    availableRoles: [
      {
        id: 'role-amzn-sde-intern',
        companyId: 'comp-amazon',
        companyName: 'Amazon',
        roleTitle: 'Software Development Engineer Intern',
        roleCategory: 'Software Engineering',
        overview: 'Collaborate with senior SDEs and product managers to deliver scalable systems and microservices powering millions of transactions daily.',
        dayToDayResponsibilities: [
          'Write high-quality, maintainable code using Java, Python, or C++ with automated unit tests.',
          'Contribute to AWS infrastructure provisioning, monitoring, and debugging.',
          'Demonstrate ownership and customer obsession by solving real operational customer friction points.',
          'Participate in team operational reviews and design reviews.'
        ],
        essentialSkills: [
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Java', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Object-Oriented Programming', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Amazon Leadership Principles', category: 'Communication & Leadership', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'AWS Cloud Fundamentals', category: 'Cloud & DevOps', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' },
          { skillName: 'Linux & Shell Scripting', category: 'Cloud & DevOps', requiredLevel: 'Intermediate', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: [
          'Enrolled in Bachelor’s or Master’s in Computer Science, Computer Engineering, or related technical discipline.',
          'Graduating between Spring 2026 and Summer 2027.'
        ],
        experienceRequirements: 'Strong foundations in data structures, algorithms, and object-oriented design from coursework or projects.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'High-Throughput Order Processing Simulation',
            description: 'Implement an asynchronous e-commerce checkout processor with idempotent inventory locking and payment webhooks.',
            expectedArtifacts: ['Full source code', 'Concurrency stress tests', 'README with design trade-offs']
          }
        ],
        recommendedCertifications: [
          { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Online Assessment (OA2) Coding & Work Simulation', questionsCount: 30, keyFocus: 'Two medium-hard algorithmic questions in 70 mins' },
          { topic: 'Behavioral Stories (Customer Obsession, Ownership)', questionsCount: 16, keyFocus: 'STAR method answers demonstrating Amazon LPs' }
        ],
        employmentType: 'Internship',
        locations: ['Bengaluru', 'Hyderabad', 'Chennai'],
        workArrangement: 'In-office',
        salaryOrStipendReference: {
          type: 'Stipend',
          minAmount: '₹80,000',
          maxAmount: '₹1,10,000',
          currency: 'INR / month',
          sourceNotes: 'Standard university stipend for SDE internships.'
        },
        applicationDeadline: 'Rolling annual recruitment',
        officialCareersLink: 'https://amazon.jobs/en/teams/internships-for-students',
        officialJobSearchLink: 'https://amazon.jobs/en/search?base_query=software+development+engineer+intern',
        lastVerifiedDate: '2026-08-20'
      }
    ]
  },
  {
    id: 'comp-adobe',
    name: 'Adobe',
    category: 'Product & Cloud',
    overview: 'Creator of the Creative Cloud, Document Cloud, and Experience Cloud transforming digital experiences and creative workflows globally.',
    officialCareersWebsite: 'https://www.adobe.com/careers.html',
    officialJobSearchLink: 'https://careers.adobe.com/us/en/search-results',
    primaryLocations: ['Noida', 'Bengaluru', 'San Jose', 'San Francisco'],
    availableHiringTracks: [
      {
        name: 'Adobe University Talent Programs',
        description: 'Internships and graduate roles in software development, computer vision, and machine learning.',
        targetGraduation: '2026 - 2027',
        applicationWindow: 'July - November'
      }
    ],
    disclaimer: 'Curated career guidance. All applications must be submitted directly through Adobe Careers.',
    availableRoles: [
      {
        id: 'role-adbe-frontend',
        companyId: 'comp-adobe',
        companyName: 'Adobe',
        roleTitle: 'Frontend Software Engineer',
        roleCategory: 'Web & Mobile Development',
        overview: 'Build high-performance web applications and design canvases for Adobe Creative Cloud and Document Cloud products.',
        dayToDayResponsibilities: [
          'Develop modular, accessible, and performant web interfaces using TypeScript, React, WebGL, and modern DOM APIs.',
          'Optimize canvas rendering, frame rates, and memory management for rich multimedia editing.',
          'Collaborate closely with product designers, UX researchers, and backend engineers.',
          'Ensure cross-browser compatibility and strict compliance with WCAG accessibility guidelines.'
        ],
        essentialSkills: [
          { skillName: 'React & Modern Frontend', category: 'Web & Mobile Development', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'TypeScript', category: 'Programming Languages', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'JavaScript (ES6+)', category: 'Programming Languages', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'WebGL & Canvas Rendering', category: 'Web & Mobile Development', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Web Performance Optimization', category: 'Web & Mobile Development', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: ['B.Tech / B.E. / M.Tech in Computer Science or Design Tech.'],
        experienceRequirements: 'Portfolio of production-grade web applications or open source frontend contributions.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Interactive Vector Drawing & Editing Canvas',
            description: 'Build a browser-based graphic canvas supporting bezier curves, layer management, undo/redo stacks, and SVG export.',
            expectedArtifacts: ['Live demo link', 'GitHub repository', 'Performance profiling report (60fps rendering)']
          }
        ],
        recommendedCertifications: [
          { title: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta / Coursera', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'JavaScript Engine Internals (Event Loop, Closures, Prototypes)', questionsCount: 20, keyFocus: 'Deep JavaScript execution model' },
          { topic: 'Frontend System Design', questionsCount: 12, keyFocus: 'State management, bundle splitting, virtualization' }
        ],
        employmentType: 'Full-time',
        locations: ['Noida', 'Bengaluru'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹16,00,000',
          maxAmount: '₹22,00,000',
          currency: 'INR',
          sourceNotes: 'Full-time graduate entry tier compensation.'
        },
        applicationDeadline: 'Autumn recruitment cycle',
        officialCareersLink: 'https://careers.adobe.com/us/en/university-talent',
        officialJobSearchLink: 'https://careers.adobe.com/us/en/search-results?keywords=software%20engineer',
        lastVerifiedDate: '2026-08-18'
      }
    ]
  },
  {
    id: 'comp-nvidia',
    name: 'NVIDIA',
    category: 'Semiconductor & AI',
    overview: 'Pioneer of GPU computing, accelerated computing architectures, CUDA, and advanced AI platforms powering the modern intelligence revolution.',
    officialCareersWebsite: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    officialJobSearchLink: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
    primaryLocations: ['Bengaluru', 'Pune', 'Hyderabad', 'Santa Clara'],
    availableHiringTracks: [
      {
        name: 'University AI & Systems Hiring',
        description: 'Roles in deep learning software, CUDA development, driver architecture, and computer graphics.',
        targetGraduation: '2025 - 2027',
        applicationWindow: 'August - March'
      }
    ],
    disclaimer: 'Curated preparation guide. Check NVIDIA Workday portal for verified listings.',
    availableRoles: [
      {
        id: 'role-nvda-ai-eng',
        companyId: 'comp-nvidia',
        companyName: 'NVIDIA',
        roleTitle: 'Machine Learning / AI Engineer',
        roleCategory: 'AI & Machine Learning',
        overview: 'Optimize deep learning inference pipelines, GPU kernel acceleration, and distributed foundation model training workflows.',
        dayToDayResponsibilities: [
          'Develop and benchmark accelerated machine learning workloads using Python, PyTorch, and CUDA.',
          'Optimize model latency, throughput, and quantization for edge and cloud deployment.',
          'Profile GPU memory bandwidth, compute saturation, and memory leaks using NVIDIA Nsight tools.',
          'Contribute to open source AI frameworks and TensorRT optimization pipelines.'
        ],
        essentialSkills: [
          { skillName: 'Python', category: 'Programming Languages', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Machine Learning & Deep Learning', category: 'AI & Machine Learning', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'PyTorch / TensorFlow', category: 'AI & Machine Learning', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'C++', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'CUDA Programming', category: 'AI & Machine Learning', requiredLevel: 'Beginner', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Model Quantization & TensorRT', category: 'AI & Machine Learning', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: ['B.Tech / M.Tech / MS in CS, Electrical Engineering, or Data Science with strong mathematical foundation.'],
        experienceRequirements: 'Research papers or demonstrated projects in deep learning model architectures.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Low-Latency Vision / LLM Inference Engine',
            description: 'Implement a batch inference pipeline utilizing INT8/FP16 quantization with TensorRT or ONNX Runtime.',
            expectedArtifacts: ['Benchmarks on GPU', 'Latency vs Accuracy trade-off curve', 'Clean reproducible code']
          }
        ],
        recommendedCertifications: [
          { title: 'NVIDIA Deep Learning Institute (DLI) Fundamentals', issuer: 'NVIDIA', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Linear Algebra, Calculus & Loss Optimization', questionsCount: 25, keyFocus: 'Matrix decomposition, backprop mathematics, gradient descent' },
          { topic: 'Transformer Architecture & Attention Mechanisms', questionsCount: 15, keyFocus: 'Multi-head attention, KV cache, memory bounds' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Pune'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹22,00,000',
          maxAmount: '₹32,00,000',
          currency: 'INR',
          sourceNotes: 'Early career AI systems engineering benchmark.'
        },
        applicationDeadline: 'Campus drives in September-October',
        officialCareersLink: 'https://www.nvidia.com/en-us/about-nvidia/careers/university-recruiting/',
        officialJobSearchLink: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
        lastVerifiedDate: '2026-08-25'
      }
    ]
  },
  {
    id: 'comp-tcs',
    name: 'TCS (Tata Consultancy Services)',
    category: 'Consulting & IT Services',
    overview: 'India’s largest multinational IT services, consulting, and business solutions organization with massive campus recruitment drives.',
    officialCareersWebsite: 'https://www.tcs.com/careers',
    officialJobSearchLink: 'https://nextstep.tcs.com/campus/',
    primaryLocations: ['Mumbai', 'Pune', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Delhi NCR'],
    availableHiringTracks: [
      {
        name: 'TCS National Qualifier Test (NQT)',
        description: 'Standardized hiring pathway with Ninja (Standard) and Digital (Premium) skilling bands.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'July - October (Annual NQT)'
      }
    ],
    disclaimer: 'Curated preparation guide for TCS NQT / Digital. Registrations must be made through TCS NextStep portal.',
    availableRoles: [
      {
        id: 'role-tcs-digital',
        companyId: 'comp-tcs',
        companyName: 'TCS (Tata Consultancy Services)',
        roleTitle: 'Systems Engineer - Digital Track',
        roleCategory: 'Software Engineering',
        overview: 'Deliver enterprise digital transformation across banking, retail, healthcare, and telecommunications using cloud, microservices, and AI.',
        dayToDayResponsibilities: [
          'Design and implement secure enterprise application features using Java, Python, or Full-Stack frameworks.',
          'Execute database migrations, schema definitions, and automated integration testing.',
          'Collaborate with global client stakeholders to resolve business logic requirements.',
          'Participate in continuous learning and cloud certification programs.'
        ],
        essentialSkills: [
          { skillName: 'Java', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'SQL & Database Optimization', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Verbal & Quantitative Aptitude', category: 'Communication & Leadership', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'Spring Boot', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Cloud Fundamentals', category: 'Cloud & DevOps', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: [
          'B.E. / B.Tech / M.Tech / MCA with minimum 60% or 6.0 CGPA throughout 10th, 12th, and graduation.',
          'Maximum 1 academic gap year permitted.'
        ],
        experienceRequirements: 'Fresher / Entry level.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Enterprise Banking Transaction Portal',
            description: 'Build a secure role-based customer banking portal with fund transfers, audit logging, and automated statement generation.',
            expectedArtifacts: ['Full source code', 'ER Diagram', 'Postman API collection']
          }
        ],
        recommendedCertifications: [
          { title: 'TCS NQT Scorecard (Digital Band >75%)', issuer: 'TCS iON', isRequired: true }
        ],
        interviewPrepFocus: [
          { topic: 'NQT Foundation + Advanced Cognitive Assessment', questionsCount: 45, keyFocus: 'Advanced coding in Java/Python and numerical aptitude' },
          { topic: 'Core Technical (OOPs, DBMS, SQL Queries)', questionsCount: 30, keyFocus: 'Joins, Normalization, ACID properties, OOP pillars' }
        ],
        employmentType: 'Full-time',
        locations: ['Pune', 'Mumbai', 'Bengaluru', 'Hyderabad'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹7,00,000',
          maxAmount: '₹9,00,000',
          currency: 'INR',
          sourceNotes: 'TCS Digital / Prime offer band compensation.'
        },
        applicationDeadline: 'Annual NQT Cycle',
        officialCareersLink: 'https://nextstep.tcs.com',
        officialJobSearchLink: 'https://nextstep.tcs.com/campus/',
        lastVerifiedDate: '2026-08-05'
      }
    ]
  },
  {
    id: 'comp-infosys',
    name: 'Infosys',
    category: 'Consulting & IT Services',
    overview: 'Global digital services and consulting leader renowned for its world-class Mysore Global Education Center and InfyTQ / HackWithInfy talent programs.',
    officialCareersWebsite: 'https://www.infosys.com/careers.html',
    officialJobSearchLink: 'https://career.infosys.com/',
    primaryLocations: ['Bengaluru', 'Mysuru', 'Pune', 'Hyderabad', 'Chennai', 'Chandigarh'],
    availableHiringTracks: [
      {
        name: 'HackWithInfy & Specialist Programmer (DSE/SP)',
        description: 'Competitive coding hackathon hiring for high-package Specialist Programmer and Digital Specialist Engineer roles.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'March - August'
      }
    ],
    disclaimer: 'Curated career guidance. Official registrations occur on Infosys Career and InfyTQ platforms.',
    availableRoles: [
      {
        id: 'role-infy-sp',
        companyId: 'comp-infosys',
        companyName: 'Infosys',
        roleTitle: 'Specialist Programmer (Power Programmer)',
        roleCategory: 'Software Engineering',
        overview: 'High-impact coding specialist role tackling complex algorithmic challenges, enterprise cloud migrations, and full-stack architecture.',
        dayToDayResponsibilities: [
          'Develop full-stack enterprise cloud microservices with sub-second API latencies.',
          'Architect data pipelines, cache synchronization, and fault-tolerant distributed transactions.',
          'Lead algorithmic problem solving and architectural modernization for Fortune 500 clients.'
        ],
        essentialSkills: [
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Python or Java', category: 'Programming Languages', requiredLevel: 'Advanced', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'SQL & Database Optimization', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'Docker & Kubernetes', category: 'Cloud & DevOps', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Full Stack Development', category: 'Web & Mobile Development', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: ['B.E. / B.Tech / M.Tech in CS/IT or Circuit branches with >=65% aggregate.'],
        experienceRequirements: 'Demonstrated high performance in competitive programming or hackathons.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Microservices-Based Real-Time Analytics Dashboard',
            description: 'Deploy three decoupled Spring Boot/FastAPI services orchestrated via Docker and connected via Kafka.',
            expectedArtifacts: ['Docker compose files', 'Architecture diagram', 'Integration test suite']
          }
        ],
        recommendedCertifications: [
          { title: 'InfyTQ Certified Software Programmer', issuer: 'Infosys', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Competitive Coding & Graph Algorithms', questionsCount: 30, keyFocus: 'Dijkstra, BFS/DFS, DP on Trees, Segment Trees' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Mysuru'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹9,50,000',
          maxAmount: '₹11,00,000',
          currency: 'INR',
          sourceNotes: 'Infosys Specialist Programmer (SP) entry compensation.'
        },
        applicationDeadline: 'Annual HackWithInfy seasons',
        officialCareersLink: 'https://career.infosys.com/',
        officialJobSearchLink: 'https://career.infosys.com/',
        lastVerifiedDate: '2026-08-01'
      }
    ]
  },
  {
    id: 'comp-wipro',
    name: 'Wipro',
    category: 'Consulting & IT Services',
    overview: 'Multinational information technology, consulting, and business process services company headquartered in Bengaluru.',
    officialCareersWebsite: 'https://careers.wipro.com',
    officialJobSearchLink: 'https://careers.wipro.com/global-campus',
    primaryLocations: ['Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Gurugram'],
    availableHiringTracks: [
      {
        name: 'Elite National Talent Hunt (NTH)',
        description: 'Fresher recruitment drive for engineering graduates across India.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'August - December'
      },
      {
        name: 'Turbo Hiring Program',
        description: 'High-package hiring for students with strong competitive coding skills.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'September - November'
      }
    ],
    disclaimer: 'Official university hiring information. Applications are submitted via the Wipro Careers portal.',
    availableRoles: [
      {
        id: 'role-wipro-project-engineer',
        companyId: 'comp-wipro',
        companyName: 'Wipro',
        roleTitle: 'Project Engineer',
        roleCategory: 'Software Engineering',
        overview: 'Deliver enterprise software development, testing, and cloud infrastructure support for global Fortune 500 clients.',
        dayToDayResponsibilities: [
          'Develop application modules using Java, Python, .NET, or React.',
          'Execute automated testing and debug defect tickets in enterprise sprint cycles.',
          'Participate in CI/CD pipeline deployments and cloud monitoring.',
          'Document code and collaborate in daily Scrum standups.'
        ],
        essentialSkills: [
          { skillName: 'Java', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'SQL Querying & Reporting', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'React', category: 'Web & Mobile Development', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' },
          { skillName: 'Cloud & DevOps', category: 'Cloud & DevOps', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: [
          'B.E. / B.Tech / M.Tech in CSE, IT, ECE, or related engineering streams.',
          '60% or 6.0 CGPA minimum across 10th, 12th, and undergraduate coursework.',
          'Maximum 1 active backlog permitted at the time of online evaluation.'
        ],
        experienceRequirements: 'Fresher graduate hiring or relevant college project internships.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Enterprise Inventory Management System',
            description: 'Build a secure full-stack inventory application with role-based access control and transactional SQL operations.',
            expectedArtifacts: ['GitHub Repository', 'ER Diagram', 'API Documentation']
          }
        ],
        recommendedCertifications: [
          { title: 'Wipro Certified Associate Developer', issuer: 'Wipro', isRequired: false },
          { title: 'Oracle Certified Associate Java Programmer', issuer: 'Oracle', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Java OOPs & Multithreading', questionsCount: 25, keyFocus: 'Encapsulation, Polymorphism, Collections Framework, Exception Handling' },
          { topic: 'SQL Queries & Joins', questionsCount: 20, keyFocus: 'Subqueries, Inner/Left Joins, Group By, Indexing' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Chennai'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹3,50,000',
          maxAmount: '₹6,50,000',
          currency: 'INR',
          sourceNotes: 'Elite (₹3.5 LPA) to Turbo (₹6.5 LPA) engineering compensation tracks.'
        },
        applicationDeadline: 'Annual campus cycle (Check Wipro Campus Portal)',
        officialCareersLink: 'https://careers.wipro.com',
        officialJobSearchLink: 'https://careers.wipro.com/global-campus',
        lastVerifiedDate: '2026-08-15'
      }
    ]
  },
  {
    id: 'comp-accenture',
    name: 'Accenture',
    category: 'Consulting & IT Services',
    overview: 'Global professional services company with leading capabilities in digital, cloud, security, and enterprise engineering.',
    officialCareersWebsite: 'https://www.accenture.com/in-en/careers',
    officialJobSearchLink: 'https://www.accenture.com/in-en/careers/local/entry-level',
    primaryLocations: ['Bengaluru', 'Pune', 'Hyderabad', 'Mumbai', 'Gurugram', 'Chennai', 'Kolkata'],
    availableHiringTracks: [
      {
        name: 'Associate Software Engineer (ASE)',
        description: 'Flagship engineering onboarding track across software development, quality, and platform services.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'July - November'
      },
      {
        name: 'Advanced Application Engineering Analyst (AAEA)',
        description: 'Specialized role for high-performing coders focused on architecture, cloud, and AI engineering.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'August - October'
      }
    ],
    disclaimer: 'Curated university reference information. Applications are processed through official Accenture campus assessment channels.',
    availableRoles: [
      {
        id: 'role-accenture-ase',
        companyId: 'comp-accenture',
        companyName: 'Accenture',
        roleTitle: 'Associate Software Engineer',
        roleCategory: 'Software Engineering',
        overview: 'Design, build, test, and configure applications to meet business process and application requirements.',
        dayToDayResponsibilities: [
          'Develop application components in modern tech stacks (Java, .NET, Python, Angular/React).',
          'Perform unit testing, code refactoring, and integration testing.',
          'Support cloud application migration and containerized microservices.',
          'Participate in Agile sprint planning and client status updates.'
        ],
        essentialSkills: [
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Python', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Web & Mobile Development', category: 'Web & Mobile Development', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'Cloud & DevOps', category: 'Cloud & DevOps', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' },
          { skillName: 'CI/CD Pipelines (GitHub Actions)', category: 'Cloud & DevOps', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: [
          'All engineering branches eligible (B.E./B.Tech/M.E./M.Tech/MCA/M.Sc CS/IT).',
          'No active backlogs at time of recruitment onboarding.'
        ],
        experienceRequirements: 'Fresher campus hire or relevant project experience.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Cloud-Enabled Web Portal',
            description: 'Develop a responsive web application hosted on cloud infrastructure with automated unit testing.',
            expectedArtifacts: ['GitHub Repository', 'Live Demo URL', 'Test Suite']
          }
        ],
        recommendedCertifications: [
          { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', isRequired: false },
          { title: 'Microsoft Certified: Azure Fundamentals', issuer: 'Microsoft', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Cognitive & Technical Assessment', questionsCount: 45, keyFocus: 'Pseudo-code, Critical Thinking, Networking, Cloud Basics' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Mumbai', 'Gurugram'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹4,50,000',
          maxAmount: '₹6,50,000',
          currency: 'INR',
          sourceNotes: 'ASE (₹4.5 LPA) and AAEA (₹6.5 LPA) standard compensation brackets.'
        },
        applicationDeadline: 'Campus Recruitment Windows',
        officialCareersLink: 'https://www.accenture.com/in-en/careers',
        officialJobSearchLink: 'https://www.accenture.com/in-en/careers/local/entry-level',
        lastVerifiedDate: '2026-08-20'
      }
    ]
  },
  {
    id: 'comp-ibm',
    name: 'IBM',
    category: 'Product & Cloud',
    overview: 'Global hybrid cloud, artificial intelligence, and enterprise technology services enterprise.',
    officialCareersWebsite: 'https://www.ibm.com/careers',
    officialJobSearchLink: 'https://www.ibm.com/careers/search?q=entry+level',
    primaryLocations: ['Bengaluru', 'Pune', 'Hyderabad', 'Kochi', 'Gurugram', 'Ahmedabad'],
    availableHiringTracks: [
      {
        name: 'Entry Level Software Developer',
        description: 'New university graduate roles across Red Hat OpenShift, IBM Cloud, and watsonx engineering.',
        targetGraduation: '2025 - 2026',
        applicationWindow: 'August - February'
      }
    ],
    disclaimer: 'Reference job requirements for university recruitment. Apply officially via IBM Careers.',
    availableRoles: [
      {
        id: 'role-ibm-software-dev',
        companyId: 'comp-ibm',
        companyName: 'IBM',
        roleTitle: 'Associate System Engineer',
        roleCategory: 'Software Engineering',
        overview: 'Build next-generation enterprise hybrid cloud software, microservices, and AI integrations.',
        dayToDayResponsibilities: [
          'Write clean, modular code in Java, Python, Go, or Node.js.',
          'Develop containerized workloads deployable to Kubernetes / Red Hat OpenShift.',
          'Implement RESTful APIs with database connectivity and security best practices.'
        ],
        essentialSkills: [
          { skillName: 'Java', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Employer Published' },
          { skillName: 'Databases & Backend', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'High', source: 'Employer Published' }
        ],
        preferredSkills: [
          { skillName: 'Docker & Containers', category: 'Cloud & DevOps', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' },
          { skillName: 'Kubernetes', category: 'Cloud & DevOps', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: [
          'B.E. / B.Tech in Computer Science, IT, Mathematics, or Electronics.',
          'Strong analytical foundation and problem-solving skills.'
        ],
        experienceRequirements: 'Fresher or internship project portfolio.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Containerized Microservice Architecture',
            description: 'Build and deploy a multi-service web app packaged in Docker containers.',
            expectedArtifacts: ['Dockerfile', 'Kubernetes YAML manifest', 'README guide']
          }
        ],
        recommendedCertifications: [
          { title: 'Red Hat Certified Specialist in Containers and Kubernetes', issuer: 'Red Hat', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Object-Oriented Design & System Concepts', questionsCount: 25, keyFocus: 'Inheritance, Interfaces, REST concepts, SQL vs NoSQL' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Kochi'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹4,80,000',
          maxAmount: '₹7,20,000',
          currency: 'INR',
          sourceNotes: 'Associate System Engineer entry range.'
        },
        applicationDeadline: 'Rolling recruitment cycles',
        officialCareersLink: 'https://www.ibm.com/careers',
        officialJobSearchLink: 'https://www.ibm.com/careers/search?q=entry+level',
        lastVerifiedDate: '2026-08-25'
      }
    ]
  },
  {
    id: 'comp-reference-roles',
    name: 'Industry Standard Tech Roles',
    category: 'Product & Cloud',
    overview: 'Canonical, industry-benchmarked technical role profiles representing core software engineering, data science, cloud, security, and design tracks across leading tech employers.',
    officialCareersWebsite: 'https://skilltrack.io/roles',
    officialJobSearchLink: 'https://skilltrack.io/explore',
    primaryLocations: ['Pan-India (Bengaluru, Pune, Hyderabad, Delhi-NCR, Mumbai, Chennai) / Remote'],
    availableHiringTracks: [
      {
        name: 'Standard Technical Career Tracks',
        description: 'Comprehensive curriculum standards mapped to global engineering rubrics.',
        targetGraduation: 'All Batches',
        applicationWindow: 'Year-Round Reference'
      }
    ],
    disclaimer: 'Curated technical reference profiles for skill gap analysis and curriculum planning. Not a single employer vacancy.',
    availableRoles: [
      {
        id: 'role-std-frontend-dev',
        companyId: 'comp-reference-roles',
        companyName: 'Industry Standard Tech Roles',
        roleTitle: 'Frontend Developer',
        roleCategory: 'Web & Mobile Development',
        overview: 'Build interactive, accessible, high-performance web applications using modern JavaScript/TypeScript, React, and state management frameworks.',
        dayToDayResponsibilities: [
          'Develop responsive user interfaces with semantic HTML5, modern CSS/Tailwind, and React components.',
          'Optimize rendering performance, bundle size, and Core Web Vitals.',
          'Integrate REST and GraphQL APIs with error handling and optimistic UI updates.',
          'Write automated component tests with Jest and React Testing Library.'
        ],
        essentialSkills: [
          { skillName: 'React', category: 'Web & Mobile Development', requiredLevel: 'Advanced', importance: 'Critical', source: 'Curated Reference Standards' },
          { skillName: 'TypeScript', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Curated Reference Standards' },
          { skillName: 'HTML5 & Responsive CSS', category: 'Web & Mobile Development', requiredLevel: 'Advanced', importance: 'Critical', source: 'Curated Reference Standards' }
        ],
        preferredSkills: [
          { skillName: 'Next.js', category: 'Web & Mobile Development', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'UI/UX Design in Figma', category: 'Design & Product', requiredLevel: 'Beginner', importance: 'Medium', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: ['Bachelor’s degree in CS, IT, or equivalent demonstrable portfolio experience.'],
        experienceRequirements: 'Portfolio of production-quality web applications or internships.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Interactive SaaS Dashboard',
            description: 'Build a complex dashboard with dark mode, chart visualizations, filtering, and responsive layout.',
            expectedArtifacts: ['GitHub Repo', 'Vercel/Netlify Live Deployment', 'Accessibility Lighthouse >= 95']
          }
        ],
        recommendedCertifications: [
          { title: 'Meta Front-End Developer Professional Certificate', issuer: 'Meta', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'JavaScript Event Loop & React Hooks', questionsCount: 30, keyFocus: 'Closures, Promises, useEffect dependencies, useMemo, custom hooks' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Remote'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹6,00,000',
          maxAmount: '₹14,00,000',
          currency: 'INR',
          sourceNotes: 'Market average for junior to mid-level frontend software engineers in India.'
        },
        applicationDeadline: 'Year-Round Reference',
        officialCareersLink: 'https://skilltrack.io',
        officialJobSearchLink: 'https://skilltrack.io',
        lastVerifiedDate: '2026-09-01'
      },
      {
        id: 'role-std-backend-dev',
        companyId: 'comp-reference-roles',
        companyName: 'Industry Standard Tech Roles',
        roleTitle: 'Backend Developer',
        roleCategory: 'Web & Mobile Development',
        overview: 'Architect resilient server-side microservices, transactional databases, and scalable distributed APIs.',
        dayToDayResponsibilities: [
          'Design, build, and maintain REST/gRPC backend services in Node.js, Python, or Java.',
          'Optimize database queries, indexing, and data modeling for PostgreSQL/MySQL.',
          'Implement authentication (JWT/OAuth), rate limiting, and caching layers with Redis.',
          'Set up automated tests and containerized deployments.'
        ],
        essentialSkills: [
          { skillName: 'Node.js & Express', category: 'Web & Mobile Development', requiredLevel: 'Advanced', importance: 'Critical', source: 'Curated Reference Standards' },
          { skillName: 'PostgreSQL', category: 'Databases & Backend', requiredLevel: 'Advanced', importance: 'Critical', source: 'Curated Reference Standards' },
          { skillName: 'RESTful API Design', category: 'Databases & Backend', requiredLevel: 'Advanced', importance: 'Critical', source: 'Curated Reference Standards' }
        ],
        preferredSkills: [
          { skillName: 'Docker & Containers', category: 'Cloud & DevOps', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Redis Caching', category: 'Databases & Backend', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: ['B.E. / B.Tech in CS/IT or equivalent project portfolio.'],
        experienceRequirements: 'Experience designing backend services and relational databases.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'High-Throughput E-Commerce Backend API',
            description: 'Implement ordering, payment webhooks, database transactions with optimistic locking, and Redis caching.',
            expectedArtifacts: ['GitHub Repo', 'Postman Collection', 'Load testing benchmark']
          }
        ],
        recommendedCertifications: [
          { title: 'AWS Certified Developer - Associate', issuer: 'AWS', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Database Concurrency & ACID', questionsCount: 25, keyFocus: 'Isolation levels, Index types (B-tree, Hash), N+1 queries' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Pune', 'Hyderabad', 'Remote'],
        workArrangement: 'Flexible',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹7,00,000',
          maxAmount: '₹16,00,000',
          currency: 'INR',
          sourceNotes: 'Market average for junior to mid-level backend engineers.'
        },
        applicationDeadline: 'Year-Round Reference',
        officialCareersLink: 'https://skilltrack.io',
        officialJobSearchLink: 'https://skilltrack.io',
        lastVerifiedDate: '2026-09-01'
      },
      {
        id: 'role-std-data-analyst',
        companyId: 'comp-reference-roles',
        companyName: 'Industry Standard Tech Roles',
        roleTitle: 'Data Analyst',
        roleCategory: 'Data Analytics & BI',
        overview: 'Transform raw enterprise telemetry into actionable business intelligence through statistical modeling, SQL transformations, and interactive BI dashboards.',
        dayToDayResponsibilities: [
          'Extract, clean, and analyze enterprise datasets using advanced SQL and Python (Pandas).',
          'Build interactive executive dashboards in Power BI or Tableau.',
          'Define KPI metrics, track cohort retention, and identify operational bottlenecks.',
          'Communicate analytical findings to technical and non-technical stakeholders.'
        ],
        essentialSkills: [
          { skillName: 'SQL Querying & Reporting', category: 'Data Analytics & BI', requiredLevel: 'Advanced', importance: 'Critical', source: 'Curated Reference Standards' },
          { skillName: 'Data Analysis with Pandas & NumPy', category: 'Data Analytics & BI', requiredLevel: 'Intermediate', importance: 'Critical', source: 'Curated Reference Standards' },
          { skillName: 'Power BI & Tableau', category: 'Data Analytics & BI', requiredLevel: 'Advanced', importance: 'Critical', source: 'Curated Reference Standards' }
        ],
        preferredSkills: [
          { skillName: 'Python', category: 'Programming Languages', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' },
          { skillName: 'Technical Communication & Presentation', category: 'Communication & Leadership', requiredLevel: 'Intermediate', importance: 'High', source: 'Curated Reference Standards' }
        ],
        educationAndEligibility: ['Degree in Computer Science, Statistics, Mathematics, Data Science, or Economics.'],
        experienceRequirements: 'Portfolio of end-to-end analytical reports and dashboard projects.',
        projectsThatDemonstrateReadiness: [
          {
            title: 'Customer Churn & Revenue Analytics Dashboard',
            description: 'Perform exploratory data analysis on a 100k customer transaction dataset with predictive churn indicators.',
            expectedArtifacts: ['Jupyter Notebook', 'Interactive Power BI / Tableau file', 'Executive summary slide deck']
          }
        ],
        recommendedCertifications: [
          { title: 'Google Data Analytics Professional Certificate', issuer: 'Google', isRequired: false },
          { title: 'Microsoft Certified: Power BI Data Analyst Associate', issuer: 'Microsoft', isRequired: false }
        ],
        interviewPrepFocus: [
          { topic: 'Complex SQL Windows Functions & CTEs', questionsCount: 30, keyFocus: 'ROW_NUMBER(), RANK(), LAG()/LEAD(), Partition By, Rolling Averages' }
        ],
        employmentType: 'Full-time',
        locations: ['Bengaluru', 'Mumbai', 'Pune', 'Gurugram', 'Hyderabad'],
        workArrangement: 'Hybrid',
        salaryOrStipendReference: {
          type: 'Annual CTC',
          minAmount: '₹5,50,000',
          maxAmount: '₹12,00,000',
          currency: 'INR',
          sourceNotes: 'Market average for data and business intelligence analysts.'
        },
        applicationDeadline: 'Year-Round Reference',
        officialCareersLink: 'https://skilltrack.io',
        officialJobSearchLink: 'https://skilltrack.io',
        lastVerifiedDate: '2026-09-01'
      }
    ]
  }
];

export const ALL_SKILL_CATEGORIES = [
  'Programming Languages',
  'Data Structures & Algorithms',
  'Web & Mobile Development',
  'Databases & Backend',
  'Cloud & DevOps',
  'AI & Machine Learning',
  'Data Analytics & BI',
  'Cybersecurity',
  'Design & Product',
  'Communication & Leadership',
  'Domain-Specific & Others'
] as const;

export const POPULAR_AUTOCOMPLETE_SKILLS: Array<{ name: string; category: typeof ALL_SKILL_CATEGORIES[number] }> = [
  { name: 'Python', category: 'Programming Languages' },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'C', category: 'Programming Languages' },
  { name: 'JavaScript', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'Go (Golang)', category: 'Programming Languages' },
  { name: 'Data Structures & Algorithms', category: 'Data Structures & Algorithms' },
  { name: 'Arrays & Dynamic Programming', category: 'Data Structures & Algorithms' },
  { name: 'Trees & Graph Traversal', category: 'Data Structures & Algorithms' },
  { name: 'React', category: 'Web & Mobile Development' },
  { name: 'Node.js & Express', category: 'Web & Mobile Development' },
  { name: 'HTML5 & Responsive CSS', category: 'Web & Mobile Development' },
  { name: 'Next.js', category: 'Web & Mobile Development' },
  { name: 'React Native', category: 'Web & Mobile Development' },
  { name: 'PostgreSQL', category: 'Databases & Backend' },
  { name: 'MySQL', category: 'Databases & Backend' },
  { name: 'MongoDB', category: 'Databases & Backend' },
  { name: 'Redis Caching', category: 'Databases & Backend' },
  { name: 'RESTful API Design', category: 'Databases & Backend' },
  { name: 'Docker & Containers', category: 'Cloud & DevOps' },
  { name: 'Kubernetes', category: 'Cloud & DevOps' },
  { name: 'AWS Cloud Fundamentals', category: 'Cloud & DevOps' },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud & DevOps' },
  { name: 'Azure Cloud Fundamentals', category: 'Cloud & DevOps' },
  { name: 'Git & Version Control', category: 'Cloud & DevOps' },
  { name: 'CI/CD Pipelines (GitHub Actions)', category: 'Cloud & DevOps' },
  { name: 'Machine Learning & Deep Learning', category: 'AI & Machine Learning' },
  { name: 'PyTorch', category: 'AI & Machine Learning' },
  { name: 'TensorFlow', category: 'AI & Machine Learning' },
  { name: 'Large Language Models (LLMs) & Prompting', category: 'AI & Machine Learning' },
  { name: 'Natural Language Processing (NLP)', category: 'AI & Machine Learning' },
  { name: 'Computer Vision (OpenCV)', category: 'AI & Machine Learning' },
  { name: 'Data Analysis with Pandas & NumPy', category: 'Data Analytics & BI' },
  { name: 'Power BI & Tableau', category: 'Data Analytics & BI' },
  { name: 'SQL Querying & Reporting', category: 'Data Analytics & BI' },
  { name: 'Web Security & OWASP Top 10', category: 'Cybersecurity' },
  { name: 'Network Security Fundamentals', category: 'Cybersecurity' },
  { name: 'Cryptography Fundamentals', category: 'Cybersecurity' },
  { name: 'UI/UX Design in Figma', category: 'Design & Product' },
  { name: 'Wireframing & Prototyping', category: 'Design & Product' },
  { name: 'Product Analytics & Metrics', category: 'Design & Product' },
  { name: 'Technical Communication & Presentation', category: 'Communication & Leadership' },
  { name: 'Agile & Scrum Methodologies', category: 'Communication & Leadership' },
  { name: 'Problem Solving & Critical Thinking', category: 'Communication & Leadership' }
];
