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
  {
    id: 9,
    question: "מהו השימוש במילת המפתח 'protected' ב-Java?",
    type: "multiple",
    correctAnswer:
      "'protected' מאפשרת גישה למשתנים או מתודות רק למחלקות יורשות ולמחלקות באותו חבילה.",
    incorrectAnswers: [
      "'protected' מאפשרת גישה רק בתוך המחלקה שבה הוגדרה.",
      "'protected' מאפשרת גישה למשתנים או מתודות לכל מחלקה בתוכנית.",
      "'protected' מגבילה את הגישה למשתנים או מתודות רק למתודות של המחלקה הנוכחית.",
    ],
  },
  {
    id: 10,
    question: "מהו ההבדל בין 'abstract class' ל-'interface' ב-Java?",
    type: "multiple",
    correctAnswer:
      "'abstract class' יכולה להכיל מימושים חלקיים ומחלקה יכולה לממש רק מחלקת אב אחת, בעוד ש-'interface' אינה כוללת מימושים ומחלקה יכולה לממש מספר interfaces. אינטרפייסים פועלים כמעין חוזה למימוש.",
    incorrectAnswers: [
      "'abstract class' יכולה להכיל רק הצהרות מבלי לכלול מימושים, בעוד ש-'interface' יכולה להכיל מימושים חלקיים.",
      "'abstract class' נועדה ליצירת מופעים, בעוד ש-'interface' משמשת לירוש תכונות בלבד.",
      "'abstract class' משמשת ליצירת קבצים חדשים, בעוד ש-'interface' משמשת ליצירת משתנים גלובליים.",
    ],
  },
  {
    id: 11,
    question: "מהו התפקיד של מתודות 'getter' ו-'setter' ב-Java?",
    type: "multiple",
    correctAnswer:
      "מתודות 'getter' ו-'setter' משמשות לקריאה ושינוי של משתנים פרטיים באופן מבוקר במחלקה.",
    incorrectAnswers: [
      "מתודות 'getter' ו-'setter' משמשות ליצירת מופעים חדשים.",
      "מתודות 'getter' ו-'setter' משמשות לירוש תכונות ממחלקות בסיס.",
      "מתודות 'getter' ו-'setter' מבצעות פעולות על אובייקטים חיצוניים.",
    ],
  },
  {
    id: 12,
    question: "האם ניתן ליצור אובייקטים חדשים ממחלקות אבסטרקטיות?",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 13,
    question: "מהו השימוש במילת המפתח 'this' ב-Java?",
    type: "multiple",
    correctAnswer: "'this' מתייחסת לאובייקט הנוכחי שבו מתבצע הקוד.",
    incorrectAnswers: [
      "'this' משמשת לגישה למחלקות אחרות.",
      "'this' נועדה ליצירת מופעים חדשים.",
      "'this' משמשת לעדכון משתנים גלובליים.",
    ],
  },
  {
    id: 14,
    question: "ב-C++, מה המילה השמורה המונעת ממחלקה להיות מחלקת בסיס לירושה?",
    type: "multiple",
    correctAnswer: "final",
    incorrectAnswers: ["static", "virtual", "abstract"],
  },
  {
    id: 15,
    question: "מהי המטרה של המתודה 'toString()' ב-Java?",
    type: "multiple",
    correctAnswer:
      "'toString()' מחזירה מחרוזת המייצגת את האובייקט בצורה קריאה ונגישה.",
    incorrectAnswers: [
      "'toString()' משנה את סוג הנתונים של האובייקט.",
      "'toString()' יוצרת מופע חדש של האובייקט.",
      "'toString()' משמשת לניהול חיבורים רשתיים.",
    ],
  },
  {
    id: 16,
    question: "מהי המילה השמורה המאפשרת ליצור מופעים של מחלקה ב-C++?",
    type: "multiple",
    correctAnswer: "new",
    incorrectAnswers: ["create", "make", "instance"],
  },
  {
    id: 18,
    question: "מהי פעולה בונה?",
    type: "multiple",
    correctAnswer:
      "פעולה שיוצרת אובייקטים חדשים ממחלקה ומאתחלת את התכונות שלהם.",
    incorrectAnswers: [
      "פעולה שיוצרת מחלקות חדשות",
      " פעולת עזר ליצירת ממשקים מתאימים לאובייקטים שמממשים אותם",
      "פעולה שיוצרת פעולות אחרות",
    ],
  },
  {
    id: 19,
    question: "מהו השימוש ב-'interface' ב-C#?",
    type: "multiple",
    correctAnswer:
      "'interface' מגדירה חוזה שמחלקות חייבות לממש, עם הצהרות ללא מימושים.",
    incorrectAnswers: [
      "'interface' משמשת ליצירת מופעים של אובייקטים חדשים.",
      "'interface' כוללת מימושים חלקיים של מתודות.",
      "'interface' נועדה לטעינת מודולים חיצוניים.",
    ],
  },

  {
    id: 20,
    question: "מהו השימוש במילת המפתח 'implements' ב-Java?",
    type: "multiple",
    correctAnswer: "'implements' מציינת שמחלקה מממשת את הממשק.",
    incorrectAnswers: [
      "'implements' נועדה לסמן ירושת תכונות ממחלקת אב.",
      "'implements' משמשת ליצירת משתנים גלובליים.",
      "'implements' נועדה להוסיף מימושים למחלקת בסיס.",
    ],
  },
  {
    id: 21,
    question: "מהו השימוש במילת המפתח 'static' ב-Java?",
    type: "multiple",
    correctAnswer:
      "'static' משמשת להצהיר על משתנים ומתודות ששייכים למחלקה ולא למופעים של המחלקה.",
    incorrectAnswers: [
      "'static' משמשת ליצירת מופעים חדשים של אובייקטים.",
      "'static' נועדה לטעינת קבצים חיצוניים.",
      "'static' משמשת לירוש תכונות ממחלקת אב.",
    ],
  },
  {
    id: 22,
    question: "מהו עקרון ה-'Dependency Injection' ב-OOP?",
    type: "multiple",
    correctAnswer:
      "Dependency Injection הוא עקרון שבו תלויות נמסרות למחלקה מבחוץ, ולא נוצרות ישירות בתוך המחלקה.",
    incorrectAnswers: [
      "Dependency Injection משמשת לשינוי סוגי נתונים של משתנים.",
      "Dependency Injection נועדה ליצירת מופעים חדשים של אובייקטים.",
      "Dependency Injection משמשת לטעינת קבצים חיצוניים.",
    ],
  },
  {
    id: 23,
    question: "מהו ההבדל בין 'overloading' ל-'overriding' ב-Java?",
    type: "multiple",
    correctAnswer:
      "'overloading' הוא יצירת מתודות עם אותו שם אך עם פרמטרים שונים, בעוד ש-'overriding' הוא החלפת מימוש מתודה במחלקת בת.",
    incorrectAnswers: [
      "'overloading' נועדה לשנות את סוג הנתונים של משתנים, בעוד ש-'overriding' נועדה לטעינת קבצים חיצוניים.",
      "'overloading' מאפשרת גישה למחלקות אחרות, בעוד ש-'overriding' משמשת ליצירת משתנים חדשים.",
      "'overloading' משמשת ליצירת מופעים חדשים, בעוד ש-'overriding' משנה את ההתנהגות של מופעים קיימים.",
    ],
  },
  {
    id: 31,
    question: "מהו עקרון ה-'Liskov Substitution Principle' (LSP) ב-OOP?",
    type: "multiple",
    correctAnswer:
      "LSP קובע שכל אובייקט מהמחלקה הבסיסית יכול להיות מוחלף באובייקט מהמחלקה הנגזרת מבלי לשנות את התנהגות התוכנית.",
    incorrectAnswers: [
      "LSP נוגע ליצירת משתנים גלובליים בתוך המחלקות.",
      "LSP משמש לטעינת קבצים חיצוניים.",
      "LSP מוודא שכל אובייקט מהמחלקה הבסיסית ניתן להמיר לפורמט של אובייקט חדש.",
    ],
  },
  {
    id: 35,
    question: "מהו עקרון ה-'Single Responsibility Principle' (SRP) ב-OOP?",
    type: "multiple",
    correctAnswer:
      "לפי עיקרון ה-SRP, כל מחלקה צריכה להיות אחראית על דבר אחד בלבד, ולהתמקד בתכלית אחד בלבד.",
    incorrectAnswers: [
      "עיקרון ה-SRP משמש ליצירת מופעים חדשים של אובייקטים.",
      "SRP עוסק בהגדרת מתודות לטעינת קבצים.",
      "SRP מוודא שכל מחלקה נועדה לנהל תכנים חיצוניים בלבד.",
    ],
  },
  {
    id: 36,
    question: "האם ירושה היא אחד מעקרונות התכנות מונחה העצמים?",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 37,
    question: "האם ניתן ליצור מופע של מחלקה מופשטת?",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 38,
    question: "האם כל המחלקות בשפת Java יורשות באופן אוטומטי מהמחלקה Object?",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 39,
    question: "האם ניתן לרשת ממספר מחלקות בו-זמנית בשפת Java?",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 40,
    question:
      "האם כימוס הוא עיקרון שמטרתו לחשוף את כל הפרטים הפנימיים של אובייקט?",
    type: "yesno",
    correctAnswer: false,
  },
  {
    id: 41,
    question:
      "האם תכנות מונחה עצמים מאפשר יצירת קוד מודולרי וניתן לשימוש חוזר?",
    type: "yesno",
    correctAnswer: true,
  },
];

export default oopQuestions;
