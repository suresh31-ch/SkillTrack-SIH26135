import React, { useState, useEffect } from 'react';
import { LearningCourse, ModuleItem } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Button, Badge } from '../ui';
import { CourseOverviewTab } from './CourseOverviewTab';
import { CourseCurriculumTab } from './CourseCurriculumTab';
import { LessonViewer } from './LessonViewer';
import { KnowledgeCheckView } from './KnowledgeCheckView';
import { CodingChallengeLab } from './CodingChallengeLab';
import { LearningPerformanceView } from './LearningPerformanceView';
import { CertificateModal } from './CertificateModal';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Code2,
  HelpCircle,
  Award,
  BarChart3,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ListFilter
} from 'lucide-react';

interface CourseWorkspaceProps {
  courseId: string;
  initialItemId?: string;
  onBackToHub: () => void;
}

export const CourseWorkspace: React.FC<CourseWorkspaceProps> = ({
  courseId,
  initialItemId,
  onBackToHub
}) => {
  const { showToast } = useToast();
  const [course, setCourse] = useState<LearningCourse | undefined>(() => LearningService.getCourseById(courseId));
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'workspace' | 'performance' | 'certificate'>('workspace');
  const [activeItemId, setActiveItemId] = useState<string>('');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Flatten all items across modules
  const allItems: ModuleItem[] = course
    ? course.modules.flatMap(m => m.items)
    : [];

  useEffect(() => {
    const updated = LearningService.getCourseById(courseId);
    setCourse(updated);

    if (updated) {
      const progress = LearningService.getCourseProgress(courseId);
      if (initialItemId && initialItemId === 'certificate') {
        setActiveTab('certificate');
      } else if (initialItemId && allItems.some(i => i.id === initialItemId)) {
        setActiveItemId(initialItemId);
        setActiveTab('workspace');
      } else if (progress?.lastItemId && allItems.some(i => i.id === progress.lastItemId)) {
        setActiveItemId(progress.lastItemId);
        setActiveTab('workspace');
      } else if (allItems.length > 0) {
        setActiveItemId(allItems[0].id);
        setActiveTab('workspace');
      }
    }
  }, [courseId, initialItemId, refreshTrigger]);

  if (!course) {
    return (
      <Card className="p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-slate-900">Course Not Found</h2>
        <Button size="sm" variant="primary" onClick={onBackToHub}>
          Return to Learning Hub
        </Button>
      </Card>
    );
  }

  const progress = LearningService.getCourseProgress(course.id);
  const completionPercentage = LearningService.getCourseCompletionPercentage(course.id);
  const totalItems = LearningService.getTotalItemCount(course);
  const completedCount = progress?.completedItemIds.length || 0;

  // Find active item and its parent module
  const activeItem = allItems.find(i => i.id === activeItemId) || allItems[0];
  const activeModule = course.modules.find(m => m.items.some(i => i.id === activeItem?.id));

  const handleSelectItem = (itemId: string) => {
    setActiveItemId(itemId);
    setActiveTab('workspace');
    LearningService.updateLastAccessedItem(course.id, itemId);
  };

  const handleItemCompleted = (itemId: string) => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleResumeLastActivity = () => {
    if (progress?.lastItemId) {
      handleSelectItem(progress.lastItemId);
    } else if (allItems.length > 0) {
      handleSelectItem(allItems[0].id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Workspace Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onBackToHub}
              className="text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Learning Hub</span>
            </Button>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {course.difficulty}
                </span>
                <span className="text-xs text-slate-500 font-medium">{course.primarySkill}</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900 truncate" title={course.name}>
                {course.name}
              </h1>
            </div>
          </div>

          {/* Quick Resume & Progress Widget */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-slate-900">
                {completionPercentage}% Complete
              </div>
              <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">
                {completedCount} of {totalItems} items
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={handleResumeLastActivity}
              className="text-xs font-semibold flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Activity</span>
            </Button>
          </div>
        </div>

        {/* Workspace Sub-tabs Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'workspace'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Interactive Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'curriculum'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curriculum & Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Course Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'performance'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Learning Analytics</span>
          </button>

          <button
            onClick={() => {
              if (completionPercentage === 100) {
                setShowCertificateModal(true);
              } else {
                setActiveTab('certificate');
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'certificate'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificate ({completionPercentage === 100 ? 'Ready' : `${completionPercentage}%`})</span>
          </button>
        </div>
      </div>

      {/* Main Tab View Switcher */}
      {activeTab === 'workspace' && activeItem && (
        <div>
          {/* Quick Item Picker Ribbon */}
          <div className="mb-4 flex items-center justify-between gap-2 overflow-x-auto pb-1 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1.5 pl-1">
              <ListFilter className="w-3.5 h-3.5 text-indigo-600" />
              Module Items:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {allItems.map((it, idx) => {
                const isSelected = it.id === activeItem.id;
                const isDone = progress?.completedItemIds.includes(it.id);

                return (
                  <button
                    key={it.id}
                    onClick={() => handleSelectItem(it.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : null}
                    <span>{idx + 1}. {it.title.slice(0, 18)}...</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Render Active Item Sub-Component */}
          {activeItem.type === 'lesson' && (
            <LessonViewer
              course={course}
              moduleTitle={activeModule?.title || 'Module'}
              item={activeItem}
              onNavigateItem={handleSelectItem}
              onItemCompleted={handleItemCompleted}
              allCourseItems={allItems}
            />
          )}

          {activeItem.type === 'challenge' && (
            <CodingChallengeLab
              course={course}
              moduleTitle={activeModule?.title || 'Module'}
              item={activeItem}
              onNavigateItem={handleSelectItem}
              onItemCompleted={handleItemCompleted}
              allCourseItems={allItems}
            />
          )}

          {activeItem.type === 'knowledge_check' && (
            <KnowledgeCheckView
              course={course}
              moduleTitle={activeModule?.title || 'Module'}
              item={activeItem}
              onNavigateItem={handleSelectItem}
              onItemCompleted={handleItemCompleted}
              allCourseItems={allItems}
            />
          )}
        </div>
      )}

      {activeTab === 'curriculum' && (
        <CourseCurriculumTab
          course={course}
          onSelectItem={handleSelectItem}
          activeItemId={activeItemId}
        />
      )}

      {activeTab === 'overview' && (
        <CourseOverviewTab
          course={course}
          onStartOrResume={handleResumeLastActivity}
          onViewCurriculum={() => setActiveTab('curriculum')}
        />
      )}

      {activeTab === 'performance' && (
        <LearningPerformanceView
          onSelectCourse={() => {}}
        />
      )}

      {activeTab === 'certificate' && (
        <Card className="p-8 text-center border-slate-200 bg-white space-y-4 max-w-2xl mx-auto">
          <Award className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">SkillTrack Verified Credential</h2>
          
          {completionPercentage === 100 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Congratulations! You have completed all curriculum milestones, solved all practical challenges, and passed all knowledge checks.
              </p>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setShowCertificateModal(true)}
                className="text-xs font-semibold"
              >
                Open Verified Certificate
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                You have currently completed {completionPercentage}% of this course ({completedCount}/{totalItems} requirements).
                Finish all remaining lessons and assessments to unlock your verified credential.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleResumeLastActivity}
                  className="text-xs font-semibold"
                >
                  Resume Course Milestones
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          course={course}
          progress={progress}
        />
      )}
    </div>
  );
};
