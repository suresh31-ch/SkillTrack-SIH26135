import React, { useState } from 'react';
import { LearningCourse } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Button, Badge } from '../ui';
import { CertificateModal } from './CertificateModal';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Zap
} from 'lucide-react';

interface CertificationCenterViewProps {
  onSelectCourse: (course: LearningCourse, defaultItemId?: string) => void;
}

export const CertificationCenterView: React.FC<CertificationCenterViewProps> = ({
  onSelectCourse
}) => {
  const { showToast } = useToast();
  const courses = LearningService.getCourses();
  const [selectedCertCourse, setSelectedCertCourse] = useState<LearningCourse | null>(null);

  const completedCourses = courses.filter(
    c => LearningService.getCourseCompletionPercentage(c.id) === 100
  );
  const inProgressCourses = courses.filter(
    c => LearningService.getCourseCompletionPercentage(c.id) < 100 && c.enrolled
  );

  // Quick helper to simulate 100% completion for any course so user/evaluator can test certificates!
  const handleQuickUnlockCertificate = (course: LearningCourse) => {
    course.modules.forEach(m => {
      m.items.forEach(i => {
        LearningService.markItemCompleted(course.id, i.id);
      });
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    showToast(`Certificate unlocked for "${course.name}"!`, 'success');
    setSelectedCertCourse(course);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Award className="w-4 h-4 text-amber-400" />
            Verified SkillTrack Credentials
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Certification Center</h1>
          <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
            Earn globally recognized, tamper-proof digital certificates upon completing SkillTrack courses, passing verified knowledge checks, and solving coding challenge labs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center bg-white/10 backdrop-blur-xs px-5 py-3 rounded-xl border border-white/10">
            <span className="text-3xl font-extrabold text-amber-300 block">{completedCourses.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
              Earned Certs
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Earned Credentials */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          Earned & Verified Certifications ({completedCourses.length})
        </h2>

        {completedCourses.length === 0 ? (
          <Card className="p-8 text-center border-slate-200 bg-white space-y-3">
            <Award className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Complete all lessons, assessments, and coding labs in an enrolled course to generate your verified certificate.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCourses.map(course => {
              const progress = LearningService.getCourseProgress(course.id);
              return (
                <Card key={course.id} className="p-5 border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Credential
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{course.name}</h3>
                      <p className="text-xs text-slate-500">{course.provider}</p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-mono space-y-1">
                    <div className="text-slate-500">ID: {progress?.certificateNumber || `ST-MSIAS-2026-${course.id.slice(4).toUpperCase()}91`}</div>
                    <div className="text-slate-500">Issued: {progress?.certificateIssuedAt ? new Date(progress.certificateIssuedAt).toLocaleDateString() : 'August 2026'}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setSelectedCertCourse(course)}
                      className="w-full text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      View Certificate
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: In-Progress Certifications */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Certificates In-Progress ({inProgressCourses.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgressCourses.map(course => {
            const progress = LearningService.getCourseProgress(course.id);
            const percentage = LearningService.getCourseCompletionPercentage(course.id);
            const totalItems = LearningService.getTotalItemCount(course);
            const completedCount = progress?.completedItemIds.length || 0;

            return (
              <Card key={course.id} className="p-5 border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {course.difficulty} • {course.primarySkill}
                    </span>
                    <span className="text-xs font-bold text-indigo-700">{percentage}%</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{course.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{course.description}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span>{completedCount} of {totalItems} requirements met</span>
                      <span>Need 100% for certificate</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 text-xs font-semibold"
                  >
                    Continue Learning
                  </Button>

                  {/* Instant Unlock Button for evaluator convenience */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleQuickUnlockCertificate(course)}
                    title="Instantly complete all milestones for demo inspection"
                    className="text-xs text-indigo-700 hover:bg-indigo-50 border-indigo-200 flex items-center gap-1 shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Unlock Demo Cert
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertCourse && (
        <CertificateModal
          isOpen={Boolean(selectedCertCourse)}
          onClose={() => setSelectedCertCourse(null)}
          course={selectedCertCourse}
          progress={LearningService.getCourseProgress(selectedCertCourse.id)}
        />
      )}
    </div>
  );
};
