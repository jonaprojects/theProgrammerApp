import PythonLessonPage from "@/components/tutorials/PythonLessonPage";
import { pythonLessons } from "@/data/tutorials/python/lessons";

export default function ListsLesson() {
  return <PythonLessonPage lesson={pythonLessons.Lists} />;
}
