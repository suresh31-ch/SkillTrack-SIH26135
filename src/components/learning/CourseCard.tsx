import React from 'react';
import { LearningCourse } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Badge, Button } from '../ui';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Play,
  ArrowRight,
  User,
  Sparkles,
  Layers,
  Code2,
  CheckSquare,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface CourseCardProps {
  course: LearningCourse;
  onSelectCourse: (course: LearningCourse, defaultItemId?: string) => void;
  onResumeLearning?: (course: LearningCourse) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelectCourse,
  onResumeLearning
}) => {
  const progress = LearningService.getCourseProgress(course.id);
  const completionPercentage = LearningService.getCourseCompletionPercentage(course.id);
  const totalItems = LearningService.getTotalItemCount(course);
  const completedItems = progress?.completedItemIds.length || 0;
  const isCompleted = completionPercentage === 100;
  const isEnrolled = course.enrolled;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'Intermediate':
        return 'border-indigo-200 bg-indigo-50 text-indigo-700';
      case 'Advanced':
      case 'Expert':
        return 'border-rose-200 bg-rose-50 text-rose-700';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group bg-white">
      {/* Top Banner Image with Skill Overlay */}
      <div className="relative h-28 w-full overflow-hidden bg-slate-900">
        <img
          src={course.bannerImage}
          alt={course.name}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-xs ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>

          <div className="flex items-center gap-1">
            {isCompleted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            ) : isEnrolled ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-xs">
                In Progress
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-300 backdrop-blur-xs">
                Available
              </span>
            )}
          </div>
        </div>

        {/* Primary Skill & Category Tag */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-white">
          <span className="font-bold text-xs tracking-wide text-white drop-shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {course.primarySkill}
          </span>
          <span className="text-[11px] text-slate-300 font-medium">
            {course.category}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            onClick={() => onSelectCourse(course)}
            className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
            title={course.name}
          >
            {course.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Instructor & Provider Info */}
          <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <span className="truncate font-medium">{course.instructor.name}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 truncate">{course.provider.split('(')[0]}</span>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-2 mt-3 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
            <div className="flex items-center gap-1 text-slate-600">
              <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{course.moduleCount} Modules</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{course.estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Cert. Ready</span>
            </div>
          </div>

          {/* Recent Activity / Due Date indicator if present */}
          {course.dueDate && (
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-amber-700">
                <Calendar className="w-3 h-3 text-amber-500" /> Due: {formatDate(course.dueDate)}
              </span>
              {progress?.lastAccessedAt && (
                <span className="text-slate-400">
                  Last active: {new Date(progress.lastAccessedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Progress & Actions Footer */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-slate-600">Completion</span>
              <span className="text-[11px] font-bold text-indigo-700">
                {completionPercentage}% ({completedItems}/{totalItems} items)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {isCompleted ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50 flex items-center justify-center gap-1.5"
                onClick={() => onSelectCourse(course, 'certificate')}
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                View Certificate
              </Button>
            ) : isEnrolled && progress && progress.completedItemIds.length > 0 ? (
              <Button
                size="sm"
                variant="primary"
                className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                onClick={() => onResumeLearning ? onResumeLearning(course) : onSelectCourse(course, progress.lastItemId)}
              >
                <Play className="w-3 h-3 fill-current" />
                Resume Learning
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                className="w-full text-xs font-semibold flex items-center justify-center gap-1.5"
                onClick={() => onSelectCourse(course)}
              >
                <span>Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
