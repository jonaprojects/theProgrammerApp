import data from "@/data/tutorials/python/tableOfContents";
import TableOfContents from "../template/TableOfContents";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function CourseTableOfContents() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <TableOfContents
      data={data}
      courseHeaderImg={require("@/assets/images/tutorials/headers/pythonTutorialHeader.png")}
    />
  );
}
