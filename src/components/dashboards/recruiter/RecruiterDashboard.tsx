import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { LocalDbService } from '../../../lib/supabase';
import { Button, Card, Badge, Input, Modal } from '../../ui';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';
import { ApplicationStatus } from '../../../types';
import {
  Briefcase,
  PlusCircle,
  Search,
  BookmarkCheck,
  Send,
  Building,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Sparkles,
  Filter,
  Check
} from 'lucide-react';

interface RecruiterDashboardProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ activeTab, onTabChange }) => {
  const { profile, organization } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState(() => LocalDbService.getJobs(organization?.id));
  const [applications, setApplications] = useState(() => LocalDbService.getApplications(organization?.id));
  const allCandidates = LocalDbService.getProfiles(organization?.id).filter(p => p.role === 'candidate');
  const allMasterSkills = LocalDbService.getSkills();

  // Filter states for candidate search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  // Post Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('Apex Infotech Solutions');
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [description, setDescription] = useState('');
  const [experienceRequired, setExperienceRequired] = useState(1);
  const [salaryMin, setSalaryMin] = useState(400000);
  const [salaryMax, setSalaryMax] = useState(650000);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !jobTitle.trim()) return;

    const newJob = LocalDbService.createJob({
      recruiter_id: profile.id,
      organization_id: organization?.id || profile.organization_id,
      company_name: companyName,
      title: jobTitle.trim(),
      description: description || 'Exciting opportunity for skilled candidates.',
      location,
      experience_required: Number(experienceRequired),
      education_required: 'B.Tech / BCA / ITI / Diploma',
      salary_min: Number(salaryMin),
      salary_max: Number(salaryMax),
      status: 'open'
    });

    setJobs(LocalDbService.getJobs(organization?.id));
    showToast('Job Vacancy Posted', `Successfully listed "${newJob.title}" for candidates!`, 'success');
    onTabChange('my_jobs');

    // Reset form
    setJobTitle('');
    setDescription('');
  };

  const handleStatusChange = (appId: string, status: ApplicationStatus) => {
    LocalDbService.updateApplicationStatus(appId, status);
    setApplications(LocalDbService.getApplications(organization?.id));
    showToast('Status Updated', `Candidate application marked as ${status}.`, 'info');
  };

  const filteredCandidates = allCandidates.filter(c => {
    const matchesSearch = c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      {/* View 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Recruiter Hub</Badge>
                <span className="text-xs text-slate-500">Hiring for: {organization?.name}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Welcome back, {profile?.full_name || 'Pooja Deshmukh'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct talent sourcing from certified skilling cohorts with verified skill-readiness metrics.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              onClick={() => onTabChange('post_job')}
              id="btn-recruiter-post-quick"
            >
              Post New Vacancy
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Active Job Postings</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{jobs.filter(j => j.status === 'open').length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Across 3 districts</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Total Applicants</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{applications.length}</div>
              <div className="text-[11px] text-indigo-600 font-medium mt-1">Avg Match: 88%</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Shortlisted / Interview</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">
                {applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">In active evaluation</div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-semibold text-slate-500">Selected / Placed</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {applications.filter(a => a.status === 'Selected').length}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Ready for joining</div>
            </Card>
          </div>

          {/* Recent Applications Triage */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-emerald-600" /> Recent Applicant Pipeline
              </h3>
              <Button size="sm" variant="ghost" onClick={() => onTabChange('applications')} className="text-xs">
                View All
              </Button>
            </div>

            <div className="space-y-2.5">
              {applications.slice(0, 3).map(app => (
                <div key={app.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{app.candidate?.full_name}</h4>
                      <Badge variant="primary" className="text-[10px]">Match: {app.overall_match_score}%</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Applied for: {app.job?.title} • {app.candidate?.district}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(app.id, 'Interview')}>
                      Interview
                    </Button>
                    <Button size="sm" variant="success" onClick={() => handleStatusChange(app.id, 'Selected')}>
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* View 2: COMPANY PROFILE */}
      {activeTab === 'company_profile' && (
        <Card className="p-5 space-y-4 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900">Employer Profile</h2>
          <p className="text-xs text-slate-500">Institutional hiring partner profile and recruitment contact info</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Company Name</span>
              <div className="text-xs font-bold text-slate-900 mt-1">Apex Infotech Solutions Pvt Ltd</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Hiring Recruiter</span>
              <div className="text-xs font-bold text-slate-900 mt-1">{profile?.full_name}</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Corporate Location</span>
              <div className="text-xs font-bold text-slate-900 mt-1">Hinjawadi IT Park, Pune</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Skilling Tenant Partner</span>
              <div className="text-xs font-bold text-slate-900 mt-1">{organization?.name}</div>
            </div>
          </div>
        </Card>
      )}

      {/* View 3: POST JOB */}
      {activeTab === 'post_job' && (
        <Card className="p-5 max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900">Post New Job Opening</h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            Specify requirements to automatically match with certified skilling graduates
          </p>

          <form onSubmit={handlePostJob} className="space-y-3.5">
            <Input
              label="Job Title / Role"
              placeholder="e.g. Junior Full Stack Engineer"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              required
              id="input-post-job-title"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Company / Division"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
              />
              <Input
                label="Location (City, District)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Experience (Years)"
                type="number"
                value={experienceRequired}
                onChange={e => setExperienceRequired(Number(e.target.value))}
              />
              <Input
                label="Min Salary (₹/yr)"
                type="number"
                value={salaryMin}
                onChange={e => setSalaryMin(Number(e.target.value))}
              />
              <Input
                label="Max Salary (₹/yr)"
                type="number"
                value={salaryMax}
                onChange={e => setSalaryMax(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description & Scope</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe key responsibilities and required technical capabilities..."
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none shadow-2xs"
              />
            </div>

            <Button type="submit" className="w-full" id="btn-submit-post-job">
              Publish Job Vacancy
            </Button>
          </form>
        </Card>
      )}

      {/* View 4: MY JOBS */}
      {activeTab === 'my_jobs' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Active Job Vacancies</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage posted listings and view incoming candidate pipelines</p>
            </div>
            <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-3.5 h-3.5" />} onClick={() => onTabChange('post_job')}>
              Post Job
            </Button>
          </div>

          <div className="space-y-3">
            {jobs.map(job => (
              <Card key={job.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <Badge variant={job.status === 'open' ? 'success' : 'default'}>
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{job.location} • Exp: {job.experience_required} yr</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">
                    {formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}/year
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onTabChange('applications')}>
                    View Applications ({applications.filter(a => a.job_id === job.id).length})
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 5: CANDIDATE SEARCH */}
      {activeTab === 'candidate_search' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Talent Search & Discovery</h2>
              <p className="text-xs text-slate-500 mt-0.5">Filter verified candidates by district and readiness score</p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Input
                placeholder="Search candidate name or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 text-xs"
              />
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none shadow-2xs"
              >
                <option value="All">All Districts</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai Suburban">Mumbai</option>
                <option value="Chhatrapati Sambhajinagar">Sambhajinagar</option>
                <option value="Nagpur">Nagpur</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCandidates.map(cand => (
              <Card key={cand.id} className="p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-indigo-50 border border-indigo-200 shrink-0">
                    <img
                      src={cand.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128'}
                      alt={cand.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{cand.full_name}</h3>
                    <p className="text-[11px] text-slate-500">{cand.district}, MH</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant="primary" className="text-[10px]">Readiness: 84%</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{cand.email}</span>
                  <Button size="sm" variant="outline" onClick={() => onTabChange('post_job')}>
                    Invite
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View 6: SHORTLISTED & 7: APPLICATIONS */}
      {(activeTab === 'shortlisted' || activeTab === 'applications') && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {activeTab === 'shortlisted' ? 'Shortlisted Candidates' : 'All Job Applications'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Triage applicant statuses and schedule interviews</p>
          </div>

          <div className="space-y-2.5">
            {applications
              .filter(a => activeTab === 'applications' || a.status === 'Shortlisted')
              .map(app => (
                <Card key={app.id} className="p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{app.candidate?.full_name}</h3>
                      <Badge variant="primary">Match: {app.overall_match_score}%</Badge>
                      <Badge variant={app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'danger' : 'purple'}>
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Applied for: <strong>{app.job?.title}</strong> ({app.job?.company_name}) • {app.candidate?.district}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-0.5">Applied: {formatDate(app.applied_at)}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(app.id, 'Shortlisted')}>
                      Shortlist
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange(app.id, 'Interview')}>
                      Interview
                    </Button>
                    <Button size="sm" variant="success" onClick={() => handleStatusChange(app.id, 'Selected')}>
                      Select
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleStatusChange(app.id, 'Rejected')}>
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
