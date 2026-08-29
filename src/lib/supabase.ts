import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Organization,
  Profile,
  CandidateProfile,
  Skill,
  JobRole,
  JobRoleSkill,
  RoadmapItem,
  CandidateRoadmapProgress,
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
  AnomalyAlert,
  UserRole
} from '../types';
import {
  SEED_ORGANIZATIONS,
  SEED_PROFILES,
  SEED_CANDIDATE_PROFILES,
  SEED_SKILLS,
  SEED_CANDIDATE_SKILLS,
  SEED_JOB_ROLES,
  SEED_JOB_ROLE_SKILLS,
  SEED_ROADMAP_ITEMS,
  SEED_CANDIDATE_ROADMAP_PROGRESS,
  SEED_JOBS,
  SEED_APPLICATIONS,
  SEED_TRAINING_CENTERS,
  SEED_COURSES,
  SEED_BATCHES,
  SEED_ENROLLMENTS,
  SEED_ATTENDANCE,
  SEED_CERTIFICATIONS,
  SEED_ASSESSMENTS,
  SEED_ASSESSMENT_RESULTS,
  SEED_PLACEMENTS,
  SEED_EMPLOYMENT_VERIFICATIONS,
  SEED_DISTRICT_ANALYTICS,
  SEED_SKILL_DEMAND,
  SEED_ANOMALIES
} from './mockData';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================================
// LOCAL STORAGE & PERSISTENT POSTGRESQL-COMPATIBLE ENGINE
// Ensures full functionality out of the box with zero runtime breaks
// =========================================================================

