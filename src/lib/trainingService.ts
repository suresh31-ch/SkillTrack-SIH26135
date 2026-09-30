import { LocalDbService, supabase, isSupabaseConfigured } from './supabase';
import {
  Batch,
  Course,
  CourseModule,
  Enrollment,
  Attendance,
  Certification,
  Placement,
  Profile,
  EmploymentVerification
} from '../types';

export interface TrainingDashboardStats {
  totalEnrolled: number;
  activeBatchesCount: number;
  totalBatchesCount: number;
  completedTrainingCount: number;
  certificationsCount: number;
  placementsCount: number;
  placementRate: number; // percentage
  avgAttendanceRate: number; // percentage
  avgSalary: number;
  activeCoursesCount: number;
  outcomesFunnel: Array<{ stage: string; count: number; percentage: number; color: string }>;
  batchPerformance: Array<{
    batchId: string;
    batchName: string;
    courseName: string;
    enrolled: number;
    capacity: number;
    avgProgress: number;
    avgAttendance: number;
    status: string;
  }>;
  attendanceTrend: Array<{ date: string; presentRate: number; present: number; absent: number }>;
}

export const SEED_COURSE_MODULES: Record<string, CourseModule[]> = {
  'crs-001': [
    {
      id: 'mod-101',
      title: 'Module 1: Modern Web Foundations (HTML5/CSS3/Tailwind & TS)',
      duration_hours: 120,
      description: 'Semantic markup, layout algorithms, responsive design, TypeScript type systems and compilation.',
      skills_covered: ['Tailwind CSS & Responsive UI', 'React.js & TypeScript']
    },
    {
      id: 'mod-102',
      title: 'Module 2: React 19 Frontend Architecture & State Machines',
      duration_hours: 140,
      description: 'Custom hooks, Context API, state machines, performance profiling, and Vite tooling.',
      skills_covered: ['React.js & TypeScript']
    },
    {
      id: 'mod-103',
      title: 'Module 3: Scalable Express API & PostgreSQL Data Modeling',
      duration_hours: 120,
      description: 'REST architecture, RLS security policies, relational indexing, transaction isolation.',
      skills_covered: ['Node.js & Express API', 'PostgreSQL & Database Design']
    },
    {
      id: 'mod-104',
      title: 'Module 4: Cloud Run Deployment & CI/CD Capstone',
      duration_hours: 100,
      description: 'Docker containerization, Google Cloud Run ingress, multi-tenant secrets and automated testing.',
      skills_covered: ['Cloud Infrastructure (GCP/AWS)']
    }
  ],
  'crs-002': [
    {
      id: 'mod-201',
      title: 'Module 1: High-Voltage Safety & EV Powertrain Architecture',
      duration_hours: 90,
      description: 'NFPA 70E compliance, insulated tooling, DC bus pre-charge mechanisms, emergency shutdown relays.',
      skills_covered: ['Electric Vehicle (EV) Diagnostics']
    },
    {
      id: 'mod-202',
      title: 'Module 2: Battery Management Systems (BMS) & Diagnostics',
      duration_hours: 100,
      description: 'Cell balancing, SoC/SoH estimation algorithms, thermal management loops, CAN bus sniffing.',
      skills_covered: ['Electric Vehicle (EV) Diagnostics', 'Battery Pack Assembly & Testing']
    },
    {
      id: 'mod-203',
      title: 'Module 3: Fast DC Charging & Grid Synchronization',
      duration_hours: 90,
      description: 'CCS2 / Type-2 protocols, OCPP 2.0.1 communication, harmonic distortion testing and isolation monitors.',
      skills_covered: ['EV Charging Station Commissioning', 'Solar PV Installation & Grid Tie']
    },
    {
      id: 'mod-204',
      title: 'Module 4: Field Troubleshooting & Vehicle Diagnostic Labs',
      duration_hours: 80,
      description: 'Oscilloscope signal capture, insulation resistance measurement, motor dyno testing and real vehicle repair.',
      skills_covered: ['Electric Vehicle (EV) Diagnostics']
    }
  ],
  'crs-003': [
    {
      id: 'mod-301',
      title: 'Module 1: Blueprint Reading & Precision Metrology',
      duration_hours: 80,
      description: 'GD&T symbol interpretation, vernier height gauges, bore micrometers, optical comparators.',
      skills_covered: ['CNC Machine Programming', 'Quality Assurance & Six Sigma (QA/QC)']
    },
    {
      id: 'mod-302',
      title: 'Module 2: G-Code & M-Code Multi-Axis Programming',
      duration_hours: 120,
      description: 'Manual part programming, canned drilling cycles, cutter compensation, 3-axis CNC vertical milling.',
      skills_covered: ['CNC Machine Programming']
    },
    {
      id: 'mod-303',
      title: 'Module 3: Tool Wear Monitoring & Controller Setup',
      duration_hours: 90,
      description: 'Fanuc 0i-MF controller offsets, acoustic tool wear sensors, surface roughness optimization.',
      skills_covered: ['CNC Machine Programming', 'PLC & SCADA Automation']
    },
    {
      id: 'mod-304',
      title: 'Module 4: Autonomous Robotic Machine Tending & CMM QC',
      duration_hours: 70,
      description: '6-axis cobot pick-and-place interfacing, Zeiss CMM inspection programs, First Article Inspection (FAI).',
      skills_covered: ['Industrial Robotics & Arm Calibration', 'Quality Assurance & Six Sigma (QA/QC)']
    }
  ]
};

export class TrainingService {
  private static ENROLLMENTS_KEY = 'skilltrack_enrollments_rich';
  private static BATCHES_KEY = 'skilltrack_batches_rich';
  private static COURSES_KEY = 'skilltrack_courses_rich';
  private static ATTENDANCE_KEY = 'skilltrack_attendance_rich';
  private static CERTS_KEY = 'skilltrack_certifications_rich';
  private static PLACEMENTS_KEY = 'skilltrack_placements_rich';

