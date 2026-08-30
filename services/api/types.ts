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

export type ApiMultiplayerPlayer = {
  userId: string;
  displayName: string;
  status: "active" | "left" | "forfeited";
  score: number;
  correctCount: number;
  answeredCount: number;
  rewardPoints: number;
  answeredCurrent: boolean;
};

export type ApiMultiplayerRound = {
  phase: "answering" | "reveal";
  position: number;
  startedAt: string;
  endsAt: string;
  revealedAt: string | null;
  question: ApiQuestion;
  correctOptionId: string | null;
  myAnswer: {
    selectedOptionId: string;
    isCorrect: boolean | null;
    pointsAwarded: number | null;
  } | null;
};

export type ApiMultiplayerMatch = {
  id: string;
  code: string;
  hostUserId: string;
  topic: { id: string; slug: string; title: string };
  visibility: "private" | "public";
  status: "waiting" | "active" | "finished" | "cancelled";
  questionCount: number;
  roundDurationSeconds: number;
  currentQuestionPosition: number;
  winnerUserId: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  expiresAt: string;
  players: ApiMultiplayerPlayer[];
  round: ApiMultiplayerRound | null;
};

export type ApiMultiplayerAnswerResult = {
  accepted: true;
  replayed: boolean;
  match: ApiMultiplayerMatch;
};

export type ApiLeaderboardPeriod = "weekly" | "all_time";

export type ApiLeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
  isCurrentUser: boolean;
};

export type ApiLeaderboard = {
  period: ApiLeaderboardPeriod;
  periodStartedAt: string | null;
  generatedAt: string;
  entries: ApiLeaderboardEntry[];
  me: ApiLeaderboardEntry | null;
};

export type ApiAchievement = {
  key: string;
  title: string;
  description: string;
  iconName: string;
  metric: string;
  threshold: number;
  currentValue: number;
  progressPercentage: number;
  unlockedAt: string | null;
  isUnlocked: boolean;
};

export type ApiAchievements = {
  unlockedCount: number;
  totalCount: number;
  achievements: ApiAchievement[];
};
