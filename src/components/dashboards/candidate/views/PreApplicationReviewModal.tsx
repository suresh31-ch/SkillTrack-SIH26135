import React, { useMemo } from 'react';
import { Modal, Button, Badge } from '../../../ui';
import { CompanyRoleProfile, PreApplicationChecklistResult } from '../../../../types/studentJourney';
import { StudentJourneyService } from '../../../../lib/studentJourneyService';
import { AssessmentResult } from '../../../../types';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  BookOpen,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface PreApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: CompanyRoleProfile;
  studentId: string;
  onConfirmApplied?: () => void;
}

export const PreApplicationReviewModal: React.FC<PreApplicationReviewModalProps> = ({
  isOpen,
  onClose,
  role,
  studentId,
  onConfirmApplied
}) => {
  const profile = useMemo(() => StudentJourneyService.getAcademicProfile(studentId), [studentId]);
  const skills = useMemo(() => StudentJourneyService.getSkills(studentId), [studentId]);

  const assessments: AssessmentResult[] = useMemo(() => {
    try {
      const stored = localStorage.getItem(`skilltrack_assessment_results_${studentId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  }, [studentId]);

  const checklist: PreApplicationChecklistResult = useMemo(() => {
    return StudentJourneyService.generatePreApplicationChecklist(
      profile,
      skills,
      assessments,
      role
    );
  }, [profile, skills, assessments, role]);

  const handleMarkAsPlanning = () => {
    StudentJourneyService.trackApplication(studentId, {
      companyName: role.companyName,
      roleTitle: role.roleTitle,
      opportunityType: 'Off-campus Opportunity',
      jobPostingUrl: role.officialJobSearchLink,
      location: role.locations.join(', '),
      status: 'Planning to apply'
    });
    if (onConfirmApplied) onConfirmApplied();
    onClose();
  };

  const handleMarkAsApplied = () => {
    StudentJourneyService.trackApplication(studentId, {
      companyName: role.companyName,
      roleTitle: role.roleTitle,
      opportunityType: 'Off-campus Opportunity',
      jobPostingUrl: role.officialJobSearchLink,
      location: role.locations.join(', '),
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0]
    });
    if (onConfirmApplied) onConfirmApplied();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pre-Application Readiness Review — ${role.roleTitle}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs">
        {/* Banner summary */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          checklist.readinessSummary === 'Ready to Apply'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : checklist.readinessSummary === 'Minor Preparation Recommended'
            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
            : 'bg-rose-50/80 border-rose-200 text-rose-950'
        }`}>
          {checklist.readinessSummary === 'Ready to Apply' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : checklist.readinessSummary === 'Minor Preparation Recommended' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm">Readiness Status: {checklist.readinessSummary}</h4>
            <p className="text-[11px] opacity-90 leading-relaxed">
              We evaluated your recorded skills, project attachments, academic standing, and assessment history against{' '}
              <strong>{role.companyName}’s</strong> published requirements. You are always free to submit your application regardless of score.
            </p>
          </div>
        </div>

        {/* Section 1: Satisfied Requirements */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
          <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Requirement Evidence Available ({checklist.satisfiedRequirements.length})
          </span>
          <div className="space-y-1 pl-5">
            {checklist.satisfiedRequirements.map((item, idx) => (
              <div key={idx} className="text-slate-700 flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Remaining Gaps / Needs Confirmation */}
        {(checklist.remainingCriticalGaps.length > 0 || checklist.requirementsAwaitingConfirmation.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklist.remainingCriticalGaps.length > 0 && (
              <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50 space-y-2">
                <span className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Skill Development Recommended
                </span>
                <ul className="space-y-1 pl-4 text-rose-800 list-disc">
                  {checklist.remainingCriticalGaps.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {checklist.requirementsAwaitingConfirmation.length > 0 && (
              <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Please Confirm Requirements
                </span>
                <ul className="space-y-1 pl-4 text-amber-800 list-disc">
                  {checklist.requirementsAwaitingConfirmation.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Resume & Portfolio Checklist */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5">
          <span className="font-bold text-slate-900 block text-xs">Pre-Submission Quality Checklist</span>
          <div className="space-y-2">
            {checklist.resumeChecklistItems.map((chk, idx) => (
              <div key={idx} className="p-2 rounded bg-white border border-slate-200 flex items-start gap-2.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  chk.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {chk.passed ? '✓' : '!'}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{chk.label}</div>
                  <div className="text-[11px] text-slate-500">{chk.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleMarkAsPlanning} className="text-xs">
              Save as Planning
            </Button>
            <Button size="sm" variant="outline" onClick={handleMarkAsApplied} className="text-xs text-teal-700 border-teal-300">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              I Already Applied
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">
              Close
            </Button>
            <a
              href={checklist.officialApplicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs"
            >
              <span>Go to Official Application</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