  private static getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private static setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }

  // 1. Batches
  static getBatches(organizationId?: string): Batch[] {
    const defaultBatches: Batch[] = [
      {
        id: 'batch-001',
        course_id: 'crs-001',
        course_name: 'Full Stack Cloud Application Engineering',
        training_center_id: 'tc-001',
        organization_id: 'org-maha-001',
        name: 'Batch 2025-Q3 (Alpha)',
        trainer_name: 'Prof. Rajesh Kulkarni',
        trainer_email: 'rajesh.kulkarni@msias.edu.in',
        start_date: '2025-07-01',
        end_date: '2025-10-31',
        capacity: 35,
        enrolled_count: 32,
        status: 'active',
        schedule: 'Mon - Fri, 09:00 AM - 01:00 PM',
        classroom: 'Software Engineering Lab 2, 3rd Floor',
        created_at: '2025-06-15'
      },
      {
        id: 'batch-002',
        course_id: 'crs-002',
        course_name: 'Electric Mobility & High-Voltage Battery Technician',
        training_center_id: 'tc-001',
        organization_id: 'org-maha-001',
        name: 'EV Tech Batch 14',
        trainer_name: 'Dr. Anand Deshpande',
        trainer_email: 'anand.deshpande@msias.edu.in',
        start_date: '2025-08-01',
        end_date: '2025-10-31',
        capacity: 30,
        enrolled_count: 28,
        status: 'active',
        schedule: 'Mon - Fri, 02:00 PM - 06:00 PM',
        classroom: 'EV High Voltage Diagnostic Bay 1',
        created_at: '2025-07-10'
      },
      {
        id: 'batch-003',
        course_id: 'crs-003',
        course_name: 'Advanced CNC Machining & Automation 4.0',
        training_center_id: 'tc-001',
        organization_id: 'org-maha-001',
        name: 'Precision CNC Batch 08',
        trainer_name: 'Er. Prakash Shinde',
        trainer_email: 'prakash.shinde@msias.edu.in',
        start_date: '2025-06-01',
        end_date: '2025-09-15',
        capacity: 25,
        enrolled_count: 25,
        status: 'completed',
        schedule: 'Mon - Sat, 08:30 AM - 12:30 PM',
        classroom: 'CNC Workshop & Machining Center',
        created_at: '2025-05-15'
      },
      {
        id: 'batch-004',
        course_id: 'crs-001',
        course_name: 'Full Stack Cloud Application Engineering',
        training_center_id: 'tc-001',
        organization_id: 'org-maha-001',
        name: 'Batch 2026-Q1 (Beta)',
        trainer_name: 'Prof. Rajesh Kulkarni',
        trainer_email: 'rajesh.kulkarni@msias.edu.in',
        start_date: '2026-09-15',
        end_date: '2027-01-15',
        capacity: 40,
        enrolled_count: 14,
        status: 'upcoming',
        schedule: 'Mon - Fri, 09:30 AM - 01:30 PM',
        classroom: 'Software Engineering Lab 1, 2nd Floor',
        created_at: '2026-08-01'
      }
    ];

    const batches = this.getStorage<Batch[]>(this.BATCHES_KEY, defaultBatches);
    if (organizationId) {
      return batches.filter(b => b.organization_id === organizationId);
    }
    return batches;
  }

  static createBatch(data: Omit<Batch, 'id' | 'created_at'>): Batch {
    const batches = this.getBatches();
    const newBatch: Batch = {
      ...data,
      id: `batch-${Date.now()}`,
      enrolled_count: data.enrolled_count || 0,
      status: data.status || 'active',
      created_at: new Date().toISOString().split('T')[0]
    };
    batches.unshift(newBatch);
    this.setStorage(this.BATCHES_KEY, batches);

    if (isSupabaseConfigured() && supabase) {
      Promise.resolve(
        supabase
          .from('batches')
          .insert({
            id: newBatch.id,
            name: newBatch.name,
            course_id: newBatch.course_id,
            training_center_id: newBatch.training_center_id,
            organization_id: newBatch.organization_id,
            start_date: newBatch.start_date,
            end_date: newBatch.end_date,
            status: newBatch.status,
            capacity: newBatch.capacity,
            enrolled_count: newBatch.enrolled_count,
            created_at: newBatch.created_at
          })
      ).catch(err => console.warn('Supabase batch insert notice:', err));
    }

    return newBatch;
  }

  static updateBatch(batchId: string, updates: Partial<Batch>): Batch | null {
    const batches = this.getBatches();
    const index = batches.findIndex(b => b.id === batchId);
    if (index === -1) return null;
    batches[index] = { ...batches[index], ...updates };
    this.setStorage(this.BATCHES_KEY, batches);
    return batches[index];
  }

  static deleteBatch(batchId: string): boolean {
    let batches = this.getBatches();
    const beforeCount = batches.length;
    batches = batches.filter(b => b.id !== batchId);
    if (batches.length !== beforeCount) {
      this.setStorage(this.BATCHES_KEY, batches);
      return true;
    }
    return false;
  }

  // 2. Courses
  static getCourses(organizationId?: string): Course[] {
    const defaultCourses: Course[] = [
      {
        id: 'crs-001',
        training_center_id: 'tc-001',
        organization_id: 'org-maha-001',
        name: 'Full Stack Cloud Application Engineering',
        description: 'Comprehensive 16-week immersive boot camp covering React 19, TypeScript, Express, PostgreSQL, and Google Cloud Run deployment with CI/CD.',
        duration: '4 Months (480 Hours)',
        category: 'Information Technology & Software',
        skills: ['React.js & TypeScript', 'Node.js & Express API', 'PostgreSQL & Database Design', 'Cloud Infrastructure (GCP/AWS)', 'Tailwind CSS & Responsive UI'],
        modules: SEED_COURSE_MODULES['crs-001'],
        status: 'active'
      },
      {
        id: 'crs-002',
        training_center_id: 'tc-001',
        organization_id: 'org-maha-001',
        name: 'Electric Mobility & High-Voltage Battery Technician',
        description: 'Diagnostic troubleshooting of BMS, motor controllers, thermal runaway prevention, and fast DC charging station integration.',
        duration: '3 Months (360 Hours)',
        category: 'Green Tech & Automotive',
        skills: ['Electric Vehicle (EV) Diagnostics', 'Solar PV Installation & Grid Tie', 'Battery Pack Assembly & Testing', 'EV Charging Station Commissioning'],
        modules: SEED_COURSE_MODULES['crs-002'],
        status: 'active'
      },
      {
        id: 'crs-003',
        training_center_id: 'tc-001',
        organization_id: 'org-maha-001',
        name: 'Advanced CNC Machining & Automation 4.0',
        description: 'Hands-on G-code generation, Fanuc controller setup, multi-axis milling, coordinate measuring machine (CMM) verification.',
        duration: '3 Months (360 Hours)',
        category: 'Industrial Automation & Manufacturing',
        skills: ['CNC Machine Programming', 'PLC & SCADA Automation', 'Industrial Robotics & Arm Calibration', 'Quality Assurance & Six Sigma (QA/QC)'],
        modules: SEED_COURSE_MODULES['crs-003'],
        status: 'active'
      }
    ];

    const courses = this.getStorage<Course[]>(this.COURSES_KEY, defaultCourses);
    if (organizationId) {
      return courses.filter(c => c.organization_id === organizationId);
    }
    return courses;
  }

  static createCourse(data: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...data,
      id: `crs-${Date.now()}`,
      status: data.status || 'active',
      modules: data.modules || [
        {
          id: `mod-${Date.now()}-1`,
          title: 'Module 1: Program Fundamentals & Principles',
          duration_hours: 90,
          description: 'Foundational theory and core concepts.',
          skills_covered: data.skills.slice(0, 2)
        },
        {
          id: `mod-${Date.now()}-2`,
          title: 'Module 2: Practical Lab & Hands-on Workshop',
          duration_hours: 120,
          description: 'Real-world project execution and tools mastery.',
          skills_covered: data.skills
        },
        {
          id: `mod-${Date.now()}-3`,
          title: 'Module 3: Capstone Project & Quality Verification',
          duration_hours: 90,
          description: 'Industry-standard assessment and certification project.',
          skills_covered: data.skills
        }
      ]
    };
    courses.unshift(newCourse);
    this.setStorage(this.COURSES_KEY, courses);
    return newCourse;
  }

  static updateCourse(courseId: string, updates: Partial<Course>): Course | null {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index === -1) return null;
    courses[index] = { ...courses[index], ...updates };
    this.setStorage(this.COURSES_KEY, courses);
    return courses[index];
  }

  // 3. Enrollments (Student Directory)
  static getEnrollments(organizationId?: string): Enrollment[] {
    const defaultEnrollments: Enrollment[] = [
      {
        id: 'enr-001',
        batch_id: 'batch-001',
        batch_name: 'Batch 2025-Q3 (Alpha)',
        course_name: 'Full Stack Cloud Application Engineering',
        candidate_id: 'prof-cand-001',
        candidate_name: 'Aarav Patil',
        candidate_email: 'aarav.patil@skilltrack.io',
        candidate_phone: '+91 98230 45678',
        candidate_district: 'Pune',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-07-01',
        completion_status: 'completed',
        progress_percentage: 100,
        modules_completed: 4,
        total_modules: 4,
        assessment_status: 'passed',
        assessment_score: 96,
        attendance_rate: 98
      },
      {
        id: 'enr-002',
        batch_id: 'batch-001',
        batch_name: 'Batch 2025-Q3 (Alpha)',
        course_name: 'Full Stack Cloud Application Engineering',
        candidate_id: 'prof-cand-002',
        candidate_name: 'Sneha Kulkarni',
        candidate_email: 'sneha.kulkarni@skilltrack.io',
        candidate_phone: '+91 98901 23456',
        candidate_district: 'Nashik',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-07-01',
        completion_status: 'completed',
        progress_percentage: 100,
        modules_completed: 4,
        total_modules: 4,
        assessment_status: 'passed',
        assessment_score: 94,
        attendance_rate: 96
      },
      {
        id: 'enr-003',
        batch_id: 'batch-002',
        batch_name: 'EV Tech Batch 14',
        course_name: 'Electric Mobility & High-Voltage Battery Technician',
        candidate_id: 'prof-cand-003',
        candidate_name: 'Rohan Gaikwad',
        candidate_email: 'rohan.gaikwad@skilltrack.io',
        candidate_phone: '+91 97654 32109',
        candidate_district: 'Chhatrapati Sambhajinagar',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-08-01',
        completion_status: 'enrolled',
        progress_percentage: 85,
        modules_completed: 3,
        total_modules: 4,
        assessment_status: 'passed',
        assessment_score: 91,
        attendance_rate: 92
      },
      {
        id: 'enr-004',
        batch_id: 'batch-001',
        batch_name: 'Batch 2025-Q3 (Alpha)',
        course_name: 'Full Stack Cloud Application Engineering',
        candidate_id: 'prof-cand-004',
        candidate_name: 'Ananya Joshi',
        candidate_email: 'ananya.joshi@skilltrack.io',
        candidate_phone: '+91 94221 87654',
        candidate_district: 'Nagpur',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-07-01',
        completion_status: 'completed',
        progress_percentage: 100,
        modules_completed: 4,
        total_modules: 4,
        assessment_status: 'passed',
        assessment_score: 98,
        attendance_rate: 95
      },
      {
        id: 'enr-005',
        batch_id: 'batch-001',
        batch_name: 'Batch 2025-Q3 (Alpha)',
        course_name: 'Full Stack Cloud Application Engineering',
        candidate_id: 'prof-cand-005',
        candidate_name: 'Tejas Shinde',
        candidate_email: 'tejas.shinde@skilltrack.io',
        candidate_phone: '+91 98199 54321',
        candidate_district: 'Thane',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-07-01',
        completion_status: 'enrolled',
        progress_percentage: 75,
        modules_completed: 3,
        total_modules: 4,
        assessment_status: 'in_progress',
        assessment_score: 82,
        attendance_rate: 89
      },
      {
        id: 'enr-006',
        batch_id: 'batch-002',
        batch_name: 'EV Tech Batch 14',
        course_name: 'Electric Mobility & High-Voltage Battery Technician',
        candidate_id: 'prof-cand-006',
        candidate_name: 'Meera Deshpande',
        candidate_email: 'meera.deshpande@skilltrack.io',
        candidate_phone: '+91 96570 12345',
        candidate_district: 'Amravati',
        avatar_url: 'https://images.unsplash.com/photo-1534751516642-a171ed2058b4?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-08-01',
        completion_status: 'enrolled',
        progress_percentage: 70,
        modules_completed: 3,
        total_modules: 4,
        assessment_status: 'in_progress',
        assessment_score: 84,
        attendance_rate: 91
      },
      {
        id: 'enr-007',
        batch_id: 'batch-003',
        batch_name: 'Precision CNC Batch 08',
        course_name: 'Advanced CNC Machining & Automation 4.0',
        candidate_id: 'prof-cand-007',
        candidate_name: 'Vikas Jadhav',
        candidate_email: 'vikas.jadhav@skilltrack.io',
        candidate_phone: '+91 93700 88123',
        candidate_district: 'Kolhapur',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-06-01',
        completion_status: 'completed',
        progress_percentage: 100,
        modules_completed: 4,
        total_modules: 4,
        assessment_status: 'passed',
        assessment_score: 95,
        attendance_rate: 97
      },
      {
        id: 'enr-008',
        batch_id: 'batch-003',
        batch_name: 'Precision CNC Batch 08',
        course_name: 'Advanced CNC Machining & Automation 4.0',
        candidate_id: 'prof-cand-008',
        candidate_name: 'Priya Nair',
        candidate_email: 'priya.nair@skilltrack.io',
        candidate_phone: '+91 95450 67890',
        candidate_district: 'Pune',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&auto=format&fit=crop&q=80',
        organization_id: 'org-maha-001',
        enrollment_date: '2025-06-01',
        completion_status: 'completed',
        progress_percentage: 100,
        modules_completed: 4,
        total_modules: 4,
        assessment_status: 'passed',
        assessment_score: 92,
        attendance_rate: 94
      }
    ];

    const enrollments = this.getStorage<Enrollment[]>(this.ENROLLMENTS_KEY, defaultEnrollments);
    if (organizationId) {
      return enrollments.filter(e => e.organization_id === organizationId);
    }
    return enrollments;
  }

  static enrollStudent(data: {
    candidate_name: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_district: string;
    batch_id: string;
    organization_id: string;
    avatar_url?: string;
  }): Enrollment {
    const batches = this.getBatches();
    const batch = batches.find(b => b.id === data.batch_id);
    const candidateId = `cand-std-${Date.now()}`;

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      batch_id: data.batch_id,
      batch_name: batch?.name || 'Assigned Batch',
      course_name: batch?.course_name || 'General Skilling Program',
      candidate_id: candidateId,
      candidate_name: data.candidate_name,
      candidate_email: data.candidate_email,
      candidate_phone: data.candidate_phone,
      candidate_district: data.candidate_district,
      avatar_url: data.avatar_url || '',
      organization_id: data.organization_id,
      enrollment_date: new Date().toISOString().split('T')[0],
      completion_status: 'enrolled',
      progress_percentage: 0,
      modules_completed: 0,
      total_modules: 4,
      assessment_status: 'pending',
      assessment_score: 0,
      attendance_rate: 0
    };

    const enrollments = this.getEnrollments();
    enrollments.unshift(newEnrollment);
    this.setStorage(this.ENROLLMENTS_KEY, enrollments);

    // Update batch enrolled count
    if (batch) {
      this.updateBatch(batch.id, { enrolled_count: (batch.enrolled_count || 0) + 1 });
    }

    return newEnrollment;
  }

  static removeEnrollment(enrollmentId: string): boolean {
    let enrollments = this.getEnrollments();
    const target = enrollments.find(e => e.id === enrollmentId);
    if (!target) return false;

    enrollments = enrollments.filter(e => e.id !== enrollmentId);
    this.setStorage(this.ENROLLMENTS_KEY, enrollments);

    // Decrement batch count
    if (target.batch_id) {
      const batches = this.getBatches();
      const batch = batches.find(b => b.id === target.batch_id);
      if (batch && (batch.enrolled_count || 0) > 0) {
        this.updateBatch(batch.id, { enrolled_count: (batch.enrolled_count || 1) - 1 });
      }
    }
    return true;
  }

  static updateEnrollment(enrollmentId: string, updates: Partial<Enrollment>): Enrollment | null {
    const enrollments = this.getEnrollments();
    const index = enrollments.findIndex(e => e.id === enrollmentId);
    if (index === -1) return null;

    enrollments[index] = { ...enrollments[index], ...updates };
    this.setStorage(this.ENROLLMENTS_KEY, enrollments);
    return enrollments[index];
  }

  // 4. Attendance
  static getAttendance(batchId?: string): Attendance[] {
    const defaultAttendance: Attendance[] = [
      { id: 'att-01', batch_id: 'batch-001', candidate_id: 'prof-cand-001', candidate_name: 'Aarav Patil', organization_id: 'org-maha-001', attendance_date: '2026-08-25', status: 'present' },
      { id: 'att-02', batch_id: 'batch-001', candidate_id: 'prof-cand-002', candidate_name: 'Sneha Kulkarni', organization_id: 'org-maha-001', attendance_date: '2026-08-25', status: 'present' },
      { id: 'att-03', batch_id: 'batch-001', candidate_id: 'prof-cand-004', candidate_name: 'Ananya Joshi', organization_id: 'org-maha-001', attendance_date: '2026-08-25', status: 'present' },
      { id: 'att-04', batch_id: 'batch-001', candidate_id: 'prof-cand-005', candidate_name: 'Tejas Shinde', organization_id: 'org-maha-001', attendance_date: '2026-08-25', status: 'absent' },

      { id: 'att-05', batch_id: 'batch-001', candidate_id: 'prof-cand-001', candidate_name: 'Aarav Patil', organization_id: 'org-maha-001', attendance_date: '2026-08-26', status: 'present' },
      { id: 'att-06', batch_id: 'batch-001', candidate_id: 'prof-cand-002', candidate_name: 'Sneha Kulkarni', organization_id: 'org-maha-001', attendance_date: '2026-08-26', status: 'present' },
      { id: 'att-07', batch_id: 'batch-001', candidate_id: 'prof-cand-004', candidate_name: 'Ananya Joshi', organization_id: 'org-maha-001', attendance_date: '2026-08-26', status: 'present' },
      { id: 'att-08', batch_id: 'batch-001', candidate_id: 'prof-cand-005', candidate_name: 'Tejas Shinde', organization_id: 'org-maha-001', attendance_date: '2026-08-26', status: 'present' },

      { id: 'att-09', batch_id: 'batch-001', candidate_id: 'prof-cand-001', candidate_name: 'Aarav Patil', organization_id: 'org-maha-001', attendance_date: '2026-08-27', status: 'present' },
      { id: 'att-10', batch_id: 'batch-001', candidate_id: 'prof-cand-002', candidate_name: 'Sneha Kulkarni', organization_id: 'org-maha-001', attendance_date: '2026-08-27', status: 'present' },
      { id: 'att-11', batch_id: 'batch-001', candidate_id: 'prof-cand-004', candidate_name: 'Ananya Joshi', organization_id: 'org-maha-001', attendance_date: '2026-08-27', status: 'leave' },
      { id: 'att-12', batch_id: 'batch-001', candidate_id: 'prof-cand-005', candidate_name: 'Tejas Shinde', organization_id: 'org-maha-001', attendance_date: '2026-08-27', status: 'present' },

      { id: 'att-13', batch_id: 'batch-002', candidate_id: 'prof-cand-003', candidate_name: 'Rohan Gaikwad', organization_id: 'org-maha-001', attendance_date: '2026-08-27', status: 'present' },
      { id: 'att-14', batch_id: 'batch-002', candidate_id: 'prof-cand-006', candidate_name: 'Meera Deshpande', organization_id: 'org-maha-001', attendance_date: '2026-08-27', status: 'present' }
    ];

    const attendance = this.getStorage<Attendance[]>(this.ATTENDANCE_KEY, defaultAttendance);
    if (batchId) {
      return attendance.filter(a => a.batch_id === batchId);
    }
    return attendance;
  }

  static markAttendance(
    batchId: string,
    candidateId: string,
    candidateName: string,
    orgId: string,
    date: string,
    status: 'present' | 'absent' | 'leave'
  ): Attendance {
    const list = this.getAttendance();
    const idx = list.findIndex(a => a.batch_id === batchId && a.candidate_id === candidateId && a.attendance_date === date);

    if (idx !== -1) {
      list[idx].status = status;
      this.setStorage(this.ATTENDANCE_KEY, list);
      return list[idx];
    } else {
      const newAtt: Attendance = {
        id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        batch_id: batchId,
        candidate_id: candidateId,
        candidate_name: candidateName,
        organization_id: orgId,
        attendance_date: date,
        status
      };
      list.push(newAtt);
      this.setStorage(this.ATTENDANCE_KEY, list);
      return newAtt;
    }
  }

  static markBulkAttendance(
    batchId: string,
    students: Array<{ id: string; name: string }>,
    orgId: string,
    date: string,
    status: 'present' | 'absent'
  ): void {
    students.forEach(s => {
      this.markAttendance(batchId, s.id, s.name, orgId, date, status);
    });
  }

  // 5. Certifications
  static getCertifications(organizationId?: string): Certification[] {
    const defaultCerts: Certification[] = [
      {
        id: 'cert-001',
        candidate_id: 'prof-cand-001',
        candidate_name: 'Aarav Patil',
        candidate_email: 'aarav.patil@skilltrack.io',
        training_center_id: 'tc-001',
        training_center_name: 'MSIAS Pune Center',
        organization_id: 'org-maha-001',
        course_id: 'crs-001',
        course_name: 'Full Stack Cloud Application Engineering',
        certificate_number: 'ST-MAHA-2025-08942',
        issue_date: '2025-11-05',
        completion_date: '2025-10-31',
        grade: 'A+',
        score: 96,
        verification_status: 'valid',
        authorized_signatory: 'Dr. Sunita Shinde, Mission Director',
        certificate_url: 'https://skilltrack.io/verify/ST-MAHA-2025-08942',
        created_at: '2025-11-05'
      },
      {
        id: 'cert-002',
        candidate_id: 'prof-cand-002',
        candidate_name: 'Sneha Kulkarni',
        candidate_email: 'sneha.kulkarni@skilltrack.io',
        training_center_id: 'tc-001',
        training_center_name: 'MSIAS Pune Center',
        organization_id: 'org-maha-001',
        course_id: 'crs-001',
        course_name: 'Full Stack Cloud Application Engineering',
        certificate_number: 'ST-MAHA-2025-08943',
        issue_date: '2025-11-05',
        completion_date: '2025-10-31',
        grade: 'A',
        score: 94,
        verification_status: 'valid',
        authorized_signatory: 'Dr. Sunita Shinde, Mission Director',
        certificate_url: 'https://skilltrack.io/verify/ST-MAHA-2025-08943',
        created_at: '2025-11-05'
      },
      {
        id: 'cert-003',
        candidate_id: 'prof-cand-004',
        candidate_name: 'Ananya Joshi',
        candidate_email: 'ananya.joshi@skilltrack.io',
        training_center_id: 'tc-001',
        training_center_name: 'MSIAS Pune Center',
        organization_id: 'org-maha-001',
        course_id: 'crs-001',
        course_name: 'Full Stack Cloud Application Engineering',
        certificate_number: 'ST-MAHA-2025-08944',
        issue_date: '2025-11-05',
        completion_date: '2025-10-31',
        grade: 'A+',
        score: 98,
        verification_status: 'valid',
        authorized_signatory: 'Dr. Sunita Shinde, Mission Director',
        certificate_url: 'https://skilltrack.io/verify/ST-MAHA-2025-08944',
        created_at: '2025-11-05'
      },
      {
        id: 'cert-004',
        candidate_id: 'prof-cand-007',
        candidate_name: 'Vikas Jadhav',
        candidate_email: 'vikas.jadhav@skilltrack.io',
        training_center_id: 'tc-001',
        training_center_name: 'MSIAS Pune Center',
        organization_id: 'org-maha-001',
        course_id: 'crs-003',
        course_name: 'Advanced CNC Machining & Automation 4.0',
        certificate_number: 'ST-MAHA-2025-04128',
        issue_date: '2025-09-20',
        completion_date: '2025-09-15',
        grade: 'A+',
        score: 95,
        verification_status: 'valid',
        authorized_signatory: 'Dr. Sunita Shinde, Mission Director',
        certificate_url: 'https://skilltrack.io/verify/ST-MAHA-2025-04128',
        created_at: '2025-09-20'
      },
      {
        id: 'cert-005',
        candidate_id: 'prof-cand-008',
        candidate_name: 'Priya Nair',
        candidate_email: 'priya.nair@skilltrack.io',
        training_center_id: 'tc-001',
        training_center_name: 'MSIAS Pune Center',
        organization_id: 'org-maha-001',
        course_id: 'crs-003',
        course_name: 'Advanced CNC Machining & Automation 4.0',
        certificate_number: 'ST-MAHA-2025-04129',
        issue_date: '2025-09-20',
        completion_date: '2025-09-15',
        grade: 'A',
        score: 92,
        verification_status: 'valid',
        authorized_signatory: 'Dr. Sunita Shinde, Mission Director',
        certificate_url: 'https://skilltrack.io/verify/ST-MAHA-2025-04129',
        created_at: '2025-09-20'
      }
    ];

    const certs = this.getStorage<Certification[]>(this.CERTS_KEY, defaultCerts);
    if (organizationId) {
      return certs.filter(c => c.organization_id === organizationId);
    }
    return certs;
  }

  static issueCertificate(data: {
    candidate_id: string;
    candidate_name: string;
    candidate_email?: string;
    course_id: string;
    course_name: string;
    organization_id: string;
    grade?: 'A+' | 'A' | 'B+' | 'B' | 'Pass';
    score?: number;
  }): Certification {
    const certNum = `ST-MAHA-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      candidate_id: data.candidate_id,
      candidate_name: data.candidate_name,
      candidate_email: data.candidate_email,
      training_center_id: 'tc-001',
      training_center_name: 'MSIAS Maharashtra State Institute of Advanced Skilling',
      organization_id: data.organization_id,
      course_id: data.course_id,
      course_name: data.course_name,
      certificate_number: certNum,
      issue_date: new Date().toISOString().split('T')[0],
      completion_date: new Date().toISOString().split('T')[0],
      grade: data.grade || 'A',
      score: data.score || 90,
      verification_status: 'valid',
      authorized_signatory: 'Dr. Sunita Shinde, Mission Director',
      certificate_url: `https://skilltrack.io/verify/${certNum}`,
      created_at: new Date().toISOString()
    };

    const certs = this.getCertifications();
    certs.unshift(newCert);
    this.setStorage(this.CERTS_KEY, certs);

    if (isSupabaseConfigured() && supabase) {
      Promise.resolve(
        supabase
          .from('certifications')
          .insert({
            id: newCert.id,
            candidate_id: newCert.candidate_id,
            organization_id: newCert.organization_id,
            course_name: newCert.course_name,
            certificate_number: newCert.certificate_number,
            issue_date: newCert.issue_date,
            grade: newCert.grade,
            verification_status: newCert.verification_status,
            created_at: newCert.created_at
          })
      ).catch(err => console.warn('Supabase cert insert notice:', err));
    }

    return newCert;
  }

  static updateCertificateStatus(certId: string, status: 'valid' | 'revoked' | 'pending'): Certification | null {
    const certs = this.getCertifications();
    const index = certs.findIndex(c => c.id === certId);
    if (index === -1) return null;
    certs[index].verification_status = status;
    this.setStorage(this.CERTS_KEY, certs);
    return certs[index];
  }

  // 6. Placements & Longitudinal Retention
  static getPlacements(organizationId?: string): Placement[] {
    const defaultPlacements: Placement[] = [
      {
        id: 'plc-001',
        candidate_id: 'prof-cand-001',
        candidate_name: 'Aarav Patil',
        training_center_id: 'tc-001',
        training_center_name: 'Maharashtra State Innovation Academy (MSIAS)',
        course_name: 'Full Stack Cloud Application Engineering',
        skills: ['React.js & TypeScript', 'Node.js & Express API', 'PostgreSQL & Database Design', 'Cloud Infrastructure (GCP/AWS)'],
        organization_id: 'org-maha-001',
        company: 'Apex Infotech Solutions',
        job_role: 'Junior Full Stack Engineer',
        salary: 540000,
        joining_date: '2025-11-15',
        offer_letter_url: 'https://skilltrack.io/offers/OFFER-APEX-8821.pdf',
        offer_letter_filename: 'Offer_Letter_Apex_Aarav_Patil.pdf',
        verification_status: 'verified',
        employment_status: 'active',
        verification_method: 'EPFO_Simulator',
        verification_notes: 'Continuous wage credit verified via EPFO Electronic Challan Return for Q4 2025 & Q1 2026.',
        retention_3m: 'verified',
        retention_6m: 'verified',
        retention_12m: 'pending',
        created_at: '2025-11-10',
        updated_at: '2026-08-20'
      },
      {
        id: 'plc-002',
        candidate_id: 'prof-cand-002',
        candidate_name: 'Sneha Kulkarni',
        training_center_id: 'tc-001',
        training_center_name: 'Maharashtra State Innovation Academy (MSIAS)',
        course_name: 'Full Stack Cloud Application Engineering',
        skills: ['React.js & TypeScript', 'Tailwind CSS & Responsive UI', 'Node.js & Express API'],
        organization_id: 'org-maha-001',
        company: 'Infosys BPM & Cloud Labs',
        job_role: 'Frontend UI Specialist',
        salary: 620000,
        joining_date: '2025-12-01',
        offer_letter_url: 'https://skilltrack.io/offers/OFFER-INFOSYS-9120.pdf',
        offer_letter_filename: 'Infosys_Offer_Sneha_Kulkarni.pdf',
        verification_status: 'verified',
        employment_status: 'active',
        verification_method: 'EPFO_Simulator',
        verification_notes: 'EPFO UAN Remittance matched employer account INFOSYS-PUNE-MIDC.',
        retention_3m: 'verified',
        retention_6m: 'verified',
        retention_12m: 'pending',
        created_at: '2025-11-20',
        updated_at: '2026-08-20'
      },
      {
        id: 'plc-003',
        candidate_id: 'prof-cand-004',
        candidate_name: 'Ananya Joshi',
        training_center_id: 'tc-001',
        training_center_name: 'Maharashtra State Innovation Academy (MSIAS)',
        course_name: 'Full Stack Cloud Application Engineering',
        skills: ['PostgreSQL & Database Design', 'Machine Learning with Scikit-Learn', 'Node.js & Express API'],
        organization_id: 'org-maha-001',
        company: 'Cognizant AI Labs',
        job_role: 'Junior Data & ML Analyst',
        salary: 580000,
        joining_date: '2025-12-01',
        offer_letter_url: 'https://skilltrack.io/offers/OFFER-COG-4431.pdf',
        offer_letter_filename: 'Cognizant_Offer_Ananya_Joshi.pdf',
        verification_status: 'verified',
        employment_status: 'active',
        verification_method: 'Bank_Salary_Credit',
        verification_notes: 'Verified via encrypted Bank Salary Credit statement.',
        retention_3m: 'verified',
        retention_6m: 'verified',
        retention_12m: 'pending',
        created_at: '2025-11-22',
        updated_at: '2026-08-20'
      },
      {
        id: 'plc-004',
        candidate_id: 'prof-cand-007',
        candidate_name: 'Vikas Jadhav',
        training_center_id: 'tc-003',
        training_center_name: 'Vidarbha Skill Innovation Academy',
        course_name: 'Advanced CNC Machining & Automation 4.0',
        skills: ['CNC Machine Programming', 'Quality Assurance & Six Sigma (QA/QC)'],
        organization_id: 'org-maha-001',
        company: 'Kalyani Advanced Precision',
        job_role: 'CNC Multi-Axis Operator',
        salary: 420000,
        joining_date: '2025-10-01',
        offer_letter_url: 'https://skilltrack.io/offers/OFFER-KALYANI-1029.pdf',
        offer_letter_filename: 'Kalyani_Joining_Vikas_Jadhav.pdf',
        verification_status: 'verified',
        employment_status: 'active',
        verification_method: 'Employer_HR_Call',
        verification_notes: 'HR Director confirmed uninterrupted active payroll tenure.',
        retention_3m: 'verified',
        retention_6m: 'verified',
        retention_12m: 'verified',
        created_at: '2025-09-25',
        updated_at: '2026-08-20'
      },
      {
        id: 'plc-005',
        candidate_id: 'prof-cand-008',
        candidate_name: 'Priya Nair',
        training_center_id: 'tc-002',
        training_center_name: 'Marathwada Center for Industrial Excellence',
        course_name: 'Electric Mobility & High-Voltage Battery Technician',
        skills: ['Electric Vehicle (EV) Diagnostics', 'Battery Pack Assembly & Testing', 'Solar PV Installation & Grid Tie'],
        organization_id: 'org-maha-001',
        company: 'Tata AutoComp Systems',
        job_role: 'Industrial Automation Trainee',
        salary: 460000,
        joining_date: '2025-10-05',
        offer_letter_url: 'https://skilltrack.io/offers/OFFER-TACO-7712.pdf',
        offer_letter_filename: 'Tata_AutoComp_Priya_Nair.pdf',
        verification_status: 'verified',
        employment_status: 'active',
        verification_method: 'EPFO_Simulator',
        verification_notes: 'EPFO Monthly Remittance Verified for 10 months continuous tenure.',
        retention_3m: 'verified',
        retention_6m: 'verified',
        retention_12m: 'pending',
        created_at: '2025-09-28',
        updated_at: '2026-08-20'
      },
      {
        id: 'plc-006',
        candidate_id: 'prof-cand-009',
        candidate_name: 'Rahul Deshmukh',
        training_center_id: 'tc-002',
        training_center_name: 'Marathwada Center for Industrial Excellence',
        course_name: 'Electric Mobility & High-Voltage Battery Technician',
        skills: ['Electric Vehicle (EV) Diagnostics', 'EV Charging Station Commissioning'],
        organization_id: 'org-maha-001',
        company: 'Mahindra Green Energy Ltd',
        job_role: 'EV Powertrain Diagnostic Engineer',
        salary: 490000,
        joining_date: '2026-01-10',
        offer_letter_url: 'https://skilltrack.io/offers/OFFER-MAHINDRA-3321.pdf',
        offer_letter_filename: 'Mahindra_Green_Rahul_Deshmukh.pdf',
        verification_status: 'in_review',
        employment_status: 'placed',
        verification_method: 'EPFO_Simulator',
        verification_notes: 'Initial 3-month wage remittance audit scheduled for next billing cycle.',
        retention_3m: 'pending',
        retention_6m: 'pending',
        retention_12m: 'pending',
        created_at: '2026-01-05',
        updated_at: '2026-08-25'
      }
    ];

    const placements = this.getStorage<Placement[]>(this.PLACEMENTS_KEY, defaultPlacements);
    if (organizationId) {
      return placements.filter(p => p.organization_id === organizationId);
    }
    return placements;
  }

  static recordPlacement(data: {
    candidate_id: string;
    candidate_name: string;
    training_center_id?: string;
    training_center_name?: string;
    course_name?: string;
    skills?: string[];
    company: string;
    job_role: string;
    salary: number;
    joining_date: string;
    organization_id: string;
    offer_letter_filename?: string;
    offer_letter_url?: string;
    verification_status?: 'unverified' | 'in_review' | 'verified' | 'flagged' | 'needs_review' | 'failed';
    employment_status?: 'active' | 'placed' | 'in_review' | 'resigned' | 'terminated';
    verification_method?: 'EPFO_Simulator' | 'Employer_HR_Call' | 'Bank_Salary_Credit' | 'Payslip_Upload' | 'Manual_Audit';
    verification_notes?: string;
  }): Placement {
    const newPlc: Placement = {
      id: `plc-${Date.now()}`,
      candidate_id: data.candidate_id,
      candidate_name: data.candidate_name,
      training_center_id: data.training_center_id || 'tc-001',
      training_center_name: data.training_center_name || 'Maharashtra State Innovation Academy (MSIAS)',
      course_name: data.course_name || 'Full Stack Cloud Application Engineering',
      skills: data.skills || ['React.js & TypeScript', 'Node.js & Express API'],
      organization_id: data.organization_id,
      company: data.company,
      job_role: data.job_role,
      salary: data.salary,
      joining_date: data.joining_date,
      offer_letter_filename: data.offer_letter_filename || `Offer_${data.company.replace(/\s+/g, '_')}_${data.candidate_name.replace(/\s+/g, '_')}.pdf`,
      offer_letter_url: data.offer_letter_url || `https://skilltrack.io/offers/OFFER-${Math.floor(1000 + Math.random() * 9000)}.pdf`,
      verification_status: data.verification_status || 'verified',
      employment_status: data.employment_status || 'active',
      verification_method: data.verification_method || 'EPFO_Simulator',
      verification_notes: data.verification_notes || 'Placement document recorded with initial verification logged in state outcome registry.',
      retention_3m: 'pending',
      retention_6m: 'pending',
      retention_12m: 'pending',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };

    const placements = this.getPlacements();
    placements.unshift(newPlc);
    this.setStorage(this.PLACEMENTS_KEY, placements);

    if (isSupabaseConfigured() && supabase) {
      Promise.resolve(
        supabase
          .from('placements')
          .insert({
            id: newPlc.id,
            candidate_id: newPlc.candidate_id,
            organization_id: newPlc.organization_id,
            company: newPlc.company,
            job_role: newPlc.job_role,
            salary: newPlc.salary,
            joining_date: newPlc.joining_date,
            verification_status: newPlc.verification_status,
            created_at: newPlc.created_at
          })
      ).catch(err => console.warn('Supabase placement insert notice:', err));
    }

    return newPlc;
  }

  static updatePlacement(placementId: string, updates: Partial<Placement>): Placement | null {
    const placements = this.getPlacements();
    const index = placements.findIndex(p => p.id === placementId);
    if (index === -1) return null;

    placements[index] = {
      ...placements[index],
      ...updates,
      updated_at: new Date().toISOString().split('T')[0]
    };
    this.setStorage(this.PLACEMENTS_KEY, placements);
    return placements[index];
  }

  static updateRetentionMilestone(
    placementId: string,
    milestone: '3m' | '6m' | '12m',
    status: 'verified' | 'pending' | 'failed' | 'needs_review' | 'simulated_epfo_verified',
    notes?: string
  ): Placement | null {
    const placements = this.getPlacements();
    const index = placements.findIndex(p => p.id === placementId);
    if (index === -1) return null;

    const key = `retention_${milestone}` as 'retention_3m' | 'retention_6m' | 'retention_12m';
    placements[index][key] = status;
    if (notes) {
      placements[index].verification_notes = `[${milestone.toUpperCase()} Milestone Update]: ${notes}`;
    }
    placements[index].updated_at = new Date().toISOString().split('T')[0];

    this.setStorage(this.PLACEMENTS_KEY, placements);
    return placements[index];
  }

  static runEpfoVerification(placementId: string): { success: boolean; placement: Placement | null; auditMessage: string } {
    const placements = this.getPlacements();
    const index = placements.findIndex(p => p.id === placementId);
    if (index === -1) {
      return { success: false, placement: null, auditMessage: 'Placement record not found.' };
    }

    const plc = placements[index];
    const uanNumber = `101${Math.floor(100000000 + Math.random() * 900000000)}`;
    const ecrReference = `ECR-MAHA-${Date.now().toString().slice(-6)}`;
    
    plc.verification_status = 'verified';
    plc.verification_method = 'EPFO_Simulator';
    plc.retention_3m = 'verified';
    plc.retention_6m = 'verified';
    plc.verification_notes = `[Simulated EPFO Validation]: Verified active UAN (${uanNumber}) wage contribution stream with Employer ${plc.company}. Electronic Challan Receipt #${ecrReference} validated.`;
    plc.updated_at = new Date().toISOString().split('T')[0];

    placements[index] = plc;
    this.setStorage(this.PLACEMENTS_KEY, placements);

    return {
      success: true,
      placement: plc,
      auditMessage: `EPFO Remittance successfully verified for ${plc.candidate_name} at ${plc.company} (UAN: ${uanNumber}).`
    };
  }

  // Simulated OCR parser for uploaded offer letters
  static simulateOcrExtraction(filename: string, candidateHint?: string): {
    extractedCompany: string;
    extractedRole: string;
    extractedSalary: number;
    extractedJoiningDate: string;
    extractedCandidateName: string;
    confidenceScore: number;
    skillsIdentified: string[];
  } {
    const nameLower = filename.toLowerCase();
    
    if (nameLower.includes('apex') || nameLower.includes('software') || nameLower.includes('dev')) {
      return {
        extractedCompany: 'Apex Infotech Solutions',
        extractedRole: 'Junior Full Stack Engineer',
        extractedSalary: 540000,
        extractedJoiningDate: '2026-09-15',
        extractedCandidateName: candidateHint || 'Aarav Patil',
        confidenceScore: 98,
        skillsIdentified: ['React.js & TypeScript', 'Node.js & Express API', 'PostgreSQL & Database Design']
      };
    } else if (nameLower.includes('infosys') || nameLower.includes('tcs') || nameLower.includes('wipro')) {
      return {
        extractedCompany: 'Infosys BPM & Cloud Labs',
        extractedRole: 'Frontend UI Specialist',
        extractedSalary: 620000,
        extractedJoiningDate: '2026-09-01',
        extractedCandidateName: candidateHint || 'Sneha Kulkarni',
        confidenceScore: 96,
        skillsIdentified: ['React.js & TypeScript', 'Tailwind CSS & Responsive UI']
      };
    } else if (nameLower.includes('tata') || nameLower.includes('ev') || nameLower.includes('auto')) {
      return {
        extractedCompany: 'Tata AutoComp Systems',
        extractedRole: 'Industrial Automation & EV Trainee',
        extractedSalary: 480000,
        extractedJoiningDate: '2026-09-20',
        extractedCandidateName: candidateHint || 'Priya Nair',
        confidenceScore: 97,
        skillsIdentified: ['Electric Vehicle (EV) Diagnostics', 'Battery Pack Assembly & Testing']
      };
    } else if (nameLower.includes('kalyani') || nameLower.includes('cnc') || nameLower.includes('precision')) {
      return {
        extractedCompany: 'Kalyani Advanced Precision',
        extractedRole: 'CNC Multi-Axis Operator',
        extractedSalary: 440000,
        extractedJoiningDate: '2026-10-01',
        extractedCandidateName: candidateHint || 'Vikas Jadhav',
        confidenceScore: 95,
        skillsIdentified: ['CNC Machine Programming', 'Quality Assurance & Six Sigma (QA/QC)']
      };
    }

    return {
      extractedCompany: 'Cognizant AI Labs',
      extractedRole: 'Associate Technical Specialist',
      extractedSalary: 520000,
      extractedJoiningDate: '2026-09-10',
      extractedCandidateName: candidateHint || 'Aarav Patil',
      confidenceScore: 94,
      skillsIdentified: ['React.js & TypeScript', 'Cloud Infrastructure (GCP/AWS)']
    };
  }

  // 7. Aggregated Metrics
  static getTrainingStats(organizationId?: string): TrainingDashboardStats {
    const enrollments = this.getEnrollments(organizationId);
    const batches = this.getBatches(organizationId);
    const courses = this.getCourses(organizationId);
    const certs = this.getCertifications(organizationId);
    const placements = this.getPlacements(organizationId);
    const attendance = this.getAttendance();

    const totalEnrolled = enrollments.length;
    const completedTrainingCount = enrollments.filter(e => e.completion_status === 'completed').length;
    const activeBatches = batches.filter(b => b.status === 'active');
    const placementsCount = placements.length;
    const placementRate = completedTrainingCount > 0 ? Math.round((placementsCount / completedTrainingCount) * 100) : 85;

    // Average attendance
    const avgAttendanceRate = enrollments.length > 0
      ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.attendance_rate || 90), 0) / enrollments.length)
      : 94;

    // Average salary
    const avgSalary = placements.length > 0
      ? Math.round(placements.reduce((acc, curr) => acc + curr.salary, 0) / placements.length)
      : 524000;

    // Outcomes funnel
    const inTrainingCount = enrollments.filter(e => e.completion_status === 'enrolled').length;
    const outcomesFunnel = [
      { stage: 'Enrolled Trainees', count: totalEnrolled, percentage: 100, color: '#3b82f6' },
      { stage: 'In Active Training', count: inTrainingCount, percentage: totalEnrolled > 0 ? Math.round((inTrainingCount / totalEnrolled) * 100) : 0, color: '#6366f1' },
      { stage: 'Graduated / Completed', count: completedTrainingCount, percentage: totalEnrolled > 0 ? Math.round((completedTrainingCount / totalEnrolled) * 100) : 0, color: '#8b5cf6' },
      { stage: 'Issued Certification', count: certs.length, percentage: totalEnrolled > 0 ? Math.round((certs.length / totalEnrolled) * 100) : 0, color: '#a855f7' },
      { stage: 'Verified Corporate Placement', count: placementsCount, percentage: totalEnrolled > 0 ? Math.round((placementsCount / totalEnrolled) * 100) : 0, color: '#10b981' }
    ];

    // Batch performance list
    const batchPerformance = batches.map(b => {
      const batchEnrollments = enrollments.filter(e => e.batch_id === b.id);
      const avgProg = batchEnrollments.length > 0
        ? Math.round(batchEnrollments.reduce((acc, e) => acc + e.progress_percentage, 0) / batchEnrollments.length)
        : 0;
      const avgAtt = batchEnrollments.length > 0
        ? Math.round(batchEnrollments.reduce((acc, e) => acc + (e.attendance_rate || 90), 0) / batchEnrollments.length)
        : 90;

      return {
        batchId: b.id,
        batchName: b.name,
        courseName: b.course_name || 'Vocational Tech Program',
        enrolled: batchEnrollments.length || b.enrolled_count || 0,
        capacity: b.capacity,
        avgProgress: avgProg,
        avgAttendance: avgAtt,
        status: b.status || 'active'
      };
    });

    // Attendance trend
    const attendanceTrend = [
      { date: '21 Aug', presentRate: 96, present: 32, absent: 1 },
      { date: '22 Aug', presentRate: 94, present: 31, absent: 2 },
      { date: '23 Aug', presentRate: 97, present: 32, absent: 1 },
      { date: '24 Aug', presentRate: 91, present: 30, absent: 3 },
      { date: '25 Aug', presentRate: 94, present: 31, absent: 2 },
      { date: '26 Aug', presentRate: 97, present: 32, absent: 1 },
      { date: '27 Aug', presentRate: 94, present: 31, absent: 2 }
    ];

    return {
      totalEnrolled,
      activeBatchesCount: activeBatches.length,
      totalBatchesCount: batches.length,
      completedTrainingCount,
      certificationsCount: certs.length,
      placementsCount,
      placementRate,
      avgAttendanceRate,
      avgSalary,
      activeCoursesCount: courses.length,
      outcomesFunnel,
      batchPerformance,
      attendanceTrend
    };
  }
}
