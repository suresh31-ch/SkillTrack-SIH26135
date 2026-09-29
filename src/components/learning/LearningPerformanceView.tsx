import React from 'react';
import { LearningService } from '../../lib/learningService';
import { LearningCourse } from '../../types/learning';
import { Card, Button, Badge } from '../ui';
import {
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Target,
  Code2,
  HelpCircle,
  Sparkles,
  BarChart3,
  Calendar,
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface LearningPerformanceViewProps {
  onSelectCourse: (course: LearningCourse) => void;
}

export const LearningPerformanceView: React.FC<LearningPerformanceViewProps> = ({
  onSelectCourse
}) => {
  const stats = LearningService.getPersonalStats();
  const courses = LearningService.getCourses();
  const enrolledCourses = courses.filter(c => c.enrolled);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Learning Analytics & Candidate Telemetry
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Performance Dashboard</h1>
          <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
            Real-time evaluation analytics across coding labs, test case pass rates, module knowledge checks, and curriculum milestone velocity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center bg-white/10 backdrop-blur-xs px-5 py-3 rounded-xl border border-white/10">
            <span className="text-3xl font-extrabold text-amber-300 block">{stats.learningStreakDays}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1 justify-center">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Challenges Solved</span>
            <Code2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.challengesCompleted} <span className="text-xs text-slate-400 font-normal">/ {stats.challengesAttempted}</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">{stats.overallAccuracy}% solve accuracy</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Assessment Avg</span>
            <HelpCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.assessmentAverage}%
          </div>
          <p className="text-[11px] text-indigo-600 font-medium">Mastery benchmark</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Test Run Passes</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.successfulTestRuns} <span className="text-xs text-slate-400 font-normal">/ {stats.totalTestRuns}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Evaluation scenarios</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Learning Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.totalLearningHours}h
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Engaged practice</p>
        </Card>
      </div>

      {/* Skill-wise & Difficulty Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skill-Wise Progress */}
        <Card className="p-5 border-slate-200 bg-white space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Skill-Wise Proficiency Index
          </h2>

          <div className="space-y-3 pt-1">
            {stats.skillPerformance.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    {item.skill}
                    {item.verified && (
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Verified
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-indigo-700">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.score >= 85
                        ? 'bg-emerald-600'
                        : item.score >= 75
                        ? 'bg-indigo-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Difficulty Breakdown & Learning Rhythm */}
        <Card className="p-5 border-slate-200 bg-white space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Challenge Difficulty Resolution
          </h2>

          <div className="space-y-3 pt-1">
            {stats.difficultyPerformance.map((diff, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{diff.difficulty} Challenges</span>
                  <span className="font-semibold text-slate-700">
                    {diff.completed} of {diff.total} Solved ({diff.accuracy}% Success Rate)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      diff.difficulty === 'Easy'
                        ? 'bg-emerald-500'
                        : diff.difficulty === 'Medium'
                        ? 'bg-indigo-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${(diff.completed / diff.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-900 space-y-1">
            <strong className="block font-bold">SkillTrack Recommendation:</strong>
            <p className="text-[11px] leading-relaxed">
              Your Python core and Full Stack concepts are at Master level. Focus on Hard Algorithmic challenges to maximize candidate ranking in technical screening.
            </p>
          </div>
        </Card>
      </div>

      {/* Enrolled Courses Progress Table */}
      <Card className="p-5 border-slate-200 bg-white space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-slate-600" />
          Course Completion Status
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Course Name</th>
                <th className="py-2.5 px-3">Primary Skill</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrolledCourses.map(course => {
                const percentage = LearningService.getCourseCompletionPercentage(course.id);
                return (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {course.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{course.primarySkill}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700">{percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {percentage === 100 ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                        </span>
                      ) : (
                        <span className="text-indigo-700 font-medium">In Progress</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectCourse(course)}
                        className="text-xs font-semibold py-1 px-2.5"
                      >
                        Open Workspace
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
