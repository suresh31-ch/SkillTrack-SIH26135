import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LocalDbService } from '../../../lib/supabase';
import { CandidateService, ProfileCompletionDetails } from '../../../lib/candidateService';
import {
  CandidateSkill,
  Skill,
  JobRole,
  JobRoleSkill,
  RoadmapItem,
  CandidateRoadmapProgress,
  SkillGapAnalysisResult,
  LearningRoadmapSkill
} from '../../../types';
import { SkillGapView } from './SkillGapView';
import { MicroRoadmapView } from './MicroRoadmapView';
import { Button, Card, Badge, Input, Modal } from '../../ui';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';
import Editor from '@monaco-editor/react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import {
  User,
  Sparkles,
  TrendingUp,
  Map,
  BookOpen,
  CheckSquare,
  Code2,
  Award,
  Briefcase,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Plus,
  ExternalLink,
  ChevronRight,
  Clock,
  Building,
  MapPin,
  FileCheck,
  Search,
  Filter,
  Trash2,
  GraduationCap,
  Phone,
  Mail,
  Building2,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';

interface CandidateDashboardProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ activeTab, onTabChange }) => {
  const { profile, candidateProfile, organization, refreshProfile, isSupabaseLive } = useAuth();
  const { showToast } = useToast();

  const candidateId = profile?.id || 'prof-cand-001';

  // Loading & Error States
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Skills State
  const [skills, setSkills] = useState<CandidateSkill[]>([]);
  const [allMasterSkills, setAllMasterSkills] = useState<Skill[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('all');
  const [skillVerificationFilter, setSkillVerificationFilter] = useState<'all' | 'verified' | 'self_declared'>('all');
  
  // Job Roles & Roadmap Engine State
  const [jobRoles, setJobRoles] = useState<JobRole[]>(() => LocalDbService.getJobRoles());
  const [jobRoleSkills, setJobRoleSkills] = useState<JobRoleSkill[]>(() => LocalDbService.getJobRoleSkills());
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(() => LocalDbService.getRoadmapItems());
  const [candidateRoadmapProgress, setCandidateRoadmapProgress] = useState<CandidateRoadmapProgress[]>(() =>
    LocalDbService.getCandidateRoadmapProgress(candidateId)
  );
  const [selectedRoadmapSkillId, setSelectedRoadmapSkillId] = useState<string | undefined>(undefined);

  // Job & Application state
  const [jobs, setJobs] = useState(() => LocalDbService.getJobs(organization?.id));
  const [applications, setApplications] = useState(() => LocalDbService.getCandidateApplications(candidateId));
  const certifications = LocalDbService.getCertifications(organization?.id);
  const assessments = LocalDbService.getAssessments(organization?.id);
  const results = LocalDbService.getAssessmentResults(candidateId);
  const placements = LocalDbService.getPlacements(organization?.id);
  const verifications = LocalDbService.getEmploymentVerifications(organization?.id);
  const courses = LocalDbService.getCourses(organization?.id);

  // Modals state
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isSavingSkill, setIsSavingSkill] = useState(false);
  const [addSkillSearch, setAddSkillSearch] = useState('');
  const [addSkillCategory, setAddSkillCategory] = useState('all');
  const [newSkillId, setNewSkillId] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [skillToDelete, setSkillToDelete] = useState<CandidateSkill | null>(null);
  const [isDeletingSkill, setIsDeletingSkill] = useState(false);

  // Edit Profile Form State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [district, setDistrict] = useState(profile?.district || '');
  const [targetJob, setTargetJob] = useState(candidateProfile?.target_job || 'Full Stack Web Developer');
  const [education, setEducation] = useState(candidateProfile?.education || 'Bachelor of Technology (B.Tech)');
  const [degree, setDegree] = useState(candidateProfile?.degree || 'Computer Engineering');
  const [gradYear, setGradYear] = useState<number>(candidateProfile?.graduation_year || 2025);
  const [expYears, setExpYears] = useState<number>(candidateProfile?.experience_years || 0);
  const [employmentStatus, setEmploymentStatus] = useState<any>(candidateProfile?.employment_status || 'in_training');

  // Assessment & Code Sandbox State
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [code, setCode] = useState('// Write TypeScript / JavaScript here\nfunction calculateReadiness(score) {\n  console.log("Candidate Readiness Score: " + score + "/100");\n  return score >= 80 ? "Job Ready" : "Requires Upskilling";\n}\n\nconsole.log(calculateReadiness(85));');
  const [isExecutingCode, setIsExecutingCode] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>('');

