import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Modal, Input } from '../../../ui';
import {
  StudentApplicationRecord,
  ApplicationStageStatus,
  CompanyRoleProfile
} from '../../../../types/studentJourney';
import { TARGET_COMPANIES_CATALOG } from '../../../../lib/companyRoleData';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { useToast } from '../../../../context/ToastContext';
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  ExternalLink,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileCheck,
  TrendingUp,
  AlertCircle,
  Award
} from 'lucide-react';

interface StudentOpportunityFeedViewProps {
  studentId: string;
  onOpenPreApplyReview: (role: CompanyRoleProfile) => void;
  onNavigateToPostPlacement?: () => void;
}

export const StudentOpportunityFeedView: React.FC<StudentOpportunityFeedViewProps> = ({
  studentId,
  onOpenPreApplyReview,
  onNavigateToPostPlacement
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'feed' | 'tracker'>('feed');
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState<'all' | 'campus' | 'offcampus'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [applications, setApplications] = useState<StudentApplicationRecord[]>(() =>
    StudentJourneyService.getApplications(studentId)
  );

  // Manual Add / Edit Application Tracker Modal
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [modalCompany, setModalCompany] = useState('');
  const [modalRole, setModalRole] = useState('');
  const [modalStatus, setModalStatus] = useState<ApplicationStageStatus>('Applied');
  const [modalAppliedDate, setModalAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalLocation, setModalLocation] = useState('Pune, Maharashtra');
  const [modalNotes, setModalNotes] = useState('');
  const [modalSalary, setModalSalary] = useState('');

  // Opportunities aggregate from target companies catalog + verified on-campus fixtures
  const verifiedOpportunities = useMemo(() => {
    const list: Array<{
      id: string;
      companyName: string;
      roleTitle: string;
      roleProfile: CompanyRoleProfile;
      opportunityType: 'On-campus Drive' | 'Off-campus Opportunity';
      location: string;
      employmentType: string;
      deadline: string;
      source: string;
      campusNotice?: string;
      isUrgent?: boolean;
    }> = [];

    // On-campus verified drive fixtures
    list.push({
      id: 'opp-tcs-campus',
      companyName: 'TCS (Tata Consultancy Services)',
      roleTitle: 'Systems Engineer - Digital Track',
      roleProfile: TARGET_COMPANIES_CATALOG.find(c => c.name.includes('TCS'))?.availableRoles[0] || TARGET_COMPANIES_CATALOG[0].availableRoles[0],
      opportunityType: 'On-campus Drive',
      location: 'Pune / Mumbai (On-Campus Placement Cell Hall B)',
      employmentType: 'Full-time',
      deadline: 'September 15, 2026',
      source: 'Institutional Training & Placement Cell (TPO) Notice #2026-44',
      campusNotice: 'Mandatory registration on TCS NextStep portal required before institute deadline.',
      isUrgent: true
    });

    list.push({
      id: 'opp-infy-campus',
      companyName: 'Infosys',
      roleTitle: 'Specialist Programmer (Power Programmer)',
      roleProfile: TARGET_COMPANIES_CATALOG.find(c => c.name.includes('Infosys'))?.availableRoles[0] || TARGET_COMPANIES_CATALOG[0].availableRoles[0],
      opportunityType: 'On-campus Drive',
      location: 'Pune / Bengaluru (Campus Auditorium)',
      employmentType: 'Full-time',
      deadline: 'September 30, 2026',
      source: 'Autonomous Engineering College Placement Board',
      campusNotice: 'Online coding round scheduled in Institute Computer Labs 4 & 5.'
    });

    // Off-campus opportunities from catalog
    TARGET_COMPANIES_CATALOG.forEach(comp => {
      comp.availableRoles.forEach(role => {
        list.push({
          id: `opp-${comp.id}-${role.id}`,
          companyName: comp.name,
          roleTitle: role.roleTitle,
          roleProfile: role,
          opportunityType: 'Off-campus Opportunity',
          location: role.locations.join(', '),
          employmentType: role.employmentType,
          deadline: role.applicationDeadline || 'Rolling Recruitment',
          source: `${comp.name} Official Careers Portal`
        });
      });
    });

    return list;
  }, []);

  const filteredOpportunities = useMemo(() => {
    return verifiedOpportunities.filter(opp => {
      if (opportunityTypeFilter === 'campus' && opp.opportunityType !== 'On-campus Drive') return false;
      if (opportunityTypeFilter === 'offcampus' && opp.opportunityType !== 'Off-campus Opportunity') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          opp.companyName.toLowerCase().includes(q) ||
          opp.roleTitle.toLowerCase().includes(q) ||
          opp.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [verifiedOpportunities, opportunityTypeFilter, searchQuery]);

  const handleSaveTracker = () => {
    if (!modalCompany.trim() || !modalRole.trim()) {
      showToast('Please specify Company and Role Title', 'warning');
      return;
    }

    const saved = StudentJourneyService.trackApplication(studentId, {
      id: editingAppId || undefined,
      companyName: modalCompany.trim(),
      roleTitle: modalRole.trim(),
      opportunityType: 'Off-campus Opportunity',
      location: modalLocation,
      status: modalStatus,
      appliedDate: modalAppliedDate,
      notes: modalNotes,
      salaryOffered: modalSalary || undefined
    });

    // If marked as Joined, initialize post placement journey!
    if (modalStatus === 'Joined company') {
      StudentJourneyService.initializePostPlacementProfile(studentId, {
        companyName: saved.companyName,
        roleTitle: saved.roleTitle,
        employmentType: 'Full-time',
        workLocation: saved.location,
        joiningDate: saved.appliedDate || new Date().toISOString().split('T')[0],
        salaryCompensation: saved.salaryOffered,
        skillsUsedInRole: ['Software Engineering Fundamentals', 'Problem Solving']
      });
      showToast(`Congratulations on joining ${saved.companyName}! Post-placement journey initialized.`, 'success');
      if (onNavigateToPostPlacement) onNavigateToPostPlacement();
    } else {
      showToast(`Application updated: ${saved.roleTitle} at ${saved.companyName} (${saved.status})`, 'success');
    }

    setApplications(StudentJourneyService.getApplications(studentId));
    setIsTrackerModalOpen(false);
    setEditingAppId(null);
  };

  const handleOpenEditApp = (app: StudentApplicationRecord) => {
    setEditingAppId(app.id);
    setModalCompany(app.companyName);
    setModalRole(app.roleTitle);
    setModalStatus(app.status);
    setModalAppliedDate(app.appliedDate || new Date().toISOString().split('T')[0]);
    setModalLocation(app.location);
    setModalNotes(app.notes || '');
    setModalSalary(app.salaryOffered || '');
    setIsTrackerModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Module 7 & 9
            </span>
            <span className="text-xs text-slate-500 font-medium">Internships & Placement Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Opportunities & Application Tracker</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Discover verified campus recruitment drives, off-campus internship openings, and track your end-to-end recruitment pipeline through 10 milestone stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'feed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Opportunity Feed ({verifiedOpportunities.length})
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'tracker' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Application Tracker ({applications.length})
            </button>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setEditingAppId(null);
              setModalCompany('');
              setModalRole('');
              setModalStatus('Applied');
              setIsTrackerModalOpen(true);
            }}
            className="text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track Application</span>
          </Button>
        </div>
      </div>

      {/* VIEW: OPPORTUNITY FEED */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-slate-400 font-medium shrink-0">Filter Track:</span>
              <button
                onClick={() => setOpportunityTypeFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${
                  opportunityTypeFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Opportunities ({verifiedOpportunities.length})
              </button>
              <button
                onClick={() => setOpportunityTypeFilter('campus')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${
                  opportunityTypeFilter === 'campus'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                On-Campus Drives (2)
              </button>
              <button
                onClick={() => setOpportunityTypeFilter('offcampus')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 cursor-pointer ${
                  opportunityTypeFilter === 'offcampus'
                    ? 'bg-teal-700 text-white'
                    : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                }`}
              >
                Off-Campus verified
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search company or role..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpportunities.map(opp => (
              <Card key={opp.id} className="p-5 border-slate-200 bg-white shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          opp.opportunityType === 'On-campus Drive'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {opp.opportunityType}
                        </span>
                        <Badge variant="purple" className="text-[9px]">{opp.employmentType}</Badge>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{opp.roleTitle}</h4>
                      <div className="text-xs font-semibold text-slate-700">{opp.companyName}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block font-medium">Deadline</span>
                      <span className="text-xs font-bold text-slate-800">{opp.deadline}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Source: {opp.source}</span>
                    </div>
                  </div>

                  {opp.campusNotice && (
                    <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{opp.campusNotice}</span>
                    </div>
                  )}

                  {/* Essential skill tags */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Required Competencies
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {opp.roleProfile.essentialSkills.slice(0, 4).map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {sk.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenPreApplyReview(opp.roleProfile)}
                    className="text-xs flex items-center gap-1 text-indigo-700 border-indigo-200"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Check Readiness</span>
                  </Button>

                  <a
                    href={opp.roleProfile.officialJobSearchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs"
                  >
                    <span>Apply Official</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: APPLICATION TRACKER */}
      {activeTab === 'tracker' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Active Application Pipeline ({applications.length})
            </h3>
            <span className="text-xs text-slate-500">
              10 Milestone Lifecycle Tracking
            </span>
          </div>

          {applications.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 space-y-3">
              <Send className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">No Applications Tracked Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  When you submit an application to a company or campus recruitment drive, record it here to track interview rounds, offer letters, and joining dates.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setEditingAppId(null);
                  setIsTrackerModalOpen(true);
                }}
                className="text-xs"
              >
                Track My First Application
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <Card key={app.id} className="p-4 border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{app.roleTitle}</span>
                      <Badge variant="primary">{app.companyName}</Badge>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.status === 'Joined company' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        app.status === 'Offer received' || app.status === 'Offer accepted' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                        app.status.includes('interview') ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        app.status === 'Applied' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        Stage: {app.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.location}
                      </span>
                      <span>•</span>
                      <span>Applied: {app.appliedDate || 'Not recorded'}</span>
                      {app.salaryOffered && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">Offer: ₹{app.salaryOffered}</span>
                        </>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                        &quot;{app.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEditApp(app)}
                      className="text-xs"
                    >
                      Update Stage
                    </Button>
                    {app.status === 'Joined company' && onNavigateToPostPlacement && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={onNavigateToPostPlacement}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500"
                      >
                        Post-Placement Hub
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tracker Modal */}
      {isTrackerModalOpen && (
        <Modal
          isOpen={isTrackerModalOpen}
          onClose={() => setIsTrackerModalOpen(false)}
          title={editingAppId ? 'Update Application Stage & Notes' : 'Track Application in Pipeline'}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <Input
              label="Company Name *"
              value={modalCompany}
              onChange={e => setModalCompany(e.target.value)}
              placeholder="e.g. Google, Microsoft, TCS"
              required
            />

            <Input
              label="Job Role Title *"
              value={modalRole}
              onChange={e => setModalRole(e.target.value)}
              placeholder="e.g. Software Engineering Intern"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Pipeline Stage *</label>
              <select
                value={modalStatus}
                onChange={e => setModalStatus(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                <option value="Planning to apply">Planning to apply</option>
                <option value="Application in progress">Application in progress</option>
                <option value="Applied">Applied</option>
                <option value="Assessment scheduled">Online Assessment scheduled</option>
                <option value="Technical interview scheduled">Technical interview scheduled</option>
                <option value="HR interview scheduled">HR interview scheduled</option>
                <option value="Offer received">Offer received</option>
                <option value="Offer accepted">Offer accepted</option>
                <option value="Joined company">Joined company (Initiates Post-Placement)</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                label="Date of Stage / Application"
                value={modalAppliedDate}
                onChange={e => setModalAppliedDate(e.target.value)}
              />

              <Input
                label="Compensation / CTC (Optional)"
                value={modalSalary}
                onChange={e => setModalSalary(e.target.value)}
                placeholder="e.g. 12,00,000 / yr"
              />
            </div>

            <Input
              label="Location"
              value={modalLocation}
              onChange={e => setModalLocation(e.target.value)}
              placeholder="e.g. Pune / Bengaluru"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Feedback / Notes</label>
              <textarea
                value={modalNotes}
                onChange={e => setModalNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Completed technical round covering binary trees and SQL query optimization."
                className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="ghost" onClick={() => setIsTrackerModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleSaveTracker}>
                Save Application
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
