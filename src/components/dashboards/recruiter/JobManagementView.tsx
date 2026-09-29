import React, { useState } from 'react';
import { Job, Application } from '../../../types';
import { Card, Badge, Button, Input } from '../../ui';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Building,
  MapPin,
  IndianRupee,
  Users,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Award,
  Grid,
  List,
  Save,
  X
} from 'lucide-react';

interface JobManagementViewProps {
  jobs: Job[];
  applications: Application[];
  onNavigateToPostJob: () => void;
  onViewJobApplicants: (jobId: string) => void;
  onUpdateJob: (jobId: string, updates: Partial<Job>) => void;
  onDeleteJob: (jobId: string) => void;
}

export const JobManagementView: React.FC<JobManagementViewProps> = ({
  jobs,
  applications,
  onNavigateToPostJob,
  onViewJobApplicants,
  onUpdateJob,
  onDeleteJob
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'paused' | 'draft'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Edit Modal State
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStatus, setEditStatus] = useState<Job['status']>('open');
  const [editSalaryMin, setEditSalaryMin] = useState(0);
  const [editSalaryMax, setEditSalaryMax] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [editExperience, setEditExperience] = useState(1);

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditCompany(job.company_name);
    setEditLocation(job.location);
    setEditStatus(job.status);
    setEditSalaryMin(job.salary_min);
    setEditSalaryMax(job.salary_max);
    setEditDescription(job.description);
    setEditExperience(job.experience_required);
  };

  const handleSaveEdit = () => {
    if (!editingJob) return;
    onUpdateJob(editingJob.id, {
      title: editTitle,
      company_name: editCompany,
      location: editLocation,
      status: editStatus,
      salary_min: Number(editSalaryMin),
      salary_max: Number(editSalaryMax),
      description: editDescription,
      experience_required: Number(editExperience)
    });
    setEditingJob(null);
  };

  // Distinct locations for filter
  const locations = Array.from(new Set(jobs.map(j => j.location.split(',')[0].trim())));

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.required_skills?.some(s => s.skill_name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || job.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Job Postings & Vacancy Portfolio
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Job Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your company's active openings, review candidate flow, and edit criteria.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateToPostJob}
          className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create New Vacancy
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by job title, company, skills, or location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="all">All Statuses ({jobs.length})</option>
              <option value="open">Active / Open ({jobs.filter(j => j.status === 'open').length})</option>
              <option value="closed">Closed ({jobs.filter(j => j.status === 'closed').length})</option>
              <option value="paused">Paused ({jobs.filter(j => j.status === 'paused').length})</option>
            </select>

            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Jobs Container */}
      {filteredJobs.length === 0 ? (
        <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            No matching job vacancies found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or filters, or create a new job opening.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setLocationFilter('all');
            }}
            className="mt-4 text-xs font-semibold"
          >
            Reset Filters
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map(job => {
            const jobApps = applications.filter(a => a.job_id === job.id);
            const shortlistedCount = jobApps.filter(
              a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected'
            ).length;

            return (
              <Card
                key={job.id}
                hover
                className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Badge & Menu */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        job.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : job.status === 'closed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {job.status === 'open' && <CheckCircle className="w-3 h-3" />}
                      {job.status === 'closed' && <XCircle className="w-3 h-3" />}
                      {job.status === 'paused' && <PauseCircle className="w-3 h-3" />}
                      {job.status.toUpperCase()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Job"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
                            onDeleteJob(job.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Company */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2.5 line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.company_name}</span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>

                  {/* Salary & Exp Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      ₹{(job.salary_min / 100000).toFixed(1)}L - {(job.salary_max / 100000).toFixed(1)}L PA
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {job.experience_required === 0 ? 'Fresher' : `${job.experience_required}+ Yrs Exp`}
                    </span>
                    {job.employment_type && (
                      <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                        {job.employment_type}
                      </span>
                    )}
                  </div>

                  {/* Required Skills Chips */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                        Key Skills Required:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {job.required_skills.slice(0, 3).map(skill => (
                          <span
                            key={skill.id}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {skill.skill_name || 'Skill'}
                          </span>
                        ))}
                        {job.required_skills.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                            +{job.required_skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Candidate Quota & Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {jobApps.length} Applicants
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium">
                      {shortlistedCount} shortlisted
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status quick toggle */}
                    {job.status === 'open' ? (
                      <button
                        onClick={() => onUpdateJob(job.id, { status: 'closed' })}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/30"
                      >
                        Close
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateJob(job.id, { status: 'open' })}
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/30"
                      >
                        Reopen
                      </button>
                    )}

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onViewJobApplicants(job.id)}
                      className="text-xs font-bold px-2.5 py-1"
                    >
                      Applicants
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Job Title & Company</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Salary Range</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Applicants</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredJobs.map(job => {
                  const jobApps = applications.filter(a => a.job_id === job.id);
                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {job.title}
                        </div>
                        <div className="text-[11px] text-slate-500">{job.company_name}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[11px]">{job.location}</td>
                      <td className="py-3.5 px-4 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ₹{(job.salary_min / 100000).toFixed(1)}L - {(job.salary_max / 100000).toFixed(1)}L PA
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            job.status === 'open'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : job.status === 'closed'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onViewJobApplicants(job.id)}
                          className="font-bold text-indigo-600 hover:underline"
                        >
                          {jobApps.length}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(job)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewJobApplicants(job.id)}
                            className="text-[11px] px-2 py-1 font-semibold"
                          >
                            Applicants
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-indigo-600" />
                Edit Job Vacancy
              </h3>
              <button
                onClick={() => setEditingJob(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Job Title
                </label>
                <Input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Company Name
                  </label>
                  <Input
                    value={editCompany}
                    onChange={e => setEditCompany(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Location
                  </label>
                  <Input
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Min Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={editSalaryMin}
                    onChange={e => setEditSalaryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Max Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={editSalaryMax}
                    onChange={e => setEditSalaryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="open">Open / Active</option>
                    <option value="closed">Closed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Job Description
                </label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" variant="ghost" onClick={() => setEditingJob(null)} className="text-xs">
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveEdit} className="text-xs font-bold">
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
