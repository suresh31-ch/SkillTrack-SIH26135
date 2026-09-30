import React, { useState } from 'react';
import { Application, Job, ApplicationStatus } from '../../../types';
import { Card, Badge, Button, Input, UserAvatar } from '../../ui';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  ChevronRight,
  UserCheck,
  ChevronDown,
  ArrowUpDown,
  Building
} from 'lucide-react';

interface ApplicantManagementViewProps {
  applications: Application[];
  jobs: Job[];
  initialSelectedJobId?: string | null;
  onOpenCandidateProfile: (candidateId: string, applicationId: string) => void;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus, notes?: string) => void;
}

export const ApplicantManagementView: React.FC<ApplicantManagementViewProps> = ({
  applications,
  jobs,
  initialSelectedJobId,
  onOpenCandidateProfile,
  onStatusChange
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(initialSelectedJobId || 'all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [readinessFilter, setReadinessFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'readiness' | 'match'>('readiness');

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesJob = selectedJobId === 'all' || app.job_id === selectedJobId;
    const matchesStage = stageFilter === 'all' || app.status === stageFilter;

    const appReadiness = app.readiness_score || 80;
    const matchesReadiness =
      readinessFilter === 'all' ||
      (readinessFilter === '90' && appReadiness >= 90) ||
      (readinessFilter === '80' && appReadiness >= 80) ||
      (readinessFilter === '70' && appReadiness >= 70);

    const matchesSearch =
      (app.candidate?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.candidate?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.candidate?.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesJob && matchesStage && matchesReadiness && matchesSearch;
  });

  // Sort
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'readiness') {
      return (b.readiness_score || 0) - (a.readiness_score || 0);
    }
    if (sortBy === 'match') {
      return (b.skill_match_score || 0) - (a.skill_match_score || 0);
    }
    return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header & Metric Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Users className="w-3.5 h-3.5" />
            Applicant Triage & Evaluation
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Applicant Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate candidate readiness scores, review certificates, and advance candidates through recruitment stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            {sortedApps.length} Candidates Found
          </div>
        </div>
      </div>

      {/* Filter and Job Selector Bar */}
      <Card className="p-4 border-slate-200 dark:border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Job Opening Selector */}
          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Filter by Job Vacancy
            </label>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="all">All Job Vacancies ({jobs.length})</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Application Stage
            </label>
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="all">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Readiness Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Skill Readiness
            </label>
            <select
              value={readinessFilter}
              onChange={e => setReadinessFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="all">All Readiness Scores</option>
              <option value="90">90%+ Top Ready</option>
              <option value="80">80%+ Job Ready</option>
              <option value="70">70%+ Qualified</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="readiness">Highest Skill Readiness</option>
              <option value="match">Highest Skill Match %</option>
              <option value="date">Most Recent Applied</option>
            </select>
          </div>
        </div>

        {/* Search Query */}
        <div className="relative pt-1">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search applicants by name, email, target role, or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      {/* Applicant Cards List */}
      {sortedApps.length === 0 ? (
        <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            No applicants found matching these filters
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your vacancy filter, recruitment stage, or search terms.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedJobId('all');
              setStageFilter('all');
              setReadinessFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-semibold"
          >
            Clear All Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedApps.map(app => {
            const readiness = app.readiness_score || 82;
            const matchScore = app.skill_match_score || 85;

            return (
              <Card
                key={app.id}
                hover
                className="p-4 border-slate-200 dark:border-slate-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Avatar & Candidate Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <UserAvatar
                      avatarUrl={app.candidate?.avatar_url}
                      name={app.candidate?.full_name}
                      size="lg"
                      className="w-12 h-12 rounded-xl ring-2 ring-indigo-500/20 shadow-sm"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-white dark:ring-slate-900" title="Verified SkillTrack Profile">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onOpenCandidateProfile(app.candidate_id, app.id)}
                        className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate text-left"
                      >
                        {app.candidate?.full_name}
                      </button>
                      <Badge variant="primary" className="text-[10px] px-2 py-0 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                        {app.candidate?.target_job || 'Technical Specialist'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <strong className="text-slate-700 dark:text-slate-300 font-semibold">{app.job?.title}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {app.candidate?.district || 'Pune'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center: Scores */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl self-stretch md:self-auto justify-around md:justify-start">
                  <div className="text-center px-2">
                    <div
                      className={`text-base font-black ${
                        readiness >= 85
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : readiness >= 75
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {readiness}%
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      Readiness Score
                    </div>
                  </div>

                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                  <div className="text-center px-2">
                    <div className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {matchScore}%
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                      Skill Match
                    </div>
                  </div>
                </div>

                {/* Right: Stage Selector & Action Buttons */}
                <div className="flex items-center gap-2 justify-between md:justify-end">
                  {/* Recruitment Stage Dropdown */}
                  <select
                    value={app.status}
                    onChange={e => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 shadow-sm ${
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
                    <option value="Applied">Stage: Applied</option>
                    <option value="Screening">Stage: Screening</option>
                    <option value="Shortlisted">Stage: Shortlisted</option>
                    <option value="Interview">Stage: Interview</option>
                    <option value="Selected">Stage: Selected / Hired</option>
                    <option value="Rejected">Stage: Rejected</option>
                  </select>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onOpenCandidateProfile(app.candidate_id, app.id)}
                    className="text-xs font-bold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Full Profile
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
