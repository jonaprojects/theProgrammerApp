import { TableOfContentsModel } from "../models/tableOfContentsModel";

const tableOfContents: TableOfContentsModel = [
  {
    title: "יסודות התכנות",
    contents: {
      הקדמה: "Intro",
      התקנה: "Installation",
      "תוכנית ראשונה": "FirstPythonProgram",
      "סוגי נתונים": "Datatypes",
      משתנים: "Variables",
      אופרטורים: "Operators",
      "קלט ופלט": "InputOutput",
      התניות: "IFElse",
      "התניות elif": "Elif",
      לולאות: "Loops",
      פונקציות: "Functions",
    },
  },
  {
    title: "מבני נתונים",
    contents: {
      רשימות: "Lists",
      מחרוזות: "Strings",
      Tuples: "Tuples",
      Sets: "Sets",
      "מילון (dict)": "Dicts",
    },
  },
  {
    title: "תכנות מונחה עצמים",
    contents: {
      "תכנות מונחה עצמים": "OOP_Intro",
      "הפעולה __str__": "ToString",
      כימוס: "Encapsulation",
      ירושה: "Inheritance",
      "פעולות סטטיות": "StaticMethods",
      "ירושה וכימוס": "InheritanceAndEncapsulation",
    },
  },
  {
    title: "מתקדם",
    contents: {
      "ספריות חיצוניות": "ExternalLibraries",
    },
  },
];
 
export default tableOfContents;
