export type LessonContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: number; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "image"; assetKey: string };

export interface ImportedLesson {
  sourceKey: string;
  courseSlug: string;
  slug: string;
  title: string;
  position: number;
  content: LessonContentBlock[];
  exercises: ImportedTutorialExercise[];
}

export interface ImportedCourse {
  slug: string;
  title: string;
  description: string;
  languageCode: string;
  imageKey: string;
}

export interface ImportedTutorialExercise {
  id: string;
  type: "predict_output" | "fill_blank" | "find_bug" | "order_code" | "trace" | "select_multiple" | "match_pairs";
  prompt: string;
  explanation: string;
  hint: string | null;
  answerKey: string | number | string[];
}

export interface ImportedOption {
  label: string;
  isCorrect: boolean;
  position: number;
}

export interface ImportedQuestion {
  sourceKey: string;
  legacyId: number;
  prompt: string;
  explanation: string | null;
  type: "multiple_choice" | "boolean";
  codeSnippet: { language: string; code: string } | null;
  options: ImportedOption[];
}

export interface ImportedTopic {
  slug: string;
  title: string;
  description: string;
  questions: ImportedQuestion[];
}

export interface ContentRejection {
  source: string;
  record: string;
  reason: string;
}

export interface ContentNormalization {
  source: string;
  record: string;
  action: string;
}

export interface ContentBundle {
  topics: ImportedTopic[];
  courses: ImportedCourse[];
  lessons: ImportedLesson[];
  skippedEmptyLessons: string[];
  normalizations: ContentNormalization[];
  rejections: ContentRejection[];
}
