import PythonLessonPage from "@/components/tutorials/PythonLessonPage";
import { pythonLessons } from "@/data/tutorials/python/lessons";

export default function InheritanceLesson() {
  return <PythonLessonPage lesson={pythonLessons.Inheritance} />;
}