  // Primary loader function from Supabase
  const loadData = async () => {
    setIsLoadingData(true);
    setDataError(null);
    try {
      const [candSkills, masterCatalog, roles, reqs, items, progress] = await Promise.all([
        CandidateService.getCandidateSkills(candidateId),
        CandidateService.getMasterSkills(),
        CandidateService.getJobRoles(),
        CandidateService.getJobRoleSkills(),
        CandidateService.getRoadmapItems(),
        CandidateService.getCandidateRoadmapProgress(candidateId)
      ]);
      setSkills(candSkills);
      setAllMasterSkills(masterCatalog);
      setJobRoles(roles);
      setJobRoleSkills(reqs);
      setRoadmapItems(items);
      setCandidateRoadmapProgress(progress);
    } catch (err: any) {
      console.error('Failed to load candidate data:', err);
      setDataError('Failed to load skills from database. Please check connection and retry.');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load latest skills and master catalog on mount or profile change
  useEffect(() => {
    loadData();
  }, [candidateId]);

  // Sync edit form with profile updates
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setDistrict(profile.district || '');
    }
    if (candidateProfile) {
      setTargetJob(candidateProfile.target_job || 'Full Stack Web Developer');
      setEducation(candidateProfile.education || 'Bachelor of Technology (B.Tech)');
      setDegree(candidateProfile.degree || 'Computer Engineering');
      setGradYear(candidateProfile.graduation_year || 2025);
      setExpYears(candidateProfile.experience_years || 0);
      setEmploymentStatus(candidateProfile.employment_status || 'in_training');
    }
  }, [profile, candidateProfile]);

  // Profile completion calculation
  const completionDetails: ProfileCompletionDetails = useMemo(() => {
    return CandidateService.calculateCompletionBreakdown(profile, candidateProfile, skills);
  }, [profile, candidateProfile, skills]);

  // AI Skill Gap Analysis Engine Computation
  const skillGapAnalysis: SkillGapAnalysisResult = useMemo(() => {
    return CandidateService.analyzeSkillGap(
      targetJob || 'Full Stack Web Developer',
      skills,
      jobRoles,
      jobRoleSkills,
      allMasterSkills
    );
  }, [targetJob, skills, jobRoles, jobRoleSkills, allMasterSkills]);

  // Personalized Micro-Roadmap Pathways Computation
  const personalizedRoadmaps: LearningRoadmapSkill[] = useMemo(() => {
    return CandidateService.buildPersonalizedRoadmaps(
      skillGapAnalysis.items,
      candidateRoadmapProgress,
      roadmapItems
    );
  }, [skillGapAnalysis.items, candidateRoadmapProgress, roadmapItems]);

  // Handler for target job update
  const handleUpdateTargetJob = async (newJobName: string) => {
    setTargetJob(newJobName);
    try {
      await CandidateService.updateCandidateProfileDetails(
        profile?.id || candidateId,
        {},
        { target_job: newJobName }
      );
      await refreshProfile();
      showToast('Target Career Saved', `Primary target role updated to ${newJobName}`, 'success');
    } catch (err) {
      console.warn('Target job update error:', err);
    }
  };

  // Handler for roadmap checkbox progress toggling
  const handleToggleRoadmapProgress = async (roadmapItemId: string, completed: boolean) => {
    try {
      const updated = await CandidateService.toggleRoadmapItemProgress(
        candidateId,
        roadmapItemId,
        completed
      );
      setCandidateRoadmapProgress(updated);
      showToast(
        completed ? 'Milestone Completed!' : 'Progress Updated',
        completed ? 'Recorded completion in candidate roadmap progress' : 'Marked lesson as in-progress',
        'success'
      );
    } catch (err) {
      console.warn('Roadmap toggle error:', err);
    }
  };

  const handleNavigateToRoadmap = (skillId?: string) => {
    setSelectedRoadmapSkillId(skillId);
    onTabChange('ai_roadmap');
  };

  const handleOpenAddSkillForGap = (skillId?: string) => {
    if (skillId) {
      setNewSkillId(skillId);
    }
    setIsAddSkillOpen(true);
  };

  // Categories list for skills filter
  const skillCategories = useMemo(() => {
    const cats = new Set(allMasterSkills.map(s => s.category));
    return ['all', ...Array.from(cats)];
  }, [allMasterSkills]);

  // Filtered candidate skills
  const filteredSkills = useMemo(() => {
    return skills.filter(item => {
      const matchSearch =
        !skillSearchQuery.trim() ||
        item.skill?.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
        item.skill?.category.toLowerCase().includes(skillSearchQuery.toLowerCase());
      
      const matchCategory =
        skillCategoryFilter === 'all' ||
        item.skill?.category.toLowerCase() === skillCategoryFilter.toLowerCase();
      
      const matchVerification =
        skillVerificationFilter === 'all' ||
        (skillVerificationFilter === 'verified' && item.verified) ||
        (skillVerificationFilter === 'self_declared' && !item.verified);

      return matchSearch && matchCategory && matchVerification;
    });
  }, [skills, skillSearchQuery, skillCategoryFilter, skillVerificationFilter]);

  // Available master skills for adding (excluding already added skills)
  const availableMasterSkills = useMemo(() => {
    const existingSkillIds = new Set(skills.map(s => s.skill_id));
    return allMasterSkills.filter(s => {
      if (existingSkillIds.has(s.id)) return false;
      const matchCategory = addSkillCategory === 'all' || s.category.toLowerCase() === addSkillCategory.toLowerCase();
      const matchSearch =
        !addSkillSearch.trim() ||
        s.name.toLowerCase().includes(addSkillSearch.toLowerCase()) ||
        s.category.toLowerCase().includes(addSkillSearch.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(addSkillSearch.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [allMasterSkills, skills, addSkillCategory, addSkillSearch]);

  // Set default selected skill when add modal opens or available list changes
  useEffect(() => {
    if (availableMasterSkills.length > 0 && (!newSkillId || !availableMasterSkills.some(s => s.id === newSkillId))) {
      setNewSkillId(availableMasterSkills[0].id);
    }
  }, [availableMasterSkills, newSkillId]);

  // Handlers for Skills
  const handleAddSkill = async () => {
    if (!profile || !newSkillId) return;
    setIsSavingSkill(true);
    try {
      await CandidateService.addCandidateSkill(profile.id, newSkillId, newSkillLevel);
      const updated = await CandidateService.getCandidateSkills(profile.id);
      setSkills(updated);
      setIsAddSkillOpen(false);
      refreshProfile();
      showToast('Skill Added', 'New skill added to your profile as self-declared.', 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to add skill', 'error');
    } finally {
      setIsSavingSkill(false);
    }
  };

  const handleUpdateSkillProficiency = async (candidateSkillId: string, level: CandidateSkill['proficiency_level']) => {
    try {
      await CandidateService.updateCandidateSkillProficiency(candidateSkillId, level);
      const updated = await CandidateService.getCandidateSkills(candidateId);
      setSkills(updated);
      showToast('Proficiency Updated', `Proficiency updated to ${level}.`, 'success');
    } catch (err: any) {
      showToast('Error', 'Failed to update proficiency', 'error');
    }
  };

  const handleConfirmDeleteSkill = async () => {
    if (!skillToDelete || !profile) return;
    if (skillToDelete.verified) {
      showToast('Action Prohibited', 'Verified skills cannot be removed.', 'error');
      setSkillToDelete(null);
      return;
    }
    setIsDeletingSkill(true);
    try {
      await CandidateService.removeCandidateSkill(skillToDelete.id, profile.id);
      const updated = await CandidateService.getCandidateSkills(profile.id);
      setSkills(updated);
      setSkillToDelete(null);
      refreshProfile();
      showToast('Skill Removed', 'Skill removed from your candidate profile.', 'info');
    } catch (err: any) {
      showToast('Error', 'Failed to remove skill', 'error');
    } finally {
      setIsDeletingSkill(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSavingProfile(true);
    try {
      await CandidateService.updateCandidateProfileDetails(
        profile.id,
        {
          full_name: fullName,
          phone,
          district
        },
        {
          target_job: targetJob,
          education,
          degree,
          graduation_year: Number(gradYear),
          experience_years: Number(expYears),
          employment_status: employmentStatus
        }
      );
      refreshProfile();
      setIsEditProfileOpen(false);
      showToast('Profile Updated', 'Candidate profile details successfully synchronized.', 'success');
    } catch (err: any) {
      showToast('Error', 'Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleApplyJob = (job: any) => {
    if (!profile) return;
    const existing = applications.find(a => a.job_id === job.id);
    if (existing) {
      showToast('Already Applied', `You have already applied for ${job.title}`, 'info');
      return;
    }
    const newApp = LocalDbService.applyToJob(profile, job);
    setApplications(LocalDbService.getCandidateApplications(profile.id));
    showToast('Application Submitted', `Applied to ${job.title} at ${job.company_name}!`, 'success');
  };

  const handleStartAssessment = (asm: any) => {
    setActiveAssessment(asm);
    setSelectedAnswers({});
    setAssessmentCompleted(false);
    setAssessmentScore(null);
  };

  const handleSubmitAssessment = () => {
    if (!activeAssessment || !profile) return;
    let score = 0;
    activeAssessment.questions.forEach((q: any) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    const percentage = Math.round((score / activeAssessment.questions.length) * 100);
    LocalDbService.recordAssessmentResult({
      assessment_id: activeAssessment.id,
      assessment_title: activeAssessment.title,
      candidate_id: profile.id,
      organization_id: profile.organization_id,
      score,
      percentage
    });
    setAssessmentScore(percentage);
    setAssessmentCompleted(true);
    showToast('Assessment Completed', `You scored ${percentage}% on ${activeAssessment.title}`, 'success');
  };

  const runCodeSandbox = () => {
    setIsExecutingCode(true);
    setCodeOutput('Executing in sandboxed environment...');
    setTimeout(() => {
      try {
        const logs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' ')),
          error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' '))
        };
        const runFn = new Function('console', code);
        runFn(customConsole);
        setCodeOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully with no output.');
      } catch (err: any) {
        setCodeOutput(`Runtime Error: ${err.message}`);
      } finally {
        setIsExecutingCode(false);
      }
    }, 600);
  };

  // Dynamic Skill Gap Radar Data from actual candidate analysis
  const overviewRadarData = useMemo(() => {
    const profToScore: Record<string, number> = {
      None: 0,
      Beginner: 30,
      Intermediate: 60,
      Advanced: 85,
      Expert: 100
    };
    if (skillGapAnalysis.items.length === 0) {
      return [
        { skill: 'React & TS', required: 90, candidate: 85 },
        { skill: 'Node & API', required: 85, candidate: 75 },
        { skill: 'PostgreSQL', required: 80, candidate: 65 },
        { skill: 'Cloud GCP', required: 75, candidate: 45 },
        { skill: 'System Design', required: 70, candidate: 50 }
      ];
    }
    return skillGapAnalysis.items.slice(0, 6).map(item => ({
      skill: item.skill_name.length > 12 ? item.skill_name.substring(0, 10) + '..' : item.skill_name,
      required: profToScore[item.required_proficiency] || 75,
      candidate: profToScore[item.candidate_proficiency] || 0
    }));
  }, [skillGapAnalysis.items]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Connection status & Error Alert */}
      {dataError && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{dataError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={loadData}>
            Retry Load
          </Button>
        </div>
      )}

      {/* View 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          {/* Header Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary">Candidate Portal</Badge>
                <span className="text-xs text-slate-500 font-medium">Target: {targetJob || 'Full Stack Web Developer'}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Welcome back, {profile?.full_name || 'Candidate'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                Track your active skilling roadmap, take practical assessments, verify certifications, and monitor post-placement retention milestones.
              </p>
            </div>

            {/* Readiness Gauge */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 shrink-0">
              <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center border-3 border-indigo-600 shadow-2xs">
                <span className="text-sm font-extrabold text-indigo-700">
                  {skillGapAnalysis.readiness_score}%
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Job Readiness</div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> {skillGapAnalysis.readiness_score >= 80 ? 'Market Ready' : skillGapAnalysis.readiness_score >= 50 ? 'Upskilling in Progress' : 'Foundational Phase'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Profile: {completionDetails.percentage}% complete</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Verified Skills</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{skills.filter(s => s.verified).length} / {skills.length}</div>
              <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {skills.filter(s => !s.verified).length} Self-Declared
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Profile Completion</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{completionDetails.percentage}%</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {completionDetails.missingItems.length === 0 ? 'Fully Complete' : `${completionDetails.missingItems.length} item(s) pending`}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Employment Status</div>
              <div className="text-lg font-bold text-slate-900 mt-1 capitalize truncate">
                {candidateProfile?.employment_status ? candidateProfile.employment_status.replace('_', ' ') : 'In Training'}
              </div>
              <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-600" /> State Tracked
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Job Applications</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{applications.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active Tracking
              </div>
            </Card>
          </div>

          {/* Active Course & Skill Gap Quick View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Active Course Progress */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Active Enrolled Course
                </h3>
                <Badge variant="success">Completed (100%)</Badge>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Full Stack Cloud Application Engineering</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">MSIAS Pune • Batch 2025-Q3 (Alpha)</p>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-emerald-600 h-1.5 rounded-full w-full" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Duration: 4 Months (480 Hours)</span>
                  <span className="text-emerald-700 font-semibold">Certificate Issued</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Button size="sm" variant="ghost" onClick={() => onTabChange('learning')} className="text-xs">
                  View Course Modules
                </Button>
                <Button size="sm" variant="outline" onClick={() => onTabChange('certifications')} className="text-xs">
                  View Certificate
                </Button>
              </div>
            </Card>

            {/* Right: Skill Gap Matrix */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Skill Gap Matrix vs Target Job
                </h3>
                <Button size="sm" variant="ghost" onClick={() => onTabChange('skill_gap')} className="text-xs">
                  Detailed Analysis
                </Button>
              </div>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={overviewRadarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 9 }} />
                    <Radar name="Market Requirement" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                    <Radar name="My Competency" dataKey="candidate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#475569' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View 2: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Candidate Profile & Credentials</h2>
              <p className="text-xs text-slate-500 mt-0.5">Multi-tenant candidate record persisted in PostgreSQL</p>
            </div>
            <Button size="sm" variant="primary" onClick={() => setIsEditProfileOpen(true)} id="btn-edit-profile">
              Edit Profile
            </Button>
          </div>

          {/* Profile Completion Dynamic Banner */}
          <Card className="p-4 bg-gradient-to-r from-indigo-50/60 via-slate-50 to-emerald-50/40 border-indigo-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-indigo-600" /> Profile Completion Status
                  </span>
                  <Badge variant={completionDetails.percentage >= 90 ? 'success' : completionDetails.percentage >= 60 ? 'purple' : 'warning'}>
                    {completionDetails.percentage >= 90 ? 'High Visibility Profile' : completionDetails.percentage >= 60 ? 'Standard Profile' : 'Incomplete'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  {completionDetails.completedCount} of {completionDetails.totalCheckpoints} checkpoints fulfilled ({completionDetails.percentage}% complete). Complete remaining checkpoints to boost employer matching index.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${completionDetails.percentage}%` }}
                  />
                </div>
              </div>

              <div className="text-left md:text-right shrink-0">
                <div className="text-2xl font-black text-indigo-700">{completionDetails.percentage}%</div>
                <span className="text-[11px] text-slate-500">Calculated Score</span>
              </div>
            </div>

            {/* Checkpoints Breakdown */}
            {completionDetails.missingItems.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Recommended Steps to Reach 100%:
                </span>
                <div className="flex flex-wrap gap-2">
                  {completionDetails.missingItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.includes('Skill')) {
                          onTabChange('skills');
                          setIsAddSkillOpen(true);
                        } else {
                          setIsEditProfileOpen(true);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-amber-600" />
                      Add {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Identity & Contact Card */}
            <Card className="p-4 lg:col-span-1 space-y-4">
              <div className="text-center space-y-2.5 pb-3 border-b border-slate-100">
                <div className="w-20 h-20 rounded-xl mx-auto overflow-hidden bg-indigo-50 border-2 border-indigo-200 p-0.5 relative group">
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256'}
                    alt={profile?.full_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Active" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{profile?.full_name || 'Candidate Name'}</h3>
                  <p className="text-xs font-semibold text-indigo-600">{candidateProfile?.target_job || 'Full Stack Web Developer'}</p>
                  <div className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile?.district || 'Pune'}, Maharashtra
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> Email:</span>
                  <strong className="text-slate-800 font-medium">{profile?.email}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:</span>
                  <strong className="text-slate-800 font-medium">{profile?.phone || 'Not provided'}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Tenant:</span>
                  <strong className="text-slate-800 font-medium">{organization?.name || 'MSIAS'}</strong>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Role:</span>
                  <Badge variant="purple" className="text-[10px]">Candidate</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Update Profile Details
              </Button>
            </Card>

            {/* Academic & Career Background */}
            <Card className="p-4 lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Academic & Professional Background</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Educational qualifications, graduation year, and career history</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Highest Education
                  </span>
                  <div className="text-xs font-bold text-slate-900 pt-0.5">{candidateProfile?.education || 'Bachelor of Technology'}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> Degree / Specialization
                  </span>
                  <div className="text-xs font-bold text-slate-900 pt-0.5">{candidateProfile?.degree || 'Computer Engineering'}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="text-slate-500 font-medium">Graduation Year</span>
                  <div className="text-xs font-bold text-slate-900 pt-0.5">{candidateProfile?.graduation_year || 2025}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="text-slate-500 font-medium">Experience (Years)</span>
                  <div className="text-xs font-bold text-slate-900 pt-0.5">{candidateProfile?.experience_years || 0} Years</div>
                </div>
              </div>

              {/* Career Goal & Readiness Card */}
              <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Target Career Goal</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{candidateProfile?.target_job || 'Full Stack Web Developer'}</h4>
                  </div>
                  <Badge variant={candidateProfile?.employment_status === 'verified_employed' || candidateProfile?.employment_status === 'placed' ? 'success' : 'warning'}>
                    {candidateProfile?.employment_status ? candidateProfile.employment_status.replace('_', ' ').toUpperCase() : 'PLACED'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-indigo-200/60 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Skill Readiness</span>
                    <div className="font-bold text-indigo-900 text-sm mt-0.5">{candidateProfile?.readiness_score || 84}/100</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Verified Skills</span>
                    <div className="font-bold text-emerald-700 text-sm mt-0.5">{skills.filter(s => s.verified).length} Skills</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Total Skills</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{skills.length} Skills</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View 3: MY SKILLS */}
      {activeTab === 'skills' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Skills Inventory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage and verify technical competencies with Supabase persistence</p>
            </div>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setAddSkillSearch('');
                setAddSkillCategory('all');
                setIsAddSkillOpen(true);
              }}
              id="btn-add-skill-modal"
            >
              Add Skill
            </Button>
          </div>

          {/* Skill Summary Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Skills</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{skills.length}</div>
              <span className="text-[10px] text-slate-400">In candidate profile</span>
            </Card>

            <Card className="p-3 border-emerald-200/70 bg-emerald-50/30">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Skills
              </span>
              <div className="text-xl font-bold text-emerald-700 mt-1">
                {skills.filter(s => s.verified).length}
              </div>
              <span className="text-[10px] text-emerald-600">Accredited by assessments</span>
            </Card>

            <Card className="p-3 border-amber-200/70 bg-amber-50/30">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" /> Self-Declared
              </span>
              <div className="text-xl font-bold text-amber-800 mt-1">
                {skills.filter(s => !s.verified).length}
              </div>
              <span className="text-[10px] text-amber-600">Pending test verification</span>
            </Card>

            <Card className="p-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Domain</span>
              <div className="text-xs font-bold text-indigo-700 mt-1.5 truncate">
                {skills[0]?.skill?.category || 'Software & Web'}
              </div>
              <span className="text-[10px] text-slate-400">Core area of expertise</span>
            </Card>
          </div>

          {/* Search, Filter and Category Controls */}
          <Card className="p-3 space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search your skills by title or category..."
                  value={skillSearchQuery}
                  onChange={e => setSkillSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                  id="input-search-candidate-skills"
                />
                {skillSearchQuery && (
                  <button
                    onClick={() => setSkillSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Verification Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs shrink-0">
                <button
                  onClick={() => setSkillVerificationFilter('all')}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    skillVerificationFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({skills.length})
                </button>
                <button
                  onClick={() => setSkillVerificationFilter('verified')}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    skillVerificationFilter === 'verified'
                      ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Verified ({skills.filter(s => s.verified).length})
                </button>
                <button
                  onClick={() => setSkillVerificationFilter('self_declared')}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    skillVerificationFilter === 'self_declared'
                      ? 'bg-white text-amber-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Self-Declared ({skills.filter(s => !s.verified).length})
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" /> Category:
              </span>
              {skillCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSkillCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 transition-colors cursor-pointer ${
                    skillCategoryFilter === cat
                      ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </Card>

          {/* Skills Grid */}
          {isLoadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <Card key={n} className="p-4 space-y-3 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 w-2/3">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                    <div className="h-5 bg-slate-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-8 bg-slate-100 rounded w-full"></div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="h-6 bg-slate-200 rounded w-24"></div>
                    <div className="h-4 bg-slate-100 rounded w-16"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSkills.map(item => (
                <Card key={item.id} className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.skill?.name || 'Skill'}</h3>
                        <Badge variant="primary" className="text-[10px] mt-1">
                          {item.skill?.category || 'Technical'}
                        </Badge>
                      </div>
                      {item.verified ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"
                          title="Verified through assessment evaluation"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200"
                          title="Self-declared by candidate. Take an assessment to verify."
                        >
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Self-Declared
                        </span>
                      )}
                    </div>

                    {item.skill?.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.skill.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    {/* Proficiency Selector */}
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-slate-500 font-medium">Proficiency:</label>
                      {item.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200" title="Accredited competency level">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> {item.proficiency_level}
                        </span>
                      ) : (
                        <select
                          value={item.proficiency_level}
                          onChange={e => handleUpdateSkillProficiency(item.id, e.target.value as any)}
                          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-indigo-700 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
                          id={`select-proficiency-${item.id}`}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Added: {formatDate(item.created_at)}</span>
                      {item.verified ? (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1" title="Verified skills are accredited and cannot be removed">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Accredited
                        </span>
                      ) : (
                        <button
                          onClick={() => setSkillToDelete(item)}
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1 rounded transition-colors cursor-pointer"
                          title="Remove self-declared skill"
                          id={`btn-remove-skill-${item.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">No Skills Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {skillSearchQuery || skillCategoryFilter !== 'all' || skillVerificationFilter !== 'all'
                    ? 'No skills matched your active search and filter criteria.'
                    : 'You have not added any skills to your candidate profile yet.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                {(skillSearchQuery || skillCategoryFilter !== 'all' || skillVerificationFilter !== 'all') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSkillSearchQuery('');
                      setSkillCategoryFilter('all');
                      setSkillVerificationFilter('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddSkillOpen(true)}
                >
                  Add New Skill
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* View 4: SKILL GAP ANALYSIS */}
      {activeTab === 'skill_gap' && (
        <SkillGapView
          analysis={skillGapAnalysis}
          targetJobName={targetJob || 'Full Stack Web Developer'}
          availableJobRoles={jobRoles}
          onChangeTargetJob={handleUpdateTargetJob}
          onNavigateToRoadmap={handleNavigateToRoadmap}
          onAddSkill={handleOpenAddSkillForGap}
        />
      )}

      {/* View 5: AI ROADMAP */}
      {activeTab === 'ai_roadmap' && (
        <MicroRoadmapView
          targetJobName={targetJob || 'Full Stack Web Developer'}
          roadmaps={personalizedRoadmaps}
          candidateProgress={candidateRoadmapProgress}
          onToggleProgress={handleToggleRoadmapProgress}
          onNavigateToCodeLab={() => onTabChange('sandbox')}
          onNavigateToAssessments={(skillName) => onTabChange('assessments')}
          onNavigateToSkillGap={() => onTabChange('skill_gap')}
          initialSelectedSkillId={selectedRoadmapSkillId}
        />
      )}

      {/* View 6: LEARNING MODULES */}
      {activeTab === 'learning' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Course Modules & Interactive Lessons</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enrolled courses under {organization?.name}</p>
          </div>

          <div className="space-y-3">
            {courses.map(course => (
              <Card key={course.id} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{course.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{course.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {course.skills.map((sk, i) => (
                        <Badge key={i} variant="default" className="text-[10px]">{sk}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => onTabChange('assessments')}>
                    Take Module Quiz
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 7: ASSESSMENTS */}
      {activeTab === 'assessments' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Practical Competency Assessments</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verify skills to earn digital credentials and boost recruiter match scores</p>
          </div>

          {!activeAssessment ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map(asm => {
                const pastResult = results.find(r => r.assessment_id === asm.id);
                return (
                  <Card key={asm.id} className="p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-slate-900">{asm.title}</h3>
                        <Badge variant="primary">{asm.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Skill: {asm.skill_name || 'Technical'}</p>
                      <div className="mt-2 text-[11px] text-slate-400">{asm.questions.length} Questions</div>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      {pastResult ? (
                        <span className="text-xs text-emerald-700 font-bold">
                          Passed: {pastResult.percentage}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Not Attempted</span>
                      )}

                      <Button size="sm" variant="primary" onClick={() => handleStartAssessment(asm)} id={`btn-start-asm-${asm.id}`}>
                        {pastResult ? 'Retake' : 'Start'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeAssessment.title}</h3>
                  <p className="text-xs text-slate-500">Answer all questions to compute verified score</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setActiveAssessment(null)}>
                  Exit
                </Button>
              </div>

              {!assessmentCompleted ? (
                <div className="space-y-4">
                  {activeAssessment.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="text-xs font-bold text-indigo-700">Question {idx + 1}</div>
                      <div className="text-xs font-semibold text-slate-900">{q.question}</div>
                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt: string, optIdx: number) => (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-2.5 p-2.5 rounded-md border text-xs cursor-pointer transition-all ${
                              selectedAnswers[q.id] === optIdx
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold'
                                : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              checked={selectedAnswers[q.id] === optIdx}
                              onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className="text-indigo-600"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <Button
                    className="w-full"
                    variant="success"
                    onClick={handleSubmitAssessment}
                    id="btn-submit-quiz"
                  >
                    Submit Assessment & Record Score
                  </Button>
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Assessment Submitted!</h3>
                  <p className="text-xs text-slate-600">
                    Your calculated score: <strong className="text-emerald-700 text-base">{assessmentScore}%</strong>
                  </p>
                  <Button size="sm" variant="primary" onClick={() => setActiveAssessment(null)}>
                    Back to Assessments
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {/* View 8: CODE LAB (Monaco Editor Sandbox) */}
      {activeTab === 'code_lab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Live Code Lab & Sandbox</h2>
              <p className="text-xs text-slate-500 mt-0.5">Monaco-powered JavaScript/TypeScript playground for practical coding tests</p>
            </div>
            <Button
              size="sm"
              variant="success"
              leftIcon={<Play className="w-3.5 h-3.5" />}
              onClick={runCodeSandbox}
              isLoading={isExecutingCode}
              id="btn-run-code"
            >
              Run Code
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-2 h-[400px] overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="light"
                value={code}
                onChange={val => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </Card>

            <Card className="p-3.5 h-[400px] flex flex-col justify-between bg-slate-900 font-mono text-xs text-slate-200">
              <div>
                <div className="text-slate-400 border-b border-slate-800 pb-2 mb-2 font-sans font-bold text-xs flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" /> Output Console
                </div>
                <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed text-xs">
                  {codeOutput || 'Click "Run Code" to execute script...'}
                </pre>
              </div>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 font-sans">
                Sandboxed JavaScript runtime • SIH practical skill validation
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* View 9: CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Verified Certifications</h2>
            <p className="text-xs text-slate-500 mt-0.5">Digital certificates issued by accredited training centers with tamper-proof IDs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map(cert => (
              <Card key={cert.id} className="p-5 border-indigo-200 bg-white relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Award className="w-5 h-5" />
                  </div>
                  <Badge variant="success">Verified Valid</Badge>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900">{cert.course_name || 'Full Stack Cloud Engineering'}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Recipient: <strong className="text-slate-900">{profile?.full_name}</strong></p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>ID: {cert.certificate_number}</span>
                  <span>Issued: {formatDate(cert.issue_date)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 10: JOBS & MATCHING */}
      {activeTab === 'jobs' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended Job Vacancies</h2>
            <p className="text-xs text-slate-500 mt-0.5">Jobs matched by your verified skill set and target profile</p>
          </div>

          <div className="space-y-3">
            {jobs.map(job => {
              const applied = applications.some(a => a.job_id === job.id);
              return (
                <Card key={job.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                      <Badge variant="primary">{job.company_name}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 max-w-2xl">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}/yr</span>
                      <span>•</span>
                      <span>Exp: {job.experience_required} yr</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    {applied ? (
                      <Badge variant="success" className="px-3 py-1 text-xs">
                        ✓ Applied
                      </Badge>
                    ) : (
                      <Button size="sm" variant="primary" onClick={() => handleApplyJob(job)} id={`btn-apply-job-${job.id}`}>
                        Apply
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* View 11: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Job Applications</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live tracking of recruitment status across hiring partners</p>
          </div>

          <div className="space-y-2.5">
            {applications.map(app => (
              <Card key={app.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{app.job?.title || 'Job Application'}</h3>
                  <p className="text-xs text-slate-500">{app.job?.company_name} • {app.job?.location}</p>
                  <div className="mt-1 text-[10px] text-slate-400">Applied: {formatDate(app.applied_at)}</div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right text-xs">
                    <span className="text-slate-500">Match:</span>
                    <strong className="text-indigo-700 ml-1">{app.overall_match_score}%</strong>
                  </div>
                  <Badge variant={app.status === 'Selected' ? 'success' : app.status === 'Interview' ? 'purple' : 'primary'}>
                    {app.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 12: EMPLOYMENT & 3/6/12M RETENTION */}
      {activeTab === 'employment' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Employment & Longitudinal Retention Tracker</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated EPFO & employer verification engine for 3, 6, and 12-month employment continuity (SIH26135)
            </p>
          </div>

          {/* Active Placement Record */}
          <Card className="p-4 border-emerald-200 bg-emerald-50/50">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Active Verified Placement</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Junior Full Stack Engineer</h3>
                <p className="text-xs text-slate-600">Apex Infotech Solutions • Pune, Maharashtra</p>
              </div>
              <Badge variant="success">Active Employed</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3.5 pt-3 border-t border-emerald-200/60 text-xs">
              <div>
                <span className="text-slate-500">Joining Date</span>
                <div className="font-bold text-slate-900 mt-0.5">15 Nov 2025</div>
              </div>
              <div>
                <span className="text-slate-500">Annual Compensation</span>
                <div className="font-bold text-emerald-700 mt-0.5">₹4,80,000 / year</div>
              </div>
              <div>
                <span className="text-slate-500">Training Institute</span>
                <div className="font-bold text-slate-900 mt-0.5">MSIAS Pune</div>
              </div>
              <div>
                <span className="text-slate-500">Verification Engine</span>
                <div className="font-bold text-indigo-700 mt-0.5">EPFO Wage Remittance Simulator</div>
              </div>
            </div>
          </Card>

          {/* 3, 6, 12 Month Milestones */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Retention Milestones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {verifications.map(ev => (
                <Card key={ev.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase">{ev.verification_period.replace('_', ' ')} Milestone</span>
                    <Badge variant={ev.status === 'simulated_epfo_verified' ? 'success' : 'warning'}>
                      {ev.status === 'simulated_epfo_verified' ? 'Verified' : 'Scheduled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ev.notes}</p>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                    Method: {ev.verification_method.replace('_', ' ')}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Candidate Profile & Credentials">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
              Personal & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                id="input-edit-fullname"
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98230 12345"
                id="input-edit-phone"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="District / Location"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                placeholder="e.g. Pune, Mumbai, Nagpur"
                id="input-edit-district"
              />
              <Input
                label="Target Job Role"
                value={targetJob}
                onChange={e => setTargetJob(e.target.value)}
                placeholder="e.g. Full Stack Web Developer"
                required
                id="input-edit-targetjob"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
              Academic & Professional Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highest Education</label>
                <select
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-2xs focus:outline-none focus:border-indigo-500"
                  id="select-edit-education"
                >
                  <option value="Bachelor of Technology (B.Tech)">Bachelor of Technology (B.Tech)</option>
                  <option value="Bachelor of Engineering (B.E.)">Bachelor of Engineering (B.E.)</option>
                  <option value="Bachelor of Science (B.Sc / BCA)">Bachelor of Science (B.Sc / BCA)</option>
                  <option value="Master of Technology (M.Tech)">Master of Technology (M.Tech)</option>
                  <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                  <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                  <option value="ITI Vocational Certificate">ITI Vocational Certificate</option>
                  <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                </select>
              </div>

              <Input
                label="Degree / Branch / Major"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                placeholder="e.g. Computer Science, Electrical"
                required
                id="input-edit-degree"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  min="1990"
                  max="2035"
                  value={gradYear}
                  onChange={e => setGradYear(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-2xs focus:outline-none focus:border-indigo-500"
                  id="input-edit-gradyear"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={expYears}
                  onChange={e => setExpYears(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-2xs focus:outline-none focus:border-indigo-500"
                  id="input-edit-expyears"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Status</label>
                <select
                  value={employmentStatus}
                  onChange={e => setEmploymentStatus(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-2xs focus:outline-none focus:border-indigo-500"
                  id="select-edit-status"
                >
                  <option value="unemployed">Unemployed / Seeking</option>
                  <option value="in_training">In Training (MSIAS)</option>
                  <option value="placed">Placed</option>
                  <option value="verified_employed">Verified Employed (EPFO)</option>
                  <option value="seeking_upgrade">Seeking Career Upgrade</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" id="btn-save-profile" isLoading={isSavingProfile}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Skill Modal */}
      <Modal isOpen={isAddSkillOpen} onClose={() => setIsAddSkillOpen(false)} title="Add Technical Skill to Profile">
        <div className="space-y-4">
          {/* Information Notice */}
          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 flex items-start gap-2.5 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Skills added by candidates start with a <strong className="font-semibold text-amber-800">Self-Declared</strong> status. To earn the <strong className="font-semibold text-emerald-800">Verified Competency</strong> badge, complete the modular assessment or accredited training certification.
            </p>
          </div>

          {/* Search & Filter Master Catalog */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Browse Master Skills Catalog</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={addSkillSearch}
                  onChange={e => setAddSkillSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
                  id="input-catalog-search"
                />
              </div>

              <select
                value={addSkillCategory}
                onChange={e => setAddSkillCategory(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 shadow-2xs focus:outline-none focus:border-indigo-500"
                id="select-catalog-category"
              >
                {skillCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Skill Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skill Selector List */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Skill ({availableMasterSkills.length} available)
            </label>
            {availableMasterSkills.length > 0 ? (
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-slate-50/50">
                {availableMasterSkills.map(s => {
                  const isSelected = newSkillId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setNewSkillId(s.id)}
                      className={`p-2.5 text-xs cursor-pointer transition-colors flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-50 border-l-4 border-indigo-600'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-500">{s.category}</div>
                        {s.description && (
                          <div className="text-[10px] text-slate-400 line-clamp-1">{s.description}</div>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 border border-slate-200 rounded-lg bg-slate-50">
                {addSkillSearch || addSkillCategory !== 'all'
                  ? 'No available skills match this search. Try clearing filters.'
                  : 'All available catalog skills have already been added to your profile!'}
              </div>
            )}
          </div>

          {/* Proficiency Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Your Proficiency Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setNewSkillLevel(lvl)}
                  className={`p-2 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                    newSkillLevel === lvl
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAddSkillOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddSkill}
              disabled={!newSkillId || availableMasterSkills.length === 0 || isSavingSkill}
              isLoading={isSavingSkill}
              id="btn-confirm-add-skill"
            >
              Add Skill to Profile
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Skill Confirmation Modal */}
      <Modal
        isOpen={Boolean(skillToDelete)}
        onClose={() => setSkillToDelete(null)}
        title="Remove Skill Confirmation"
      >
        <div className="space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to remove <strong className="text-slate-900 font-bold">{skillToDelete?.skill?.name}</strong> ({skillToDelete?.skill?.category}) from your candidate profile?
          </p>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            Note: Removing this skill will immediately update your candidate profile and recalculate your overall profile completion score.
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSkillToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDeleteSkill}
              isLoading={isDeletingSkill}
              id="btn-confirm-delete-skill"
            >
              Remove Skill
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
