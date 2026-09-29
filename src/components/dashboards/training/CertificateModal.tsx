import React from 'react';
import { Certification } from '../../../types';
import { Modal, Button, Badge } from '../../ui';
import { formatDate } from '../../../lib/utils';
import { Award, ShieldCheck, CheckCircle2, Download, Printer, ExternalLink, QrCode } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verifiable Digital Credential" size="lg">
      <div className="space-y-6">
        {/* Certificate Card Printable Container */}
        <div className="relative p-6 sm:p-8 rounded-2xl border-4 border-indigo-900/20 bg-gradient-to-b from-white via-indigo-50/20 to-amber-50/20 shadow-xl overflow-hidden print:m-0 print:border-2 print:shadow-none">
          {/* Subtle Background Seal Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-indigo-950" />
          </div>

          {/* Top National / State Skilling Header */}
          <div className="text-center border-b border-indigo-100 pb-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Accredited Vocational Qualification Framework (NCVET Level 5)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Maharashtra State Institute of Advanced Skilling
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Autonomous Technical Training Authority • SkillTrack Verified Certificate
            </p>
          </div>

          {/* Certificate Body */}
          <div className="my-8 text-center space-y-4 relative z-10">
            <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
              This is to officially certify that
            </p>

            <div className="text-2xl sm:text-3xl font-black text-indigo-950 underline decoration-indigo-300 underline-offset-8">
              {certificate.candidate_name || 'Aarav Patil'}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
              has successfully completed the comprehensive competency program and satisfied all practical laboratory and industry assessment standards in
            </p>

            <div className="inline-block px-5 py-2.5 rounded-xl bg-indigo-900 text-white font-bold text-base sm:text-lg shadow-md shadow-indigo-950/20">
              {certificate.course_name}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Grade Achieved</span>
                <span className="text-emerald-700 font-black text-sm">{certificate.grade || 'A+ (Distinction)'}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Score</span>
                <span className="text-slate-900 font-bold text-sm">{certificate.score || 95}%</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Completion Date</span>
                <span className="text-slate-900 font-bold text-sm">{formatDate(certificate.completion_date || certificate.issue_date)}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signatures */}
          <div className="pt-6 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="text-[10px] font-mono text-slate-400">CREDENTIAL ID</div>
                <div className="font-mono font-bold text-slate-900 text-xs">{certificate.certificate_number}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Digitally Signed & Valid</span>
                </div>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="font-serif italic font-bold text-slate-800 text-sm">
                {certificate.authorized_signatory || 'Dr. Sunita Shinde, IAS'}
              </div>
              <div className="h-0.5 w-32 bg-slate-300 ml-auto" />
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Mission Director & State Secretary</div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Public verification URL: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">{certificate.certificate_url || `https://skilltrack.io/verify/${certificate.certificate_number}`}</code></span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print Certificate
            </Button>
            <Button size="sm" variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
