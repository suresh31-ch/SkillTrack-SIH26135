import React, { useState, useMemo, useEffect } from 'react';
import {
  JobRole,
  JobRoleSkill,
  Skill,
  CandidateSkill,
  RoadmapItem,
  CandidateRoadmapProgress
} from '../../../types';
import {
  SkillIntelligenceEngine,
  CompatibilityScoreResult,
  RoleSkillMatch,
  RankedLearningPriority
} from '../../../lib/skillIntelligenceEngine';
import { LocalDbService } from '../../../lib/supabase';
import { Card, Badge, Button } from '../../ui';
import {
  TrendingUp,
  Target,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Search,
  BookOpen,
  Plus,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  Info,
  Flame,
  Brain,
  Code2,
  Check,
  Compass,
  Lightbulb
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface SkillGapViewProps {
  candidateProfileId: string;
  candidateSkills: CandidateSkill[];
  masterSkills: Skill[];
  jobRoles: JobRole[];
  jobRoleSkills: JobRoleSkill[];
  currentTargetJob: string;
  onUpdateTargetJob: (newJobName: string) => Promise<void>;
  onNavigateToRoadmap: (skillId?: string) => void;
  onOpenAddSkill: (skillId?: string) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  candidateProfileId = 'prof-cand-001',
  candidateSkills = [],
  masterSkills = [],
  jobRoles = [],
  jobRoleSkills = [],
  currentTargetJob = 'Full Stack Web Developer',
  onUpdateTargetJob,
  onNavigateToRoadmap,
  onOpenAddSkill
}) => {
  const safeJobRoles = jobRoles && jobRoles.length > 0 ? jobRoles : [];
  const roadmapItems = useMemo(() => LocalDbService.getRoadmapItems(), []);
  const allJobs = useMemo(() => LocalDbService.getJobs(), []);

  // Candidate roadmap progress from storage
  const candidateProgress = useMemo(() => {
    return LocalDbService.getCandidateRoadmapProgress(candidateProfileId);
  }, [candidateProfileId]);

  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    const matched = safeJobRoles.find(
      r => r.name.toLowerCase() === (currentTargetJob || '').toLowerCase() || r.id === currentTargetJob
    );
    return matched?.id || safeJobRoles[0]?.id || '10000000-0000-0000-0000-000000000001';
  });

  // Guided Workflow Step (Steps 1 to 6)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [activeVisualizer, setActiveVisualizer] = useState<'bar' | 'radar'>('bar');

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<'gemini-3.8-flash' | 'deterministic-engine'>('deterministic-engine');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Selected Role Object
  const selectedRole = useMemo(() => {
    return safeJobRoles.find(r => r.id === selectedJobId) || safeJobRoles[0];
  }, [safeJobRoles, selectedJobId]);

  // Requirements for the selected role
  const roleRequirements = useMemo(() => {
    const reqs = jobRoleSkills.filter(rs => rs.job_role_id === selectedRole?.id);
    return reqs.length > 0 ? reqs : jobRoleSkills.slice(0, 5);
  }, [jobRoleSkills, selectedRole]);

  // Comprehensive Deterministic Compatibility Result
  const compatibilityResult: CompatibilityScoreResult = useMemo(() => {
    return SkillIntelligenceEngine.calculateRoleCompatibility({
      targetRole: selectedRole,
      roleRequirements,
      candidateSkills,
      allRoadmapItems: roadmapItems,
      candidateRoadmapProgress: candidateProgress,
      activeJobs: allJobs
    });
  }, [selectedRole, roleRequirements, candidateSkills, roadmapItems, candidateProgress, allJobs]);

  // Sync initial explanation
  useEffect(() => {
    setAiExplanation(compatibilityResult.ai_explanation || null);
    setAiSource('deterministic-engine');
  }, [compatibilityResult]);

  // Handle Request AI Advisor Explanation
  const handleRequestAiAdvice = async () => {
    setIsLoadingAi(true);
    try {
      const res = await SkillIntelligenceEngine.requestAiExplanation(compatibilityResult);
      setAiExplanation(res.explanation);
      setAiSource(res.source);
    } catch {
      setAiExplanation(compatibilityResult.ai_explanation || 'Deterministic analysis generated.');
      setAiSource('deterministic-engine');
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Handle Target Job Switch & Database Sync
  const handleSetAsTargetJob = async () => {
    if (!selectedRole) return;
    setIsUpdatingTarget(true);
    try {
      await onUpdateTargetJob(selectedRole.name);
    } finally {
      setIsUpdatingTarget(false);
    }
  };

  // Filtered Matrix Items
  const filteredMatches = useMemo(() => {
    return compatibilityResult.matches.filter(item => {
      const matchSearch =
        item.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.explanation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'MEETS' && (item.status === 'MEETS_REQUIREMENT' || item.status === 'EXCEEDS_REQUIREMENT')) ||
        (statusFilter === 'DEFICIT' && item.status === 'PROFICIENCY_DEFICIT') ||
        (statusFilter === 'UNASSESSED' && item.status === 'UNASSESSED');

      const matchImportance =
        importanceFilter === 'all' || item.importance.toLowerCase() === importanceFilter.toLowerCase();

      return matchSearch && matchStatus && matchImportance;
    });
  }, [compatibilityResult.matches, searchQuery, statusFilter, importanceFilter]);

  // Visualization Data
  const chartData = useMemo(() => {
    return compatibilityResult.matches.map(item => ({
      skill: item.skill_name.length > 14 ? item.skill_name.substring(0, 12) + '..' : item.skill_name,
      fullName: item.skill_name,
      required: item.required_rank * 25,
      candidate: item.candidate_rank * 25,
      status: item.status,
      evidence: item.evidence
    }));
  }, [compatibilityResult.matches]);

  const isCurrentTarget = selectedRole?.name.toLowerCase() === (currentTargetJob || '').toLowerCase();

  const workflowSteps = [
    { num: 1, title: 'Target Role', desc: 'Select career goal' },
    { num: 2, title: 'Requirements', desc: 'Review competencies' },
    { num: 3, title: 'Match & Gaps', desc: 'Inspect alignment' },
    { num: 4, title: 'Ranked Roadmaps', desc: 'Prioritize learning' },
    { num: 5, title: 'Code Lab Practice', desc: 'Complete milestones' },
    { num: 6, title: 'Readiness Boost', desc: 'Track score delta' }
  ];

  return (
    <div className="space-y-6">
      {/* 6-Step Guided Career Guidance Workflow Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-400" /> Candidate AI Career Guidance Workflow
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Step {activeWorkflowStep} of 6:</span>
            <span className="font-bold text-white">{workflowSteps[activeWorkflowStep - 1].title}</span>
          </div>
        </div>

        {/* Workflow Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3">
          {workflowSteps.map(step => {
            const isActive = activeWorkflowStep === step.num;
            const isCompleted = activeWorkflowStep > step.num;
            return (
              <button
                key={step.num}
                onClick={() => setActiveWorkflowStep(step.num)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-950/70 text-white ring-1 ring-indigo-500/50'
                    : isCompleted
                    ? 'border-emerald-800/60 bg-emerald-950/30 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isActive ? 'bg-indigo-500 text-white' : isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : step.num}
                  </span>
                  <span className="text-[11px] font-bold truncate">{step.title}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{step.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header & Target Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="text-xs">
              Skill Intelligence Engine v2.0
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Deterministic Scoring & Evidence Weighting</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Career Competency & Skill Gap Advisor</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Evaluate your competencies against real job market requirements, compute instant readiness indexes, and generate targeted micro-roadmaps.
          </p>
        </div>

        {/* Role Selector Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Target Career Role:
            </label>
            <select
              value={selectedJobId}
              onChange={e => {
                setSelectedJobId(e.target.value);
                setActiveWorkflowStep(2);
              }}
              className="w-full sm:w-64 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs cursor-pointer"
              id="select-target-job-role"
            >
              {jobRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name} ({role.category})
                </option>
              ))}
            </select>
          </div>

          {!isCurrentTarget && (
            <div className="sm:self-end">
              <Button
                size="sm"
                variant="primary"
                onClick={handleSetAsTargetJob}
                disabled={isUpdatingTarget}
                leftIcon={<Target className="w-3.5 h-3.5" />}
                className="text-xs"
                id="btn-set-primary-target"
              >
                {isUpdatingTarget ? 'Saving...' : 'Set as Primary Target'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Readiness Overview & AI Explanation Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Readiness Score Card (5 Cols) */}
        <Card className="lg:col-span-5 p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Deterministic Readiness Index
              </span>
              <Badge variant={isCurrentTarget ? 'success' : 'purple'} className="text-[10px]">
                {isCurrentTarget ? 'Active Goal' : 'Simulated'}
              </Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedRole?.name}</h3>
              <p className="text-xs text-indigo-200/80 line-clamp-2 mt-0.5">{selectedRole?.description}</p>
            </div>

            {/* Big Gauge Display */}
            <div className="flex items-center gap-4 pt-2">
              <div className="relative w-20 h-20 rounded-full bg-indigo-800/60 border-4 border-indigo-400/40 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-white">{compatibilityResult.overall_score}%</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  {compatibilityResult.overall_score >= 80 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Ready for Placement</span>
                    </>
                  ) : compatibilityResult.overall_score >= 50 ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">Near Industry Standard</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">Targeted Skilling Required</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-indigo-200">
                  {compatibilityResult.skills_count.meets_or_exceeds} of {compatibilityResult.skills_count.total_required} skill requirements satisfied
                </p>
                <div className="text-[10px] text-indigo-300/80">
                  {compatibilityResult.confidence_score}% verified via assessments
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-indigo-800/60 flex items-center justify-between relative z-10 text-xs">
            <span className="text-indigo-300">Next Gain: +{compatibilityResult.projected_improvement.next_milestone_gain}%</span>
            <button
              onClick={() => {
                setActiveWorkflowStep(4);
                onNavigateToRoadmap();
              }}
              className="text-white hover:text-indigo-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Open AI Roadmap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* AI Career Advice Panel (7 Cols) */}
        <Card className="lg:col-span-7 p-5 border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  AI Career Guidance & Competency Synthesis
                </h3>
              </div>
              <Badge variant={aiSource === 'gemini-3.8-flash' ? 'purple' : 'primary'} className="text-[10px]">
                {aiSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Deterministic Engine'}
              </Badge>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mt-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              {aiExplanation}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Next Best Action: <strong>{compatibilityResult.next_best_action}</strong></span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRequestAiAdvice}
              isLoading={isLoadingAi}
              leftIcon={<Brain className="w-3.5 h-3.5 text-indigo-600" />}
              className="text-xs shrink-0"
              id="btn-refresh-ai-advice"
            >
              Generate AI Advice
            </Button>
          </div>
        </Card>
      </div>

      {/* Ranked Learning Priority Recommendations (Section 4 & 7) */}
      <Card className="p-5 border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple">Ranked Learning Priorities</Badge>
              <span className="text-xs text-slate-500 font-medium">Explainable Progression Engine</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              Targeted Curriculum Recommendations to Maximize Role Readiness
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritized by requirement importance, proficiency delta, and live employer demand.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenAddSkill()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs shrink-0"
          >
            Add Self-Declared Skill
          </Button>
        </div>

        {compatibilityResult.learning_priorities.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-sm">All Role Competencies Satisfied!</div>
            <p className="mt-1 max-w-md mx-auto">
              Your recorded competencies meet or exceed all industry requirements for {selectedRole.name}. You are fully eligible for recruiter shortlisting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {compatibilityResult.learning_priorities.slice(0, 6).map(priority => (
              <div
                key={priority.skill_id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[11px] flex items-center justify-center border border-indigo-200 shrink-0">
                      {priority.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={priority.skill_name}>
                        {priority.skill_name}
                      </h4>
                      <span className="text-[10px] text-slate-400">{priority.category}</span>
                    </div>
                    <Badge variant={priority.importance === 'Critical' ? 'danger' : 'warning'} className="text-[10px] py-0 px-1.5 shrink-0">
                      {priority.importance}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {priority.reason}
                  </p>

                  <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-indigo-900 font-bold">
                      <span>Projected Readiness Gain:</span>
                      <span className="text-emerald-700">+{priority.projected_readiness_gain}%</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Active Employer Demand: {priority.market_demand_count} jobs
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigateToRoadmap(priority.skill_id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    Open Roadmap Lessons <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenAddSkill(priority.skill_id)}
                    className="text-[11px] py-1 px-2 text-slate-500"
                  >
                    Log Skill
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Visualizers & Comparative Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Viz 1: Competency Comparison */}
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" /> Role Competency Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Required industry benchmark vs. current candidate level</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setActiveVisualizer('bar')}
                className={`px-2 py-1 rounded font-medium ${activeVisualizer === 'bar' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Bar
              </button>
              <button
                onClick={() => setActiveVisualizer('radar')}
                className={`px-2 py-1 rounded font-medium ${activeVisualizer === 'radar' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'}`}
              >
                Radar
              </button>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              {activeVisualizer === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Level']}
                    labelFormatter={(_l, p) => p?.[0]?.payload?.fullName || _l}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="required" name="Required Level" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="candidate" name="My Competency" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 9 }} />
                  <Radar name="Required Level" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                  <Radar name="My Competency" dataKey="candidate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: '10px', color: '#475569' }} />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Viz 2: Category Breakdown */}
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" /> Category Attainment Ratios
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Readiness breakdown across technical domain categories</p>
            </div>
            <Badge variant="primary">Domain Score</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(compatibilityResult.category_breakdown).map(([cat, info]) => {
              const pct = info.max_score > 0 ? Math.round((info.score / info.max_score) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cat}</span>
                    <span className="font-bold text-slate-900">{pct}% ({info.matched_skills}/{info.total_skills} skills)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Granular Competency Breakdown Table */}
      <Card className="p-0 overflow-hidden border border-slate-200">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {selectedRole.name} — Detailed Competency Match Table ({filteredMatches.length})
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Transparent required vs candidate level, evidence type, and recommended next action
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-40"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
            >
              <option value="all">All Status</option>
              <option value="MEETS">Meets / Exceeds</option>
              <option value="DEFICIT">Deficit</option>
              <option value="UNASSESSED">Unassessed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5">Skill & Category</th>
                <th className="py-2.5 px-3.5">Importance</th>
                <th className="py-2.5 px-3.5">Required Prof.</th>
                <th className="py-2.5 px-3.5">Candidate Level</th>
                <th className="py-2.5 px-3.5">Evidence Type</th>
                <th className="py-2.5 px-3.5">Match Status</th>
                <th className="py-2.5 px-3.5">Action & Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMatches.map(m => (
                <tr key={m.skill_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3.5">
                    <div className="font-bold text-slate-900">{m.skill_name}</div>
                    <div className="text-[10px] text-slate-400">{m.category}</div>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      m.importance === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : m.importance === 'High'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.importance}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-900">
                    {m.required_proficiency}
                  </td>
                  <td className="py-2.5 px-3.5 font-semibold text-slate-700">
                    {m.candidate_proficiency}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      m.evidence === 'VERIFIED_ASSESSMENT' || m.evidence === 'INSTITUTE_CREDENTIAL'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : m.evidence === 'SELF_DECLARED'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {m.evidence.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      m.status === 'MEETS_REQUIREMENT' || m.status === 'EXCEEDS_REQUIREMENT'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : m.status === 'PROFICIENCY_DEFICIT'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {m.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5">
                    {m.status === 'MEETS_REQUIREMENT' || m.status === 'EXCEEDS_REQUIREMENT' ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Requirement Met
                      </span>
                    ) : (
                      <button
                        onClick={() => onNavigateToRoadmap(m.skill_id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        Study (+{m.projected_score_gain}%) <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
