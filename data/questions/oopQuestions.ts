import { Questions } from "./models";

const oopQuestions: Questions = [
  {
    id: 0,
    question: "איך קוראים לבעיה שנובעת מירושה מרובה?",
    type: "multiple",
    correctAnswer: "בעיית היהלום",
    incorrectAnswers: ["בעיית הירושה המרובה", "בעיית הריבוי", "בעית הקקטוס"],
  },
  {
    id: 1,
    question: "מהו העיקרון שלפיו משתמשים בתכונות פרטיות במקום פומביות?",
    type: "multiple",
    correctAnswer: "כימוס",
    incorrectAnswers: ["פולימורפיזם", "ירושה", "הכלה"],
  },
  {
    id: 2,
    question:
      "באיזו מילה שמורה משתמשים ב-C# על מנת לבדוק האם אובייקט שייך למחלקה מסוימת או למחלקת בת שלה?",
    type: "multiple",
    correctAnswer: "is",
    incorrectAnswers: ["isinstance", "instanceof", "id"],
  },
  {
    id: 3,
    question:
      "class B:A{\n        public int b;\n    }\n    public static void Main(string[] args)\n    {\n        A a = new A();\n        a.a = 4;\n        B b = (B)(a);\n        Console.WriteLine(a.a);\n    }\n~csharp~\n[[",
    type: "multiple",
    correctAnswer: "שגיאת זמן ריצה",
    incorrectAnswers: ["4", "null", "שגיאת קומפילציה"],
  },
  {
    id: 4,
    question:
      "אילו משפות התכנות הבאות נחשבות לשפת התכנות הראשונה שתמכה בתכנות מונחה עצמים?",
    type: "multiple",
    correctAnswer: "Simula 67",
    incorrectAnswers: ["Rust", "Smalltalk", "C++"],
  },
  {
    id: 5,
    question:
      "מהי המילה השמורה שבאמצעותה ניתן לגשת למחלקת האב מתוך מחלקת הבת בפייתון?",
    type: "multiple",
    correctAnswer: "super",
    incorrectAnswers: ["base", "father", "this"],
  },
  {
    id: 6,
    question:
      "מהי המילה השמורה שבאמצעותה ניתן לגשת למחלקת האב מתוך מחלקת הבת ב-C#?",
    type: "multiple",
    correctAnswer: "base",
    incorrectAnswers: ["super", "father", "this"],
  },
  {
    id: 7,
    question: "האם קיימת תמיכה בירושה מרובה בפייתון?",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 8,
    question: "האם קיימת תמיכה בתכנות מונחה עצמים ב-C?",
    type: "yesno",
    correctAnswer: false,
  },
];

export default oopQuestions;
