export type UserRole = 'candidate' | 'recruiter' | 'training_center' | 'organization_admin';

export type OrganizationType = 'Government Program' | 'Corporate' | 'Skilling NGO' | 'Educational Trust' | 'Vocational Board';
export type SubscriptionPlan = 'Free' | 'Pro' | 'Enterprise' | 'Government Tier';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  logo_url?: string;
  contact_email: string;
  state: string;
  district?: string;
  location: string;
  subscription_plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'trial';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  organization_id: string;
  district?: string;
  avatar_url?: string;
  email_verified?: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalAuthCredential {
  id: string; // auth_user_id
  email: string;
  password_hash: string;
  salt: string;
  email_verified: boolean;
  verification_token?: string;
  verification_sent_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface CandidateProfile {
  id: string;
  profile_id: string;
  organization_id: string;
  education: string;
  degree: string;
  graduation_year: number;
  experience_years: number;
  employment_status: 'unemployed' | 'in_training' | 'placed' | 'verified_employed' | 'seeking_upgrade';
  target_job: string;
  readiness_score: number; // 0-100
  profile_completion: number; // 0-100
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
}

export interface JobRole {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_name?: string;
  avg_salary_lpa?: number;
  created_at?: string;
  required_skills?: JobRoleSkill[];
}

export interface JobRoleSkill {
  id: string;
  job_role_id: string;
  skill_id: string;
  skill?: Skill;
  required_proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  created_at?: string;
}

export type SkillGapStatus = 'READY' | 'IMPROVE' | 'MISSING';
export type SkillGapSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'OPTIMAL';

export interface SkillGapItem {
  skill_id: string;
  skill_name: string;
  skill_category: string;
  required_proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  candidate_proficiency: 'None' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  status: SkillGapStatus;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  severity: SkillGapSeverity;
  verified: boolean;
  gap_levels: number;
  description?: string;
  roadmap_topic_count?: number;
}

export interface SkillGapAnalysisResult {
  target_job: string;
  job_role_id: string;
  job_description?: string;
  category?: string;
  readiness_score: number; // 0-100 deterministic
  ready_count: number;
  improve_count: number;
  missing_count: number;
  verified_count: number;
  total_required: number;
  items: SkillGapItem[];
  top_missing_skill?: SkillGapItem;
  top_improve_skill?: SkillGapItem;
  category_breakdown: Record<string, { total: number; ready: number; score: number }>;
}

export interface RoadmapItem {
  id: string;
  roadmap_id?: string;
  skill_id: string;
  skill_name?: string;
  topic: string;
  description: string;
  order_index: number;
  estimated_time: string;
  resource_type: 'Interactive Lab' | 'Video Tutorial' | 'Documentation' | 'Hands-on Project' | 'Code Practice';
  practice_requirement: string;
  assessment_ready: boolean;
  completed?: boolean;
}

export interface LearningRoadmapSkill {
  skill_id: string;
  skill_name: string;
  category: string;
  current_proficiency: string;
  target_proficiency: string;
  status: SkillGapStatus;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  items: RoadmapItem[];
  progress_percentage: number;
  completed_items: number;
  total_items: number;
}

export interface CandidateRoadmapProgress {
  id: string;
  candidate_id: string;
  roadmap_item_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  completed?: boolean;
  completed_at?: string;
}

export interface CandidateSkill {
  id: string;
  candidate_id: string;
  skill_id: string;
  skill?: Skill;
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified: boolean;
  verification_source?: string;
  created_at: string;
}

export interface Job {
  id: string;
  recruiter_id: string;
  organization_id: string;
  company_name: string;
  title: string;
  description: string;
  location: string;
  job_category?: string;
  employment_type?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote / Hybrid';
  experience_required: number;
  education_required: string;
  salary_min: number;
  salary_max: number;
  status: 'open' | 'closed' | 'paused' | 'draft';
  required_skills?: JobRequiredSkill[];
  skills_required?: string[];
  created_at: string;
  updated_at: string;
}

export interface JobRequiredSkill {
  id: string;
  job_id: string;
  skill_id: string;
  skill_name?: string;
  required_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  is_required: boolean;
}

export type ApplicationStatus = 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';

export interface Application {
  id: string;
  candidate_id: string;
  job_id: string;
  recruiter_id: string;
  organization_id: string;
  skill_match_score: number;
  readiness_score: number;
  overall_match_score: number;
  status: ApplicationStatus;
  recruiter_notes?: string;
  interview_date?: string;
  candidate?: {
    full_name: string;
    email: string;
    phone?: string;
    target_job?: string;
    readiness_score?: number;
    district?: string;
    avatar_url?: string;
    education?: string;
    degree?: string;
    experience_years?: number;
  };
  job?: {
    title: string;
    company_name: string;
    location: string;
    employment_type?: string;
  };
  applied_at: string;
  updated_at: string;
}

export interface CandidateProjectRecord {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
}

export interface CandidateExperienceRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | 'Present';
  description: string;
}

