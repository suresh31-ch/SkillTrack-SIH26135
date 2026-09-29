import React, { useState } from 'react';
import {
  SupportedSkill,
  AssessmentDifficulty,
  CodingLanguage,
  QuizQuestion,
  HistoricalAssessmentRecord
} from '../../../../lib/assessmentData';
import { AssessmentQuizView } from './AssessmentQuizView';
import { AssessmentScoreView } from './AssessmentScoreView';
import { CodingPracticeView } from './CodingPracticeView';
import { AssessmentProgressDashboard } from './AssessmentProgressDashboard';
import { Card, Button, Badge } from '../../../ui';
import {
  CheckSquare,
  Code2,
  BarChart3,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export type AssessmentSubView = 'dashboard' | 'quiz' | 'score' | 'coding';

interface AssessmentModuleProps {
  initialSubView?: AssessmentSubView;
  initialSkill?: SupportedSkill;
}

export const AssessmentModule: React.FC<AssessmentModuleProps> = ({
  initialSubView = 'dashboard',
  initialSkill = 'Python'
}) => {
  const [activeSubView, setActiveSubView] = useState<AssessmentSubView>(initialSubView);
  const [activeSkill, setActiveSkill] = useState<SupportedSkill>(initialSkill);
  const [activeDifficulty, setActiveDifficulty] = useState<AssessmentDifficulty>('Beginner');

  // Completed assessment result for score review screen
  const [completedRecord, setCompletedRecord] = useState<HistoricalAssessmentRecord | null>(null);
  const [completedQuestions, setCompletedQuestions] = useState<QuizQuestion[]>([]);
  const [completedUserAnswers, setCompletedUserAnswers] = useState<Record<number, number>>({});

  // Handlers
  const handleStartQuiz = (skill: SupportedSkill = 'Python', difficulty: AssessmentDifficulty = 'Beginner') => {
    setActiveSkill(skill);
    setActiveDifficulty(difficulty);
    setActiveSubView('quiz');
  };

  const handleAssessmentCompleted = (
    record: HistoricalAssessmentRecord,
    questions: QuizQuestion[],
    userAnswers: Record<number, number>
  ) => {
    setCompletedRecord(record);
    setCompletedQuestions(questions);
    setCompletedUserAnswers(userAnswers);
    setActiveSubView('score');
  };

  const handleGoToCodingPractice = (skillLanguage?: string) => {
    if (skillLanguage && ['Python', 'Java', 'C++', 'SQL'].includes(skillLanguage)) {
      setActiveSkill(skillLanguage as SupportedSkill);
    }
    setActiveSubView('coding');
  };

  return (
    <div className="space-y-6">
      {/* Top Module Sub-Navigation Bar (Only shown when not in middle of timed quiz) */}
      {activeSubView !== 'quiz' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-xl bg-slate-100 border border-slate-200/80">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSubView('dashboard')}
              id="subtab-assessment-progress"
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeSubView === 'dashboard'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Assessment Dashboard & History</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartQuiz(activeSkill, activeDifficulty)}
              id="subtab-skill-quizzes"
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeSubView === 'quiz' || activeSubView === 'score'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Skill Assessments (MCQ Quiz)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('coding')}
              id="subtab-code-lab"
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeSubView === 'coding'
                  ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Code2 className="w-4 h-4 text-blue-600" />
              <span>Coding Practice (Sandbox Lab)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>MSIAS Verified Framework</span>
          </div>
        </div>
      )}

      {/* Dynamic View Rendering */}
      {activeSubView === 'dashboard' && (
        <AssessmentProgressDashboard
          onStartAssessment={(skill, diff) => handleStartQuiz(skill || 'Python', diff || 'Beginner')}
          onGoToCodingPractice={handleGoToCodingPractice}
        />
      )}

      {activeSubView === 'quiz' && (
        <AssessmentQuizView
          initialSkill={activeSkill}
          initialDifficulty={activeDifficulty}
          onAssessmentCompleted={handleAssessmentCompleted}
          onCancel={() => setActiveSubView('dashboard')}
        />
      )}

      {activeSubView === 'score' && completedRecord && (
        <AssessmentScoreView
          record={completedRecord}
          questions={completedQuestions}
          userAnswers={completedUserAnswers}
          onRetake={() => handleStartQuiz(completedRecord.skill, completedRecord.difficulty)}
          onSelectAnother={() => setActiveSubView('quiz')}
          onGoToCodingPractice={handleGoToCodingPractice}
          onViewHistory={() => setActiveSubView('dashboard')}
        />
      )}

      {activeSubView === 'coding' && (
        <CodingPracticeView
          initialLanguage={
            ['Python', 'Java', 'C++', 'SQL'].includes(activeSkill)
              ? (activeSkill as CodingLanguage)
              : 'Python'
          }
        />
      )}
    </div>
  );
};
