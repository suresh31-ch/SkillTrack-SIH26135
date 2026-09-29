import React, { useState } from 'react';
import { ModuleItem, LearningCourse } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Button, Badge } from '../ui';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Award,
  Code2,
  FileText,
  BookmarkCheck
} from 'lucide-react';

interface LessonViewerProps {
  course: LearningCourse;
  moduleTitle: string;
  item: ModuleItem;
  onNavigateItem: (itemId: string) => void;
  onItemCompleted: (itemId: string) => void;
  allCourseItems: ModuleItem[];
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  course,
  moduleTitle,
  item,
  onNavigateItem,
  onItemCompleted,
  allCourseItems
}) => {
  const { showToast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const lessonData = item.lessonData;
  const progress = LearningService.getCourseProgress(course.id);
  const isCompleted = progress?.completedItemIds.includes(item.id) || false;

  const currentIndex = allCourseItems.findIndex(i => i.id === item.id);
  const prevItem = currentIndex > 0 ? allCourseItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allCourseItems.length - 1 ? allCourseItems[currentIndex + 1] : null;

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    showToast('Code snippet copied to clipboard', 'info');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleMarkComplete = () => {
    LearningService.markItemCompleted(course.id, item.id);
    onItemCompleted(item.id);
    showToast(`Lesson completed: "${item.title}"`, 'success');
  };

  if (!lessonData) {
    return (
      <Card className="p-8 text-center space-y-3">
        <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Lesson Material Coming Soon</h3>
        <p className="text-xs text-slate-500">The content for this module item is being prepared.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Context */}
      <div className="space-y-2 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>{course.name}</span>
          <span>•</span>
          <span className="text-indigo-600 font-semibold">{moduleTitle}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
              {lessonData.heading}
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {lessonData.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {lessonData.estimatedMinutes} mins
            </span>

            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Completed
              </span>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={handleMarkComplete}
                className="text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <BookmarkCheck className="w-4 h-4" />
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Learning Content Sections */}
      <div className="space-y-6">
        {lessonData.sections.map((section, sIdx) => (
          <Card key={sIdx} className="p-5 space-y-4 border-slate-200 bg-white">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              {section.title}
            </h2>

            <div className="text-xs text-slate-700 leading-relaxed space-y-2.5">
              {section.content.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {/* Code Snippet Box with Copy Action */}
            {section.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 text-xs font-mono shadow-xs mt-3">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    {section.codeSnippet.caption || `${section.codeSnippet.language.toUpperCase()} Example`}
                  </span>
                  <button
                    onClick={() => handleCopyCode(section.codeSnippet!.code, sIdx)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedIndex === sIdx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed font-mono text-slate-200">
                  <code>{section.codeSnippet.code}</code>
                </pre>

                {section.codeSnippet.output && (
                  <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Program Output:
                    </span>
                    <pre className="text-emerald-400 font-mono text-[11px] whitespace-pre-wrap">
                      {section.codeSnippet.output}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Callout Card (Tip, Warning, Info, Best Practice) */}
            {section.callout && (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 mt-3 ${
                  section.callout.type === 'best_practice'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : section.callout.type === 'warning'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                }`}
              >
                {section.callout.type === 'best_practice' ? (
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : section.callout.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <span className="font-bold text-[11px] uppercase tracking-wider block">
                    {section.callout.type === 'best_practice' ? 'SkillTrack Best Practice' : section.callout.type.toUpperCase()}
                  </span>
                  <p className="leading-relaxed">{section.callout.text}</p>
                </div>
              </div>
            )}

            {/* Key Takeaway */}
            {section.keyTakeaway && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center gap-2 text-slate-700">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong className="text-slate-900">Key Takeaway:</strong> {section.keyTakeaway}
                </span>
              </div>
            )}
          </Card>
        ))}

        {/* Important Points Checklist */}
        {lessonData.importantPoints && lessonData.importantPoints.length > 0 && (
          <Card className="p-4 bg-slate-50 border-slate-200 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Important Conceptual Points to Remember
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 pl-1">
              {lessonData.importantPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Related Resources */}
        {lessonData.relatedResources && lessonData.relatedResources.length > 0 && (
          <Card className="p-4 space-y-3 border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              Related Reference Documentation & Labs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lessonData.relatedResources.map((res, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200/80 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{res.title}</span>
                      <Badge variant="primary" className="text-[9px] uppercase font-semibold">
                        {res.type}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{res.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Sticky-style Navigation Bar */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <div>
          {prevItem ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateItem(prevItem.id)}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: {prevItem.title.slice(0, 24)}...</span>
            </Button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleMarkComplete}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Mark Complete
            </Button>
          )}

          {nextItem && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                if (!isCompleted) {
                  LearningService.markItemCompleted(course.id, item.id);
                  onItemCompleted(item.id);
                }
                onNavigateItem(nextItem.id);
              }}
              className="text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <span>Continue to Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
