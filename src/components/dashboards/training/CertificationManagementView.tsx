import React, { useState } from 'react';
import { Certification, Enrollment, Course } from '../../../types';
import { Card, Badge, Button, Input, Modal } from '../../ui';
import { formatDate } from '../../../lib/utils';
import {
  Award,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Printer,
  QrCode,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface CertificationManagementViewProps {
  certifications: Certification[];
  enrollments: Enrollment[];
  courses: Course[];
  preSelectedEnrollment?: Enrollment | null;
  onIssueCertificate: (data: {
    candidate_id: string;
    candidate_name: string;
    candidate_email?: string;
    course_id: string;
    course_name: string;
    organization_id: string;
    grade?: 'A+' | 'A' | 'B+' | 'B' | 'Pass';
    score?: number;
  }) => void;
  onUpdateStatus: (certId: string, status: 'valid' | 'revoked' | 'pending') => void;
  onViewCertificate: (cert: Certification) => void;
}

export const CertificationManagementView: React.FC<CertificationManagementViewProps> = ({
  certifications,
  enrollments,
  courses,
  preSelectedEnrollment,
  onIssueCertificate,
  onUpdateStatus,
  onViewCertificate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'revoked' | 'pending'>('all');

  // Issue Certificate Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(!!preSelectedEnrollment);
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    preSelectedEnrollment?.candidate_id || enrollments[0]?.candidate_id || ''
  );
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'crs-001');
  const [grade, setGrade] = useState<'A+' | 'A' | 'B+' | 'B' | 'Pass'>('A+');
  const [score, setScore] = useState(96);

  const filteredCerts = certifications.filter(c => {
    const matchesSearch =
      (c.candidate_name && c.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.certificate_number && c.certificate_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.course_name && c.course_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || c.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = enrollments.find(e => e.candidate_id === selectedCandidateId) || enrollments[0];
    const course = courses.find(c => c.id === selectedCourseId) || courses[0];

    onIssueCertificate({
      candidate_id: candidate?.candidate_id || `cand-${Date.now()}`,
      candidate_name: candidate?.candidate_name || 'Aarav Patil',
      candidate_email: candidate?.candidate_email || 'candidate@skilltrack.io',
      course_id: course?.id || 'crs-001',
      course_name: course?.name || 'Full Stack Cloud Application Engineering',
      organization_id: 'org-maha-001',
      grade,
      score: Number(score)
    });

    setIsIssueModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
            <Award className="w-3.5 h-3.5" />
            Accredited Qualifications
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Certification Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Issue cryptographically verifiable credentials, revoke audit-compromised certs, and verify student records.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsIssueModalOpen(true)}
          className="shrink-0 font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Issue New Certificate
        </Button>
      </div>

      {/* 2. Top Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500">Issued Credentials</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{certifications.length} Certs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Award className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700">Verified & Active</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {certifications.filter(c => c.verification_status === 'valid').length} Valid
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-700">NCVET Level 5 Compliance</span>
            <div className="text-2xl font-black text-purple-900 mt-1">100% Rate</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* 3. Search & Filter Strip */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, cert ID, course..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['all', 'valid', 'pending', 'revoked'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Certificate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCerts.map(cert => {
          const isValid = cert.verification_status === 'valid';

          return (
            <Card
              key={cert.id}
              className="p-5 border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{cert.candidate_name}</h3>
                    <Badge variant={isValid ? 'success' : cert.verification_status === 'pending' ? 'warning' : 'danger'}>
                      {cert.verification_status ? cert.verification_status.toUpperCase() : 'VALID'}
                    </Badge>
                  </div>
                  <p className="text-xs text-indigo-600 font-semibold mt-0.5">{cert.course_name}</p>
                </div>

                <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* Certificate Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Credential ID</span>
                  <span className="font-mono font-bold text-slate-900 text-[11px]">{cert.certificate_number}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Issue Date</span>
                  <span className="font-bold text-slate-900">{formatDate(cert.issue_date)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Performance Grade</span>
                  <span className="font-bold text-emerald-700">{cert.grade || 'A+ (Distinction)'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Assessment Score</span>
                  <span className="font-bold text-slate-900">{cert.score || 95}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onViewCertificate(cert)}
                  className="text-xs flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 font-bold"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  View & Print Credential
                </Button>

                {isValid ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(cert.id, 'revoked')}
                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Revoke
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(cert.id, 'valid')}
                    className="text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Re-Verify
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCerts.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Certificates Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No certification records matched your query. You can issue a new digital credential to any eligible graduate.
          </p>
          <Button size="sm" variant="primary" onClick={() => setIsIssueModalOpen(true)} className="mt-4">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Issue Digital Credential
          </Button>
        </div>
      )}

      {/* Modal: Issue Certificate */}
      <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Issue State Technical Certificate" size="md">
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Candidate</label>
            <select
              value={selectedCandidateId}
              onChange={e => setSelectedCandidateId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
            >
              {enrollments.map(e => (
                <option key={e.id} value={e.candidate_id}>
                  {e.candidate_name} ({e.course_name} • {e.completion_status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Curriculum</label>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade Awarded</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                <option value="A+">A+ (Distinction: 90%+)</option>
                <option value="A">A (First Class: 80-89%)</option>
                <option value="B+">B+ (Higher Second: 70-79%)</option>
                <option value="B">B (Second Class: 60-69%)</option>
                <option value="Pass">Pass</option>
              </select>
            </div>

            <Input
              label="Final Assessment Score (%)"
              type="number"
              min={60}
              max={100}
              value={score}
              onChange={e => setScore(Number(e.target.value))}
              required
            />
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs flex items-center gap-2">
            <QrCode className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>A cryptographically signed Certificate ID and QR code will be generated upon issuance.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 text-white">
              Issue & Sign Certificate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
