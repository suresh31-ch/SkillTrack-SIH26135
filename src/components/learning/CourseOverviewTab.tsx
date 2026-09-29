import React from 'react';
import { LearningCourse } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Button, Badge } from '../ui';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Play,
  User,
  Sparkles,
  Layers,
  Code2,
  FileCheck,
  Target,
  ShieldCheck,
  Check,
  ExternalLink
} from 'lucide-react';

interface CourseOverviewTabProps {
  course: LearningCourse;
  onStartOrResume: () => void;
  onViewCurriculum: () => void;
}

export const CourseOverviewTab: React.FC<CourseOverviewTabProps> = ({
  course,
  onStartOrResume,
  onViewCurriculum
}) => {
  const progress = LearningService.getCourseProgress(course.id);
  const completionPercentage = LearningService.getCourseCompletionPercentage(course.id);
  const totalItems = LearningService.getTotalItemCount(course);
  const completedItems = progress?.completedItemIds.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Card */}
      <Card className="overflow-hidden border-slate-200 bg-white">
        <div className="relative h-48 sm:h-56 w-full bg-slate-950 overflow-hidden">
          <img
            src={course.bannerImage}
            alt={course.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-600/90 text-white backdrop-blur-xs">
                {course.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                {course.category}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {course.provider}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
              {course.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl line-clamp-2 leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>

        {/* Action Strip */}
        <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{course.moduleCount} Modules ({totalItems} items)</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{course.estimatedDuration} Total</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>SkillTrack Certificate</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onViewCurriculum}
              className="text-xs font-semibold"
            >
              View Full Syllabus
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={onStartOrResume}
              className="text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {completionPercentage > 0 && completionPercentage < 100
                  ? `Resume (${completionPercentage}%)`
                  : completionPercentage === 100
                  ? 'Review Course'
                  : 'Start Learning'}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid: What you'll learn & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Outcomes */}
        <Card className="p-5 border-slate-200 bg-white space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            What You'll Master in this Course
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {course.whatYouWillLearn.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Prerequisites */}
        <Card className="p-5 border-slate-200 bg-white space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-600" />
            Prerequisites & Background Knowledge
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {course.prerequisites.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {/* Certificate Requirement Callout */}
          <div className="mt-4 p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs space-y-1">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Verified Certification Eligibility
            </div>
            <p className="text-indigo-800 text-[11px] leading-relaxed">
              Complete all lessons, pass every module Knowledge Check, and solve all coding practice challenges to unlock your tamper-proof SkillTrack Digital Credential.
            </p>
          </div>
        </Card>
      </div>

      {/* Instructor & Author Bio */}
      <Card className="p-5 border-slate-200 bg-white space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-600" />
          Lead Instructor & Curriculum Architect
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{course.instructor.name}</h3>
              <Badge variant="primary" className="text-[10px]">Verified Instructor</Badge>
            </div>
            <p className="font-medium text-indigo-600">{course.instructor.title}</p>
            <p className="text-slate-600 leading-relaxed max-w-2xl">{course.instructor.bio}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
