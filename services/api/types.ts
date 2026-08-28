export type ApiEnvelope<T> = { data: T };

export type ApiCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  languageCode: string;
  imageKey: string | null;
  lessonCount: number;
};

export type ApiLesson = {
  id: string;
  slug: string;
  title: string;
  position: number;
  content: unknown[];
};

export type ApiCourseDetails = ApiCourse & { lessons: ApiLesson[] };

export type ApiTopic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  questionCount: number;
};

export type ApiQuestionOption = {
  id: string;
  questionId: string;
  label: string;
  position: number;
};

export type ApiQuestion = {
  id: string;
  prompt: string;
  type: "multiple_choice" | "boolean";
  difficulty: number;
  codeSnippet: { language: string; code: string } | null;
  options: ApiQuestionOption[];
};

export type ApiAttemptResult = {
  id: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  explanation: string | null;
  correctOptionId: string;
  correctOptionLabel: string;
  createdAt: string;
  replayed: boolean;
};

export type ApiUserSummary = {
  id: string;
  displayName: string;
  points: number;
};

export type ApiUserProfile = ApiUserSummary & {
  email: string;
  bio: string;
  createdAt: string;
};

export type ApiAuthResult = {
  token: string;
  user: ApiUserProfile;
};

export type ApiEnrollmentProgress = {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  status: "not_started" | "in_progress" | "completed";
  enrolledAt: string;
  completedAt: string | null;
  lastAccessedAt: string | null;
  resumeLesson: ApiLessonProgress | null;
  lessons: ApiLessonProgress[];
};

export type ApiLessonProgress = {
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  position: number;
  status: "not_started" | "in_progress" | "completed";
  lastAccessedAt: string | null;
  completedAt: string | null;
};

export type ApiTopicProgress = {
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  questionCount: number;
  attemptsCount: number;
  correctCount: number;
  answeredCount: number;
  correctlyAnsweredCount: number;
  completionPercentage: number;
  accuracyPercentage: number;
  masteryPercentage: number;
  status: "not_started" | "practicing" | "mastered";
  lastAttemptedAt: string | null;
};

export type ApiLearningSummary = {
  enrolledCourses: number;
  completedCourses: number;
  completedLessons: number;
  totalLessons: number;
  answeredQuestions: number;
  correctlyAnsweredQuestions: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  activeDays: number;
  currentStreakDays: number;
  lastActivityAt: string | null;
};

export type ApiProgress = {
  user: ApiUserSummary;
  summary: ApiLearningSummary;
  enrollments: ApiEnrollmentProgress[];
  topics: ApiTopicProgress[];
  tutorialExercises: ApiTutorialExerciseProgress[];
};

export type ApiTutorialExerciseProgress = {
  exerciseId: string;
  lessonId: string;
  lessonSlug: string;
  courseSlug: string;
  attemptsCount: number;
  completed: boolean;
  hintUsed: boolean;
  solutionRevealed: boolean;
  completedAt: string | null;
  lastAttemptedAt: string | null;
};

export type ApiTutorialExerciseSubmission = {
  submissionId: string;
  exerciseId: string;
  action: "check" | "reveal";
  isCorrect: boolean | null;
  pointsAwarded: number;
  totalPoints: number;
  replayed: boolean;
  progress: Omit<ApiTutorialExerciseProgress, "exerciseId" | "lessonId" | "lessonSlug" | "courseSlug">;
};
