import React, { useState } from 'react';
import { Application, Job, ApplicationStatus } from '../../../types';
import { Card, Badge, Button, UserAvatar } from '../../ui';
import {
  Layers,
  Users,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';

interface PipelineKanbanViewProps {
  applications: Application[];
  jobs: Job[];
  initialJobId?: string | null;
  onOpenCandidateProfile: (candidateId: string, applicationId: string) => void;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
}

const STAGES: { key: ApplicationStatus; label: string; color: string; bg: string; border: string }[] = [
  {
    key: 'Applied',
    label: 'Applied',
    color: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-50 dark:bg-slate-900/60',
    border: 'border-slate-300 dark:border-slate-700'
  },
  {
    key: 'Screening',
    label: 'Screening',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50/40 dark:bg-amber-950/20',
    border: 'border-amber-300 dark:border-amber-800'
  },
  {
    key: 'Shortlisted',
    label: 'Shortlisted',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50/40 dark:bg-blue-950/20',
    border: 'border-blue-300 dark:border-blue-800'
  },
  {
    key: 'Interview',
    label: 'Interview',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50/40 dark:bg-purple-950/20',
    border: 'border-purple-300 dark:border-purple-800'
  },
  {
    key: 'Selected',
    label: 'Selected / Hired',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
    border: 'border-emerald-300 dark:border-emerald-800'
  },
  {
    key: 'Rejected',
    label: 'Rejected',
    color: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50/40 dark:bg-rose-950/20',
    border: 'border-rose-300 dark:border-rose-800'
  }
];

const NEXT_STAGE_MAP: Record<ApplicationStatus, ApplicationStatus | null> = {
  Applied: 'Screening',
  Screening: 'Shortlisted',
  Shortlisted: 'Interview',
  Interview: 'Selected',
  Selected: null,
  Rejected: 'Applied'
};

const PREV_STAGE_MAP: Record<ApplicationStatus, ApplicationStatus | null> = {
  Applied: null,
  Screening: 'Applied',
  Shortlisted: 'Screening',
  Interview: 'Shortlisted',
  Selected: 'Interview',
  Rejected: null
};

export const PipelineKanbanView: React.FC<PipelineKanbanViewProps> = ({
  applications,
  jobs,
  initialJobId,
  onOpenCandidateProfile,
  onStatusChange
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || 'all');

  const filteredApps = applications.filter(app => {
    return selectedJobId === 'all' || app.job_id === selectedJobId;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Layers className="w-3.5 h-3.5" />
            Visual Candidate Pipeline
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Hiring Pipeline Kanban
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Advance candidates across stages, schedule interviews, and finalize hiring decisions.
          </p>
        </div>

        {/* Vacancy Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Filter by Vacancy:
          </label>
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold"
          >
            <option value="all">All Job Vacancies ({jobs.length})</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} — {j.company_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Container (Horizontal Scrollable) */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4 min-w-[1280px]">
          {STAGES.map(stage => {
            const stageApps = filteredApps.filter(a => a.status === stage.key);
            const nextStage = NEXT_STAGE_MAP[stage.key];
            const prevStage = PREV_STAGE_MAP[stage.key];

            return (
              <div
                key={stage.key}
                className={`flex-1 min-w-[260px] rounded-2xl border ${stage.border} ${stage.bg} flex flex-col max-h-[75vh]`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${stage.color}`}>{stage.label}</span>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-200">
                    {stageApps.length}
                  </span>
                </div>

                {/* Candidate Cards Column Content */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1">
                  {stageApps.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-medium">
                      No candidates in {stage.label}
                    </div>
                  ) : (
                    stageApps.map(app => {
                      const readiness = app.readiness_score || 82;

                      return (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2.5"
                        >
                          {/* Card Top: Candidate info */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <UserAvatar
                                avatarUrl={app.candidate?.avatar_url}
                                name={app.candidate?.full_name}
                                size="sm"
                                className="w-8 h-8 rounded-lg ring-1 ring-indigo-500/30 shrink-0"
                              />
                              <div className="min-w-0">
                                <button
                                  onClick={() => onOpenCandidateProfile(app.candidate_id, app.id)}
                                  className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 truncate text-left block"
                                >
                                  {app.candidate?.full_name || 'Candidate'}
                                </button>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {app.candidate?.district || 'Location Unspecified'}
                                </div>
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                readiness >= 85
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                              }`}
                            >
                              {readiness}%
                            </span>
                          </div>

                          {/* Applied Role */}
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg truncate">
                            {app.job?.title}
                          </div>

                          {/* Action Bar */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                            <button
                              onClick={() => onOpenCandidateProfile(app.candidate_id, app.id)}
                              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-0.5"
                            >
                              <Eye className="w-3 h-3" />
                              Profile
                            </button>

                            <div className="flex items-center gap-1">
                              {prevStage && (
                                <button
                                  onClick={() => onStatusChange(app.id, prevStage)}
                                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                                  title={`Move back to ${prevStage}`}
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {stage.key !== 'Rejected' && (
                                <button
                                  onClick={() => onStatusChange(app.id, 'Rejected')}
                                  className="p-1 rounded bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100"
                                  title="Reject"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {nextStage && (
                                <button
                                  onClick={() => onStatusChange(app.id, nextStage)}
                                  className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-500 flex items-center gap-0.5 shadow-sm"
                                  title={`Advance to ${nextStage}`}
                                >
                                  Advance
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
