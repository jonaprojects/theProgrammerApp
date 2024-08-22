import networksQuestions from "./networksQuestions";
import oopQuestions from "./oopQuestions";
import pythonQuestions from "./pythonQuestions";
import webDevQuestions from "./webdevQuestions";
import type { Questions } from "./models";
// TODO: Update this method after the proof of concept

const topicMap: Record<string, Questions> = {
  python: pythonQuestions,
  networks: networksQuestions,
  webdev: webDevQuestions,
  oop: oopQuestions,
};

export async function loadQuestions(topic: string) {
  // TODO: later change it when using an external database
  return topicMap[topic];
}
