import React, { useState, useEffect } from 'react';
import {
  CodingLanguage,
  CodingDifficulty,
  CodingProblem,
  CODING_PROBLEMS_DATA,
  TestCase
} from '../../../../lib/assessmentData';
import { AssessmentService, SimulatedCodeExecutionResult } from '../../../../lib/assessmentService';
import Editor from '@monaco-editor/react';
import { Card, Button, Badge } from '../../../ui';
import {
  Play,
  CheckCircle2,
  XCircle,
  Code2,
  Terminal,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  Cpu,
  ChevronRight,
  Filter,
  CheckCircle,
  FileCode,
  Flame,
  Award
} from 'lucide-react';
import { useToast } from '../../../../context/ToastContext';

interface CodingPracticeViewProps {
  initialLanguage?: CodingLanguage;
  onProblemSolved?: () => void;
}

const MONACO_LANG_MAP: Record<CodingLanguage, string> = {
  Python: 'python',
  Java: 'java',
  'C++': 'cpp',
  SQL: 'sql'
};

const LANG_ICONS: Record<CodingLanguage, string> = {
  Python: '🐍',
  Java: '☕',
  'C++': '⚡',
  SQL: '🗄️'
};

export const CodingPracticeView: React.FC<CodingPracticeViewProps> = ({
  initialLanguage = 'Python',
  onProblemSolved
}) => {
  const { showToast } = useToast();

  const [selectedLanguage, setSelectedLanguage] = useState<CodingLanguage>(initialLanguage);
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<'All' | CodingDifficulty>('All');
  const [selectedProblemId, setSelectedProblemId] = useState<string>('py-001');

  // Active Problem Code & Tabs
  const [userCode, setUserCode] = useState<string>('');
  const [activeBottomTab, setActiveBottomTab] = useState<'testcases' | 'console'>('testcases');
  const [selectedTestCaseTab, setSelectedTestCaseTab] = useState<number>(0);

  // Execution State
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<SimulatedCodeExecutionResult | null>(null);

  // Filter problems for currently selected language
  const availableProblems = CODING_PROBLEMS_DATA.filter(p => {
    const matchLang = p.language === selectedLanguage;
    const matchDiff = selectedDifficultyFilter === 'All' || p.difficulty === selectedDifficultyFilter;
    return matchLang && matchDiff;
  });

  const activeProblem = CODING_PROBLEMS_DATA.find(p => p.id === selectedProblemId) || availableProblems[0] || CODING_PROBLEMS_DATA[0];

  // Set initial problem when language changes
  useEffect(() => {
    const firstForLang = CODING_PROBLEMS_DATA.find(p => p.language === selectedLanguage);
    if (firstForLang) {
      setSelectedProblemId(firstForLang.id);
      setUserCode(firstForLang.starterCode);
      setExecutionResult(null);
    }
  }, [selectedLanguage]);

  // Update code when active problem changes
  useEffect(() => {
    if (activeProblem) {
      setUserCode(activeProblem.starterCode);
      setExecutionResult(null);
    }
  }, [selectedProblemId]);

  // Reset to starter template
  const handleResetCode = () => {
    if (activeProblem) {
      setUserCode(activeProblem.starterCode);
      setExecutionResult(null);
      showToast('Code Reset', 'Restored starter solution boilerplate.', 'info');
    }
  };

  // Safe Run Code Simulation
  const handleRunCode = () => {
    if (!activeProblem) return;

    setIsExecuting(true);
    setActiveBottomTab('testcases');

    setTimeout(() => {
      const result = AssessmentService.simulateCodeExecution(activeProblem, userCode);
      setExecutionResult(result);
      setIsExecuting(false);

      if (result.allPassed) {
        AssessmentService.recordSolvedProblem(activeProblem, result.testCaseResults.length, result.testCaseResults.length);
        showToast('All Test Cases Passed!', `Solved ${activeProblem.title} in ${result.runtimeMs}ms`, 'success');
        if (onProblemSolved) onProblemSolved();
      } else {
        showToast('Execution Completed', 'Some test cases did not pass. Check assertions.', 'warning');
      }
    }, 650);
  };

  const solvedProblems = AssessmentService.getSolvedProblems();
  const isCurrentProblemSolved = solvedProblems.some(s => s.problemId === activeProblem.id && s.passedTests === s.totalTests);

  return (
    <div className="space-y-4">
      {/* Header Bar with Language Selector & Difficulty Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
        {/* Language Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['Python', 'Java', 'C++', 'SQL'] as CodingLanguage[]).map(lang => {
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                id={`lang-tab-${lang.toLowerCase().replace('+', 'p')}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{LANG_ICONS[lang]}</span>
                <span>{lang}</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter & Run Code Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDifficultyFilter}
              onChange={e => setSelectedDifficultyFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="success"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={handleRunCode}
            isLoading={isExecuting}
            id="btn-run-code-sandbox"
            className="shadow-xs font-bold"
          >
            Run Code
          </Button>
        </div>
      </div>

      {/* Problem Selector Horizontal List */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {availableProblems.map(prob => {
          const isSelected = selectedProblemId === prob.id;
          const isSolved = solvedProblems.some(s => s.problemId === prob.id);

          return (
            <button
              key={prob.id}
              type="button"
              onClick={() => setSelectedProblemId(prob.id)}
              id={`prob-btn-${prob.id}`}
              className={`px-3 py-2 rounded-lg border text-left shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <Badge
                variant={prob.difficulty === 'Easy' ? 'success' : prob.difficulty === 'Medium' ? 'warning' : 'danger'}
                className="text-[10px]"
              >
                {prob.difficulty}
              </Badge>
              <span className="text-xs font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-[240px]">
                {prob.title}
              </span>
              {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (5 Cols): Problem Statement, Examples, Constraints, Hints */}
        <Card className="lg:col-span-5 p-4 space-y-4 max-h-[640px] overflow-y-auto bg-white border-slate-200">
          <div className="space-y-2 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                {activeProblem.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Badge variant={activeProblem.difficulty === 'Easy' ? 'success' : activeProblem.difficulty === 'Medium' ? 'warning' : 'danger'}>
                  {activeProblem.difficulty}
                </Badge>
                {isCurrentProblemSolved && (
                  <Badge variant="success" className="text-[10px]">
                    ✓ Solved
                  </Badge>
                )}
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {activeProblem.title}
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span>Time Limit: {activeProblem.timeLimit}</span>
              <span>•</span>
              <span>Memory: {activeProblem.memoryLimit}</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {activeProblem.description}
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Examples</h4>
            {activeProblem.examples.map((ex, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="text-[11px] font-bold text-indigo-700 font-sans">Example {idx + 1}:</div>
                <div><strong className="text-slate-500 font-sans">Input: </strong><span className="text-slate-900">{ex.input}</span></div>
                <div><strong className="text-slate-500 font-sans">Output: </strong><span className="text-emerald-700 font-bold">{ex.output}</span></div>
                {ex.explanation && (
                  <div className="text-[11px] text-slate-600 font-sans pt-1 border-t border-slate-200/60">
                    <span className="font-semibold text-slate-700">Explanation: </span>{ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Constraints</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 font-mono">
              {activeProblem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Hints */}
          {activeProblem.hints && activeProblem.hints.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                Algorithmic Hint
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800/90">{activeProblem.hints[0]}</p>
            </div>
          )}
        </Card>

        {/* Right Column (7 Cols): Monaco Code Editor & Test Cases / Output Console */}
        <div className="lg:col-span-7 space-y-3 flex flex-col">
          {/* Monaco Editor Card */}
          <Card className="overflow-hidden border-slate-200 bg-slate-900 flex flex-col rounded-xl">
            {/* Editor Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>solution.{selectedLanguage === 'Python' ? 'py' : selectedLanguage === 'Java' ? 'java' : selectedLanguage === 'C++' ? 'cpp' : 'sql'}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-slate-200 text-[11px] h-7 px-2"
                  leftIcon={<RotateCcw className="w-3 h-3" />}
                  onClick={handleResetCode}
                  id="btn-reset-code-template"
                >
                  Reset Template
                </Button>
              </div>
            </div>

            {/* Editor Surface */}
            <div className="h-[310px] w-full">
              <Editor
                height="100%"
                language={MONACO_LANG_MAP[selectedLanguage]}
                theme="vs-dark"
                value={userCode}
                onChange={val => setUserCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on'
                }}
              />
            </div>
          </Card>

          {/* Test Cases & Console Output Panel */}
          <Card className="p-3.5 bg-slate-900 border-slate-800 text-slate-200 rounded-xl flex-1 space-y-3">
            {/* Panel Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBottomTab('testcases')}
                  className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    activeBottomTab === 'testcases'
                      ? 'bg-slate-800 text-indigo-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Test Cases ({activeProblem.testCases.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveBottomTab('console')}
                  className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    activeBottomTab === 'console'
                      ? 'bg-slate-800 text-indigo-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Console Output
                </button>
              </div>

              {executionResult && (
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" /> {executionResult.runtimeMs} ms
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Cpu className="w-3 h-3 text-slate-500" /> {executionResult.memoryMb} MB
                  </span>
                  <Badge variant={executionResult.allPassed ? 'success' : 'danger'} className="text-[10px]">
                    {executionResult.allPassed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
              )}
            </div>

            {/* Test Cases View */}
            {activeBottomTab === 'testcases' && (
              <div className="space-y-3 text-xs">
                {/* Test case tabs */}
                <div className="flex items-center gap-2">
                  {activeProblem.testCases.map((tc, idx) => {
                    const result = executionResult?.testCaseResults?.find(r => r.testCaseId === tc.id);
                    const isSelected = selectedTestCaseTab === idx;

                    return (
                      <button
                        key={tc.id}
                        type="button"
                        onClick={() => setSelectedTestCaseTab(idx)}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'border-indigo-500 bg-slate-800 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {result && (
                          result.passed
                            ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            : <XCircle className="w-3 h-3 text-rose-400" />
                        )}
                        <span>Case {idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Test Case Details */}
                {activeProblem.testCases[selectedTestCaseTab] && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                    <div>
                      <span className="text-slate-500">Input:</span>
                      <div className="text-slate-300 bg-slate-900 p-1.5 rounded mt-0.5">
                        {activeProblem.testCases[selectedTestCaseTab].input}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected Output:</span>
                      <div className="text-emerald-400 bg-slate-900 p-1.5 rounded mt-0.5">
                        {activeProblem.testCases[selectedTestCaseTab].expectedOutput}
                      </div>
                    </div>

                    {executionResult?.testCaseResults?.[selectedTestCaseTab] && (
                      <div>
                        <span className="text-slate-500">Actual Output:</span>
                        <div className={`p-1.5 rounded mt-0.5 ${
                          executionResult.testCaseResults[selectedTestCaseTab].passed
                            ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60'
                            : 'text-rose-400 bg-rose-950/40 border border-rose-800/60'
                        }`}>
                          {executionResult.testCaseResults[selectedTestCaseTab].actualOutput}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Console Logs View */}
            {activeBottomTab === 'console' && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 min-h-[110px] max-h-[140px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {executionResult?.stdout || 'Click "Run Code" to execute script in safe simulated sandbox...'}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
