import { P } from "@/components/UI/typography/Typography";
import TutorialTemplate from "../template/TutorialTemplate";
import Container from "@/components/UI/Container";
import { PropsWithChildren } from "react";

type PythonTutorialTemplate = PropsWithChildren<{
  title: string;
  onNextPage: () => void;
  nextPageTitle: string;
}>;
export default function PythonTutorialTemplate(props: PythonTutorialTemplate) {
  return (
    <TutorialTemplate
      headerBackgroundImg={require("@/assets/images/tutorials/headers/pythonTutorialHeader.png")}
      headerTitle={props.title}
      onNextPage={props.onNextPage}
      nextPageTitle={props.nextPageTitle}
      tableOfContentsPath="/tutorials/python/CourseTableOfContents"
    >
      {props.children}
    </TutorialTemplate>
  );
}
