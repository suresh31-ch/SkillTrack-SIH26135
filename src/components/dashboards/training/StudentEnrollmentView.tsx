import React, { useState } from 'react';
import { Enrollment, Batch } from '../../../types';
import { Card, Badge, Button, Input, Modal } from '../../ui';
import { formatDate } from '../../../lib/utils';
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Award,
  BarChart2,
  GraduationCap,
  Sparkles,
  LayoutGrid,
  List
} from 'lucide-react';

interface StudentEnrollmentViewProps {
  enrollments: Enrollment[];
  batches: Batch[];
  initialBatchId?: string | null;
  onEnrollStudent: (data: {
    candidate_name: string;
    candidate_email: string;
    candidate_phone: string;
    candidate_district: string;
    batch_id: string;
    organization_id: string;
  }) => void;
  onRemoveEnrollment: (enrollmentId: string) => void;
  onNavigateToProgress: (candidateId?: string) => void;
  onIssueCertificateForCandidate: (enrollment: Enrollment) => void;
}

export const StudentEnrollmentView: React.FC<StudentEnrollmentViewProps> = ({
  enrollments,
  batches,
  initialBatchId,
  onEnrollStudent,
  onRemoveEnrollment,
  onNavigateToProgress,
  onIssueCertificateForCandidate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>(initialBatchId || 'all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enrolled' | 'completed' | 'dropped'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Enroll Student Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [targetBatchId, setTargetBatchId] = useState(batches[0]?.id || 'batch-001');

  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch =
      (e.candidate_name && e.candidate_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.candidate_email && e.candidate_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.candidate_district && e.candidate_district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.course_name && e.course_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBatch = selectedBatchId === 'all' || e.batch_id === selectedBatchId;
    const matchesStatus = statusFilter === 'all' || e.completion_status === statusFilter;

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onEnrollStudent({
      candidate_name: name.trim(),
      candidate_email: email.trim(),
      candidate_phone: phone.trim() || '+91 98000 00000',
      candidate_district: district.trim(),
      batch_id: targetBatchId,
      organization_id: 'org-maha-001'
    });

    setIsEnrollModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const totalCount = enrollments.length;
  const inTrainingCount = enrollments.filter(e => e.completion_status === 'enrolled').length;
  const completedCount = enrollments.filter(e => e.completion_status === 'completed').length;
  const avgAtt = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.attendance_rate || 90), 0) / enrollments.length)
    : 94;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
            <Users className="w-3.5 h-3.5" />
            Trainee Registry
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Student Enrollment & Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor admitted trainees across cohorts, module completion percentages, and assessment scores.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsEnrollModalOpen(true)}
          className="shrink-0 font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Enroll New Candidate
        </Button>
      </div>

      {/* 2. Top Metric Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-3.5 bg-white border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Enrolled</span>
          <div className="text-xl font-black text-slate-900 mt-1">{totalCount} Students</div>
        </Card>
        <Card className="p-3.5 bg-white border-slate-200">
          <span className="text-[11px] font-bold text-indigo-600 uppercase">Active Training</span>
          <div className="text-xl font-black text-indigo-950 mt-1">{inTrainingCount} In-Progress</div>
        </Card>
        <Card className="p-3.5 bg-white border-slate-200">
          <span className="text-[11px] font-bold text-purple-600 uppercase">Graduated</span>
          <div className="text-xl font-black text-purple-900 mt-1">{completedCount} Certified</div>
        </Card>
        <Card className="p-3.5 bg-white border-slate-200">
          <span className="text-[11px] font-bold text-emerald-600 uppercase">Avg Attendance</span>
          <div className="text-xl font-black text-emerald-700 mt-1">{avgAtt}% Rate</div>
        </Card>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, email, district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Batch Selector & Status */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-none"
            >
              <option value="all">All Batches & Cohorts</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              {(['all', 'enrolled', 'completed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'enrolled' ? 'In Training' : st}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Student Content: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEnrollments.map(enr => (
            <Card key={enr.id} className="p-4 border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-sm flex items-center justify-center border border-indigo-200 shrink-0">
                    {(enr.candidate_name || 'A').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{enr.candidate_name}</h3>
                    <p className="text-[11px] text-slate-500">{enr.candidate_email}</p>
                  </div>
                </div>

                <Badge variant={enr.completion_status === 'completed' ? 'success' : 'primary'}>
                  {enr.completion_status === 'completed' ? 'Graduated' : 'In-Training'}
                </Badge>
              </div>

              {/* Course & Batch info */}
              <div className="p-2 rounded-lg bg-slate-50 text-[11px] space-y-1">
                <div className="font-semibold text-slate-800 truncate">{enr.course_name}</div>
                <div className="text-slate-500 flex items-center justify-between">
                  <span>Batch: <strong className="text-slate-700">{enr.batch_name}</strong></span>
                  <span>District: <strong className="text-slate-700">{enr.candidate_district || 'Pune'}</strong></span>
                </div>
              </div>

              {/* Progress & Modules */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Modules Completed</span>
                  <span className="text-indigo-600">{enr.modules_completed || 3} of {enr.total_modules || 4} ({enr.progress_percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${enr.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Assessment & Attendance stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                  <span className="text-slate-500">Assessment:</span>
                  <span className="font-bold text-slate-900">{enr.assessment_score || 90}%</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-slate-50">
                  <span className="text-slate-500">Attendance:</span>
                  <span className="font-bold text-emerald-700">{enr.attendance_rate || 94}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigateToProgress(enr.candidate_id)}
                  className="text-xs flex-1"
                >
                  <BarChart2 className="w-3.5 h-3.5 mr-1" />
                  Progress
                </Button>

                {enr.completion_status === 'completed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onIssueCertificateForCandidate(enr)}
                    className="text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200"
                  >
                    <Award className="w-3.5 h-3.5 mr-1" />
                    Certificate
                  </Button>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Remove enrollment record for ${enr.candidate_name}?`)) {
                      onRemoveEnrollment(enr.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove from batch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="overflow-hidden border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Candidate Name</th>
                  <th className="p-3.5">Batch / Cohort</th>
                  <th className="p-3.5">District</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5">Assessment</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnrollments.map(enr => (
                  <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div>{enr.candidate_name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{enr.candidate_email}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{enr.batch_name}</td>
                    <td className="p-3.5 text-slate-600">{enr.candidate_district || 'Pune'}</td>
                    <td className="p-3.5 font-semibold text-indigo-700">
                      {enr.modules_completed || 3}/{enr.total_modules || 4} ({enr.progress_percentage}%)
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{enr.assessment_score || 90}%</td>
                    <td className="p-3.5 font-bold text-emerald-700">{enr.attendance_rate || 94}%</td>
                    <td className="p-3.5">
                      <Badge variant={enr.completion_status === 'completed' ? 'success' : 'primary'}>
                        {enr.completion_status === 'completed' ? 'Graduated' : 'In-Training'}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {enr.completion_status === 'completed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onIssueCertificateForCandidate(enr)}
                          className="text-purple-700 hover:bg-purple-50"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${enr.candidate_name}?`)) {
                            onRemoveEnrollment(enr.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredEnrollments.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Enrolled Trainees</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No candidates match the selected filters. Click below to admit a student into an active cohort.
          </p>
          <Button size="sm" variant="primary" onClick={() => setIsEnrollModalOpen(true)} className="mt-4">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Enroll Trainee
          </Button>
        </div>
      )}

      {/* Modal: Enroll Candidate */}
      <Modal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} title="Enroll Candidate into Cohort" size="md">
        <form onSubmit={handleEnrollSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Training Batch</label>
            <select
              value={targetBatchId}
              onChange={e => setTargetBatchId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.course_name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Candidate Full Name"
            placeholder="e.g. Ramesh Deshmukh"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="candidate@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mobile Number"
              placeholder="+91 98000 12345"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <Input
            label="Home District / Location"
            placeholder="e.g. Pune / Nagpur / Nashik"
            value={district}
            onChange={e => setDistrict(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 text-white">
              Complete Enrollment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
