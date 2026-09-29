import React from 'react';
import { LearningCourse, LearningModule, ModuleItem } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Button, Badge } from '../ui';
import {
  BookOpen,
  Code2,
  HelpCircle,
  CheckCircle2,
  Circle,
  Play,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CourseCurriculumTabProps {
  course: LearningCourse;
  onSelectItem: (itemId: string) => void;
  activeItemId?: string;
}

export const CourseCurriculumTab: React.FC<CourseCurriculumTabProps> = ({
  course,
  onSelectItem,
  activeItemId
}) => {
  const progress = LearningService.getCourseProgress(course.id);
  const completedItemIds = progress?.completedItemIds || [];

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'challenge':
        return <Code2 className="w-4 h-4 text-amber-600" />;
      case 'knowledge_check':
        return <HelpCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-500" />;
    }
  };

  const getItemTypeBadge = (type: string) => {
    switch (type) {
      case 'lesson':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Lesson</span>;
      case 'challenge':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Coding Lab</span>;
      case 'knowledge_check':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Assessment</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Summary */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Curriculum Structure & Module Milestones
          </h2>
          <p className="text-xs text-slate-500">
            {course.moduleCount} structured modules • {LearningService.getTotalItemCount(course)} total learning milestones
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{completedItemIds.length} of {LearningService.getTotalItemCount(course)} Completed</span>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-5">
        {course.modules.map((mod: LearningModule, mIdx: number) => {
          const modCompletedItems = mod.items.filter(i => completedItemIds.includes(i.id)).length;
          const isModComplete = modCompletedItems === mod.items.length && mod.items.length > 0;
          const modPercentage = Math.round((modCompletedItems / mod.items.length) * 100) || 0;

          return (
            <Card key={mod.id} className="overflow-hidden border-slate-200 bg-white">
              {/* Module Header Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 uppercase tracking-wider">
                      Module {mIdx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                    {isModComplete && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Module Complete
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{mod.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {mod.estimatedHours} hrs
                  </span>
                  <span className="font-semibold text-indigo-700">
                    {modPercentage}% ({modCompletedItems}/{mod.items.length})
                  </span>
                </div>
              </div>

              {/* Module Items Tree */}
              <div className="divide-y divide-slate-100">
                {mod.items.map((item: ModuleItem, iIdx: number) => {
                  const isItemDone = completedItemIds.includes(item.id);
                  const isCurrent = activeItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className={`p-3.5 sm:px-5 flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                        isCurrent
                          ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600'
                          : 'hover:bg-slate-50 bg-white'
                      }`}
                    >
                      {/* Left Item Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status Icon */}
                        <div className="shrink-0">
                          {isItemDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                              →
                            </div>
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        {/* Title & Type */}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {item.title}
                            </span>
                            {getItemTypeBadge(item.type)}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              {getItemIcon(item.type)}
                              <span>{item.type === 'lesson' ? 'Concept Material' : item.type === 'challenge' ? 'Interactive Lab' : '10-Q Assessment'}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.estimatedMinutes} mins
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="shrink-0 flex items-center gap-2">
                        {isCurrent ? (
                          <span className="px-2.5 py-1 rounded bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 shadow-2xs">
                            Active
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        ) : isItemDone ? (
                          <span className="text-xs text-slate-500 font-medium hover:text-indigo-600 flex items-center gap-1">
                            Review <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                            Start <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
