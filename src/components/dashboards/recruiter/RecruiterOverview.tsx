import React from 'react';
import { Job, Application, ApplicationStatus } from '../../../types';
import { RecruiterStats } from '../../../lib/recruiterService';
import { Card, Badge, Button } from '../../ui';
import {
  Briefcase,
  Users,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  Award,
  Sparkles,
  PlusCircle,
  Search,
  Layers,
  ArrowRight,
  ChevronRight,
  Eye,
  Building,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface RecruiterOverviewProps {
  stats: RecruiterStats;
  jobs: Job[];
  applications: Application[];
  onNavigateTab: (tab: string, filterParam?: string) => void;
  onOpenCandidateProfile: (candidateId: string, applicationId?: string) => void;
  onQuickStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const RecruiterOverview: React.FC<RecruiterOverviewProps> = ({
  stats,
  jobs,
  applications,
  onNavigateTab,
  onOpenCandidateProfile,
  onQuickStatusChange
}) => {
  const activeJobsList = jobs.filter(j => j.status === 'open');
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              SkillTrack Recruiter Portal • SIH26135
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Recruiter Command Center
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Source verified talent trained under state skilling initiatives, evaluate candidate skill readiness, and streamline your hiring pipeline.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigateTab('post_job')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Post Job Vacancy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('candidates')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs"
            >
              <Search className="w-4 h-4 mr-1.5" />
              Search Candidates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('pipeline')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs"
            >
              <Layers className="w-4 h-4 mr-1.5" />
              View Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Job Postings */}
        <Card
          hover
          className="p-4 cursor-pointer transition-all border-slate-200 dark:border-slate-800"
          onClick={() => onNavigateTab('jobs')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Job Postings
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.totalJobs}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {stats.activeJobs} Active
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.closedJobs} closed • {stats.pausedJobs} paused
          </div>
        </Card>

        {/* Metric 2: Applications Received */}
        <Card
          hover
          className="p-4 cursor-pointer transition-all border-slate-200 dark:border-slate-800"
          onClick={() => onNavigateTab('applicants')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Applications
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.totalApplications}
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              {stats.screeningCount} in screening
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {stats.activeJobs} active vacancies
          </div>
        </Card>

        {/* Metric 3: Shortlisted Candidates */}
        <Card
          hover
          className="p-4 cursor-pointer transition-all border-slate-200 dark:border-slate-800"
          onClick={() => onNavigateTab('pipeline')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Shortlisted Candidates
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.shortlistedCount}
            </span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              {stats.interviewCount} interviews
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Top match candidates
          </div>
        </Card>

        {/* Metric 4: Placed / Hired */}
        <Card
          hover
          className="p-4 cursor-pointer transition-all border-slate-200 dark:border-slate-800"
          onClick={() => onNavigateTab('pipeline')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Selected / Hired
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.selectedCount}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {stats.offerAcceptanceRate}% offer rate
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg {stats.avgTimeToHireDays} days to hire
          </div>
        </Card>
      </div>

      {/* Visual Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Recruitment Pipeline Funnel */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Recruitment Pipeline Funnel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Candidate conversion across selection stages
              </p>
            </div>
            <Badge variant="primary" className="text-[10px]">
              Funnel Velocity
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.pipelineFunnel}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip
                  formatter={(value: any, name: string) => [`${value} Candidates`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Applications & Shortlists by Job Role */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Applications & Shortlists by Role
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of applicant interest across active job vacancies
              </p>
            </div>
            <Badge variant="success" className="text-[10px]">
              Demand Breakdown
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.applicationsByJob}
                margin={{ top: 10, right: 20, left: -10, bottom: 25 }}
              >
                <XAxis
                  dataKey="jobTitle"
                  stroke="#94a3b8"
                  fontSize={10}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="applications" name="Applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shortlisted" name="Shortlisted" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Talent Pool Skill Readiness Distribution */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Candidate Skill Readiness Cohorts
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of candidates by verified skill readiness score
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              Avg {stats.avgReadinessScore}%
            </div>
          </div>

          <div className="h-56 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.talentReadinessDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="range"
                  label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                >
                  {stats.talentReadinessDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Monthly Hiring & Application Velocity */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-500" />
                Hiring Velocity & Monthly Growth
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly application volume and successful placements
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              2026 Trend
            </Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.monthlyTrend}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Area type="monotone" dataKey="hires" name="Hires" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Recent Applicants Live Stream + Active Job Openings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Recent Applicants Triage */}
        <Card className="lg:col-span-2 p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Recent Applicants Stream
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick triage and stage action on latest applications
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNavigateTab('applicants')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
            >
              View All ({applications.length})
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentApps.map(app => (
              <div
                key={app.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={app.candidate?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                    alt={app.candidate?.full_name || 'Candidate'}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenCandidateProfile(app.candidate_id, app.id)}
                        className="font-bold text-xs text-slate-900 dark:text-slate-100 hover:text-indigo-600 truncate text-left"
                      >
                        {app.candidate?.full_name}
                      </button>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                        {app.readiness_score || 84}% Readiness
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{app.job?.title}</span>
                      <span>•</span>
                      <span>{app.candidate?.district || 'Pune'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <select
                    value={app.status}
                    onChange={e => onQuickStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:ring-2 focus:ring-indigo-500 ${
                      app.status === 'Selected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        : app.status === 'Interview'
                        ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                        : app.status === 'Shortlisted'
                        ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                        : app.status === 'Screening'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                        : app.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenCandidateProfile(app.candidate_id, app.id)}
                    className="text-[11px] px-2.5 py-1 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Column 3: Active Vacancies */}
        <Card className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Active Vacancies
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeJobsList.length} open for applications
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onNavigateTab('jobs')}
                className="text-xs text-indigo-600 font-semibold"
              >
                All Jobs
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {activeJobsList.slice(0, 4).map(job => {
                const jobAppCount = applications.filter(a => a.job_id === job.id).length;
                return (
                  <div
                    key={job.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {job.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{job.company_name}</span>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[9px] px-1.5 py-0 flex-shrink-0">
                        Active
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-[11px]">
                      <span className="text-slate-500">
                        ₹{(job.salary_min / 100000).toFixed(1)} - {(job.salary_max / 100000).toFixed(1)} LPA
                      </span>
                      <button
                        onClick={() => onNavigateTab('applicants', job.id)}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        {jobAppCount} Applicants →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('post_job')}
            className="w-full mt-4 text-xs font-bold border-dashed border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Create Another Vacancy
          </Button>
        </Card>
      </div>
    </div>
  );
};