const STORAGE_KEYS = {
  ORGANIZATIONS: 'st_db_organizations_v1',
  PROFILES: 'st_db_profiles_v1',
  CANDIDATE_PROFILES: 'st_db_candidate_profiles_v1',
  SKILLS: 'st_db_skills_v1',
  CANDIDATE_SKILLS: 'st_db_candidate_skills_v1',
  JOBS: 'st_db_jobs_v1',
  APPLICATIONS: 'st_db_applications_v1',
  TRAINING_CENTERS: 'st_db_training_centers_v1',
  COURSES: 'st_db_courses_v1',
  BATCHES: 'st_db_batches_v1',
  ENROLLMENTS: 'st_db_enrollments_v1',
  ATTENDANCE: 'st_db_attendance_v1',
  CERTIFICATIONS: 'st_db_certifications_v1',
  ASSESSMENTS: 'st_db_assessments_v1',
  ASSESSMENT_RESULTS: 'st_db_assessment_results_v1',
  PLACEMENTS: 'st_db_placements_v1',
  EMPLOYMENT_VERIFICATIONS: 'st_db_employment_verifications_v1',
  DISTRICT_ANALYTICS: 'st_db_district_analytics_v1',
  SKILL_DEMAND: 'st_db_skill_demand_v1',
  ANOMALIES: 'st_db_anomalies_v1',
  JOB_ROLES: 'st_db_job_roles_v1',
  JOB_ROLE_SKILLS: 'st_db_job_role_skills_v1',
  ROADMAP_ITEMS: 'st_db_roadmap_items_v1',
  CANDIDATE_ROADMAP_PROGRESS: 'st_db_candidate_roadmap_progress_v1',
  AUTH_SESSION: 'st_auth_session_v1'
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

export class LocalDbService {
  static getOrganizations(): Organization[] {
    return getStorage<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, SEED_ORGANIZATIONS);
  }

  static getOrganization(id: string): Organization | undefined {
    return this.getOrganizations().find(org => org.id === id);
  }

  static addOrganization(org: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Organization {
    const orgs = this.getOrganizations();
    const newOrg: Organization = {
      ...org,
      id: `org-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orgs.push(newOrg);
    setStorage(STORAGE_KEYS.ORGANIZATIONS, orgs);
    return newOrg;
  }

  static getProfiles(organizationId?: string): Profile[] {
    const profiles = getStorage<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    if (organizationId) {
      return profiles.filter(p => p.organization_id === organizationId);
    }
    return profiles;
  }

  static getProfileByAuthId(authUserId: string): Profile | undefined {
    return this.getProfiles().find(p => p.auth_user_id === authUserId);
  }

  static getProfileByEmail(email: string): Profile | undefined {
    return this.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  static createProfile(data: {
    auth_user_id: string;
    full_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    organization_id: string;
    district?: string;
  }): Profile {
    const profiles = this.getProfiles();
    const newProfile: Profile = {
      id: `prof-${Date.now()}`,
      auth_user_id: data.auth_user_id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      organization_id: data.organization_id,
      district: data.district || 'Pune',
      avatar_url: `https://images.unsplash.com/photo-${1534528741775 + (profiles.length % 5)}?w=128&auto=format&fit=crop&q=80`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    setStorage(STORAGE_KEYS.PROFILES, profiles);

    // If candidate, create candidate profile entry
    if (data.role === 'candidate') {
      const cProfiles = getStorage<CandidateProfile[]>(STORAGE_KEYS.CANDIDATE_PROFILES, SEED_CANDIDATE_PROFILES);
      const newCProfile: CandidateProfile = {
        id: `cand-prof-${Date.now()}`,
        profile_id: newProfile.id,
        organization_id: data.organization_id,
        education: 'Bachelor of Technology (B.Tech)',
        degree: 'Engineering / Science',
        graduation_year: 2025,
        experience_years: 0,
        employment_status: 'in_training',
        target_job: 'Software / Automation Engineer',
        readiness_score: 70,
        profile_completion: 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      cProfiles.push(newCProfile);
      setStorage(STORAGE_KEYS.CANDIDATE_PROFILES, cProfiles);
    }

    return newProfile;
  }

  static updateProfile(profileId: string, updates: Partial<Profile>): Profile | null {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profileId);
    if (index === -1) return null;
    profiles[index] = { ...profiles[index], ...updates, updated_at: new Date().toISOString() };
    setStorage(STORAGE_KEYS.PROFILES, profiles);
    return profiles[index];
  }

  static getCandidateProfile(profileId: string): CandidateProfile | undefined {
    const cProfiles = getStorage<CandidateProfile[]>(STORAGE_KEYS.CANDIDATE_PROFILES, SEED_CANDIDATE_PROFILES);
    return cProfiles.find(cp => cp.profile_id === profileId);
  }

  static calculateProfileCompletion(profileId: string): number {
    const p = this.getProfiles().find(pr => pr.id === profileId);
    const cp = this.getCandidateProfile(profileId);
    const skills = this.getCandidateSkills(profileId);

    let score = 0;
    // Core Profile (40%)
    if (p?.full_name?.trim()) score += 8;
    if (p?.email?.trim()) score += 8;
    if (p?.phone?.trim()) score += 8;
    if (p?.district?.trim()) score += 8;
    if (p?.avatar_url?.trim()) score += 8;

    // Academic & Career (40%)
    if (cp?.education?.trim()) score += 8;
    if (cp?.degree?.trim()) score += 8;
    if (cp?.graduation_year && cp.graduation_year > 1990) score += 8;
    if (cp?.target_job?.trim()) score += 8;
    if (cp?.employment_status?.trim()) score += 8;

    // Skills (20%)
    if (skills.length >= 1) score += 10;
    if (skills.length >= 3) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  static updateCandidateProfile(profileId: string, updates: Partial<CandidateProfile>): CandidateProfile | null {
    const cProfiles = getStorage<CandidateProfile[]>(STORAGE_KEYS.CANDIDATE_PROFILES, SEED_CANDIDATE_PROFILES);
    const index = cProfiles.findIndex(cp => cp.profile_id === profileId);
    if (index === -1) return null;
    
    cProfiles[index] = { ...cProfiles[index], ...updates, updated_at: new Date().toISOString() };
    
    // Automatically recalculate profile completion
    const calculatedCompletion = this.calculateProfileCompletion(profileId);
    cProfiles[index].profile_completion = calculatedCompletion;

    setStorage(STORAGE_KEYS.CANDIDATE_PROFILES, cProfiles);
    return cProfiles[index];
  }

  static getSkills(): typeof SEED_SKILLS {
    return getStorage<typeof SEED_SKILLS>(STORAGE_KEYS.SKILLS, SEED_SKILLS);
  }

  static getCandidateSkills(candidateProfileId: string): typeof SEED_CANDIDATE_SKILLS {
    const candidateSkills = getStorage<typeof SEED_CANDIDATE_SKILLS>(STORAGE_KEYS.CANDIDATE_SKILLS, SEED_CANDIDATE_SKILLS);
    const skills = this.getSkills();
    return candidateSkills
      .filter(cs => cs.candidate_id === candidateProfileId)
      .map(cs => ({
        ...cs,
        skill: skills.find(s => s.id === cs.skill_id)
      }));
  }

  static addCandidateSkill(candidateProfileId: string, skillId: string, level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'): void {
    const list = getStorage<typeof SEED_CANDIDATE_SKILLS>(STORAGE_KEYS.CANDIDATE_SKILLS, SEED_CANDIDATE_SKILLS);
    const existing = list.find(s => s.candidate_id === candidateProfileId && s.skill_id === skillId);
    if (existing) {
      existing.proficiency_level = level;
    } else {
      list.push({
        id: `cs-${Date.now()}`,
        candidate_id: candidateProfileId,
        skill_id: skillId,
        proficiency_level: level,
        verified: false,
        created_at: new Date().toISOString()
      });
    }
    setStorage(STORAGE_KEYS.CANDIDATE_SKILLS, list);

    // Recalculate profile completion
    const completion = this.calculateProfileCompletion(candidateProfileId);
    const cProfiles = getStorage<CandidateProfile[]>(STORAGE_KEYS.CANDIDATE_PROFILES, SEED_CANDIDATE_PROFILES);
    const idx = cProfiles.findIndex(cp => cp.profile_id === candidateProfileId);
    if (idx !== -1) {
      cProfiles[idx].profile_completion = completion;
      setStorage(STORAGE_KEYS.CANDIDATE_PROFILES, cProfiles);
    }
  }

  static updateCandidateSkill(candidateSkillId: string, level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'): void {
    const list = getStorage<typeof SEED_CANDIDATE_SKILLS>(STORAGE_KEYS.CANDIDATE_SKILLS, SEED_CANDIDATE_SKILLS);
    const item = list.find(cs => cs.id === candidateSkillId);
    if (item) {
      item.proficiency_level = level;
      setStorage(STORAGE_KEYS.CANDIDATE_SKILLS, list);
    }
  }

  static removeCandidateSkill(candidateSkillId: string, candidateProfileId?: string): void {
    let list = getStorage<typeof SEED_CANDIDATE_SKILLS>(STORAGE_KEYS.CANDIDATE_SKILLS, SEED_CANDIDATE_SKILLS);
    const item = list.find(cs => cs.id === candidateSkillId);
    const profileId = candidateProfileId || item?.candidate_id;
    
    list = list.filter(cs => cs.id !== candidateSkillId);
    setStorage(STORAGE_KEYS.CANDIDATE_SKILLS, list);

    if (profileId) {
      const completion = this.calculateProfileCompletion(profileId);
      const cProfiles = getStorage<CandidateProfile[]>(STORAGE_KEYS.CANDIDATE_PROFILES, SEED_CANDIDATE_PROFILES);
      const idx = cProfiles.findIndex(cp => cp.profile_id === profileId);
      if (idx !== -1) {
        cProfiles[idx].profile_completion = completion;
        setStorage(STORAGE_KEYS.CANDIDATE_PROFILES, cProfiles);
      }
    }
  }

  // =========================================================================
  // JOB ROLES, SKILL REQUIREMENTS & ROADMAPS
  // =========================================================================

  static getJobRoles(): JobRole[] {
    return getStorage<JobRole[]>(STORAGE_KEYS.JOB_ROLES, SEED_JOB_ROLES);
  }

  static getJobRoleById(idOrName: string): JobRole | undefined {
    const roles = this.getJobRoles();
    return roles.find(r => r.id === idOrName || r.name.toLowerCase() === idOrName.toLowerCase());
  }

  static getJobRoleSkills(jobRoleId?: string): JobRoleSkill[] {
    const all = getStorage<JobRoleSkill[]>(STORAGE_KEYS.JOB_ROLE_SKILLS, SEED_JOB_ROLE_SKILLS);
    const skills = this.getSkills();
    const mapped = all.map(jrs => ({
      ...jrs,
      skill: skills.find(s => s.id === jrs.skill_id)
    }));
    if (jobRoleId) {
      return mapped.filter(jrs => jrs.job_role_id === jobRoleId);
    }
    return mapped;
  }

  static getRoadmapItems(skillId?: string): RoadmapItem[] {
    const all = getStorage<RoadmapItem[]>(STORAGE_KEYS.ROADMAP_ITEMS, SEED_ROADMAP_ITEMS);
    const skills = this.getSkills();
    const mapped = all.map(item => ({
      ...item,
      skill_name: skills.find(s => s.id === item.skill_id)?.name
    }));
    if (skillId) {
      return mapped.filter(item => item.skill_id === skillId);
    }
    return mapped;
  }

  static getCandidateRoadmapProgress(candidateId: string): CandidateRoadmapProgress[] {
    const all = getStorage<CandidateRoadmapProgress[]>(STORAGE_KEYS.CANDIDATE_ROADMAP_PROGRESS, SEED_CANDIDATE_ROADMAP_PROGRESS);
    return all.filter(p => p.candidate_id === candidateId);
  }

  static toggleRoadmapProgress(candidateId: string, roadmapItemId: string, completed: boolean): CandidateRoadmapProgress[] {
    let all = getStorage<CandidateRoadmapProgress[]>(STORAGE_KEYS.CANDIDATE_ROADMAP_PROGRESS, SEED_CANDIDATE_ROADMAP_PROGRESS);
    if (completed) {
      const existing = all.find(p => p.candidate_id === candidateId && p.roadmap_item_id === roadmapItemId);
      if (!existing) {
        all.push({
          id: `crp-${Date.now()}`,
          candidate_id: candidateId,
          roadmap_item_id: roadmapItemId,
          status: 'completed',
          completed_at: new Date().toISOString()
        });
      }
    } else {
      all = all.filter(p => !(p.candidate_id === candidateId && p.roadmap_item_id === roadmapItemId));
    }
    setStorage(STORAGE_KEYS.CANDIDATE_ROADMAP_PROGRESS, all);
    return all.filter(p => p.candidate_id === candidateId);
  }

  static getJobs(organizationId?: string): Job[] {
    const jobs = getStorage<Job[]>(STORAGE_KEYS.JOBS, SEED_JOBS);
    if (organizationId) {
      return jobs.filter(j => j.organization_id === organizationId);
    }
    return jobs;
  }

  static createJob(data: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...data,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    jobs.unshift(newJob);
    setStorage(STORAGE_KEYS.JOBS, jobs);
    return newJob;
  }

  static getApplications(organizationId?: string): Application[] {
    const apps = getStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    if (organizationId) {
      return apps.filter(a => a.organization_id === organizationId);
    }
    return apps;
  }

  static getCandidateApplications(candidateProfileId: string): Application[] {
    const apps = this.getApplications();
    return apps.filter(a => a.candidate_id === candidateProfileId);
  }

  static getRecruiterApplications(recruiterProfileId: string): Application[] {
    const apps = this.getApplications();
    return apps.filter(a => a.recruiter_id === recruiterProfileId);
  }

  static applyToJob(candidateProfile: Profile, job: Job): Application {
    const apps = this.getApplications();
    const newApp: Application = {
      id: `app-${Date.now()}`,
      candidate_id: candidateProfile.id,
      job_id: job.id,
      recruiter_id: job.recruiter_id,
      organization_id: job.organization_id,
      skill_match_score: Math.floor(Math.random() * 25) + 75,
      readiness_score: 82,
      overall_match_score: Math.floor(Math.random() * 20) + 78,
      status: 'Applied',
      candidate: {
        full_name: candidateProfile.full_name,
        email: candidateProfile.email,
        target_job: 'Developer / Technical Specialist',
        readiness_score: 82,
        district: candidateProfile.district || 'Pune'
      },
      job: {
        title: job.title,
        company_name: job.company_name,
        location: job.location
      },
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    apps.unshift(newApp);
    setStorage(STORAGE_KEYS.APPLICATIONS, apps);
    return newApp;
  }

  static updateApplicationStatus(applicationId: string, status: Application['status']): Application | null {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === applicationId);
    if (idx === -1) return null;
    apps[idx].status = status;
    apps[idx].updated_at = new Date().toISOString();
    setStorage(STORAGE_KEYS.APPLICATIONS, apps);
    return apps[idx];
  }

  static getTrainingCenters(organizationId?: string): TrainingCenter[] {
    const tcs = getStorage<TrainingCenter[]>(STORAGE_KEYS.TRAINING_CENTERS, SEED_TRAINING_CENTERS);
    if (organizationId) {
      return tcs.filter(tc => tc.organization_id === organizationId);
    }
    return tcs;
  }

  static getCourses(organizationId?: string): Course[] {
    const courses = getStorage<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);
    if (organizationId) {
      return courses.filter(c => c.organization_id === organizationId);
    }
    return courses;
  }

  static createCourse(data: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...data,
      id: `crs-${Date.now()}`
    };
    courses.push(newCourse);
    setStorage(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  }

  static getBatches(organizationId?: string): Batch[] {
    const batches = getStorage<Batch[]>(STORAGE_KEYS.BATCHES, SEED_BATCHES);
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
      created_at: new Date().toISOString(),
      enrolled_count: 0
    };
    batches.push(newBatch);
    setStorage(STORAGE_KEYS.BATCHES, batches);
    return newBatch;
  }

  static getEnrollments(organizationId?: string): Enrollment[] {
    const enrollments = getStorage<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, SEED_ENROLLMENTS);
    if (organizationId) {
      return enrollments.filter(e => e.organization_id === organizationId);
    }
    return enrollments;
  }

  static getAttendance(batchId?: string): Attendance[] {
    const attendance = getStorage<Attendance[]>(STORAGE_KEYS.ATTENDANCE, SEED_ATTENDANCE);
    if (batchId) {
      return attendance.filter(a => a.batch_id === batchId);
    }
    return attendance;
  }

  static markAttendance(batchId: string, candidateId: string, candidateName: string, orgId: string, date: string, status: Attendance['status']): void {
    const list = this.getAttendance();
    const idx = list.findIndex(a => a.batch_id === batchId && a.candidate_id === candidateId && a.attendance_date === date);
    if (idx !== -1) {
      list[idx].status = status;
    } else {
      list.push({
        id: `att-${Date.now()}`,
        batch_id: batchId,
        candidate_id: candidateId,
        candidate_name: candidateName,
        organization_id: orgId,
        attendance_date: date,
        status
      });
    }
    setStorage(STORAGE_KEYS.ATTENDANCE, list);
  }

  static getCertifications(organizationId?: string): Certification[] {
    const certs = getStorage<Certification[]>(STORAGE_KEYS.CERTIFICATIONS, SEED_CERTIFICATIONS);
    if (organizationId) {
      return certs.filter(c => c.organization_id === organizationId);
    }
    return certs;
  }

  static issueCertificate(data: Omit<Certification, 'id' | 'created_at'>): Certification {
    const certs = this.getCertifications();
    const newCert: Certification = {
      ...data,
      id: `cert-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    certs.unshift(newCert);
    setStorage(STORAGE_KEYS.CERTIFICATIONS, certs);
    return newCert;
  }

  static getAssessments(organizationId?: string): Assessment[] {
    const assessments = getStorage<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, SEED_ASSESSMENTS);
    if (organizationId) {
      return assessments.filter(a => a.organization_id === organizationId);
    }
    return assessments;
  }

  static getAssessmentResults(candidateId?: string): AssessmentResult[] {
    const results = getStorage<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENT_RESULTS, SEED_ASSESSMENT_RESULTS);
    if (candidateId) {
      return results.filter(r => r.candidate_id === candidateId);
    }
    return results;
  }

  static recordAssessmentResult(data: Omit<AssessmentResult, 'id' | 'completed_at'>): AssessmentResult {
    const results = this.getAssessmentResults();
    const newResult: AssessmentResult = {
      ...data,
      id: `res-${Date.now()}`,
      completed_at: new Date().toISOString()
    };
    results.unshift(newResult);
    setStorage(STORAGE_KEYS.ASSESSMENT_RESULTS, results);
    return newResult;
  }

  static getPlacements(organizationId?: string): Placement[] {
    const placements = getStorage<Placement[]>(STORAGE_KEYS.PLACEMENTS, SEED_PLACEMENTS);
    if (organizationId) {
      return placements.filter(p => p.organization_id === organizationId);
    }
    return placements;
  }

  static recordPlacement(data: Omit<Placement, 'id' | 'created_at' | 'updated_at'>): Placement {
    const placements = this.getPlacements();
    const newPlc: Placement = {
      ...data,
      id: `plc-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    placements.unshift(newPlc);
    setStorage(STORAGE_KEYS.PLACEMENTS, placements);
    return newPlc;
  }

  static getEmploymentVerifications(organizationId?: string): EmploymentVerification[] {
    const evs = getStorage<EmploymentVerification[]>(STORAGE_KEYS.EMPLOYMENT_VERIFICATIONS, SEED_EMPLOYMENT_VERIFICATIONS);
    if (organizationId) {
      return evs.filter(ev => ev.organization_id === organizationId);
    }
    return evs;
  }

  static runSimulatedVerification(
    placementId: string,
    candidateId: string,
    candidateName: string,
    orgId: string,
    period: '3_month' | '6_month' | '12_month'
  ): EmploymentVerification {
    const evs = this.getEmploymentVerifications();
    const newEv: EmploymentVerification = {
      id: `ev-${Date.now()}`,
      placement_id: placementId,
      candidate_id: candidateId,
      candidate_name: candidateName,
      organization_id: orgId,
      verification_period: period,
      status: 'simulated_epfo_verified',
      verification_method: 'EPFO_Simulator',
      verified_at: new Date().toISOString(),
      notes: `[Simulated EPFO Validation]: Automated monthly wage remittance credit verified for ${period.replace('_', ' ')} milestone.`
    };
    evs.unshift(newEv);
    setStorage(STORAGE_KEYS.EMPLOYMENT_VERIFICATIONS, evs);
    return newEv;
  }

  static getDistrictAnalytics(organizationId?: string): DistrictAnalytics[] {
    const da = getStorage<DistrictAnalytics[]>(STORAGE_KEYS.DISTRICT_ANALYTICS, SEED_DISTRICT_ANALYTICS);
    if (organizationId) {
      return da.filter(d => d.organization_id === organizationId);
    }
    return da;
  }

  static getSkillDemand(organizationId?: string): SkillDemand[] {
    const sd = getStorage<SkillDemand[]>(STORAGE_KEYS.SKILL_DEMAND, SEED_SKILL_DEMAND);
    if (organizationId) {
      return sd.filter(s => s.organization_id === organizationId);
    }
    return sd;
  }

  static getAnomalies(organizationId?: string): AnomalyAlert[] {
    const alerts = getStorage<AnomalyAlert[]>(STORAGE_KEYS.ANOMALIES, SEED_ANOMALIES);
    if (organizationId) {
      return alerts.filter(a => a.organization_id === organizationId);
    }
    return alerts;
  }

  static resetToDefaultSeed(): void {
    Object.values(STORAGE_KEYS).forEach(k => {
      localStorage.removeItem(k);
    });
  }
}
