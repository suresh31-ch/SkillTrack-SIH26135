/**
 * SkillTrack - Student Career Journey & Skilling Intelligence Types
 * Problem Statement: SIH26135
 */

export type SkillCategory =
  | 'Programming Languages'
  | 'Data Structures & Algorithms'
  | 'Web & Mobile Development'
  | 'Databases & Backend'
  | 'Cloud & DevOps'
  | 'AI & Machine Learning'
  | 'Data Analytics & BI'
  | 'Cybersecurity'
  | 'Design & Product'
  | 'Communication & Leadership'
  | 'Domain-Specific & Others';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Proficient';

export type HowSkillLearned =
  | 'College Coursework'
  | 'Self-Learning / Online Courses'
  | 'Internship Experience'
  | 'Hands-on Projects'
  | 'Verified Certification'
  | 'Industry Work Experience';

export type EvidenceConfidenceType =
  | 'self_declared'
  | 'project_evidence'
  | 'assessment_demonstrated'
  | 'verified_certification';

export interface StudentSkillRecord {
  id: string;
  studentId: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  howLearned: HowSkillLearned;
  lastPracticedDate?: string;
  projectUrl?: string;
  evidenceAttachmentUrl?: string;
  evidenceType: EvidenceConfidenceType;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type CertificationVerificationStatus =
  | 'not_submitted'
  | 'verification_pending'
  | 'verified'
  | 'verification_failed'
  | 'expired';

export interface StudentCertificationRecord {
  id: string;
  studentId: string;
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateFileUrl?: string;
  relatedSkills: string[];
  verificationStatus: CertificationVerificationStatus;
  verificationMethod?: 'Official API Verification' | 'Issuer URL Check' | 'Placement Officer Review' | 'Manual Cryptographic Review';
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
}

export type PreferredEmploymentType =
  | 'Internship'
  | 'Full-time'
  | 'Apprenticeship'
  | 'Contract'
  | 'Research Fellowship';

export interface StudentAcademicProfile {
  studentId: string;
  fullName: string;
  college: string;
  degree: string;
  branch: string;
  currentYearOrSemester: string;
  graduationYear: number;
  location: string;
  preferredLocations: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  careerInterests: string[];
  preferredEmploymentType: PreferredEmploymentType;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  onboardingCompleted: boolean;
  updatedAt: string;
}

export interface CareerGoal {
  id: string;
  studentId: string;
  targetCompany: string;
  targetRole: string;
  targetIndustry: string;
  employmentPreference: PreferredEmploymentType;
  preferredLocation: string;
  workArrangement: 'In-office' | 'Hybrid' | 'Remote' | 'Any';
  expectedApplicationPeriod: string;
  targetGraduationOrAvailability: string;
  weeklyLearningHours: number; // e.g. 5, 10, 15, 20
  prioritySkills: string[];
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRoleRequirement {
  skillName: string;
  category: SkillCategory;
  requiredLevel: SkillProficiency;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  source: 'Employer Published' | 'Verified Job Specification' | 'Curated Reference Standards';
  description?: string;
}

export interface CompanyRoleProfile {
  id: string;
  companyId: string;
  companyName: string;
  roleTitle: string;
  roleCategory: string; // e.g., 'Software Engineering', 'Data & AI', 'Cloud & DevOps'
  overview: string;
  dayToDayResponsibilities: string[];
  essentialSkills: CompanyRoleRequirement[];
  preferredSkills: CompanyRoleRequirement[];
  educationAndEligibility: string[];
  experienceRequirements: string;
  projectsThatDemonstrateReadiness: Array<{ title: string; description: string; expectedArtifacts: string[] }>;
  recommendedCertifications: Array<{ title: string; issuer: string; isRequired: boolean }>;
  interviewPrepFocus: Array<{ topic: string; questionsCount: number; keyFocus: string }>;
  employmentType: PreferredEmploymentType;
  locations: string[];
  workArrangement: 'In-office' | 'Hybrid' | 'Remote' | 'Flexible';
  salaryOrStipendReference?: {
    type: 'Stipend' | 'Annual CTC';
    minAmount: string;
    maxAmount: string;
    currency: string;
    sourceNotes: string;
  };
  applicationDeadline?: string;
  officialCareersLink: string;
  officialJobSearchLink: string;
  lastVerifiedDate: string;
}

export interface TargetCompany {
  id: string;
  name: string;
  ticker?: string;
  category: 'Tech Enterprise' | 'Consulting & IT Services' | 'Product & Cloud' | 'Semiconductor & AI' | 'Fintech & Enterprise';
  logoUrl?: string;
  overview: string;
  officialCareersWebsite: string;
  officialJobSearchLink: string;
  primaryLocations: string[];
  availableHiringTracks: Array<{
    name: string;
    description: string;
    targetGraduation: string;
    applicationWindow: string;
  }>;
  availableRoles: CompanyRoleProfile[];
  disclaimer: string;
}

export type SkillGapCategory =
  | 'Meets requirement'
  | 'Partially meets requirement'
  | 'Skill needs assessment'
  | 'Skill to develop'
  | 'Requirement not yet evidenced';

export interface CompanySkillGapItem {
  skillName: string;
  category: SkillCategory;
  requiredLevel: SkillProficiency;
  studentLevel?: SkillProficiency;
  evidenceSource: 'None' | 'Self-Declared' | 'Project Link' | 'Assessment Passed' | 'Verified Certificate';
  confidenceScore: number; // 0.0 to 1.0
  gapCategory: SkillGapCategory;
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  suggestedAction: string;
  relatedCourseId?: string;
  relatedAssessmentSkill?: string;
  estimatedEffortHours: number;
}

export interface CompanyRoleGapAnalysis {
  companyName: string;
  roleTitle: string;
  readinessPercentage: number;
  provisionalScore: boolean;
  totalRequirements: number;
  meetingCount: number;
  partialCount: number;
  needsAssessmentCount: number;
  toDevelopCount: number;
  notEvidencedCount: number;
  gapItems: CompanySkillGapItem[];
  formulaExplanation: string;
  topPriorities: string[];
  calculatedAt: string;
}

export type ApplicationStageStatus =
  | 'Saved'
  | 'Planning to apply'
  | 'Application in progress'
  | 'Applied'
  | 'Assessment scheduled'
  | 'Technical interview scheduled'
  | 'HR interview scheduled'
  | 'Offer received'
  | 'Offer accepted'
  | 'Offer declined'
  | 'Joined company'
  | 'Rejected'
  | 'Withdrawn'
  | 'Closed';

export interface StudentApplicationRecord {
  id: string;
  studentId: string;
  companyName: string;
  roleTitle: string;
  opportunityType: 'On-campus Drive' | 'Off-campus Opportunity' | 'Verified Skilling Partner';
  jobPostingUrl?: string;
  campusPlacementCellNotice?: string;
  location: string;
  status: ApplicationStageStatus;
  appliedDate?: string;
  nextStepDate?: string;
  notes?: string;
  salaryOffered?: string;
  offerLetterUrl?: string;
  offerAcceptedDate?: string;
  joiningDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreApplicationChecklistResult {
  roleTitle: string;
  companyName: string;
  satisfiedRequirements: string[];
  requirementsAwaitingConfirmation: string[];
  remainingCriticalGaps: string[];
  assessmentEvidencePassed: string[];
  portfolioProjectsIncluded: string[];
  resumeChecklistItems: Array<{ label: string; passed: boolean; tip: string }>;
  readinessSummary: 'Ready to Apply' | 'Minor Preparation Recommended' | 'Skill Gap Development Recommended';
  officialApplicationLink: string;
}

export interface PostPlacementCheckInQuestion {
  id: string;
  question: string;
  responseType: 'yes_no' | 'scale_1_5' | 'text' | 'multi_select';
  options?: string[];
  answer?: any;
}

export interface PostPlacementCheckInMilestone {
  interval: 'Joining Day' | '30 Days' | '90 Days' | '6 Months' | '12 Months';
  milestoneTitle: string;
  dueDate: string;
  completedDate?: string;
  status: 'Pending' | 'Completed' | 'Upcoming';
  questions: PostPlacementCheckInQuestion[];
}

export interface PostPlacementProfile {
  studentId: string;
  companyName: string;
  roleTitle: string;
  employmentType: PreferredEmploymentType;
  workLocation: string;
  joiningDate: string;
  salaryCompensation?: string; // Private by default
  isCompensationPrivate: boolean;
  skillsUsedInRole: string[];
  skillsNeedingImprovement: string[];
  currentUpskillingGoals: string[];
  certificationsPursuedPostJoining: string[];
  verificationStatus: 'Self-Reported' | 'Placement Officer Confirmed' | 'Employer Verified' | 'Verification Pending';
  verificationDocumentUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  checkInMilestones: PostPlacementCheckInMilestone[];
  retentionStatus: 'Active & Employed' | 'Promoted' | 'Role Transitioned' | 'Pursuing Higher Education' | 'Seeking Upgrade';
  updatedAt: string;
}

export interface PostPlacementLearningRecommendation {
  id: string;
  skillName: string;
  targetProficiency: 'Advanced' | 'Expert';
  reason: string;
  careerPathGain: string;
  recommendedCourseTitle: string;
  estimatedHours: number;
}
