import React, { useState, useEffect, useRef } from 'react';
import {
  SupportedSkill,
  AssessmentDifficulty,
  QuizQuestion,
  HistoricalAssessmentRecord
} from '../../../../lib/assessmentData';
import { AssessmentService } from '../../../../lib/assessmentService';
import { Button, Card, Badge, Modal } from '../../../ui';
import {
  CheckSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Code2,
  CheckCircle2,
  XCircle,
  Flame,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

interface AssessmentQuizViewProps {
  initialSkill?: SupportedSkill;
  initialDifficulty?: AssessmentDifficulty;
  candidateProfileId?: string;
  onAssessmentCompleted: (record: HistoricalAssessmentRecord, questions: QuizQuestion[], userAnswers: Record<number, number>) => void;
  onCancel: () => void;
}

const SKILL_ICONS: Record<SupportedSkill, string> = {
  Python: '🐍',
  Java: '☕',
  'C++': '⚡',
  SQL: '🗄️',
  JavaScript: '🟨',
  React: '⚛️'
};

const SKILL_COLORS: Record<SupportedSkill, string> = {
  Python: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Java: 'bg-amber-50 text-amber-700 border-amber-200',
  'C++': 'bg-blue-50 text-blue-700 border-blue-200',
  SQL: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  JavaScript: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  React: 'bg-indigo-50 text-indigo-700 border-indigo-200'
};

export const AssessmentQuizView: React.FC<AssessmentQuizViewProps> = ({
  initialSkill = 'Python',
  initialDifficulty = 'Beginner',
  candidateProfileId,
  onAssessmentCompleted,
  onCancel
}) => {
  // Setup Selection State
  const [selectedSkill, setSelectedSkill] = useState<SupportedSkill>(initialSkill);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AssessmentDifficulty>(initialDifficulty);
  const [quizStarted, setQuizStarted] = useState(false);

  // Active Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Timer State (15 minutes countdown)
  const TOTAL_TIME_SECONDS = 15 * 60; // 900 seconds
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_TIME_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const skillsList: SupportedSkill[] = ['Python', 'Java', 'C++', 'SQL', 'JavaScript', 'React'];
  const difficultiesList: AssessmentDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

  // Start Quiz Handler
  const handleStartQuiz = () => {
    const loadedQuestions = AssessmentService.getQuestions(selectedSkill, selectedDifficulty);
    setQuestions(loadedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSecondsRemaining(TOTAL_TIME_SECONDS);
    setIsTimerPaused(false);
    setQuizStarted(true);
  };

  // Timer effect
  useEffect(() => {
    if (quizStarted && !isTimerPaused && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleDirectSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStarted, isTimerPaused, secondsRemaining]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle selecting an answer
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Direct Submission logic
  const handleDirectSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });

    const timeSpent = TOTAL_TIME_SECONDS - secondsRemaining;
    const record = AssessmentService.recordAssessmentResult(
      selectedSkill,
      selectedDifficulty,
      score,
      questions.length,
      timeSpent,
      candidateProfileId
    );

    setIsSubmitModalOpen(false);
    onAssessmentCompleted(record, questions, selectedAnswers);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQ = questions[currentQuestionIndex];
  const isTimeCritical = secondsRemaining < 180; // Less than 3 minutes

  // If quiz has not started, show the interactive Skill & Difficulty Selection Screen
  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              Skill Assessment Setup
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your domain and difficulty level to take a timed 10-question competency evaluation.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel} id="btn-cancel-assessment">
            Back to Dashboard
          </Button>
        </div>

        {/* Step 1: Skill Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
              Select Skill Domain
            </label>
            <span className="text-xs text-slate-500">6 Specialized Tech Tracks</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {skillsList.map(skill => {
              const isSelected = selectedSkill === skill;
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  id={`skill-select-${skill.toLowerCase().replace('+', 'p')}`}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{SKILL_ICONS[skill]}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{skill}</div>
                    <div className="text-[10px] text-slate-500">10 Questions</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
              Select Difficulty Level
            </label>
            <span className="text-xs text-slate-500">Adaptive Competency Tiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficultiesList.map(diff => {
              const isSelected = selectedDifficulty === diff;
              const diffBadgeColor =
                diff === 'Beginner' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                diff === 'Intermediate' ? 'text-indigo-700 bg-indigo-50 border-indigo-200' :
                'text-purple-700 bg-purple-50 border-purple-200';

              const diffDesc =
                diff === 'Beginner' ? 'Core syntax, built-in data structures, basic control flow and primitives' :
                diff === 'Intermediate' ? 'Design patterns, memory lifecycles, APIs, concurrency and algorithms' :
                'Engine internals, low-level optimizations, complex architecture and system edge-cases';

              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  id={`diff-select-${diff.toLowerCase()}`}
                  className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={diff === 'Beginner' ? 'success' : diff === 'Intermediate' ? 'primary' : 'purple'}>
                      {diff}
                    </Badge>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{diffDesc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assessment Preview Box */}
        <Card className="p-4 bg-slate-50 border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{SKILL_ICONS[selectedSkill]}</span>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedSkill} — {selectedDifficulty} Assessment
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                10 multiple-choice questions • 15 minutes time limit • 70% required to pass verification
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Flame className="w-4 h-4 text-amber-300" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleStartQuiz}
              id="btn-start-quiz-now"
            >
              Begin Assessment Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="space-y-5">
      {/* Top Quiz Header with Progress & Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-lg">
            {SKILL_ICONS[selectedSkill]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{selectedSkill} Assessment</h3>
              <Badge variant={selectedDifficulty === 'Beginner' ? 'success' : selectedDifficulty === 'Intermediate' ? 'primary' : 'purple'}>
                {selectedDifficulty}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Question {currentQuestionIndex + 1} of {questions.length} ({answeredCount} answered)
            </p>
          </div>
        </div>

        {/* Live Timer UI */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
              isTimeCritical
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
            title="Time remaining"
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-slate-500'}`} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={() => setIsSubmitModalOpen(true)}
            id="btn-submit-assessment-header"
          >
            Finish & Submit
          </Button>
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((answeredCount) / questions.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left 3 Columns: Active Question Card */}
        <div className="lg:col-span-3 space-y-4">
          {currentQ && (
            <Card className="p-5 space-y-5 bg-white border-slate-200">
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Topic:</span>
                    <Badge variant="default" className="text-[10px]">{currentQ.topic}</Badge>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {currentQ.question}
                  </h4>
                </div>
                <Badge variant={selectedAnswers[currentQ.id] !== undefined ? 'success' : 'warning'}>
                  {selectedAnswers[currentQ.id] !== undefined ? 'Answered' : 'Pending'}
                </Badge>
              </div>

              {/* Code Snippet if applicable */}
              {currentQ.codeSnippet && (
                <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre className="whitespace-pre">{currentQ.codeSnippet}</pre>
                </div>
              )}

              {/* 4 Multiple Choice Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((optionText, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                      id={`opt-q${currentQ.id}-${optIdx}`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        checked={isSelected}
                        onChange={() => handleSelectOption(currentQ.id, optIdx)}
                        className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {optionLetters[optIdx]}
                        </span>
                        <span className="leading-relaxed">{optionText}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  id="btn-prev-question"
                >
                  Previous
                </Button>

                <div className="text-xs text-slate-500 font-medium">
                  {currentQuestionIndex + 1} / {questions.length}
                </div>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    id="btn-next-question"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="success"
                    rightIcon={<Send className="w-4 h-4" />}
                    onClick={() => setIsSubmitModalOpen(true)}
                    id="btn-submit-final"
                  >
                    Review & Submit
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right 1 Column: Question Matrix Navigation */}
        <div className="space-y-4">
          <Card className="p-4 space-y-4 bg-white border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Question Navigator</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Click any number to jump directly</p>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    id={`matrix-btn-q${idx + 1}`}
                    className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                        : isAnswered
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px]">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-indigo-600 border border-indigo-600" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-emerald-50 border border-emerald-300" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-slate-50 border border-slate-200" />
                <span>Unanswered ({questions.length - answeredCount})</span>
              </div>
            </div>

            <Button
              className="w-full text-xs"
              variant="success"
              onClick={() => setIsSubmitModalOpen(true)}
              id="btn-sidebar-submit"
            >
              Submit Assessment ({answeredCount}/{questions.length})
            </Button>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal before Final Submission */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Skill Assessment"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Skill Track:</span>
              <strong className="text-slate-900">{selectedSkill} ({selectedDifficulty})</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Answered Questions:</span>
              <strong className="text-indigo-600 font-bold">{answeredCount} of {questions.length}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Time Remaining:</span>
              <strong className="text-slate-900">{formatTime(secondsRemaining)}</strong>
            </div>
          </div>

          {answeredCount < questions.length && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>You have <strong>{questions.length - answeredCount} unanswered</strong> questions. Unanswered questions will be scored as 0.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Continue Quiz
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleDirectSubmit}
              id="btn-confirm-submit-modal"
            >
              Confirm & Grade
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
