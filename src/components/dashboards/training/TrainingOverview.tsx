import React from 'react';
import { TrainingDashboardStats } from '../../../lib/trainingService';
import { Batch, Enrollment, Certification, Placement } from '../../../types';
import { Card, Badge, Button } from '../../ui';
import { formatCurrency, formatDate } from '../../../lib/utils';
import {
  Users,
  Layers,
  GraduationCap,
  Award,
  Briefcase,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from 'recharts';

interface TrainingOverviewProps {
  stats: TrainingDashboardStats;
  batches: Batch[];
  enrollments: Enrollment[];
  certifications: Certification[];
  placements: Placement[];
  onNavigateTab: (tabId: string, filterParam?: string) => void;
  onOpenNewBatchModal: () => void;
  onOpenEnrollStudentModal: () => void;
  onOpenIssueCertModal: () => void;
  onOpenRecordPlacementModal: () => void;
  onViewCertificate: (cert: Certification) => void;
}

export const TrainingOverview: React.FC<TrainingOverviewProps> = ({
  stats,
  batches,
  enrollments,
  certifications,
  placements,
  onNavigateTab,
  onOpenNewBatchModal,
  onOpenEnrollStudentModal,
  onOpenIssueCertModal,
  onOpenRecordPlacementModal,
  onViewCertificate
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/30 to-purple-50/20 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
              <Building className="w-3 h-3 text-indigo-600" />
              MSIAS Center #01 • Pune Region
            </span>
            <Badge variant="success" className="text-[10px]">NCVET Accredited</Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Vocational Training Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time candidate enrollment, biometric attendance monitoring, modular assessment tracking, and verifiable career placement outcomes.
          </p>
        </div>

        {/* Quick Hub Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={onOpenNewBatchModal}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Create Batch
          </Button>
          <Button size="sm" variant="secondary" onClick={onOpenEnrollStudentModal}>
            <Users className="w-3.5 h-3.5 mr-1" />
            Enroll Student
          </Button>
          <Button size="sm" variant="primary" onClick={onOpenRecordPlacementModal}>
            <Briefcase className="w-3.5 h-3.5 mr-1" />
            Record Placement
          </Button>
        </div>
      </div>

      {/* 2. Top 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1: Enrolled Students */}
        <Card className="p-4 border-slate-200 bg-white hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Enrolled Students</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalEnrolled}</div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% capacity filled</span>
          </div>
        </Card>

        {/* Metric 2: Active Batches */}
        <Card className="p-4 border-slate-200 bg-white hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Batches</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-950 mt-2">{stats.activeBatchesCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.totalBatchesCount} total cohorts
          </div>
        </Card>

        {/* Metric 3: Completed Training */}
        <Card className="p-4 border-slate-200 bg-white hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Completed Training</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900 mt-2">{stats.completedTrainingCount}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            Graduated candidates
          </div>
        </Card>

        {/* Metric 4: Certifications Issued */}
        <Card className="p-4 border-slate-200 bg-white hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Certificates Issued</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{stats.certificationsCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            100% Verifiable QR
          </div>
        </Card>

        {/* Metric 5: Placement Rate */}
        <Card className="p-4 border-slate-200 bg-white hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Placement Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{stats.placementRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.placementsCount} placed graduates
          </div>
        </Card>

        {/* Metric 6: Attendance Overview */}
        <Card className="p-4 border-slate-200 bg-white hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Attendance Avg</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-800 mt-2">{stats.avgAttendanceRate}%</div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1">
            Biometric verified
          </div>
        </Card>
      </div>

      {/* 3. Analytics Charts: Funnel & Daily Attendance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Outcomes Funnel Chart */}
        <Card className="p-5 border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Skilling to Placement Pipeline Funnel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conversion stages from batch enrollment to corporate employment
              </p>
            </div>
            <Badge variant="primary">Outcome Audit</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {stats.outcomesFunnel.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.stage}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {stage.count} Trainees <span className="text-slate-400 font-normal">({stage.percentage}%)</span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(stage.percentage, 5)}%`,
                      backgroundColor: stage.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-700">Average Salary of Placed Graduates:</span>
            </div>
            <span className="font-black text-emerald-700 text-sm">
              {formatCurrency(stats.avgSalary)} / year
            </span>
          </div>
        </Card>

        {/* 7-Day Attendance Rate Trend */}
        <Card className="p-5 border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Daily Attendance Trend (%)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                7-day active biometric check-in log across all cohorts
              </p>
            </div>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => onNavigateTab('attendance')}>
              View Log <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Attendance Rate']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="presentRate"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Peak Attendance</span>
              <div className="font-black text-emerald-700 text-sm mt-0.5">97%</div>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50">
              <span className="text-[10px] uppercase font-bold text-indigo-800">Center Average</span>
              <div className="font-black text-indigo-700 text-sm mt-0.5">{stats.avgAttendanceRate}%</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-50">
              <span className="text-[10px] uppercase font-bold text-amber-800">Audit Compliance</span>
              <div className="font-black text-amber-700 text-sm mt-0.5">100% Valid</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Active Cohorts & Recent Graduates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Batches */}
        <Card className="p-5 border-slate-200 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Active Batches & Cohorts</h3>
              <p className="text-xs text-slate-500 mt-0.5">Current student cohorts undergoing modular training</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onNavigateTab('batches')}>
              Manage All
            </Button>
          </div>

          <div className="space-y-3">
            {batches.slice(0, 3).map(batch => {
              const enrolled = batch.enrolled_count || 0;
              const capacity = batch.capacity || 30;
              const percent = Math.min(100, Math.round((enrolled / capacity) * 100));

              return (
                <div key={batch.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{batch.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{batch.course_name}</p>
                    </div>
                    <Badge variant={batch.status === 'completed' ? 'purple' : batch.status === 'upcoming' ? 'warning' : 'success'}>
                      {batch.status ? batch.status.toUpperCase() : 'ACTIVE'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>Trainer: <strong className="text-slate-900">{batch.trainer_name || 'Prof. Rajesh Kulkarni'}</strong></div>
                    <div>Capacity: <strong className="text-slate-900">{enrolled} / {capacity} Seats</strong></div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>Seat Enrollment</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Placed Graduates */}
        <Card className="p-5 border-slate-200 bg-white space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Recent Placed Graduates</h3>
              <p className="text-xs text-slate-500 mt-0.5">Graduates successfully hired with verified offer letters</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onNavigateTab('placements')}>
              View Register
            </Button>
          </div>

          <div className="space-y-3">
            {placements.slice(0, 3).map(plc => (
              <div key={plc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {(plc.candidate_name || 'A').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{plc.candidate_name || 'Aarav Patil'}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">{plc.job_role} • <strong className="text-slate-700">{plc.company}</strong></p>
                    <span className="text-[10px] text-slate-400">Joined: {formatDate(plc.joining_date)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-emerald-700 text-xs sm:text-sm">
                    {formatCurrency(plc.salary)}/yr
                  </div>
                  <Badge variant="purple" className="text-[10px] mt-1">Verified Placement</Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Certificate Row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Recently Issued Certificates:</span>
            <div className="flex items-center gap-1.5">
              {certifications.slice(0, 2).map(c => (
                <button
                  key={c.id}
                  onClick={() => onViewCertificate(c)}
                  className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-[11px] font-bold transition-colors flex items-center gap-1"
                >
                  <Award className="w-3 h-3" />
                  {c.candidate_name?.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
