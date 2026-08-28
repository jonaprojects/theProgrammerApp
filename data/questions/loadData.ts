import networksQuestions from "./networksQuestions";
import oopQuestions from "./oopQuestions";
import pythonQuestions from "./pythonQuestions";
import webDevQuestions from "./webdevQuestions";
import clangQuestions from "./clang";
import assemblyQuestions from "./assembly";
import catalogExpansion from "./catalogExpansion";
import catalogExpansionAdvanced, {
  type CompactQuestion,
} from "./catalogExpansionAdvanced";

import type { Questions } from "./models";
// TODO: Update this method after the proof of concept

function expandCompactQuestions(questions: CompactQuestion[]): Questions {
  return questions.map((question) => {
    const [id, prompt, answer, fourth, fifth] = question;
    if (typeof answer === "boolean") {
      return {
        id,
        question: prompt,
        type: "yesno" as const,
        correctAnswer: answer,
        explanation: fourth,
      };
    }
    return {
      id,
      question: prompt,
      type: "multiple" as const,
      correctAnswer: answer,
      incorrectAnswers: fourth,
      explanation: fifth,
    };
  });
}

const advancedCatalog = Object.fromEntries(
  Object.entries(catalogExpansionAdvanced).map(([topic, questions]) => [
    topic,
    expandCompactQuestions(questions),
  ]),
) as Record<string, Questions>;

const topicMap: Record<string, Questions> = {
  python: [...pythonQuestions, ...catalogExpansion.python],
  networks: [...networksQuestions, ...catalogExpansion.networks],
  "web-development": [...webDevQuestions, ...catalogExpansion["web-development"]],
  "object-oriented-programming": [
    ...oopQuestions,
    ...catalogExpansion["object-oriented-programming"],
    ...advancedCatalog["object-oriented-programming"],
  ],
  "c-language": [...clangQuestions, ...catalogExpansion["c-language"]],
  assembly: [...assemblyQuestions, ...catalogExpansion.assembly],
  cybersecurity: [...catalogExpansion.cybersecurity, ...advancedCatalog.cybersecurity],
  databases: [...catalogExpansion.databases, ...advancedCatalog.databases],
  git: [...catalogExpansion.git, ...advancedCatalog.git],
  algorithms: [...catalogExpansion.algorithms, ...advancedCatalog.algorithms],
};

export async function loadQuestions(topic: string) {
  // TODO: later change it when using an external database
  return topicMap[topic];
}
