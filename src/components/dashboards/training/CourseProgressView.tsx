import React, { useState } from 'react';
import { Course, CourseModule, Enrollment, Batch } from '../../../types';
import { Card, Badge, Button, Modal, Input } from '../../ui';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  BookOpen,
  BarChart3,
  Award,
  Layers,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CourseProgressViewProps {
  courses: Course[];
  enrollments: Enrollment[];
  batches: Batch[];
  onUpdateEnrollmentProgress: (enrollmentId: string, updates: Partial<Enrollment>) => void;
  onIssueCertificateForCandidate: (enrollment: Enrollment) => void;
}

export const CourseProgressView: React.FC<CourseProgressViewProps> = ({
  courses,
  enrollments,
  batches,
  onUpdateEnrollmentProgress,
  onIssueCertificateForCandidate
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'crs-001');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Edit Progress Modal
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);
  const [newProgress, setNewProgress] = useState(100);
  const [newModulesCompleted, setNewModulesCompleted] = useState(4);
  const [newScore, setNewScore] = useState(95);
  const [newStatus, setNewStatus] = useState<'enrolled' | 'completed' | 'dropped'>('completed');

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseEnrollments = enrollments.filter(e => {
    const batch = batches.find(b => b.id === e.batch_id);
    return batch?.course_id === selectedCourseId || e.course_name === selectedCourse?.name;
  });

  const handleOpenProgressModal = (enr: Enrollment) => {
    setEditingEnrollment(enr);
    setNewProgress(enr.progress_percentage);
    setNewModulesCompleted(enr.modules_completed || 3);
    setNewScore(enr.assessment_score || 90);
    setNewStatus(enr.completion_status);
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnrollment) return;

    onUpdateEnrollmentProgress(editingEnrollment.id, {
      progress_percentage: Number(newProgress),
      modules_completed: Number(newModulesCompleted),
      assessment_score: Number(newScore),
      assessment_status: Number(newScore) >= 75 ? 'passed' : 'in_progress',
      completion_status: Number(newProgress) === 100 ? 'completed' : newStatus
    });

    setEditingEnrollment(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Curriculum & Competency Audits
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Course Progress & Assessment Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate module completion milestones, practical laboratory benchmarks, and capstone exam scores.
          </p>
        </div>

        {/* Course Filter Dropdown */}
        <select
          value={selectedCourseId}
          onChange={e => setSelectedCourseId(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 max-w-xs"
        >
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Course Syllabus & Modular Structure */}
      <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">{selectedCourse?.name}</h3>
              <Badge variant="primary">{selectedCourse?.duration}</Badge>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {selectedCourse?.description}
            </p>
          </div>
        </div>

        {/* Modular Grid */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Accredited Curriculum Modules ({selectedCourse?.modules?.length || 4} Units)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedCourse?.modules?.map((mod, idx) => {
              const isExpanded = expandedModuleId === mod.id;

              return (
                <div
                  key={mod.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-50/80 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 leading-snug">{mod.title}</h5>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                      {mod.duration_hours} Hrs
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {mod.description}
                  </p>

                  <div className="pl-8 pt-1 flex flex-wrap gap-1">
                    {mod.skills_covered.map(sk => (
                      <span key={sk} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 3. Trainee Progress & Assessment Benchmarks */}
      <Card className="p-5 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Enrolled Trainees Progress in {selectedCourse?.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of completed curriculum units, passing scores, and certification readiness
            </p>
          </div>

          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {courseEnrollments.length} Active Candidates
          </span>
        </div>

        {/* Student Progress Cards */}
        <div className="space-y-3">
          {courseEnrollments.map(enr => {
            const isCompleted = enr.completion_status === 'completed' || enr.progress_percentage === 100;

            return (
              <div
                key={enr.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-3 w-full md:w-1/3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-xs shrink-0">
                    {(enr.candidate_name || 'A').charAt(0)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{enr.candidate_name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{enr.batch_name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Badge variant={isCompleted ? 'success' : 'primary'} className="text-[10px]">
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Middle: Progress Bar */}
                <div className="w-full md:w-1/3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Modules Completed</span>
                    <span className="text-indigo-700 font-bold">
                      {enr.modules_completed || 3} / {enr.total_modules || 4} ({enr.progress_percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        enr.progress_percentage >= 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${enr.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Right: Assessment Score & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-1/3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Assessment</span>
                    <span className={`text-sm font-black ${(enr.assessment_score || 0) >= 80 ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {enr.assessment_score || 90}%
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenProgressModal(enr)}
                      className="text-xs"
                    >
                      <Sliders className="w-3.5 h-3.5 mr-1" />
                      Update
                    </Button>

                    {isCompleted && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onIssueCertificateForCandidate(enr)}
                        className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                      >
                        <Award className="w-3.5 h-3.5 mr-1" />
                        Certify
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {courseEnrollments.length === 0 && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">No Candidates in this Course</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Enroll candidates to begin monitoring modular progression.</p>
          </div>
        )}
      </Card>

      {/* Progress Update Modal */}
      {editingEnrollment && (
        <Modal
          isOpen={!!editingEnrollment}
          onClose={() => setEditingEnrollment(null)}
          title={`Update Progress: ${editingEnrollment.candidate_name}`}
          size="md"
        >
          <form onSubmit={handleSaveProgress} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Curriculum Learning Progress: <strong className="text-indigo-600">{newProgress}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={newProgress}
                onChange={e => setNewProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Modules Completed (Out of 4)"
                type="number"
                min="0"
                max="4"
                value={newModulesCompleted}
                onChange={e => setNewModulesCompleted(Number(e.target.value))}
                required
              />
              <Input
                label="Assessment Exam Score (%)"
                type="number"
                min="0"
                max="100"
                value={newScore}
                onChange={e => setNewScore(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                <option value="enrolled">In-Training (Enrolled)</option>
                <option value="completed">Completed / Graduated</option>
                <option value="dropped">Dropped Out</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditingEnrollment(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 text-white">
                Save Progress
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
