export type TutorialExerciseOption = {
  id: string;
  label: string;
};

type TutorialExerciseBase = {
  id: string;
  prompt: string;
  explanation: string;
  hint?: string;
  language?: string;
};

export type TutorialChoiceExercise = TutorialExerciseBase & {
  type: "predict_output" | "fill_blank" | "trace";
  code: string;
  options: TutorialExerciseOption[];
  correctOptionId: string;
};

export type TutorialMultiSelectExercise = TutorialExerciseBase & {
  type: "select_multiple";
  code?: string;
  options: TutorialExerciseOption[];
  correctOptionIds: string[];
};

export type TutorialMatchPairsExercise = TutorialExerciseBase & {
  type: "match_pairs";
  leftItems: TutorialExerciseOption[];
  rightItems: TutorialExerciseOption[];
  /** One `leftId:rightId` entry for every left item, in leftItems order. */
  correctMatches: string[];
};

export type TutorialFindBugExercise = TutorialExerciseBase & {
  type: "find_bug";
  codeLines: string[];
  correctLineIndex: number;
};

export type TutorialOrderCodeExercise = TutorialExerciseBase & {
  type: "order_code";
  blocks: Array<{ id: string; code: string }>;
  correctOrder: string[];
};

export type TutorialExerciseDefinition =
  | TutorialChoiceExercise
  | TutorialMultiSelectExercise
  | TutorialMatchPairsExercise
  | TutorialFindBugExercise
  | TutorialOrderCodeExercise;

export type TutorialExerciseAnswer = string | number | string[] | null;
