export interface Question {
  id: number;
  question: string;
  type: "yesno" | "multiple";
  explanation?: string;
}

export interface MultipleChoiceQuestion extends Question {
  correctAnswer: string;
  incorrectAnswers: [string, string, string];
}

export interface YesNoQuestion extends Question {
  correctAnswer: boolean;
}

export type Questions = (MultipleChoiceQuestion | YesNoQuestion)[];
