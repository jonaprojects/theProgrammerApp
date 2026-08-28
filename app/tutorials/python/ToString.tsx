import PythonLessonPage from "@/components/tutorials/PythonLessonPage";
import { pythonLessons } from "@/data/tutorials/python/lessons";

export default function ToStringLesson() {
  return <PythonLessonPage lesson={pythonLessons.ToString} />;
}
