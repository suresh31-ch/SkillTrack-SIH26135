import React, { useState } from 'react';
import { Batch, Attendance, Enrollment } from '../../../types';
import { Card, Badge, Button, Input } from '../../ui';
import { formatDate } from '../../../lib/utils';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  FileSpreadsheet
} from 'lucide-react';

interface AttendanceManagementViewProps {
  batches: Batch[];
  enrollments: Enrollment[];
  attendanceRecords: Attendance[];
  initialBatchId?: string | null;
  onMarkAttendance: (
    batchId: string,
    candidateId: string,
    candidateName: string,
    date: string,
    status: 'present' | 'absent' | 'leave'
  ) => void;
  onMarkBulkAttendance: (
    batchId: string,
    students: Array<{ id: string; name: string }>,
    date: string,
    status: 'present' | 'absent'
  ) => void;
}

export const AttendanceManagementView: React.FC<AttendanceManagementViewProps> = ({
  batches,
  enrollments,
  attendanceRecords,
  initialBatchId,
  onMarkAttendance,
  onMarkBulkAttendance
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(initialBatchId || batches[0]?.id || 'batch-001');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [exportNotice, setExportNotice] = useState(false);

  const currentBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const batchStudents = enrollments.filter(e => e.batch_id === selectedBatchId);

  // Helper to change date by +1 or -1 days
  const handleDateShift = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Get status of student on selectedDate
  const getStudentStatus = (candidateId: string): 'present' | 'absent' | 'leave' => {
    const record = attendanceRecords.find(
      a => a.batch_id === selectedBatchId && a.candidate_id === candidateId && a.attendance_date === selectedDate
    );
    return record ? record.status : 'present'; // default to present
  };

  // Computed daily stats for this batch
  const presentCount = batchStudents.filter(s => getStudentStatus(s.candidate_id) === 'present').length;
  const absentCount = batchStudents.filter(s => getStudentStatus(s.candidate_id) === 'absent').length;
  const leaveCount = batchStudents.filter(s => getStudentStatus(s.candidate_id) === 'leave').length;
  const attendanceRate = batchStudents.length > 0 ? Math.round((presentCount / batchStudents.length) * 100) : 100;

  // Bulk actions
  const handleMarkAll = (status: 'present' | 'absent') => {
    const studentsToMark = batchStudents.map(s => ({
      id: s.candidate_id,
      name: s.candidate_name || 'Student'
    }));
    onMarkBulkAttendance(selectedBatchId, studentsToMark, selectedDate, status);
  };

  const handleExportCSV = () => {
    const headers = 'Candidate Name,Batch,Course,Date,Status\n';
    const rows = batchStudents
      .map(
        s =>
          `"${s.candidate_name}","${currentBatch?.name}","${currentBatch?.course_name}","${selectedDate}","${getStudentStatus(
            s.candidate_id
          )}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${currentBatch?.name}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200 mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            Biometric Skilling Attendance
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Daily Attendance Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mark daily attendance logs, verify present/absent ratios, and audit student attendance percentages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleExportCSV} className="text-xs font-semibold">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Export CSV Log
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Attendance log exported successfully to CSV!</span>
        </div>
      )}

      {/* 2. Batch Selector & Date Controls Strip */}
      <Card className="p-4 bg-white border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Cohort Selector */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Select Cohort:</label>
            <select
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-80"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.course_name})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector with Nav buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => handleDateShift(-1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:bg-white"
              />
            </div>

            <button
              onClick={() => handleDateShift(1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
            >
              Today
            </button>
          </div>
        </div>

        {/* Quick Batch Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Enrolled Trainees</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{batchStudents.length} Students</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Present Today</span>
            <div className="text-lg font-black text-emerald-700 mt-0.5">
              {presentCount} <span className="text-xs font-bold text-emerald-600">({attendanceRate}%)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-50 border border-red-100">
            <span className="text-[10px] font-bold text-red-800 uppercase">Absent</span>
            <div className="text-lg font-black text-red-700 mt-0.5">{absentCount} Students</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-[10px] font-bold text-amber-800 uppercase">Approved Leave</span>
            <div className="text-lg font-black text-amber-700 mt-0.5">{leaveCount} Students</div>
          </div>
        </div>
      </Card>

      {/* 3. Student Attendance List & Actions */}
      <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Student Attendance Register • {formatDate(selectedDate)}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trainer: <strong className="text-slate-700">{currentBatch?.trainer_name || 'Prof. Rajesh Kulkarni'}</strong> • Room: <strong className="text-slate-700">{currentBatch?.classroom || 'Software Lab'}</strong>
            </p>
          </div>

          {/* Bulk Tools */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleMarkAll('present')} className="text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50">
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              Mark All Present
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleMarkAll('absent')} className="text-xs text-red-700 border-red-200 hover:bg-red-50">
              <UserX className="w-3.5 h-3.5 mr-1" />
              Mark All Absent
            </Button>
          </div>
        </div>

        {/* Student List */}
        <div className="divide-y divide-slate-100">
          {batchStudents.map(student => {
            const currentStatus = getStudentStatus(student.candidate_id);

            return (
              <div key={student.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-xs">
                    {(student.candidate_name || 'S').charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{student.candidate_name}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{student.candidate_email}</span>
                      <span>•</span>
                      <span>Overall Rate: <strong className="text-emerald-700">{student.attendance_rate || 94}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* 3 Status Toggles */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() =>
                      onMarkAttendance(
                        selectedBatchId,
                        student.candidate_id,
                        student.candidate_name || 'Student',
                        selectedDate,
                        'present'
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Present
                  </button>

                  <button
                    onClick={() =>
                      onMarkAttendance(
                        selectedBatchId,
                        student.candidate_id,
                        student.candidate_name || 'Student',
                        selectedDate,
                        'absent'
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      currentStatus === 'absent'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Absent
                  </button>

                  <button
                    onClick={() =>
                      onMarkAttendance(
                        selectedBatchId,
                        student.candidate_id,
                        student.candidate_name || 'Student',
                        selectedDate,
                        'leave'
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      currentStatus === 'leave'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Leave
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {batchStudents.length === 0 && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">No Students Enrolled in this Batch</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Please enroll candidates to start tracking attendance.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
