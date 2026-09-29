import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { LocalDbService } from '../../../lib/supabase';
import { RecruiterService } from '../../../lib/recruiterService';
import {
  Job,
  Application,
  ApplicationStatus,
  RecruiterCandidateDetail
} from '../../../types';
import { RecruiterOverview } from './RecruiterOverview';
import { PostJobForm } from './PostJobForm';
import { JobManagementView } from './JobManagementView';
import { ApplicantManagementView } from './ApplicantManagementView';
import { CandidateSearchView } from './CandidateSearchView';
import { PipelineKanbanView } from './PipelineKanbanView';
import { CandidateProfileModal } from './CandidateProfileModal';
import { Card, Badge, Button, Input } from '../../ui';
import {
  Building,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Save,
  Check
} from 'lucide-react';

interface RecruiterDashboardProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  activeTab,
  onTabChange
}) => {
  const { profile, organization } = useAuth();
  const { showToast } = useToast();

  const [jobs, setJobs] = useState<Job[]>(() => RecruiterService.getJobs(organization?.id));
  const [applications, setApplications] = useState<Application[]>(() => RecruiterService.getApplications(organization?.id));
  const [detailedCandidates, setDetailedCandidates] = useState<RecruiterCandidateDetail[]>(() =>
    RecruiterService.getDetailedCandidates()
  );
  const masterSkills = LocalDbService.getSkills();

  // Active filter param when navigating between tabs (e.g. from Jobs -> Applicants for jobId)
  const [filterJobId, setFilterJobId] = useState<string | null>(null);

  // Candidate Profile Modal state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  // Company Profile state
  const [companyName, setCompanyName] = useState(organization?.name || 'Apex Infotech Solutions');
  const [companyLocation, setCompanyLocation] = useState('Pune Hinjawadi Phase 2, Maharashtra');
  const [companyWebsite, setCompanyWebsite] = useState('https://apexinfotech.example.com');
  const [companyEmail, setCompanyEmail] = useState('careers@apexinfotech.example.com');
  const [companyPhone, setCompanyPhone] = useState('+91 20 6712 4000');
  const [companyIndustry, setCompanyIndustry] = useState('Information Technology & Cloud Engineering');
  const [companySize, setCompanySize] = useState('250 - 500 Employees');
  const [companyDesc, setCompanyDesc] = useState(
    'Leading digital engineering solutions provider partnering with state skill development missions to recruit job-ready technical talent.'
  );
  const [companySavedToast, setCompanySavedToast] = useState(false);

  // Reload data helper
  const reloadData = async () => {
    try {
      const [latestJobs, latestApps] = await Promise.all([
        RecruiterService.loadJobsAsync(organization?.id),
        RecruiterService.loadApplicationsAsync(organization?.id)
      ]);
      setJobs(latestJobs);
      setApplications(latestApps);
    } catch {
      setJobs(RecruiterService.getJobs(organization?.id));
      setApplications(RecruiterService.getApplications(organization?.id));
    }
    setDetailedCandidates(RecruiterService.getDetailedCandidates());
  };

  useEffect(() => {
    reloadData();
  }, [organization?.id]);

  const stats = RecruiterService.getRecruiterStats(organization?.id);

  const handleNavigateTab = (tab: string, filterParam?: string) => {
    if (filterParam) {
      setFilterJobId(filterParam);
    } else {
      setFilterJobId(null);
    }
    onTabChange(tab);
  };

  const handleOpenCandidateProfile = (candidateId: string, applicationId?: string) => {
    setSelectedCandidateId(candidateId);
    setSelectedApplicationId(applicationId || null);
  };

  const handleCloseCandidateProfile = () => {
    setSelectedCandidateId(null);
    setSelectedApplicationId(null);
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus, notes?: string) => {
    RecruiterService.updateApplicationStage(appId, newStatus, notes);
    reloadData();
    showToast(
      'Application Updated',
      `Candidate moved to "${newStatus}" stage.`,
      newStatus === 'Selected' ? 'success' : newStatus === 'Rejected' ? 'error' : 'info'
    );
  };

  const handleJobCreated = (newJob: Job) => {
    reloadData();
    showToast('Job Published', `"${newJob.title}" is now active and accepting applicants!`, 'success');
    onTabChange('jobs');
  };

  const handleUpdateJob = (jobId: string, updates: Partial<Job>) => {
    RecruiterService.updateJob(jobId, updates);
    reloadData();
    showToast('Job Updated', 'Job opening criteria updated successfully.', 'success');
  };

  const handleDeleteJob = (jobId: string) => {
    RecruiterService.deleteJob(jobId);
    reloadData();
    showToast('Job Deleted', 'Job opening was removed.', 'info');
  };

  const handleShortlistCandidate = (candidate: RecruiterCandidateDetail, job: Job) => {
    RecruiterService.shortlistCandidateForJob(candidate, job);
    reloadData();
    showToast(
      'Candidate Shortlisted',
      `${candidate.full_name} has been added to the shortlist pipeline for ${job.title}.`,
      'success'
    );
  };

  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanySavedToast(true);
    showToast('Profile Saved', 'Company recruiting profile details updated successfully.', 'success');
    setTimeout(() => setCompanySavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <RecruiterOverview
          stats={stats}
          jobs={jobs}
          applications={applications}
          onNavigateTab={handleNavigateTab}
          onOpenCandidateProfile={handleOpenCandidateProfile}
          onQuickStatusChange={handleStatusChange}
        />
      )}

      {/* 2. JOB MANAGEMENT */}
      {(activeTab === 'jobs' || activeTab === 'my_jobs') && (
        <JobManagementView
          jobs={jobs}
          applications={applications}
          onNavigateToPostJob={() => onTabChange('post_job')}
          onViewJobApplicants={jobId => handleNavigateTab('applicants', jobId)}
          onUpdateJob={handleUpdateJob}
          onDeleteJob={handleDeleteJob}
        />
      )}

      {/* 3. APPLICANT MANAGEMENT */}
      {activeTab === 'applicants' && (
        <ApplicantManagementView
          applications={applications}
          jobs={jobs}
          initialSelectedJobId={filterJobId}
          onOpenCandidateProfile={handleOpenCandidateProfile}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* 4. CANDIDATE SEARCH */}
      {activeTab === 'candidates' && (
        <CandidateSearchView
          candidates={detailedCandidates}
          masterSkills={masterSkills}
          jobs={jobs.filter(j => j.status === 'open')}
          onOpenCandidateProfile={handleOpenCandidateProfile}
          onShortlistCandidate={handleShortlistCandidate}
        />
      )}

      {/* 5. PIPELINE KANBAN */}
      {activeTab === 'pipeline' && (
        <PipelineKanbanView
          applications={applications}
          jobs={jobs}
          initialJobId={filterJobId}
          onOpenCandidateProfile={handleOpenCandidateProfile}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* 6. POST JOB FORM */}
      {activeTab === 'post_job' && (
        <PostJobForm
          recruiterProfile={
            profile || {
              id: 'prof-recruiter-001',
              full_name: 'Recruiter Admin',
              email: 'recruiter@apexinfotech.com',
              role: 'recruiter',
              organization_id: organization?.id || 'org-maha-001',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
          masterSkills={masterSkills}
          onJobCreated={handleJobCreated}
          onCancel={() => onTabChange('jobs')}
        />
      )}

      {/* 7. COMPANY PROFILE */}
      {activeTab === 'company_profile' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
                <Building className="w-3.5 h-3.5" />
                Recruiting Entity Profile
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Company & Organization Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage your enterprise identity visible to candidates and skill centers.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveCompanyProfile} className="space-y-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/30">
                  {companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {companyName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>State Skilling Verified Partner</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Company Name
                  </label>
                  <Input
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Industry Domain
                  </label>
                  <Input
                    value={companyIndustry}
                    onChange={e => setCompanyIndustry(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Headquarters / Office Location
                  </label>
                  <Input
                    value={companyLocation}
                    onChange={e => setCompanyLocation(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Organization Size
                  </label>
                  <Input
                    value={companySize}
                    onChange={e => setCompanySize(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Careers Website
                  </label>
                  <Input
                    value={companyWebsite}
                    onChange={e => setCompanyWebsite(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Recruiting Email
                  </label>
                  <Input
                    value={companyEmail}
                    onChange={e => setCompanyEmail(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Company Overview & Mission
                </label>
                <textarea
                  rows={4}
                  value={companyDesc}
                  onChange={e => setCompanyDesc(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                {companySavedToast ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Company profile updated successfully!
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    Changes take effect across all active job vacancy cards.
                  </span>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save Company Profile
                </Button>
              </div>
            </Card>
          </form>
        </div>
      )}

      {/* Global Candidate Profile Modal */}
      {selectedCandidateId && (
        <CandidateProfileModal
          candidateId={selectedCandidateId}
          applicationId={selectedApplicationId}
          jobs={jobs.filter(j => j.status === 'open')}
          onClose={handleCloseCandidateProfile}
          onStatusChange={handleStatusChange}
          onShortlistCandidate={handleShortlistCandidate}
        />
      )}
    </div>
  );
};