export interface CandidateEducationRecord {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  graduation_year: number;
  grade_or_gpa?: string;
}

export interface CandidateCertRecord {
  id: string;
  name: string;
  issuing_org: string;
  issue_date: string;
  credential_id: string;
  verification_url?: string;
  verified: boolean;
}

export interface RecruiterCandidateDetail {
  id: string;
  profile_id: string;
  full_name: string;
  email: string;
  phone: string;
  district: string;
  state: string;
  avatar_url?: string;
  headline: string;
  bio: string;
  target_job: string;
  readiness_score: number;
  experience_years: number;
  employment_status: string;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    verified: boolean;
    verification_source?: string;
  }>;
  education: CandidateEducationRecord[];
  experience: CandidateExperienceRecord[];
  certifications: CandidateCertRecord[];
  projects: CandidateProjectRecord[];
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface TrainingCenter {
  id: string;
  organization_id: string;
  name: string;
  district: string;
  taluka: string;
  address: string;
  contact_email: string;
  capacity?: number;
  placement_rate?: number;
  status: 'active' | 'audit_pending' | 'suspended';
  created_at: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration_hours: number;
  description: string;
  skills_covered: string[];
}

export interface Course {
  id: string;
  training_center_id: string;
  organization_id: string;
  name: string;
  description: string;
  duration: string; // e.g. "3 Months"
  skills: string[];
  modules?: CourseModule[];
  category?: string;
  status: 'active' | 'draft' | 'archived';
}

export interface Batch {
  id: string;
  course_id: string;
  course_name?: string;
  training_center_id: string;
  organization_id: string;
  name: string;
  trainer_name?: string;
  trainer_email?: string;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled_count?: number;
  status?: 'active' | 'upcoming' | 'completed' | 'paused';
  schedule?: string;
  classroom?: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  batch_id: string;
  batch_name?: string;
  course_name?: string;
  candidate_id: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_phone?: string;
  candidate_district?: string;
  avatar_url?: string;
  organization_id: string;
  enrollment_date: string;
  completion_status: 'enrolled' | 'completed' | 'dropped';
  progress_percentage: number;
  modules_completed?: number;
  total_modules?: number;
  assessment_status?: 'pending' | 'in_progress' | 'passed' | 'failed';
  assessment_score?: number;
  attendance_rate?: number;
}

export interface Attendance {
  id: string;
  batch_id: string;
  candidate_id: string;
  candidate_name?: string;
  organization_id: string;
  attendance_date: string;
  status: 'present' | 'absent' | 'leave';
}

export interface Certification {
  id: string;
  candidate_id: string;
  candidate_name?: string;
  candidate_email?: string;
  training_center_id: string;
  training_center_name?: string;
  organization_id: string;
  course_id: string;
  course_name?: string;
  certificate_number: string;
  issue_date: string;
  completion_date?: string;
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'Pass';
  score?: number;
  verification_status: 'valid' | 'revoked' | 'pending';
  certificate_url?: string;
  authorized_signatory?: string;
  created_at: string;
}

export interface Assessment {
  id: string;
  organization_id: string;
  title: string;
  skill_id: string;
  skill_name?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
  }>;
  created_at: string;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
  assessment_title?: string;
  candidate_id: string;
  organization_id?: string;
  score: number;
  max_score?: number;
  percentage: number;
  passed?: boolean;
  completed_at: string;
}

export interface Placement {
  id: string;
  candidate_id: string;
  candidate_name?: string;
  training_center_id: string;
  training_center_name?: string;
  course_name?: string;
  skills?: string[];
  organization_id: string;
  company: string;
  job_role: string;
  salary: number; // Annual in INR
  joining_date: string;
  offer_letter_url?: string;
  offer_letter_filename?: string;
  verification_status: 'unverified' | 'in_review' | 'verified' | 'flagged' | 'needs_review' | 'failed';
  employment_status: 'active' | 'placed' | 'in_review' | 'resigned' | 'terminated';
  verification_method?: 'EPFO_Simulator' | 'Employer_HR_Call' | 'Bank_Salary_Credit' | 'Payslip_Upload' | 'Manual_Audit';
  verification_notes?: string;
  retention_3m?: 'verified' | 'pending' | 'failed' | 'needs_review' | 'simulated_epfo_verified';
  retention_6m?: 'verified' | 'pending' | 'failed' | 'needs_review' | 'simulated_epfo_verified';
  retention_12m?: 'verified' | 'pending' | 'failed' | 'needs_review' | 'simulated_epfo_verified';
  created_at: string;
  updated_at: string;
}

