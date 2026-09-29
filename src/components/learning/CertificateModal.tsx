import React, { useRef } from 'react';
import { LearningCourse, LearnerCourseProgress } from '../../types/learning';
import { Modal, Button, Badge } from '../ui';
import { useToast } from '../../context/ToastContext';
import {
  Award,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Calendar,
  User,
  QrCode
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: LearningCourse;
  candidateName?: string;
  progress?: LearnerCourseProgress;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  course,
  candidateName = 'Alex Mercer',
  progress
}) => {
  const { showToast } = useToast();
  const certNumber = progress?.certificateNumber || `ST-MSIAS-2026-${course.id.slice(4).toUpperCase()}89`;
  const issueDate = progress?.certificateIssuedAt
    ? new Date(progress.certificateIssuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Certificate credential downloaded (PDF format)', 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://skilltrack.io/verify/${certNumber}`);
      showToast('Verification URL copied to clipboard!', 'info');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SkillTrack Verified Credential"
    >
      <div className="space-y-6">
        {/* Certificate Display Graphic */}
        <div
          id="certificate-print-region"
          className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-8 rounded-2xl border-4 border-amber-400/40 text-white shadow-2xl text-center overflow-hidden"
        >
          {/* Subtle Watermark BG */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Seal / Top Header */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 shadow-inner mx-auto mb-1">
              <Award className="w-7 h-7" />
            </div>

            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-400">
              Certificate of Technical Mastery
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
              SkillTrack Professional Certification
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
          </div>

          {/* Recipient Details */}
          <div className="relative z-10 my-6 space-y-2">
            <p className="text-xs text-slate-300 font-serif italic">
              This credential certifies that
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-300 tracking-wide">
              {candidateName}
            </h3>
            <p className="text-xs text-slate-300 font-serif italic">
              has successfully completed all modules, practical assessments, and evaluation challenges for
            </p>
            <div className="text-base sm:text-lg font-bold text-white max-w-md mx-auto pt-1 text-balance">
              {course.name}
            </div>
          </div>

          {/* Verification Strip & Signatures */}
          <div className="relative z-10 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="text-left space-y-1 text-[11px]">
              <div className="text-slate-400">Credential ID:</div>
              <div className="font-mono text-amber-300 font-bold">{certNumber}</div>
              <div className="text-[10px] text-slate-400">Issued: {issueDate}</div>
            </div>

            {/* Simulated QR Code & Badge */}
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-white text-slate-950">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="text-left text-[10px] text-slate-400">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Cryptographically Verified
                </span>
                <span>SkillTrack Board of Assessment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleShare}
              className="text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Credential Link
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
