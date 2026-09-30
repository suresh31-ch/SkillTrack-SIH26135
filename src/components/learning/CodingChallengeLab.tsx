import React, { useState, useEffect } from 'react';
import {
  ModuleItem,
  LearningCourse,
  LearningChallenge,
  SupportedLanguage,
  ChallengeExecutionResult
} from '../../types/learning';
import { LearningService } from '../../lib/learningService';
import { Card, Button, Badge, Modal } from '../ui';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Code2,
  Play,
  Send,
  RotateCcw,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Maximize2,
  Minimize2,
  FileCode,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CodingChallengeLabProps {
  course: LearningCourse;
  moduleTitle: string;
  item: ModuleItem;
  onNavigateItem: (itemId: string) => void;
  onItemCompleted: (itemId: string) => void;
  allCourseItems: ModuleItem[];
}

export const CodingChallengeLab: React.FC<CodingChallengeLabProps> = ({
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
  const challenge: LearningChallenge | undefined = item.challengeData;

  const [language, setLanguage] = useState<SupportedLanguage>('Python');
  const [code, setCode] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'custom' | 'hints'>('tests');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);
  const [showHintIdx, setShowHintIdx] = useState<number | null>(null);
  const [evalResult, setEvalResult] = useState<ChallengeExecutionResult | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Initialize starter code or saved progress
  useEffect(() => {
    if (!challenge) return;

    const progress = LearningService.getCourseProgress(course.id, effectiveCandidateId);
    const savedSub = progress?.challengeSubmissions[challenge.id];
    const draft = progress?.customDraftCodes?.[challenge.id]?.[language];

    if (savedSub && savedSub.code) {
      setCode(savedSub.code);
      setLanguage(savedSub.language || 'Python');
      if (savedSub.solved) {
        setEvalResult({
          passed: true,
          passedTests: savedSub.passedTests,
          totalTests: savedSub.totalTests,
          durationMs: 42,
          memoryMb: 14.2,
          scenarios: challenge.testScenarios.map(sc => ({
            scenarioId: sc.id,
            scenarioTitle: sc.title,
            passed: true,
            input: sc.input,
            expectedOutput: sc.expectedOutput,
            actualOutput: sc.expectedOutput,
            durationMs: 20
          })),
          explanation: 'Previously solved solution loaded.'
        });
      }
    } else if (draft) {
      setCode(draft);
    } else {
      setCode(challenge.starterCode[language] || challenge.starterCode['Python'] || '');
    }
  }, [challenge, course.id, language]);

  if (!challenge) {
    return (
      <Card className="p-8 text-center space-y-3">
        <Code2 className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Coding Practice Lab Coming Soon</h3>
        <p className="text-xs text-slate-500">The challenge environment for this module item is being prepared.</p>
      </Card>
    );
  }

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const progress = LearningService.getCourseProgress(course.id, effectiveCandidateId);
    const draft = progress?.customDraftCodes?.[challenge.id]?.[newLang];
    setCode(draft || challenge.starterCode[newLang] || '');
  };

  const handleSaveDraft = () => {
    LearningService.saveChallengeDraft(course.id, challenge.id, language, code, effectiveCandidateId);
    showToast('Challenge draft code saved successfully', 'info');
  };

  const handleResetCode = () => {
    setCode(challenge.starterCode[language] || '');
    setShowResetModal(false);
    showToast('Editor reset to initial template', 'info');
  };

  const handleRunTests = (isCustom: boolean = false) => {
    setIsRunning(true);
    setTimeout(() => {
      const result = LearningService.evaluateChallenge(
        challenge,
        code,
        language,
        isCustom ? customInput : undefined
      );
      setEvalResult(result);
      setIsRunning(false);

      if (result.passed) {
        showToast(`All ${result.totalTests} test cases passed!`, 'success');
      } else {
        showToast(`${result.passedTests}/${result.totalTests} tests passed. Check scenario details.`, 'warning');
      }
    }, 600);
  };

  const handleSubmitSolution = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = LearningService.evaluateChallenge(challenge, code, language);
      setEvalResult(result);
      setIsRunning(false);

      LearningService.submitChallengeSolution(
        course.id,
        item.id,
        challenge.id,
        code,
        language,
        result,
        effectiveCandidateId
      );

      if (result.passed) {
        onItemCompleted(item.id);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast('Challenge solved and accepted! Great work.', 'success');
      } else {
        showToast('Submission rejected: Edge test scenarios failed.', 'error');
      }
    }, 800);
  };

  const currentIndex = allCourseItems.findIndex(i => i.id === item.id);
  const nextItem = currentIndex < allCourseItems.length - 1 ? allCourseItems[currentIndex + 1] : null;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{course.name}</span>
            <span>•</span>
            <span className="text-indigo-600 font-semibold">{moduleTitle}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Code2 className="w-5 h-5 text-indigo-600 shrink-0" />
            {challenge.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              challenge.difficulty === 'Easy'
                ? 'success'
                : challenge.difficulty === 'Medium'
                ? 'primary'
                : 'danger'
            }
            className="text-xs px-2.5 py-1"
          >
            {challenge.difficulty}
          </Badge>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{challenge.estimatedMinutes} mins
          </span>
          {evalResult?.passed && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Accepted
            </span>
          )}
        </div>
      </div>

      {/* Main Split Grid (Problem description on left, Code + Eval on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Challenge Description (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 border-slate-200 bg-white space-y-4 max-h-[750px] overflow-y-auto">
            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-indigo-600" />
                Problem Specification
              </h2>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {challenge.description}
              </div>
            </div>

            {/* Input & Output Format */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <strong className="text-slate-900 block mb-1">Input Format:</strong>
                <p className="text-slate-600">{challenge.inputFormat}</p>
              </div>
              <div>
                <strong className="text-slate-900 block mb-1">Output Format:</strong>
                <p className="text-slate-600">{challenge.outputFormat}</p>
              </div>
            </div>

            {/* Constraints */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <strong className="text-slate-900 block font-semibold">Constraints:</strong>
              <ul className="space-y-1 text-slate-600 pl-2">
                {challenge.constraints.map((c, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Test Scenarios Overview */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900">Example Scenarios</h3>
              <div className="space-y-2">
                {challenge.testScenarios.slice(0, 2).map((sc, sIdx) => (
                  <div key={sc.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-mono space-y-1">
                    <span className="font-bold text-indigo-700 block font-sans">Example {sIdx + 1}: {sc.title}</span>
                    <div className="text-slate-600"><strong>Input:</strong> {sc.input}</div>
                    <div className="text-slate-900 font-semibold"><strong>Expected Output:</strong> {sc.expectedOutput}</div>
                    {sc.explanation && (
                      <div className="text-slate-500 font-sans text-[10px] mt-1 pt-1 border-t border-slate-200">
                        {sc.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Collapsible Hints */}
            {challenge.hints && challenge.hints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  Hints & Optimization Tips
                </h3>
                <div className="space-y-1.5">
                  {challenge.hints.map((hint, hIdx) => {
                    const isOpen = showHintIdx === hIdx;
                    return (
                      <div key={hIdx} className="rounded-lg border border-amber-200/80 bg-amber-50/50 text-xs overflow-hidden">
                        <button
                          onClick={() => setShowHintIdx(isOpen ? null : hIdx)}
                          className="w-full px-3 py-2 text-left font-semibold text-amber-900 flex items-center justify-between cursor-pointer"
                        >
                          <span>Hint {hIdx + 1}</span>
                          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-2.5 text-amber-800 text-[11px] leading-relaxed border-t border-amber-200/60 pt-1.5">
                            {hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Code Editor & Execution Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Editor Container */}
          <Card className="border-slate-800 bg-slate-950 text-slate-100 overflow-hidden flex flex-col shadow-md">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300 text-xs">Language:</span>
                <select
                  value={language}
                  onChange={e => handleLanguageChange(e.target.value as SupportedLanguage)}
                  className="bg-slate-800 text-slate-100 border border-slate-700 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                >
                  <option value="Python">Python 3.12</option>
                  <option value="Java">Java 21</option>
                  <option value="C++">C++ 20</option>
                  <option value="TypeScript">TypeScript / Node.js</option>
                  <option value="SQL">PostgreSQL / ANSI SQL</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  title="Save draft"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Code Input Textarea */}
            <div className="relative">
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                rows={14}
                className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed border-none selection:bg-indigo-900"
                placeholder="// Write your solution here..."
              />
            </div>

            {/* Editor Action Buttons */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">
                {code.split('\n').length} lines • {code.length} chars
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isRunning}
                  onClick={() => handleRunTests(false)}
                  className="text-xs font-semibold bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                  {isRunning ? 'Running...' : 'Run Demo Tests'}
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  disabled={isRunning}
                  onClick={handleSubmitSolution}
                  className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isRunning ? 'Evaluating...' : 'Submit Solution'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Evaluation & Output Panel */}
          <Card className="border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            {/* Panel Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    activeTab === 'tests'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Test Results ({evalResult ? `${evalResult.passedTests}/${evalResult.totalTests}` : `${challenge.testScenarios.length} Scenarios`})
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                    activeTab === 'custom'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Custom Test Case
                </button>
              </div>

              {evalResult && (
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {evalResult.durationMs}ms
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-slate-400" />
                    {evalResult.memoryMb}MB
                  </span>
                </div>
              )}
            </div>

            {/* Tab 1: Test Results */}
            {activeTab === 'tests' && (
              <div className="space-y-3">
                {evalResult ? (
                  <div className="space-y-3">
                    {/* Status Alert Banner */}
                    <div
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                        evalResult.passed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {evalResult.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="font-bold">
                          {evalResult.passed
                            ? 'Accepted — All test scenarios passed!'
                            : `Wrong Answer — ${evalResult.passedTests}/${evalResult.totalTests} tests passed.`}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium">{evalResult.explanation}</span>
                    </div>

                    {/* Scenario Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {evalResult.scenarios.map((sc, idx) => (
                        <button
                          key={sc.scenarioId}
                          onClick={() => setActiveScenarioIdx(idx)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer border ${
                            activeScenarioIdx === idx
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                              : sc.passed
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                              : 'border-rose-200 bg-rose-50 text-rose-800'
                          }`}
                        >
                          {sc.passed ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                          <span>Case {idx + 1}</span>
                        </button>
                      ))}
                    </div>

                    {/* Active Scenario Detail */}
                    {evalResult.scenarios[activeScenarioIdx] && (
                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono space-y-2">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Input:</span>
                          <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-800 mt-0.5">
                            {evalResult.scenarios[activeScenarioIdx].input}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Expected Output:</span>
                            <div className="p-1.5 rounded bg-white border border-slate-200 text-emerald-700 font-semibold mt-0.5">
                              {evalResult.scenarios[activeScenarioIdx].expectedOutput}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Actual Output:</span>
                            <div
                              className={`p-1.5 rounded bg-white border mt-0.5 font-semibold ${
                                evalResult.scenarios[activeScenarioIdx].passed
                                  ? 'border-emerald-200 text-emerald-700'
                                  : 'border-rose-200 text-rose-700'
                              }`}
                            >
                              {evalResult.scenarios[activeScenarioIdx].actualOutput}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs space-y-2 bg-slate-50 rounded-lg border border-slate-100">
                    <Terminal className="w-6 h-6 text-slate-400 mx-auto" />
                    <p>Run your code to see evaluation output and test case assertions.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Custom Test Case */}
            {activeTab === 'custom' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Custom Input Parameters:</label>
                  <textarea
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    rows={3}
                    placeholder="Enter custom input arguments to test (e.g., [1, 2, 3], 4)..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRunTests(true)}
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Run Custom Check
                  </Button>
                </div>
              </div>
            )}

            {/* Next Item Recommendation if Solved */}
            {evalResult?.passed && nextItem && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Ready for the next module item!
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onNavigateItem(nextItem.id)}
                  className="text-xs font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <span>Proceed to {nextItem.title.slice(0, 20)}...</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Code to Starter Template"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            Are you sure you want to revert your code to the original starter template? All uncommitted edits for this language will be reset.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowResetModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleResetCode}
              className="text-xs"
            >
              Reset Code
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
