import React, { useState, useEffect } from 'react';
import { ModuleItem, LearningCourse, KnowledgeCheckData, KnowledgeCheckResult } from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Button, Badge, Modal } from '../ui';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  HelpCircle,
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Code2
} from 'lucide-react';

interface KnowledgeCheckViewProps {
  course: LearningCourse;
  moduleTitle: string;
  item: ModuleItem;
  onNavigateItem: (itemId: string) => void;
  onItemCompleted: (itemId: string) => void;
  allCourseItems: ModuleItem[];
}

export const KnowledgeCheckView: React.FC<KnowledgeCheckViewProps> = ({
  course,
  moduleTitle,
  item,
  onNavigateItem,
  onItemCompleted,
  allCourseItems
}) => {
  const { showToast } = useToast();
  const { user, profile, isDemoMode } = useAuth();
  const effectiveCandidateId = isDemoMode ? 'prof-cand-001' : (user?.id || profile?.id || 'default');
  const kcData: KnowledgeCheckData | undefined = item.knowledgeCheckData;

  const progress = LearningService.getCourseProgress(course.id, effectiveCandidateId);
  const existingResult = kcData ? progress?.knowledgeCheckResults[kcData.id] : undefined;

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>((kcData?.timeLimitMinutes || 10) * 60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [result, setResult] = useState<KnowledgeCheckResult | undefined>(existingResult);

  // Restore prior result if already completed
  useEffect(() => {
    if (existingResult) {
      setResult(existingResult);
      if (existingResult.userAnswers) {
        setSelectedAnswers(existingResult.userAnswers);
      }
    }
  }, [existingResult]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || result || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, result, secondsRemaining]);

  if (!kcData) {
    return (
      <Card className="p-8 text-center space-y-3">
        <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Knowledge Check Coming Soon</h3>
        <p className="text-xs text-slate-500">The questions for this module assessment are being prepared.</p>
      </Card>
    );
  }

  const questions = kcData.questions;
  const currentQuestion = questions[currentQIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = questions.length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (result) return; // Locked after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleClearAnswer = () => {
    if (result) return;
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleSubmit = () => {
    setShowConfirmModal(false);
    setIsTimerActive(false);

    const timeSpent = (kcData.timeLimitMinutes * 60) - secondsRemaining;
    const computedResult = LearningService.submitKnowledgeCheck(
      course.id,
      item.id,
      kcData.id,
      selectedAnswers,
      questions,
      timeSpent,
      effectiveCandidateId
    );

    setResult(computedResult);
    onItemCompleted(item.id);
    showToast(`Knowledge Check evaluated: ${computedResult.percentage}% Score`, 'success');
  };

  const handleRetake = () => {
    setResult(undefined);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQIndex(0);
    setSecondsRemaining(kcData.timeLimitMinutes * 60);
    setIsTimerActive(true);
  };

  const currentIndex = allCourseItems.findIndex(i => i.id === item.id);
  const nextItem = currentIndex < allCourseItems.length - 1 ? allCourseItems[currentIndex + 1] : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{course.name}</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">{moduleTitle}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
            {kcData.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{kcData.description}</p>
        </div>

        {/* Timer & Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!result ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${
                secondsRemaining < 120
                  ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time Left: {formatTimer(secondsRemaining)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Score: {result.percentage}% ({result.performanceCategory})
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetake}
                className="text-xs font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Assessment Layout */}
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question View (Left 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-6 border-slate-200 space-y-5 bg-white">
              {/* Question Meta Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                    Question {currentQIndex + 1} of {totalCount}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Topic: {currentQuestion.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleFlag}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                      flaggedQuestions[currentQuestion.id]
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag for Review'}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                {currentQuestion.question}
              </div>

              {/* Code Snippet in Question if present */}
              {currentQuestion.codeSnippet && (
                <div className="p-3.5 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre><code>{currentQuestion.codeSnippet}</code></pre>
                </div>
              )}

              {/* Options List */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === oIdx;
                  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {optionLetters[oIdx]}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  {selectedAnswers[currentQuestion.id] !== undefined && (
                    <button
                      onClick={handleClearAnswer}
                      className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                    className="text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {currentQIndex < totalCount - 1 ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setCurrentQIndex(prev => Math.min(totalCount - 1, prev + 1))}
                      className="text-xs font-semibold"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setShowConfirmModal(true)}
                      className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Submit Assessment
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Navigator Panel */}
          <div className="space-y-4">
            <Card className="p-4 border-slate-200 space-y-3.5 bg-white">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Navigator
              </h3>

              {/* Question Pills Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isFlagged = flaggedQuestions[q.id];
                  const isCurrent = idx === currentQIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-indigo-600 ring-offset-1 bg-indigo-600 text-white'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isFlagged && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-400" />
                    Answered
                  </span>
                  <span className="font-bold text-slate-900">{answeredCount}/{totalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-300" />
                    Unanswered
                  </span>
                  <span className="font-bold text-slate-900">{totalCount - answeredCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Flagged for Review
                  </span>
                  <span className="font-bold text-slate-900">{flaggedCount}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Assessment
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Post-Submission Performance Summary */
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white space-y-6">
            {/* Top Score Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  {result.performanceCategory} Performance Tier
                </div>
                <h2 className="text-xl font-bold">Knowledge Check Assessment Completed</h2>
                <p className="text-xs text-indigo-200">
                  Completed in {Math.round(result.timeSpentSeconds / 60)} minutes • Evaluated against SkillTrack benchmarks
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center bg-white/10 backdrop-blur-xs px-5 py-3 rounded-xl border border-white/10">
                  <span className="text-3xl font-extrabold text-white block">{result.percentage}%</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                    {result.score}/{result.totalMarks} Points
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-950 block">{result.correctCount} Correct</span>
                  <span className="text-slate-500 text-[11px]">Accurate answers</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="font-bold text-rose-950 block">{result.incorrectCount} Incorrect</span>
                  <span className="text-slate-500 text-[11px]">Review recommended</span>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">{result.unansweredCount} Unanswered</span>
                  <span className="text-slate-500 text-[11px]">Skipped items</span>
                </div>
              </div>
            </div>

            {/* Strong & Improvement Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Demonstrated Strengths
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.strongAreas.map((area, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-medium border border-emerald-200">
                      ✓ {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Recommended Areas for Review
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.improvementAreas.map((area, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-medium border border-amber-200">
                      • {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Next Steps */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Suggested Next Action
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">
                    {result.suggestedLessons[0] || 'Continue learning curriculum'}
                  </span>
                  <span className="text-slate-600">
                    Reinforce your understanding with the practical coding challenge or proceed to the next module.
                  </span>
                </div>
                {nextItem && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigateItem(nextItem.id)}
                    className="text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <span>Proceed to {nextItem.title.slice(0, 20)}...</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Detailed Question Review List */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Question-by-Question Review & Rationales</h3>
              
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs space-y-3 ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : userAns !== undefined
                          ? 'border-rose-200 bg-rose-50/20'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          Q{idx + 1}: {q.question}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                            isCorrect
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                              : 'bg-rose-100 border-rose-300 text-rose-800'
                          }`}
                        >
                          {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isCorrect ? 'Correct (+10 pts)' : 'Incorrect (0 pts)'}
                        </span>
                      </div>

                      {q.codeSnippet && (
                        <div className="p-2.5 rounded bg-slate-950 text-slate-200 font-mono text-[11px]">
                          <pre><code>{q.codeSnippet}</code></pre>
                        </div>
                      )}

                      <div className="space-y-1 pl-1">
                        <div className="text-[11px] text-slate-600">
                          <strong>Your Answer:</strong>{' '}
                          {userAns !== undefined ? (
                            <span className={isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                              {q.options[userAns]}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not answered</span>
                          )}
                        </div>
                        {!isCorrect && (
                          <div className="text-[11px] text-emerald-700">
                            <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                          </div>
                        )}
                      </div>

                      {/* Explanation */}
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] leading-relaxed">
                        <strong className="text-slate-900 block mb-0.5">Explanation:</strong>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Confirmation Submission Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Knowledge Check Assessment"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>Are you sure you want to finalize and evaluate your answers for this module assessment?</p>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span>Answered Questions:</span>
              <strong className="text-emerald-700">{answeredCount} of {totalCount}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Unanswered Questions:</span>
              <strong className={totalCount - answeredCount > 0 ? 'text-rose-600' : 'text-slate-700'}>
                {totalCount - answeredCount}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Flagged for Review:</span>
              <strong className="text-amber-600">{flaggedCount}</strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="text-xs"
            >
              Back to Questions
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmit}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
