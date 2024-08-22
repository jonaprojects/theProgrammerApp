import { Questions } from "./models";

const webDevQuestions: Questions = [
  {
    id: 0,
    question: "מה מסמלות ראשי התיבות HTML?",
    type: "multiple",
    correctAnswer: "Hyper Text Markup Language",
    incorrectAnswers: [
      "Hyper Transfer Markup Language",
      "Hyper Text Transfer Protocol",
      "Hosted Text Markup Language",
    ],
  },
  {
    id: 1,
    question: "איך ניתן ליצור משתנה חדש ב-Javascript?",
    type: "multiple",
    correctAnswer: "באמצעות המילה השמורה var",
    incorrectAnswers: [
      "תלוי בסוג המשתנה - int, string, וכדומה",
      "באמצעות המילה השמורה new",
      "לא ניתן ליצור משתנים ב-javascript",
    ],
  },
  {
    id: 2,
    question: "איך ניתן להדפיס מלל ב-javascript?",
    type: "multiple",
    correctAnswer: "console.log(“hello world”)",
    incorrectAnswers: [
      "console.write(“hello world”)",
      "system.out.println(“hello world”)",
      "print(“hello world”)",
    ],
  },
  {
    id: 3,
    question: "איזה אלמנט מייצג פסקה ב-HTML?",
    type: "multiple",
    correctAnswer: "p",
    incorrectAnswers: ["paragraph", "par", "ParagraphBuilder"],
  },
  {
    id: 4,
    question:
      "איזו ספרית javascript ידועה מאפשרת ליצור user interfaces באמצעות פירוק שלהם לרכיבים ושימוש חוזר שלהם?",
    type: "multiple",
    correctAnswer: "React",
    incorrectAnswers: ["Bootstrap", "Angular", "SDL"],
  },
  {
    id: 5,
    question: "כיצד ניתן ליצור את הכותרת הגדולה ביותר ב-HTML?",
    type: "multiple",
    correctAnswer: "h1",
    incorrectAnswers: ["header6", "header1", "h6"],
  },
  {
    id: 6,
    question:
      "איזה פעולה ב-react מאפשרת לנו ליצור זיכרון שמשויך ל-component (רכיב)?",
    type: "multiple",
    correctAnswer: "useState",
    incorrectAnswers: ["useMemo", "useEffect", "useMemory"],
  },
  {
    id: 7,
    question: "מה מסמלות הראשי תיבות של CSS?",
    type: "multiple",
    correctAnswer: "Cascading Style Sheets",
    incorrectAnswers: [
      "Custom Style Sheets",
      "Client-Side Style Sheets",
      "Client custom styles",
    ],
  },
  {
    id: 8,
    question: "מתי נוצר אתר האינטרנט הראשון ברשת האינטרנט?",
    type: "multiple",
    correctAnswer: "1991",
    incorrectAnswers: ["1992", "1983", "1998"],
  },
  {
    id: 9,
    question: "מהו אחד מההבדלים בין תחביר JSON לבין אובייקטים ב-Javascript?",
    type: "multiple",
    correctAnswer: "ב-JSON חובה לכתוב את התכונות בתוך מירכאות כפולות.",
    incorrectAnswers: [
      "ב-JSON לא ניתן להזין ערכים מספריים.",
      "אין הבדל ממשי.",
      "אין קשר בין שני המושגים ולכן אין טעם אפילו להשוות ביניהם.",
    ],
  },
  {
    id: 10,
    question: "אילו מהתוכנות הבאות משמשות לפיתוח אתרים?",
    type: "multiple",
    correctAnswer: "Wordpress",
    incorrectAnswers: ["GIMP", "webGen", "Slack"],
  },
  {
    id: 11,
    question: "אילו מהבאים הוא לא סטטוס תגובה של HTTP?",
    type: "multiple",
    correctAnswer: "800",
    incorrectAnswers: ["404", "200", "500"],
  },
  {
    id: 12,
    question: "אילו מהבאים הוא כלל עיצובי אשר נוגע לשימוש בצבעים בעיצוב אתרים",
    type: "multiple",
    correctAnswer: "חוק ה-60 30 10",
    incorrectAnswers: ["חוק ה 70 20 10", "חוק ה 50 30 20", "חוק ה 80 10 10"],
  },
  {
    id: 13,
    question:
      "קיימת תוכנה שמאפשרת יצירה של אפליקציות frontend בפייתון במקום ב-javascript",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 14,
    question:
      "ב-javascript אי אפשר לשלוח בקשות GET ו-POST לשרתים מרוחקים וחייבים להתקין ספריות חיצוניות לכך",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 15,
    question: "הגרסה העדכנית ביותר של HTML היא HTML4.",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 16,
    question:
      "חייבים לדעת איך לתכנת ב-HTML, CSS ו-Javascript על מנת לפתח אתרים",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 17,
    question:
      "התהליך של פיתוח אתרים כך שיתאימו לתצורות מסך שונות של מכשירים נקרא ״עיצוב רספונסיבי״",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 18,
    question: "שני חוקרים מהטכניון היו ממפתחי שפת PHP",
    type: "yesno",
    correctAnswer: true,
  },
];

export default webDevQuestions;
