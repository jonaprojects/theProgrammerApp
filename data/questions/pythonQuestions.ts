import { Questions } from "./models";

const pythonQuestions:Questions = [
  {
    id: 0,
    question: "מי פיתח את שפת פייתון?",
    type: "multiple",
    correctAnswer: "גואידו ואן רוסום",
    incorrectAnswers: ["ביל גייטס", "דניס ריצ'י", "גריידון הור"],
  },
  {
    id: 1,
    question: "באיזו מילה שמורה משתמשים על מנת להגדיר משתנים בפייתון?",
    type: "multiple",
    correctAnswer: "var",
    incorrectAnswers: [
      "const",
      "תלוי בטיפוס המשתנה (int, bool, string וכו׳)",
      "בפייתון ניתן להגדיר משתנים ללא מילה שמורה שכזו.",
    ],
  },
  {
    id: 2,
    question: "באיזו שפת תכנות כתובה פייתון בגרסתה הרווחת?",
    type: "multiple",
    correctAnswer: "C",
    incorrectAnswers: ["C++", "Python", "C#"],
  },
  {
    id: 3,
    question: "איזו פעולה מאפשרת הוספה של איבר חדש לרשימה בפייתון?",
    type: "multiple",
    correctAnswer: "append",
    incorrectAnswers: ["add", "push", "insert"],
  },
  {
    id: 4,
    question:
      "איזה מבנה נתונים בפייתון שומר על כך שלא יהיו כפילויות של איברים?",
    type: "multiple",
    correctAnswer: "set",
    incorrectAnswers: ["list", "tuple", "stack"],
  },
  {
    id: 5,
    question: "איזו פעולה מפרידה מחרוזת לרשימה של מחרוזות לפי תווים ומחרוזות?",
    type: "multiple",
    correctAnswer: "split",
    incorrectAnswers: ["extend", "separate", "to_list"],
  },
  {
    id: 6,
    question: "מהי המילה השמורה לפעולה בונה בפייתון?",
    type: "multiple",
    correctAnswer: "__init__",
    incorrectAnswers: [
      "constructor",
      "יוצרים את הפעולה הבונה באמצעות שם המחלקה",
      "create",
    ],
  },
  {
    id: 7,
    question:
      "איזו פעולה מובנית מאפשרת סינון של מבני נתונים בהתאם לתנאים נתונים?",
    type: "multiple",
    correctAnswer: "filter",
    incorrectAnswers: ["select", "map", "reduce"],
  },
  {
    id: 8,
    question: "איזו מילה שמורה אחראית לייבוא של מודולים בפייתון?",
    type: "multiple",
    correctAnswer: "import",
    incorrectAnswers: ["using", "export", "require"],
  },
  {
    id: 9,
    question: "איזה מבנה נתונים מכיל זוגות של מפתחות וערכים?",
    type: "multiple",
    correctAnswer: "dict",
    incorrectAnswers: ["list", "tuple", "set"],
  },
  {
    id: 10,
    question: "באיזה שנה פייתון נוצרה?",
    type: "multiple",
    correctAnswer: "1991",
    incorrectAnswers: ["1987", "1996", "1976"],
  },
  {
    id: 11,
    question: "איך ניתן לבדוק אם איבר שייך לרשימה בפייתון?",
    type: "multiple",
    correctAnswer: "in",
    incorrectAnswers: ["contains", "exists", "has"],
  },
  {
    id: 12,
    question: "מה מהבאים מתייחס למופע הנוכחי של האובייקט בפייתון (לפי הנהוג)?",
    type: "multiple",
    correctAnswer: "self",
    incorrectAnswers: ["this", "current", "object"],
  },
  {
    id: 13,
    question: "באיזה כלי ניתן להתקין ספריות חיצוניות בפייתון?",
    type: "multiple",
    correctAnswer: "pip",
    incorrectAnswers: ["Nuget", "npm", "expo"],
  },
  {
    id: 14,
    question: "איך ניתן להגדיל את הערך של המשתנה a ב-1?",
    type: "multiple",
    correctAnswer: "=+a",
    incorrectAnswers: ["++a", "a+=1 או a++", "inc a"],
  },
  {
    id: 15,
    question: "ניתן לשנות את הערכים ב-tuple.",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 16,
    question: "אין תמיכה בתכנות מונחה עצמים בפייתון",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 17,
    question: "פייתון היא שפה שעוברת תהליך של אינטרפטציה (interpreted)",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 18,
    question: "מאחורי הקלעים, פייתון עוברת הידור ל-Java",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 19,
    question: "פייתון היא שפה עם מערכת טיפוסים דינמית",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 20,
    question: "בפייתון 3 יש תמיכה בביטויים טרינרים",
    type: "yesno",
    correctAnswer: false,
  },
];

export default pythonQuestions;