export type VerificationPeriod = '3_month' | '6_month' | '12_month';

export interface EmploymentVerification {
  id: string;
  placement_id: string;
  candidate_id: string;
  candidate_name?: string;
  organization_id: string;
  verification_period: VerificationPeriod;
  status: 'verified' | 'pending' | 'failed' | 'needs_review' | 'simulated_epfo_verified';
  verification_method: 'EPFO_Simulator' | 'Employer_HR_Call' | 'Bank_Salary_Credit' | 'Candidate_Self_Declaration' | 'Payslip_Upload';
  verified_at: string;
  notes?: string;
}

export interface LearningRoadmap {
  id: string;
  candidate_id: string;
  organization_id: string;
  target_job: string;
  generated_by: 'ai_engine' | 'counselor';
  roadmap_data: {
    title: string;
    estimated_weeks: number;
    steps: Array<{
      step_number: number;
      title: string;
      description: string;
      milestone_skill: string;
      duration: string;
      status: 'pending' | 'in_progress' | 'completed';
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface LearningProgress {
  id: string;
  roadmap_id: string;
  candidate_id: string;
  skill_id: string;
  progress_percentage: number;
  completed: boolean;
  updated_at: string;
}

export interface DistrictAnalytics {
  id: string;
  organization_id: string;
  district: string;
  state: string;
  total_candidates: number;
  trained_count: number;
  placed_count: number;
  retention_rate_6m: number; // percentage
  top_skill_demanded: string;
  skill_gap_index: number; // 0 - 100
  enrolled?: number;
  trained?: number;
  placed?: number;
  placement_rate?: number;
  average_salary?: number;
  updated_at: string;
}

export interface SkillDemand {
  id: string;
  organization_id: string;
  skill_name: string;
  demand_score: number; // 0-100
  job_postings_count: number;
  avg_salary: number;
  growth_rate: number;
}

export interface AnomalyAlert {
  id: string;
  organization_id: string;
  training_center_id?: string;
  training_center_name?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detected_pattern: string; // e.g. "Ghost Enrollment / Abnormal 100% Placement in 2 Days"
  reason?: string;
  type?: string;
  entity_name?: string;
  entity_id?: string;
  rule_code?: string;
  status: 'open' | 'investigating' | 'resolved' | 'new' | 'under_review';
  resolution_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
}

export interface SkillSupplyDemandItem {
  id: string;
  skill_name: string;
  category: string;
  available_candidates: number; // supply
  industry_demand: number; // demand seats / job postings
  gap: number; // demand - available_candidates
  gap_percentage: number;
  classification: 'critical_shortage' | 'moderate_shortage' | 'balanced' | 'surplus';
  avg_salary: number; // INR
  growth_rate: number; // YoY %
  top_employers: string[];
}

export interface TrainingCenterPerformanceMetric {
  id: string;
  name: string;
  district: string;
  taluka?: string;
  contact_email?: string;
  enrolled: number;
  trained: number;
  completion_rate: number; // %
  certified: number;
  certification_rate: number; // %
  placed: number;
  placement_rate: number; // %
  retention_3m: number; // %
  retention_6m: number; // %
  retention_12m: number; // %
  avg_salary: number; // INR
  compliance_score: number; // 0-100
  audit_status: 'Compliant' | 'Audit Pending' | 'Under Review' | 'Flagged';
}

export interface EmploymentOutcomeMetrics {
  total_placed: number;
  retention_3m_count: number;
  retention_3m_rate: number;
  retention_6m_count: number;
  retention_6m_rate: number;
  retention_12m_count: number;
  retention_12m_rate: number;
  active_employed_count: number;
  resigned_count: number;
  attrition_rate: number;
  epfo_verified_rate: number;
  avg_initial_salary: number;
  avg_current_salary: number;
  wage_growth_rate: number;
}

export interface AdminAnalyticsKPIs {
  total_candidates: number;
  candidates_trained: number;
  candidates_certified: number;
  candidates_placed: number;
  placement_rate: number; // %
  retention_3m_rate: number; // %
  retention_6m_rate: number; // %
  retention_12m_rate: number; // %
  avg_readiness_score: number; // 0-100
  avg_skill_gap_index: number; // 0-100
}

export interface ReportConfig {
  report_type: 'executive_summary' | 'district_matrix' | 'skill_supply_demand' | 'training_centers' | 'employment_retention' | 'fraud_anomalies';
  district_filter: string;
  training_center_filter: string;
  skill_category_filter: string;
  time_period: 'last_30_days' | 'last_quarter' | 'fy_2025_26' | 'all_time';
  format: 'csv' | 'json';
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}
