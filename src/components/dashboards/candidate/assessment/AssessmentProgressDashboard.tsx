import React, { useState } from 'react';
import {
  AssessmentService,
  AssessmentMetrics,
  SkillProgressData
} from '../../../../lib/assessmentService';
import {
  HistoricalAssessmentRecord,
  SupportedSkill,
  AssessmentDifficulty
} from '../../../../lib/assessmentData';
import { Card, Button, Badge, Input, EmptyState } from '../../../ui';
import { useAuth } from '../../../../context/AuthContext';
import {
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Search,
  Filter,
  RotateCcw,
  Code2,
  Layers,
  Sparkles,
  Flame,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckSquare,
  ShieldCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface AssessmentProgressDashboardProps {
  candidateProfileId?: string;
  onStartAssessment: (skill?: SupportedSkill, difficulty?: AssessmentDifficulty) => void;
  onGoToCodingPractice: (skill?: string) => void;
  onReviewPastAssessment?: (record: HistoricalAssessmentRecord) => void;
}

export const AssessmentProgressDashboard: React.FC<AssessmentProgressDashboardProps> = ({
  candidateProfileId,
  onStartAssessment,
  onGoToCodingPractice,
  onReviewPastAssessment
}) => {
  const { profile, candidateProfile, isDemoMode } = useAuth();
  const effectiveCandidateId = candidateProfileId || candidateProfile?.id || profile?.id || (isDemoMode ? 'prof-cand-001' : '');

  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<'All' | SupportedSkill>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | AssessmentDifficulty>('All');

  const metrics: AssessmentMetrics = AssessmentService.getMetrics(effectiveCandidateId);
  const skillProgressList: SkillProgressData[] = AssessmentService.getSkillWiseProgress(effectiveCandidateId);
  const allHistory: HistoricalAssessmentRecord[] = AssessmentService.getAssessmentHistory(effectiveCandidateId);
  const solvedProblems = AssessmentService.getSolvedProblems(effectiveCandidateId);

  // Filter history records
  const filteredHistory = allHistory.filter(item => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.performanceLevel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchSkill = skillFilter === 'All' || item.skill === skillFilter;
    const matchDiff = difficultyFilter === 'All' || item.difficulty === difficultyFilter;

    return matchSearch && matchSkill && matchDiff;
  });

  // Prepare Chart Data
  const chartData = skillProgressList.map(s => ({
    name: s.skill,
    score: s.quizScore,
    mastery: s.masteryPct,
    problems: s.problemsSolved
  }));

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 Core Top-Level Working Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Available Assessments */}
        <Card className="p-4 space-y-1 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Available</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{metrics.availableAssessments}</div>
          <div className="text-[11px] text-slate-500">Across 6 tech tracks</div>
        </Card>

        {/* Metric 2: Completed Assessments */}
        <Card className="p-4 space-y-1 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{metrics.completedAssessments}</div>
          <div className="text-[11px] text-slate-500">Graded evaluations</div>
        </Card>

        {/* Metric 3: Average Score */}
        <Card className="p-4 space-y-1 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{metrics.averageScore}%</div>
          <div className="text-[11px] text-slate-500">Overall competency</div>
        </Card>

        {/* Metric 4: Skills Assessed */}
        <Card className="p-4 space-y-1 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Skills Assessed</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700">{metrics.skillsAssessedCount} / 6</div>
          <div className="text-[11px] text-slate-500">Domain breadth</div>
        </Card>

        {/* Metric 5: Coding Problems Solved */}
        <Card className="p-4 space-y-1 bg-white border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Problems Solved</span>
            <Code2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{metrics.codingProblemsSolved} / {metrics.totalCodingProblems}</div>
          <div className="text-[11px] text-slate-500">In Code Lab sandbox</div>
        </Card>
      </div>

      {/* Visual Charts & Skill Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 Cols): Competency & Skill Progress Bar Chart */}
        <Card className="lg:col-span-7 p-5 space-y-4 bg-white border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Skill Competency Score Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Average verified quiz score percentage by domain</p>
            </div>
            <Badge variant="primary" className="text-[10px]">
              Live Progress
            </Badge>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  formatter={(val: any) => [`${val}%`, 'Competency Score']}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick CTA to Take Next Assessment */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs">
            <div className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ready to level up your competency score?</span>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onStartAssessment()}
              id="btn-progress-take-assessment"
            >
              Take Assessment
            </Button>
          </div>
        </Card>

        {/* Right (5 Cols): Skill Matrix with Level Badges & Solved Counter */}
        <Card className="lg:col-span-5 p-5 space-y-4 bg-white border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Domain Mastery Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Highest verified difficulty tier per skill</p>
          </div>

          <div className="space-y-3">
            {skillProgressList.map(skill => (
              <div
                key={skill.skill}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between hover:bg-slate-50 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{skill.skill}</span>
                    <Badge
                      variant={
                        skill.highestLevel === 'Advanced' ? 'purple' :
                        skill.highestLevel === 'Intermediate' ? 'primary' :
                        skill.highestLevel === 'Beginner' ? 'success' : 'default'
                      }
                      className="text-[10px]"
                    >
                      {skill.highestLevel}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{skill.completedAttempts} attempt{skill.completedAttempts !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{skill.problemsSolved} problem{skill.problemsSolved !== 1 ? 's' : ''} solved</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">{skill.quizScore}%</div>
                  <button
                    type="button"
                    onClick={() => onStartAssessment(skill.skill as SupportedSkill)}
                    className="text-[11px] text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-0.5"
                  >
                    <span>Assess</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Assessment History Table */}
      <Card className="p-5 space-y-4 bg-white border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              Assessment History & Evaluation Records
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified historical record of completed skill quizzes and performance ratings
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-48">
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
                className="text-xs h-8"
              />
            </div>

            <select
              value={skillFilter}
              onChange={e => setSkillFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Skills</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="SQL">SQL</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={e => setDifficultyFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {allHistory.length === 0 ? (
          <EmptyState
            icon={<Award className="w-6 h-6 text-indigo-500" />}
            title="No assessments completed yet"
            description="Take your first assessment in Python, React, SQL, or other in-demand skills to build verified competency evidence and unlock targeted career recommendations."
            actionText="Start First Assessment"
            onAction={() => onStartAssessment()}
            className="my-3 py-10"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Skill & Assessment</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Score & Percentage</th>
                <th className="py-2.5 px-3">Performance Level</th>
                <th className="py-2.5 px-3">Date Completed</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length > 0 ? (
                filteredHistory.map(record => {
                  const isPassed = record.percentage >= 70;
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{record.title}</div>
                        <div className="text-[11px] text-slate-500">{record.skill} Track</div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            record.difficulty === 'Beginner' ? 'success' :
                            record.difficulty === 'Intermediate' ? 'primary' : 'purple'
                          }
                          className="text-[10px]"
                        >
                          {record.difficulty}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isPassed ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {record.percentage}%
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({record.score}/{record.totalQuestions})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-xs text-slate-700 font-medium">{record.performanceLevel}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {formatDate(record.completedAt)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[11px] h-7 px-2"
                            onClick={() => onStartAssessment(record.skill, record.difficulty)}
                            title="Retake this assessment"
                          >
                            <RotateCcw className="w-3 h-3 mr-1 text-slate-500" />
                            Retake
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[11px] h-7 px-2"
                            onClick={() => onGoToCodingPractice(record.skill)}
                            title="Practice coding exercises"
                          >
                            <Code2 className="w-3 h-3 mr-1 text-indigo-600" />
                            Practice
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No assessment records found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  );
};
