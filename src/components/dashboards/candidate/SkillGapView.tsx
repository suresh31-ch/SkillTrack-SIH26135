import React, { useState, useMemo } from 'react';
import {
  JobRole,
  JobRoleSkill,
  Skill,
  CandidateSkill,
  SkillGapAnalysisResult,
  SkillGapStatus,
  SkillGapSeverity
} from '../../../types';
import { CandidateService } from '../../../lib/candidateService';
import { Card, Badge, Button, Input } from '../../ui';
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
  SlidersHorizontal,
  Flame,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
  candidateProfileId,
  candidateSkills,
  masterSkills,
  jobRoles,
  jobRoleSkills,
  currentTargetJob,
  onUpdateTargetJob,
  onNavigateToRoadmap,
  onOpenAddSkill
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    const matched = jobRoles.find(
      r => r.name.toLowerCase() === (currentTargetJob || '').toLowerCase() || r.id === currentTargetJob
    );
    return matched?.id || jobRoles[0]?.id || '10000000-0000-0000-0000-000000000001';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [activeVisualizer, setActiveVisualizer] = useState<'bar' | 'radar'>('bar');

  // Selected Role Object
  const selectedRole = useMemo(() => {
    return jobRoles.find(r => r.id === selectedJobId) || jobRoles[0];
  }, [jobRoles, selectedJobId]);

  // Compute Skill Gap Analysis
  const analysis: SkillGapAnalysisResult = useMemo(() => {
    return CandidateService.analyzeSkillGap(
      selectedRole?.id || selectedJobId,
      candidateSkills,
      jobRoles,
      jobRoleSkills,
      masterSkills
    );
  }, [selectedRole, selectedJobId, candidateSkills, jobRoles, jobRoleSkills, masterSkills]);

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
  const filteredItems = useMemo(() => {
    return analysis.items.filter(item => {
      const matchSearch =
        item.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skill_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'READY' && item.status === 'READY') ||
        (statusFilter === 'IMPROVE' && item.status === 'IMPROVE') ||
        (statusFilter === 'MISSING' && item.status === 'MISSING');

      const matchImportance =
        importanceFilter === 'all' || item.importance.toLowerCase() === importanceFilter.toLowerCase();

      return matchSearch && matchStatus && matchImportance;
    });
  }, [analysis.items, searchQuery, statusFilter, importanceFilter]);

  // Chart Data
  const chartData = useMemo(() => {
    const profMap: Record<string, number> = {
      None: 0,
      Beginner: 25,
      Intermediate: 50,
      Advanced: 75,
      Expert: 100
    };

    return analysis.items.map(item => ({
      skill: item.skill_name.length > 14 ? item.skill_name.substring(0, 12) + '..' : item.skill_name,
      fullName: item.skill_name,
      required: profMap[item.required_proficiency] || 50,
      candidate: profMap[item.candidate_proficiency] || 0,
      status: item.status,
      verified: item.verified
    }));
  }, [analysis.items]);

  const isCurrentTarget = selectedRole?.name.toLowerCase() === (currentTargetJob || '').toLowerCase();

  return (
    <div className="space-y-6">
      {/* Header & Target Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="text-xs">
              AI Skill Gap Engine
            </Badge>
            <span className="text-xs text-slate-500 font-medium">Deterministic Scoring v2.0</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Career Readiness & Gap Analyzer</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Evaluate your competencies against real job market requirements, compute instant readiness indexes, and generate targeted micro-roadmaps.
          </p>
        </div>

        {/* Role Selector Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Target Role:
            </label>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
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

      {/* Readiness Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Readiness Score Card (5 Cols) */}
        <Card className="lg:col-span-5 p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Market Readiness Index
              </span>
              <Badge variant={isCurrentTarget ? 'success' : 'purple'} className="text-[10px]">
                {isCurrentTarget ? 'Active Target Job' : 'Simulated Target'}
              </Badge>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedRole?.name}</h3>
              <p className="text-xs text-indigo-200/80 line-clamp-2 mt-0.5">{selectedRole?.description}</p>
            </div>

            {/* Big Gauge Display */}
            <div className="flex items-center gap-4 pt-2">
              <div className="relative w-20 h-20 rounded-full bg-indigo-800/60 border-4 border-indigo-400/40 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-white">{analysis.readiness_score}%</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  {analysis.readiness_score >= 80 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Ready for Placement</span>
                    </>
                  ) : analysis.readiness_score >= 50 ? (
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
                  {analysis.ready_count} of {analysis.total_required} skill requirements satisfied
                </p>
                <div className="text-[10px] text-indigo-300/80">
                  {analysis.verified_count} verified via assessments
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-indigo-800/60 flex items-center justify-between relative z-10 text-xs">
            <span className="text-indigo-300">Industry: {selectedRole?.category}</span>
            <button
              onClick={() => onNavigateToRoadmap()}
              className="text-white hover:text-indigo-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Generate Full Roadmap <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Status Counters & Highlights (7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Ready Skills */}
          <Card className="p-4 bg-emerald-50/50 border-emerald-200 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready Skills
              </span>
              <div className="text-3xl font-black text-emerald-900 mt-1">{analysis.ready_count}</div>
              <p className="text-[11px] text-emerald-700">Meet or exceed role requirements</p>
            </div>
            <div className="pt-2 text-[10px] text-emerald-600 font-medium">
              {analysis.verified_count} verified credentials
            </div>
          </Card>

          {/* Need Improvement */}
          <Card className="p-4 bg-amber-50/50 border-amber-200 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Need Boost
              </span>
              <div className="text-3xl font-black text-amber-900 mt-1">{analysis.improve_count}</div>
              <p className="text-[11px] text-amber-700">Partial level, need advancement</p>
            </div>
            <div className="pt-2 text-[10px] text-amber-700 font-medium truncate">
              {analysis.top_improve_skill ? `Focus: ${analysis.top_improve_skill.skill_name}` : 'No partial gaps'}
            </div>
          </Card>

          {/* Missing Skills */}
          <Card className="p-4 bg-rose-50/50 border-rose-200 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Missing Skills
              </span>
              <div className="text-3xl font-black text-rose-900 mt-1">{analysis.missing_count}</div>
              <p className="text-[11px] text-rose-700">Crucial for job shortlisting</p>
            </div>
            <div className="pt-2 text-[10px] text-rose-700 font-medium truncate">
              {analysis.top_missing_skill ? `Top: ${analysis.top_missing_skill.skill_name}` : 'All skills present'}
            </div>
          </Card>

          {/* Actionable Interventions Banner (Spans 3 Cols on SM) */}
          <div className="sm:col-span-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="p-2 rounded bg-indigo-100 text-indigo-700 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Highest Impact Action: </span>
                {analysis.top_missing_skill ? (
                  <span className="text-slate-700">
                    Acquire <strong>{analysis.top_missing_skill.skill_name}</strong> ({analysis.top_missing_skill.importance} Priority) to boost your score by ~15-20%.
                  </span>
                ) : analysis.top_improve_skill ? (
                  <span className="text-slate-700">
                    Upgrade <strong>{analysis.top_improve_skill.skill_name}</strong> from {analysis.top_improve_skill.candidate_proficiency} to {analysis.top_improve_skill.required_proficiency}.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium">
                    All requirements satisfied! Take assessment tests to verify competencies.
                  </span>
                )}
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => onNavigateToRoadmap(analysis.top_missing_skill?.skill_id || analysis.top_improve_skill?.skill_id)}
              className="text-xs shrink-0"
              id="btn-view-prescribed-roadmap"
            >
              View Micro-Roadmap
            </Button>
          </div>
        </div>
      </div>

      {/* Visualizer Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Comparison Chart (8 Cols) */}
        <Card className="lg:col-span-8 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Skill Competency vs Industry Requirement
              </h3>
              <p className="text-[11px] text-slate-500">Benchmark level (% proficiency scale) for {selectedRole?.name}</p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveVisualizer('bar')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeVisualizer === 'bar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setActiveVisualizer('radar')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeVisualizer === 'radar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Radar Web
              </button>
            </div>
          </div>

          <div className="h-64 pt-2">
            {activeVisualizer === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="skill"
                    stroke="#64748b"
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-md text-xs space-y-1">
                            <div className="font-bold text-slate-900">{data.fullName}</div>
                            <div className="text-indigo-600 font-semibold">Required: {data.required}%</div>
                            <div className="text-emerald-600 font-semibold">
                              Current: {data.candidate}% {data.verified ? '(Verified)' : ''}
                            </div>
                            <div className="text-[10px] text-slate-500 capitalize">Status: {data.status}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
                  <Bar dataKey="required" name="Job Requirement" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="candidate" name="My Current Proficiency" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" stroke="#64748b" tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" tick={{ fontSize: 9 }} />
                  <Radar name="Market Requirement" dataKey="required" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                  <Radar name="My Competency" dataKey="candidate" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Category Readiness Breakdown (4 Cols) */}
        <Card className="lg:col-span-4 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Domain Competency Breakdown
            </h3>
            <div className="space-y-2.5">
              {Object.entries(analysis.category_breakdown).map(([cat, data]) => {
                const percent = data.total > 0 ? Math.round((data.ready / data.total) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{cat}</span>
                      <span className="font-bold text-indigo-700">
                        {data.ready}/{data.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          percent >= 80 ? 'bg-emerald-500' : percent >= 40 ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Micro-roadmaps prioritize domains with lower completion to accelerate overall job readiness.
          </div>
        </Card>
      </div>

      {/* Granular Skill Requirements & Delta Matrix */}
      <div className="space-y-4">
        {/* Controls & Search */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search requirements by skill name, domain, or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-600 shadow-2xs"
                id="input-search-skill-gap"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({analysis.items.length})
              </button>
              <button
                onClick={() => setStatusFilter('MISSING')}
                className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  statusFilter === 'MISSING'
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'text-rose-700 hover:bg-rose-100/50'
                }`}
              >
                Missing ({analysis.missing_count})
              </button>
              <button
                onClick={() => setStatusFilter('IMPROVE')}
                className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  statusFilter === 'IMPROVE'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-amber-700 hover:bg-amber-100/50'
                }`}
              >
                Need Boost ({analysis.improve_count})
              </button>
              <button
                onClick={() => setStatusFilter('READY')}
                className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  statusFilter === 'READY'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-emerald-700 hover:bg-emerald-100/50'
                }`}
              >
                Ready ({analysis.ready_count})
              </button>
            </div>
          </div>
        </Card>

        {/* Requirements Matrix Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredItems.map(item => (
              <Card
                key={item.skill_id}
                className={`p-4 flex flex-col justify-between border-l-4 hover:shadow-md transition-shadow ${
                  item.status === 'READY'
                    ? 'border-l-emerald-500'
                    : item.status === 'IMPROVE'
                    ? 'border-l-amber-500'
                    : 'border-l-rose-500'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.skill_name}</h4>
                      <Badge variant="primary" className="text-[10px] mt-1">
                        {item.skill_category}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    {item.status === 'READY' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> READY
                      </span>
                    ) : item.status === 'IMPROVE' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-600" /> IMPROVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-600" /> MISSING
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                  {/* Proficiency Comparison */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Required Level:</span>
                      <strong className="text-indigo-700 font-bold">{item.required_proficiency}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Your Current Level:</span>
                      <strong
                        className={`font-bold flex items-center gap-1 ${
                          item.status === 'READY'
                            ? 'text-emerald-700'
                            : item.status === 'IMPROVE'
                            ? 'text-amber-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {item.candidate_proficiency}
                        {item.verified && <ShieldCheck className="w-3 h-3 text-emerald-600" title="Verified Skill" />}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400">Importance:</span>
                      <Badge
                        variant={
                          item.importance === 'Critical'
                            ? 'danger'
                            : item.importance === 'High'
                            ? 'warning'
                            : 'default'
                        }
                        className="text-[10px]"
                      >
                        {item.importance} Priority
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {item.status === 'MISSING' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOpenAddSkill(item.skill_id)}
                      className="text-xs py-1"
                      leftIcon={<Plus className="w-3 h-3 text-indigo-600" />}
                    >
                      Declare Skill
                    </Button>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      {item.verified ? 'Verified Credential' : 'Self-Declared'}
                    </span>
                  )}

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigateToRoadmap(item.skill_id)}
                    className="text-xs py-1"
                    rightIcon={<ChevronRight className="w-3 h-3" />}
                  >
                    Micro-Roadmap
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">No Skill Requirements Match Filter</h3>
            <p className="text-xs text-slate-500">Try adjusting your active search query or status filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
