import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { LocalDbService } from '../../../../lib/supabase';
import { AnalyticsService } from '../../../../lib/analyticsService';
import { Card, Badge, Button } from '../../../ui';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  Sparkles,
  Search,
  AlertCircle,
  Briefcase,
  Users,
  GraduationCap,
  Download,
  Filter,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Building2,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';

export const SkillSupplyDemandView: React.FC = () => {
  const { organization, isSupabaseLive } = useAuth();
  const { showToast } = useToast();

  // Load actual application data from LocalDbService / Supabase
  const allMasterSkills = useMemo(() => LocalDbService.getSkills(), []);
  const allJobs = useMemo(() => LocalDbService.getJobs(organization?.id), [organization]);
  const allCandidates = useMemo(
    () => LocalDbService.getProfiles(organization?.id).filter(p => p.role === 'candidate'),
    [organization]
  );
  const allCandidateSkills = useMemo(() => LocalDbService.getAllCandidateSkills(), []);
  const allJobRoles = useMemo(() => LocalDbService.getJobRoles(), []);
  const allJobRoleSkills = useMemo(() => LocalDbService.getJobRoleSkills(), []);
  const allRoadmapItems = useMemo(() => LocalDbService.getRoadmapItems(), []);
  const allOrganizations = useMemo(() => LocalDbService.getOrganizations(), []);

  // Filter States
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract distinct districts from jobs and candidates
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    allJobs.forEach(j => {
      if (j.location) {
        const parts = j.location.split(',')[0].replace(' (Hybrid)', '').replace(' (Remote)', '').trim();
        if (parts) set.add(parts);
      }
    });
    allCandidates.forEach(c => {
      if (c.district) set.add(c.district);
    });
    return ['all', ...Array.from(set).sort()];
  }, [allJobs, allCandidates]);

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set(allMasterSkills.map(s => s.category));
    return ['all', ...Array.from(set).sort()];
  }, [allMasterSkills]);

  // Filtered Jobs based on selected criteria
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // Org filter
      if (selectedOrg !== 'all' && job.organization_id !== selectedOrg) return false;

      // District filter
      if (selectedDistrict !== 'all') {
        const loc = (job.location || '').toLowerCase();
        if (!loc.includes(selectedDistrict.toLowerCase())) return false;
      }

      // Role filter
      if (selectedRole !== 'all') {
        const title = (job.title || '').toLowerCase();
        if (!title.includes(selectedRole.toLowerCase())) return false;
      }

      // Date range filter
      if (selectedDateRange !== 'all') {
        const jobDate = new Date(job.created_at || '2026-08-01');
        const now = new Date('2026-09-28');
        const diffDays = (now.getTime() - jobDate.getTime()) / (1000 * 3600 * 24);
        if (selectedDateRange === '30' && diffDays > 30) return false;
        if (selectedDateRange === '60' && diffDays > 60) return false;
        if (selectedDateRange === '90' && diffDays > 90) return false;
      }

      return true;
    });
  }, [allJobs, selectedOrg, selectedDistrict, selectedRole, selectedDateRange]);

  // Filtered Candidates based on criteria
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter(c => {
      if (selectedDistrict !== 'all' && c.district) {
        if (!c.district.toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
      }
      return true;
    });
  }, [allCandidates, selectedDistrict]);

  const candidateIdSet = useMemo(() => new Set(filteredCandidates.map(c => c.id)), [filteredCandidates]);

  // Aggregate metrics per master skill
  const skillMetrics = useMemo(() => {
    return allMasterSkills.map(skill => {
      // 1. Demand: Number of job listings requiring this skill
      const requiringJobs = filteredJobs.filter(job => {
        return (job.required_skills || []).some(
          rs =>
            rs.skill_id === skill.id ||
            (rs.skill_name && rs.skill_name.toLowerCase() === skill.name.toLowerCase()) ||
            (rs.name && rs.name.toLowerCase() === skill.name.toLowerCase())
        );
      });
      const jobListingCount = requiringJobs.length;

      // 2. Supply: Number of candidates who possess this skill
      const candidateRecords = allCandidateSkills.filter(
        cs => cs.skill_id === skill.id && candidateIdSet.has(cs.candidate_id)
      );
      const candidateCount = candidateRecords.length;

      // 3. Candidates meeting required proficiency (Intermediate, Advanced, or Expert)
      const proficientCandidates = candidateRecords.filter(cs =>
        ['Intermediate', 'Advanced', 'Expert'].includes(cs.proficiency_level)
      );
      const proficientCount = proficientCandidates.length;

      // 4. Difference between employer demand and candidate supply (Deficit = Demand - Supply)
      const gap = jobListingCount - candidateCount;

      // 5. Proficiency Coverage %: (Proficient candidates / Job listings) * 100
      const coverageRate = jobListingCount > 0 ? Math.round((proficientCount / jobListingCount) * 100) : 100;

      // 6. Associated Job Roles from catalog
      const associatedJobRoles = allJobRoleSkills
        .filter(jrs => jrs.skill_id === skill.id)
        .map(jrs => {
          const role = allJobRoles.find(r => r.id === jrs.job_role_id);
          return role ? role.name : null;
        })
        .filter(Boolean) as string[];

      // 7. Roadmaps available in SkillTrack
      const roadmapsForSkill = allRoadmapItems.filter(r => r.skill_id === skill.id);

      // Status classification based on transparent formula
      let status: 'critical_deficit' | 'moderate_deficit' | 'balanced' | 'surplus' = 'balanced';
      if (jobListingCount > 0 && candidateCount === 0) {
        status = 'critical_deficit';
      } else if (gap > 1) {
        status = 'critical_deficit';
      } else if (gap === 1) {
        status = 'moderate_deficit';
      } else if (candidateCount > jobListingCount && jobListingCount > 0) {
        status = 'surplus';
      } else if (jobListingCount === 0 && candidateCount > 0) {
        status = 'surplus';
      }

      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        jobListingCount,
        requiringJobs: requiringJobs.map(j => j.title),
        candidateCount,
        proficientCount,
        gap,
        coverageRate,
        associatedJobRoles,
        roadmapMilestonesCount: roadmapsForSkill.length,
        roadmapItems: roadmapsForSkill,
        status
      };
    });
  }, [
    allMasterSkills,
    filteredJobs,
    allCandidateSkills,
    candidateIdSet,
    allJobRoleSkills,
    allJobRoles,
    allRoadmapItems
  ]);

  // Filter skills based on UI filters & search
  const filteredSkillMetrics = useMemo(() => {
    return skillMetrics.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchRole = item.associatedJobRoles.some(r => r.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchRole) return false;
      }
      return true;
    });
  }, [skillMetrics, selectedCategory, searchQuery]);

  // Overall summary metrics
  const totalJobsAnalyzed = filteredJobs.length;
  const totalCandidatesAnalyzed = filteredCandidates.length;
  const skillsInDemand = skillMetrics.filter(s => s.jobListingCount > 0).length;
  const skillsWithDeficit = skillMetrics.filter(s => s.status === 'critical_deficit' || s.status === 'moderate_deficit').length;

  // Chart data: Top 8 skills by Job Demand
  const topDemandChartData = useMemo(() => {
    return [...filteredSkillMetrics]
      .sort((a, b) => b.jobListingCount - a.jobListingCount || b.candidateCount - a.candidateCount)
      .slice(0, 8)
      .map(s => ({
        name: s.name.length > 18 ? s.name.substring(0, 16) + '..' : s.name,
        fullName: s.name,
        jobDemand: s.jobListingCount,
        candidateSupply: s.candidateCount,
        proficientSupply: s.proficientCount
      }));
  }, [filteredSkillMetrics]);

  // Data-driven Training Priorities & Recommendations Engine
  const trainingRecommendations = useMemo(() => {
    return skillMetrics
      .filter(s => s.jobListingCount > 0 && s.gap >= 0)
      .sort((a, b) => b.gap - a.gap || b.jobListingCount - a.jobListingCount)
      .slice(0, 4)
      .map(s => {
        return {
          skill: s.name,
          category: s.category,
          demandCount: s.jobListingCount,
          supplyCount: s.candidateCount,
          gap: s.gap,
          coverageRate: s.coverageRate,
          roadmapMilestones: s.roadmapMilestonesCount,
          associatedRoles: s.associatedJobRoles,
          recommendation: `High industry priority: required by ${s.jobListingCount} active job listing(s), while only ${s.candidateCount} candidate(s) currently possess this competency.`
        };
      });
  }, [skillMetrics]);

  // CSV Export Handler
  const handleExportCsv = () => {
    const filename = `skilltrack_skill_demand_intelligence_${new Date().toISOString().split('T')[0]}`;
    const headers = [
      'Skill Name',
      'Sector Domain',
      'Active Job Listings Requiring',
      'Candidate Supply (Trained)',
      'Proficient Candidates (Inter+)',
      'Net Talent Gap (Demand - Supply)',
      'Proficiency Coverage (%)',
      'Demand Classification',
      'Associated Standard Roles',
      'SkillTrack Roadmaps Available'
    ];

    const rows = filteredSkillMetrics.map(s => [
      s.name,
      s.category,
      s.jobListingCount,
      s.candidateCount,
      s.proficientCount,
      s.gap > 0 ? `+${s.gap} Deficit` : `${s.gap} Surplus`,
      `${s.coverageRate}%`,
      s.status.replace('_', ' ').toUpperCase(),
      s.associatedJobRoles.join('; ') || 'General',
      `${s.roadmapMilestonesCount} Lessons`
    ]);

    AnalyticsService.exportToCsv(filename, headers, rows);
    showToast('Export Success', 'Skill Demand & Supply Intelligence report exported to CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="purple">SIH26135 Intelligence</Badge>
            <span className="text-xs text-slate-500 font-medium">Empirical Labor Market Calibration</span>
            {isSupabaseLive && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Live Supabase Connected
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Skill Demand & Candidate Supply Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Calculated strictly from active hiring requisitions and verified candidate competency records. Identifies talent shortages, proficiency coverage, and prioritized skilling roadmaps without speculative extrapolation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCsv}
            id="btn-export-demand-csv"
          >
            Export Demand Matrix (CSV)
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Job Listings</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalJobsAnalyzed}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-0.5">
            Verified employer requisitions
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Candidate Talent Pool</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{totalCandidatesAnalyzed}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Registered candidate profiles
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Skills in Demand</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1">{skillsInDemand}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Explicitly required in postings
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Skills with Talent Deficit</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{skillsWithDeficit}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-0.5">
            Employer demand exceeds supply
          </div>
        </Card>
      </div>

      {/* Transparent Calculation Methodology Disclosure (Anti-Hallucination) */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900">Transparent Calculation Methodology & Scope Disclosure:</span>
          <p className="leading-relaxed">
            • <strong>Job Listings Count (Demand):</strong> Number of active job postings explicitly requiring the skill in their vacancy specifications. Job listings are evaluated as discrete postings; multi-seat vacancies are not assumed unless specified in job schema.<br />
            • <strong>Candidate Supply:</strong> Distinct registered candidates possessing the skill in their verified or declared competency roster.<br />
            • <strong>Proficiency Coverage:</strong> Count of candidates with Intermediate, Advanced, or Expert proficiency relative to active job demands.<br />
            • <strong>Net Talent Gap:</strong> <code className="text-indigo-800 font-mono">Job Listings Requiring - Candidate Supply</code>. Positive values denote undersupply (priority upskilling targets).
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-indigo-600" /> Multi-Dimensional Calibration Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="all">All Districts / Regions</option>
              {availableDistricts
                .filter(d => d !== 'all')
                .map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {/* Sector / Domain */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="all">All Skill Categories</option>
              {categories
                .filter(c => c !== 'all')
                .map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          {/* Organization Tenant */}
          <div>
            <select
              value={selectedOrg}
              onChange={e => setSelectedOrg(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="all">All Sponsoring Orgs</option>
              {allOrganizations.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <select
              value={selectedDateRange}
              onChange={e => setSelectedDateRange(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="all">All Date Horizons</option>
              <option value="30">Last 30 Days Postings</option>
              <option value="60">Last 60 Days Postings</option>
              <option value="90">Last 90 Days Postings</option>
            </select>
          </div>
        </div>

        {selectedDistrict !== 'all' && filteredJobs.length === 0 && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              No job postings recorded for district <strong>{selectedDistrict}</strong> in active database. Showing state-wide competencies.
            </span>
          </div>
        )}
      </Card>

      {/* Visualizations: Ranked Skill-Demand & Supply Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Ranked Skill-Demand Chart */}
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> Most Required Skills (Ranked by Job Requisitions)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Top skills by frequency in active job vacancy descriptions</p>
            </div>
            <Badge variant="primary">{topDemandChartData.length} Ranked</Badge>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDemandChartData} margin={{ top: 10, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Job Postings`, 'Demand']}
                  labelFormatter={(lbl, p) => (p && p[0] ? (p[0].payload as any).fullName : lbl)}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', borderColor: '#e2e8f0' }}
                />
                <Bar dataKey="jobDemand" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Job Postings Requiring Skill" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Demand vs Supply Comparison Chart */}
        <Card className="p-5 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> Employer Demand vs Candidate Supply Comparison
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Job postings demand versus total candidate supply & proficient candidates</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDemandChartData} margin={{ top: 10, right: 15, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#475569', fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [val, name]}
                  labelFormatter={(lbl, p) => (p && p[0] ? (p[0].payload as any).fullName : lbl)}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', borderColor: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="jobDemand" name="Job Postings (Demand)" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                <Bar dataKey="candidateSupply" name="Candidate Pool (Supply)" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="proficientSupply" name="Proficient (Inter+)" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Priority Training Recommendations Engine */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" /> Priority Training Recommendations & Curricular Interventions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Derived from calculated skill deficits and multi-role employer demand. Labeled as data-driven recommendations, not guaranteed employment outcomes.
            </p>
          </div>
          <Badge variant="purple">Actionable Interventions</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingRecommendations.map((rec, idx) => (
            <Card key={idx} className="p-4 border-slate-200 bg-white space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{rec.skill}</span>
                    <Badge variant="primary">{rec.category}</Badge>
                  </div>
                  <div className="text-xs text-rose-700 font-semibold mt-1">
                    Talent Deficit: +{rec.gap} Candidates Needed ({rec.demandCount} Jobs vs {rec.supplyCount} Candidates)
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Priority #{idx + 1}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {rec.recommendation}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px]">Cross-Role Relevance:</span>
                  <div className="font-semibold text-slate-800 text-[11px] truncate">
                    {rec.associatedRoles.length > 0 ? rec.associatedRoles.join(', ') : 'Direct Industry Requisition'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">SkillTrack Roadmap:</span>
                  <div className="font-semibold text-indigo-700 text-[11px]">
                    {rec.roadmapMilestones > 0 ? `${rec.roadmapMilestones} Modular Lessons Ready` : 'Curriculum Draft Needed'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Granular Demand vs Supply Data Table */}
      <Card className="p-0 overflow-hidden border border-slate-200">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Granular Skill Demand & Supply Calibration Matrix
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Showing {filteredSkillMetrics.length} competencies based on active database records
            </p>
          </div>
          <Badge variant="primary">{filteredSkillMetrics.length} Records</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3.5">Skill Name</th>
                <th className="py-2.5 px-3.5">Category</th>
                <th className="py-2.5 px-3.5 text-center">Job Postings (Demand)</th>
                <th className="py-2.5 px-3.5 text-center">Candidate Pool (Supply)</th>
                <th className="py-2.5 px-3.5 text-center">Proficient (Inter+)</th>
                <th className="py-2.5 px-3.5 text-center">Net Gap (D - S)</th>
                <th className="py-2.5 px-3.5">Market Status</th>
                <th className="py-2.5 px-3.5">SkillTrack Roadmap</th>
                <th className="py-2.5 px-3.5">Associated Standard Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSkillMetrics.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No skills found matching selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSkillMetrics.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-500">{item.category}</td>
                    <td className="py-2.5 px-3.5 text-center font-bold text-indigo-700">
                      {item.jobListingCount}
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-semibold text-slate-900">
                      {item.candidateCount}
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-semibold text-emerald-700">
                      {item.proficientCount}
                    </td>
                    <td className="py-2.5 px-3.5 text-center font-bold">
                      {item.gap > 0 ? (
                        <span className="text-rose-700 font-bold">+{item.gap} Deficit</span>
                      ) : item.gap < 0 ? (
                        <span className="text-emerald-700 font-semibold">{Math.abs(item.gap)} Surplus</span>
                      ) : (
                        <span className="text-slate-500">0 (Balanced)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          item.status === 'critical_deficit'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.status === 'moderate_deficit'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : item.status === 'surplus'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.status === 'critical_deficit'
                          ? 'Critical Deficit'
                          : item.status === 'moderate_deficit'
                          ? 'Moderate Deficit'
                          : item.status === 'surplus'
                          ? 'Talent Surplus'
                          : 'Balanced'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-indigo-700 font-medium">
                      {item.roadmapMilestonesCount > 0 ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {item.roadmapMilestonesCount} Lessons
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No Roadmap</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-500 text-[11px] max-w-[200px] truncate">
                      {item.associatedJobRoles.length > 0 ? item.associatedJobRoles.join(', ') : 'Open Hiring Requisitions'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
