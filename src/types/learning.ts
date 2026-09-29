export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';
export type SupportedLanguage = 'Python' | 'Java' | 'C++' | 'JavaScript' | 'SQL';
export type ModuleItemType = 'lesson' | 'challenge' | 'knowledge_check';
export type PerformanceCategory = 'Mastery' | 'Proficient' | 'Developing' | 'Foundational';
export type CourseFilterTab = 'my_learning' | 'currently_learning' | 'finished' | 'nearly_due' | 'recommended' | 'all';
export type KnowledgeCheckData = LearningKnowledgeCheck;

export interface LessonSection {
  title: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
    output?: string;
  };
  callout?: {
    type: 'tip' | 'warning' | 'info' | 'best_practice';
    text: string;
  };
  keyTakeaway?: string;
}

export interface LessonContent {
  heading: string;
  summary: string;
  estimatedMinutes: number;
  sections: LessonSection[];
  importantPoints: string[];
  relatedResources: Array<{
    title: string;
    type: 'documentation' | 'lab' | 'reference' | 'cheatsheet';
    description: string;
    url?: string;
  }>;
  interactiveSandboxPreview?: {
    starterCode: string;
    language: SupportedLanguage;
    expectedResult: string;
  };
}

export interface KnowledgeCheckQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: CourseDifficulty;
}

export interface LearningKnowledgeCheck {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  timeLimitMinutes: number;
  passingPercentage: number;
  questions: KnowledgeCheckQuestion[];
}

export interface TestScenario {
  id: number;
  title: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface LearningChallenge {
  id: string;
  title: string;
  topic: string;
  difficulty: ChallengeDifficulty;
  supportedLanguages: SupportedLanguage[];
  defaultLanguage: SupportedLanguage;
  description: string;
  constraints: string[];
  inputSpecification: string;
  outputSpecification: string;
  inputFormat?: string;
  outputFormat?: string;
  estimatedMinutes?: number;
  starterCode?: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  hints: string[];
  starterSolutions: Record<SupportedLanguage, string>;
  testScenarios: TestScenario[];
}

export interface ModuleItem {
  id: string;
  type: ModuleItemType;
  title: string;
  orderIndex: number;
  estimatedMinutes: number;
  lessonData?: LessonContent;
  challengeData?: LearningChallenge;
  knowledgeCheckData?: LearningKnowledgeCheck;
}

export interface LearningModule {
  id: string;
  orderIndex: number;
  title: string;
  description: string;
  estimatedDuration: string;
  estimatedHours?: number;
  items: ModuleItem[];
}

export interface CourseInstructor {
  name: string;
  title: string;
  organization: string;
  avatar: string;
  bio: string;
}

export interface LearningCourse {
  id: string;
  name: string;
  slug: string;
  primarySkill: string;
  skills: string[];
  category: string;
  difficulty: CourseDifficulty;
  provider: string;
  instructor: CourseInstructor;
  estimatedDuration: string;
  moduleCount: number;
  lessonCount: number;
  challengeCount: number;
  assessmentCount: number;
  description: string;
  learningOutcomes: string[];
  prerequisites: string[];
  modules: LearningModule[];
  status: 'active' | 'in_progress' | 'completed' | 'nearly_due';
  dueDate?: string;
  certificateEligible: boolean;
  certificateCriteria: string;
  enrolled: boolean;
  lastAccessedAt?: string;
  createdAt?: string;
  tags: string[];
  targetRoles: string[];
  accentColor: string;
  bannerImage: string;
}

export interface KnowledgeCheckResult {
  score: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  performanceCategory: PerformanceCategory;
  strongAreas: string[];
  improvementAreas: string[];
  suggestedLessons: string[];
  recommendedChallenges: string[];
  completedAt: string;
  timeSpentSeconds: number;
  userAnswers: Record<number, number>;
}

export interface ChallengeExecutionResult {
  passed: boolean;
  passedTests: number;
  totalTests: number;
  durationMs: number;
  memoryMb: number;
  scenarios: Array<{
    scenarioId: number;
    scenarioTitle: string;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    durationMs: number;
    error?: string;
  }>;
  explanation?: string;
}

export interface LearnerCourseProgress {
  courseId: string;
  candidateId: string;
  startedAt: string;
  lastAccessedAt: string;
  lastItemId: string;
  completedItemIds: string[];
  knowledgeCheckResults: Record<string, KnowledgeCheckResult>;
  challengeSubmissions: Record<string, {
    solved: boolean;
    code: string;
    language: SupportedLanguage;
    solvedAt: string;
    passedTests: number;
    totalTests: number;
    attempts: number;
  }>;
  customDraftCodes?: Record<string, Record<SupportedLanguage, string>>;
  certificateIssued: boolean;
  certificateNumber?: string;
  certificateIssuedAt?: string;
}

export interface PersonalLearningStats {
  challengesAttempted: number;
  challengesCompleted: number;
  successfulTestRuns: number;
  totalTestRuns: number;
  learningStreakDays: number;
  overallAccuracy: number;
  assessmentAverage: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  totalLearningHours: number;
  skillPerformance: Array<{
    skill: string;
    score: number;
    verified: boolean;
  }>;
  difficultyPerformance: Array<{
    difficulty: string;
    completed: number;
    total: number;
    accuracy: number;
  }>;
}
