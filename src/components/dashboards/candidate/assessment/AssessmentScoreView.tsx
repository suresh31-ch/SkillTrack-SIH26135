import React, { useState } from 'react';
import {
  HistoricalAssessmentRecord,
  QuizQuestion,
  SupportedSkill
} from '../../../../lib/assessmentData';
import { Card, Button, Badge } from '../../../ui';
import {
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  Code2,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface AssessmentScoreViewProps {
  record: HistoricalAssessmentRecord;
  questions: QuizQuestion[];
  userAnswers: Record<number, number>;
  onRetake: () => void;
  onSelectAnother: () => void;
  onGoToCodingPractice: (skillLanguage?: string) => void;
  onViewHistory: () => void;
}

export const AssessmentScoreView: React.FC<AssessmentScoreViewProps> = ({
  record,
  questions,
  userAnswers,
  onRetake,
  onSelectAnother,
  onGoToCodingPractice,
  onViewHistory
}) => {
  const [showDetailedReview, setShowDetailedReview] = useState(true);

  const correctCount = record.score;
  const incorrectCount = record.totalQuestions - record.score;
  const isPassed = record.percentage >= 70;

  // Format time spent mm:ss
  const formatTimeSpent = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Score Metrics */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SkillTrack Verified Competency Assessment
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {record.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Assessment completed and securely recorded into your candidate profile registry with tamper-evident grading.
            </p>
          </div>

          {/* Large Visual Score Ring / Metric */}
          <div className="flex items-center gap-4 shrink-0 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="text-center">
              <div className={`text-4xl sm:text-5xl font-black ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {record.percentage}%
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                Score: {record.score} / {record.totalQuestions}
              </div>
            </div>

            <div className="h-12 w-px bg-white/10" />

            <div className="space-y-1">
              <Badge variant={isPassed ? 'success' : 'warning'} className="text-xs px-2.5 py-0.5">
                {record.performanceLevel}
              </Badge>
              <div className="text-[11px] text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Time: {formatTimeSpent(record.timeSpentSeconds)}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 space-y-1 bg-white border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Correct Answers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700">{correctCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Out of {record.totalQuestions} questions</div>
        </Card>

        <Card className="p-3.5 space-y-1 bg-white border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Incorrect Answers</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-700">{incorrectCount}</div>
          <div className="text-[10px] text-slate-400 font-medium">Areas for reinforcement</div>
        </Card>

        <Card className="p-3.5 space-y-1 bg-white border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verification Status</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm font-bold text-slate-900 pt-1">
            {isPassed ? 'Passed Verified' : 'Needs Practice'}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">70% benchmark</div>
        </Card>

        <Card className="p-3.5 space-y-1 bg-white border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Time Taken</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 pt-1">
            {formatTimeSpent(record.timeSpentSeconds)}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">15 min allocated</div>
        </Card>
      </div>

      {/* Domain-Specific Improvement Recommendations */}
      <Card className="p-5 bg-indigo-50/60 border-indigo-200 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Personalized Skill Improvement Recommendations
          </h3>
        </div>

        <ul className="space-y-2 text-xs text-slate-700">
          {record.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-indigo-100 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Code2 className="w-3.5 h-3.5" />}
            onClick={() => onGoToCodingPractice(record.skill)}
            id="btn-score-practice-lab"
          >
            Practice in Code Lab
          </Button>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={onRetake}
            id="btn-score-retake"
          >
            Retake Quiz
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onSelectAnother}
            id="btn-score-select-skill"
          >
            Choose Another Skill
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onViewHistory}
            id="btn-score-view-history"
          >
            View Assessment History
          </Button>
        </div>
      </Card>

      {/* Detailed Question Review Accordion / Section */}
      <Card className="p-5 space-y-4 bg-white border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Question-by-Question Review</h3>
            <p className="text-xs text-slate-500 mt-0.5">Analyze correct solutions and technical explanations for all 10 questions</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDetailedReview(!showDetailedReview)}
            rightIcon={showDetailedReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            {showDetailedReview ? 'Hide Details' : 'Show All Questions'}
          </Button>
        </div>

        {showDetailedReview && (
          <div className="space-y-4 pt-1">
            {questions.map((q, idx) => {
              const userChoice = userAnswers[q.id];
              const isCorrect = userChoice === q.correctIndex;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border space-y-3 transition-all ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Question {idx + 1}</span>
                        <Badge variant="default" className="text-[10px]">{q.topic}</Badge>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{q.question}</p>
                    </div>

                    <Badge variant={isCorrect ? 'success' : 'danger'}>
                      {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                    </Badge>
                  </div>

                  {q.codeSnippet && (
                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                      <pre className="whitespace-pre">{q.codeSnippet}</pre>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isSelectedByUser = userChoice === optIdx;
                      const isTheCorrectOption = optIdx === q.correctIndex;

                      let badgeClass = 'border-slate-200 bg-white text-slate-700';
                      if (isTheCorrectOption) {
                        badgeClass = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-300';
                      } else if (isSelectedByUser && !isCorrect) {
                        badgeClass = 'border-rose-400 bg-rose-50 text-rose-950 font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border flex items-start gap-2 ${badgeClass}`}
                        >
                          <span className="font-mono font-bold text-[11px] shrink-0">
                            {optionLetters[optIdx]}.
                          </span>
                          <span className="flex-1 leading-snug">{opt}</span>
                          {isTheCorrectOption && (
                            <span className="text-[10px] text-emerald-700 font-bold shrink-0">Correct</span>
                          )}
                          {isSelectedByUser && !isTheCorrectOption && (
                            <span className="text-[10px] text-rose-700 font-bold shrink-0">Your Choice</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Technical Explanation */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      Explanation:
                    </span>
                    <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
