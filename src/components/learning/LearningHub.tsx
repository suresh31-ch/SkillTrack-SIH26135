import React, { useState, useMemo } from 'react';
import { LearningCourse, CourseFilterTab } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { CourseCard } from './CourseCard';
import { CourseWorkspace } from './CourseWorkspace';
import { CertificationCenterView } from './CertificationCenterView';
import { LearningPerformanceView } from './LearningPerformanceView';
import { Card, Button, Badge, EmptyState } from '../ui';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Search,
  SlidersHorizontal,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  Play,
  Flame,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const LearningHub: React.FC = () => {
  const [activeNavTab, setActiveNavTab] = useState<CourseFilterTab>('my_learning');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Active course workspace state
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [initialWorkspaceItemId, setInitialWorkspaceItemId] = useState<string | undefined>(undefined);

  const { profile, candidateProfile, isDemoMode } = useAuth();
  const effectiveCandidateId = candidateProfile?.id || profile?.id || (isDemoMode ? 'prof-cand-001' : '');

  const courses = LearningService.getCourses(effectiveCandidateId);
  const allProgress = LearningService.getAllProgress(effectiveCandidateId);
  const personalStats = LearningService.getPersonalStats(effectiveCandidateId);

  // Find most recently accessed active course (only if genuinely in progress)
  const mostRecentActiveCourse = useMemo(() => {
    const enrolledWithProgress = courses.filter(c => {
      const p = allProgress[c.id];
      const pct = LearningService.getCourseCompletionPercentage(c.id, effectiveCandidateId);
      return c.enrolled && p?.lastAccessedAt && pct > 0 && pct < 100;
    });

    if (enrolledWithProgress.length === 0) {
      return null;
    }

    return enrolledWithProgress.sort((a, b) => {
      const dateA = new Date(allProgress[a.id]?.lastAccessedAt || 0).getTime();
      const dateB = new Date(allProgress[b.id]?.lastAccessedAt || 0).getTime();
      return dateB - dateA;
    })[0];
  }, [courses, allProgress, effectiveCandidateId]);

  // Categories list
  const categories = ['All', 'Core Engineering', 'Data Structures & Algorithms', 'Databases & Backend', 'Full Stack Development', 'Artificial Intelligence'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered & Sorted Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const progress = allProgress[course.id];
      const percentage = LearningService.getCourseCompletionPercentage(course.id, effectiveCandidateId);

      // Filter by Main Tab
      if (activeNavTab === 'my_learning') {
        if (!course.enrolled) return false;
      } else if (activeNavTab === 'currently_learning') {
        if (!course.enrolled || percentage === 100 || percentage === 0) return false;
      } else if (activeNavTab === 'finished_learning') {
        if (percentage !== 100) return false;
      } else if (activeNavTab === 'nearly_due') {
        if (!course.dueDate || percentage === 100) return false;
      } else if (activeNavTab === 'recommended') {
        // Show courses not yet completed or highly rated
        if (percentage === 100) return false;
      }

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = course.name.toLowerCase().includes(q);
        const matchesSkill = course.primarySkill.toLowerCase().includes(q);
        const matchesDesc = course.description.toLowerCase().includes(q);
        const matchesInstructor = course.instructor.name.toLowerCase().includes(q);
        if (!matchesName && !matchesSkill && !matchesDesc && !matchesInstructor) {
          return false;
        }
      }

      // Filter by Category
      if (selectedCategory !== 'All') {
        if (course.category !== selectedCategory) return false;
      }

      // Filter by Difficulty
      if (selectedDifficulty !== 'All') {
        if (course.difficulty !== selectedDifficulty) return false;
      }

      return true;
    }).sort((a, b) => {
      const pA = LearningService.getCourseCompletionPercentage(a.id, effectiveCandidateId);
      const pB = LearningService.getCourseCompletionPercentage(b.id, effectiveCandidateId);

      if (sortBy === 'progress_high') {
        return pB - pA;
      } else if (sortBy === 'progress_low') {
        return pA - pB;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Default: recently accessed
        const dateA = new Date(allProgress[a.id]?.lastAccessedAt || a.createdAt).getTime();
        const dateB = new Date(allProgress[b.id]?.lastAccessedAt || b.createdAt).getTime();
        return dateB - dateA;
      }
    });
  }, [courses, allProgress, activeNavTab, searchQuery, selectedCategory, selectedDifficulty, sortBy, effectiveCandidateId]);

  const handleOpenCourse = (course: LearningCourse, defaultItemId?: string) => {
    setSelectedCourseId(course.id);
    setInitialWorkspaceItemId(defaultItemId);
  };

  const handleResumeLearning = (course: LearningCourse) => {
    const p = allProgress[course.id];
    setSelectedCourseId(course.id);
    setInitialWorkspaceItemId(p?.lastItemId);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSortBy('recent');
  };

  // If a course workspace is open, show the dedicated CourseWorkspace
  if (selectedCourseId) {
    return (
      <CourseWorkspace
        courseId={selectedCourseId}
        initialItemId={initialWorkspaceItemId}
        onBackToHub={() => {
          setSelectedCourseId(null);
          setInitialWorkspaceItemId(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Resume Activity Strip */}
      {mostRecentActiveCourse && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Resume Active Learning
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {mostRecentActiveCourse.name}
            </h2>
            <p className="text-xs text-indigo-200 line-clamp-1 max-w-xl">
              {mostRecentActiveCourse.description}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-indigo-300">
                {LearningService.getCourseCompletionPercentage(mostRecentActiveCourse.id, effectiveCandidateId)}% Complete
              </div>
              <div className="w-28 bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-400 h-1.5 rounded-full"
                  style={{
                    width: `${LearningService.getCourseCompletionPercentage(mostRecentActiveCourse.id, effectiveCandidateId)}%`
                  }}
                />
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => handleResumeLearning(mostRecentActiveCourse)}
              className="text-xs font-semibold bg-white text-slate-950 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current text-indigo-600" />
              <span>Resume Now</span>
            </Button>
          </div>
        </div>
      )}

      {/* Main Hub Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveNavTab('my_learning')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeNavTab === 'my_learning'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Learning ({courses.filter(c => c.enrolled).length})</span>
          </button>

          <button
            onClick={() => setActiveNavTab('currently_learning')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeNavTab === 'currently_learning'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Currently Learning</span>
          </button>

          <button
            onClick={() => setActiveNavTab('finished_learning')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeNavTab === 'finished_learning'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finished Learning</span>
          </button>

          <button
            onClick={() => setActiveNavTab('nearly_due')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeNavTab === 'nearly_due'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Nearly Due</span>
          </button>

          <button
            onClick={() => setActiveNavTab('recommended')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeNavTab === 'recommended'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended for You</span>
          </button>
        </div>

        {/* Quick links to Performance & Certifications */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveNavTab('performance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeNavTab === 'performance'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveNavTab('certification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeNavTab === 'certification'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Certificates</span>
          </button>
        </div>
      </div>

      {/* Render Subviews: Performance or Certification */}
      {activeNavTab === 'performance' && (
        <LearningPerformanceView onSelectCourse={handleOpenCourse} />
      )}

      {activeNavTab === 'certification' && (
        <CertificationCenterView onSelectCourse={handleOpenCourse} />
      )}

      {/* Main Course Catalog & Filtering view (for course tabs) */}
      {activeNavTab !== 'performance' && activeNavTab !== 'certification' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <Card className="p-4 border-slate-200 bg-white space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Field */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search courses, skills, instructors..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="sm:col-span-2">
                <select
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {difficulties.map(d => (
                    <option key={d} value={d}>Difficulty: {d}</option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="sm:col-span-2">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="recent">Recently Active</option>
                  <option value="progress_high">Progress: High to Low</option>
                  <option value="progress_low">Progress: Low to High</option>
                  <option value="name">Course Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Active Filters / Results summary */}
            {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>
                  Showing {filteredCourses.length} of {courses.length} courses
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear Filters
                </button>
              </div>
            )}
          </Card>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            activeNavTab === 'my_learning' && !searchQuery ? (
              <EmptyState
                icon={<BookOpen className="w-8 h-8 text-indigo-500" />}
                title="No learning activity yet"
                description="You have not enrolled in any courses yet. Browse our industry-aligned curriculum below to begin your personalized learning journey."
                actionText="Explore All Courses"
                onAction={() => setActiveNavTab('all_courses')}
                className="my-6 py-12 bg-white"
              />
            ) : (
              <Card className="p-12 text-center border-slate-200 bg-white space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Courses Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No learning courses match your current search query or filter selection.
                </p>
                <Button size="sm" variant="outline" onClick={handleClearFilters} className="text-xs">
                  Reset All Filters
                </Button>
              </Card>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelectCourse={handleOpenCourse}
                  onResumeLearning={handleResumeLearning}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
