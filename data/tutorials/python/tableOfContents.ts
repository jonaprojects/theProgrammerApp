import { TableOfContentsModel } from "../models/tableOfContentsModel";

const tableOfContents: TableOfContentsModel = [
  {
    title: "יסודות התכנות",
    contents: {
      הקדמה: "Intro",
      התקנה: "Installation",
      "תוכנית ראשונה": "FirstProgram",
      "סוגי נתונים": "DataTypes",
      משתנים: "Variables",
      אופרטורים: "Operators",
      "קלט ופלט": "InputOutput",
      התניות: "Conditions",
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
      "מילון (dict)": "Dictionary",
    },
  },
  {
    title: "תכנות מונחה עצמים",
    contents: {
      "תכנות מונחה עצמים": "OOP1",
      "הפעולה __str__": "Str",
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
