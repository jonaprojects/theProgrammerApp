import { Questions } from "./models";

const pythonQuestions: Questions = [
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
  {
    id: 21,
    question: "מהי מטרת ה-'lambda function' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'lambda function' היא פונקציה אנונימית, כלומר פונקציה ללא שם, שניתן להגדיר בקלות עבור פעולות קצרות.",
    incorrectAnswers: [
      "'lambda function' היא פונקציה עם יכולת להחזיר מספרים עשרוניים.",
      "'lambda function' היא פונקציה שמבצעת פעולות רק על מחרוזות.",
      "'lambda function' היא פונקציה שמבצעת חישובים מתקדמים בלבד.",
    ],
  },
  {
    id: 22,
    question: "מהו תפקיד ה-'self' ב-Python?",
    type: "multiple",
    correctAnswer: "'self' מתייחס לאובייקט הנוכחי בתוך מתודת מחלקה.",
    incorrectAnswers: [
      "'self' מתייחס למשתנים גלובליים בתוך המחלקה.",
      "'self' משמש כקבועה שמגדירה את גודל האובייקט.",
      "'self' נועד להגדיר את סוג הנתונים של המשתנים.",
    ],
  },
  {
    id: 23,
    question: "מהו השימוש בפונקציה 'open' ב-Python?",
    type: "multiple",
    correctAnswer: "הפונקציה 'open' משמשת לפתיחת קובץ לקריאה או כתיבה.",
    incorrectAnswers: [
      "הפונקציה 'open' משמשת ליצירת רשימות חדשות.",
      "הפונקציה 'open' משמשת לטעינת מודולים נוספים.",
      "הפונקציה 'open' משמשת לצורך ניהול חיבורים רשתיים.",
    ],
  },
  {
    id: 24,
    question: "מהו 'decorator' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'decorator' הוא פונקציה שמשתמשת לשינוי או הרחבת התנהגות של פונקציה אחרת.",
    incorrectAnswers: [
      "'decorator' הוא אובייקט המייצג סוגי נתונים חדשים.",
      "'decorator' הוא כלי לניהול משתנים בתוך פונקציה.",
      "'decorator' הוא רכיב ליצירת ממשקי משתמש.",
    ],
  },
  {
    id: 25,
    question: "מהו השימוש בפונקציה 'map' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'map' משמשת ליישום פונקציה על כל פריט באיטרביל (כגון רשימה) וליצור אובייקט חדש עם התוצאות.",
    incorrectAnswers: [
      "'map' משמשת ליצירת פונקציות חדשות מתוך אובייקטים קיימים.",
      "'map' משמשת לטעינת מודולים חדשים לקוד.",
      "'map' משמשת לניהול קבצים בתוך פרויקטים.",
    ],
  },
  {
    id: 26,
    question: "מהו 'virtual environment' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'virtual environment' הוא כלי ליצירת סביבות מבודדות להתקנת תלויות עבור פרויקטים שונים.",
    incorrectAnswers: [
      "'virtual environment' הוא אובייקט לניהול רשימות משתנים.",
      "'virtual environment' הוא מודול ליצירת קבצים חדשים.",
      "'virtual environment' הוא פונקציה לניהול קוד JavaScript.",
    ],
  },
  {
    id: 27,
    question: "מהי מטרת הפקודה 'pip install' ב-Python?",
    type: "multiple",
    correctAnswer:
      "הפקודה 'pip install' מתקינה חבילות ותלויות נוספות לסביבת Python שלך.",
    incorrectAnswers: [
      "הפקודה 'pip install' יוצרת קבצים חדשים לפרויקט.",
      "הפקודה 'pip install' מעדכנת את גרסת Python למערכת.",
      "הפקודה 'pip install' מספקת תמיכה לפיתוח צד שרת.",
    ],
  },
  {
    id: 28,
    question: "מה עושה הפונקציה 'len' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'len' מחזירה את האורך של אובייקט, כגון רשימה, מחרוזת או קבוצה.",
    incorrectAnswers: [
      "'len' משנה את תוכן האובייקט שצוין.",
      "'len' מבצעת חיבור בין שני אובייקטים.",
      "'len' בודקת אם אובייקט קיים במערכת.",
    ],
  },
  {
    id: 29,
    question: "מהו השימוש במילת המפתח 'with' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'with' משמשת לנהל את חיי האובייקט ולוודא שהמשאבים יתפנו כראוי לאחר השימוש.",
    incorrectAnswers: [
      "'with' משמשת ליצירת משתנים חדשים.",
      "'with' משמשת לייבוא מודולים נוספים.",
      "'with' משמשת לניהול קבצים בתוך ספריות.",
    ],
  },
  {
    id: 30,
    question: "מהו השימוש ב-'try' ו-'except' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'try' ו-'except' משמשים לטפל בשגיאות שמתרחשות במהלך הריצה של קוד.",
    incorrectAnswers: [
      "'try' ו-'except' משמשים ליצירת פונקציות חדשות.",
      "'try' ו-'except' משמשים לנהל את התצוגה של התוכנית.",
      "'try' ו-'except' משמשים לקביעת משתנים גלובליים.",
    ],
  },
  {
    id: 31,
    question: "מהו תפקיד המודול 'datetime' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'datetime' מאפשרת לעבוד עם תאריכים ושעות, כולל חישוב תאריכים ועבודה עם אזורי זמן.",
    incorrectAnswers: [
      "'datetime' משמשת ליצירת גרפים ותרשימים.",
      "'datetime' משמשת לניהול תצוגה של דפי אינטרנט.",
      "'datetime' משמשת להמרת קבצים בפורמטים שונים.",
    ],
  },
  {
    id: 32,
    question: "מהו תפקיד המודול 'os' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'os' מספק פונקציות לניהול מערכות קבצים ולביצוע פעולות מערכת, כמו גישה לתיקיות וקבצים.",
    incorrectAnswers: [
      "'os' משמש ליצירת גרפים וויזואליזציות.",
      "'os' משמש לניהול קונפיגורציות של שרתים.",
      "'os' משמש ליצירת ממשקי משתמש גרפיים.",
    ],
  },
  {
    id: 33,
    question: "מהי מטרת הפונקציה 'filter' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'filter' מסננת פריטים מתוך איטרביל (כגון רשימה) על פי פונקציה שצוין.",
    incorrectAnswers: [
      "'filter' משמשת ליצירת פונקציות חדשות.",
      "'filter' משמשת לטעינת קבצים חדשים.",
      "'filter' משמשת להמרת נתונים לפורמטים שונים.",
    ],
  },
  {
    id: 34,
    question: "מהו השימוש בפונקציה 'enumerate' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'enumerate' מחזירה את האינדקס ואת הערך של פריטים בתוך איטרביל.",
    incorrectAnswers: [
      "'enumerate' יוצרת פונקציות חדשות מתוך רשימות.",
      "'enumerate' מסננת פריטים מתוך איטרביל.",
      "'enumerate' מספקת תצוגה של אובייקטים גראפיים.",
    ],
  },
  {
    id: 35,
    question: "מהו השימוש ב-'assert' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'assert' משמשת לבדוק אם תנאי מסוים נכון, ואם לא, זורקת שגיאה.",
    incorrectAnswers: [
      "'assert' משמשת ליצירת אובייקטים חדשים.",
      "'assert' משמשת לניהול תצוגת המשתמש.",
      "'assert' משמשת לטעינת מודולים נוספים.",
    ],
  },
  {
    id: 36,
    question: "מהו השימוש ב-'pass' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'pass' משמשת כמילוי מקום לפקודה ריקה בתוך פונקציה, מחלקה או לולאה.",
    incorrectAnswers: [
      "'pass' משמשת להמרת נתונים לפורמטים שונים.",
      "'pass' משמשת ליצירת משתנים גלובליים.",
      "'pass' משמשת לטעינת מודולים חיצוניים.",
    ],
  },
  {
    id: 37,
    question: "מהי מטרת השימוש בפונקציה 'range' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'range' משמשת ליצירת סדרת מספרים בתחום נתון, שהיא איטרביל שניתן להשתמש בו בלולאות.",
    incorrectAnswers: [
      "'range' משמשת ליצירת מחרוזות חדשות.",
      "'range' משמשת לטעינת קבצים חיצוניים.",
      "'range' משמשת לניהול ממשקי משתמש.",
    ],
  },
  {
    id: 38,
    question: "מהו השימוש בפונקציה 'input' ב-Python?",
    type: "multiple",
    correctAnswer: "'input' מקבלת קלט מהמשתמש כטקסט ומחזירה אותו כ-str.",
    incorrectAnswers: [
      "'input' מחזירה את הקלט כמשתנה מספרי.",
      "'input' משנה את הקלט לטיפוס נתונים בוליאני.",
      "'input' משמשת לניהול קבצים בצורה אוטומטית.",
    ],
  },
  {
    id: 39,
    question: "מהי מטרת השימוש בפונקציה 'round' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'round' עוגלת מספרים עשרוניים למספר העשרוני הקרוב ביותר או למספר עשרוני עם מספר מסוים של מקומות אחרי הנקודה.",
    incorrectAnswers: [
      "'round' משמשת ליצירת רשימות חדשות.",
      "'round' משמשת לניהול תצוגת הטקסט.",
      "'round' משמשת להמרת קבצים לפורמטים שונים.",
    ],
  },
  {
    id: 40,
    question: "מהו השימוש בפונקציה 'split' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'split' מפרקת מחרוזת למספר חלקים לפי מפריד שנבחר ומחזירה רשימה של התוצאות.",
    incorrectAnswers: [
      "'split' מחברת מחרוזות יחד.",
      "'split' משמשת ליצירת קבצים חדשים.",
      "'split' משנה את הפורמט של מספרים עשרוניים.",
    ],
  },
  {
    id: 41,
    question: "מהו השימוש במילת המפתח 'return' ב-Python?",
    type: "multiple",
    correctAnswer: "'return' מחזירה ערך מהפונקציה למקום שבו היא נקראה.",
    incorrectAnswers: [
      "'return' משנה את סוג הפונקציה.",
      "'return' מבטלת את ריצת הפונקציה.",
      "'return' יוצרת משתנים חדשים בתוך הפונקציה.",
    ],
  },
  {
    id: 42,
    question: "מהו תפקיד המודול 'sys' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'sys' מספק גישה לפרמטרים ולמאפיינים של סביבת הריצה של התוכנית, כמו פרמטרים שצוינו בקו הפקודה.",
    incorrectAnswers: [
      "'sys' משמש לניהול קבצים ונתונים.",
      "'sys' משמש ליצירת ממשקי משתמש גרפיים.",
      "'sys' משמש ליצירת גרפים ותרשימים.",
    ],
  },
  {
    id: 42,
    question: "מהו השימוש בפונקציה 'replace' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'replace' מחליפה תת-מחרוזת אחת במחרוזת אחרת בתוך מחרוזת נתונה.",
    incorrectAnswers: [
      "'replace' משנה את תוכן הקובץ.",
      "'replace' מחליפה ערכים בתוך רשימה.",
      "'replace' מחליפה קבצים באחסון.",
    ],
  },
  {
    id: 43,
    question: "מהו השימוש בפונקציה 'join' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'join' מחברת את פריטי רשימה או איטרביל למחרוזת אחת, תוך שימוש במפריד שצוין.",
    incorrectAnswers: [
      "'join' משמשת ליצירת רשימות חדשות.",
      "'join' משנה את הפורמט של קובץ טקסט.",
      "'join' מפרקת מחרוזות למספר חלקים.",
    ],
  },
  {
    id: 44,
    question: "מהו השימוש ב-'global' בתוך פונקציה ב-Python?",
    type: "multiple",
    correctAnswer:
      "'global' מאפשרת לפונקציה לגשת ולשנות משתנים גלובליים שהוגדרו מחוץ לפונקציה.",
    incorrectAnswers: [
      "'global' יוצרת משתנים חדשים בתוך הפונקציה בלבד.",
      "'global' משנה את התנהגות הפונקציה באופן אוטומטי.",
      "'global' משמשת ליצירת קבצים חדשים במערכת.",
    ],
  },
  {
    id: 45,
    question: "מה עושה המודול 'math' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'math' מספק פונקציות מתמטיות מתקדמות כמו חישוב שורש ריבועי, חישוב ערכים טריגונומטריים ועוד.",
    incorrectAnswers: [
      "'math' משמש לניהול קבצים במערכת.",
      "'math' משמש ליצירת ממשקי משתמש גרפיים.",
      "'math' משמש לטעינת מודולים חיצוניים.",
    ],
  },
  {
    id: 46,
    question: "מהו השימוש בפונקציה 'sorted' ב-Python?",
    type: "multiple",
    correctAnswer:
      "'sorted' מסדרת את הפריטים באיטרביל (כגון רשימה) בסדר עולה ומחזירה רשימה חדשה מסודרת.",
    incorrectAnswers: [
      "'sorted' משנה את סדר הקובץ במערכת הקבצים.",
      "'sorted' משמשת ליצירת מחרוזות חדשות.",
      "'sorted' משמשת לניהול קבצים מחוץ לתוכנית.",
    ],
  },
  {
    id: 47,
    question: "מהי מטרת השימוש בפונקציה 'eval' ב-Python?",
    type: "multiple",
    correctAnswer: "'eval' מבצעת קוד שנמצא במחרוזת ומחזירה את התוצאה שלו.",
    incorrectAnswers: [
      "'eval' מנתחת מחרוזות ומחזירה תוצאות מספריות.",
      "'eval' משמשת ליצירת קבצים חדשים בקוד.",
      "'eval' משנה את התנהגות הפונקציה באופן אוטומטי.",
    ],
  },
  {
    id: 48,
    question: "מהו השימוש ב-'staticmethod' בתוך מחלקה ב-Python?",
    type: "multiple",
    correctAnswer:
      "'staticmethod' מאפשרת להגדיר מתודה שאינה תלויה באובייקט או ב-class, וניתן לקרוא לה ישירות מהמחלקה.",
    incorrectAnswers: [
      "'staticmethod' משמשת ליצירת משתנים גלובליים.",
      "'staticmethod' משנה את התנהגות האובייקט הנוכחי.",
      "'staticmethod' נועדה ליצירת פונקציות גנרטור.",
    ],
  },
  {
    id: 49,
    question: "מהי מטרת השימוש בפונקציה 'type' ב-Python?",
    type: "multiple",
    correctAnswer: "'type' מחזירה את סוג הנתונים של האובייקט הניתן לה כפרמטר.",
    incorrectAnswers: [
      "'type' משנה את סוג הנתונים של המשתנה.",
      "'type' משמשת ליצירת פונקציות חדשות.",
      "'type' מנהלת קבצים ומודולים.",
    ],
  },
  {
    id: 50,
    question: "האם Python היא שפה מונחית עצמים?",
    type: "yesno",
    correctAnswer: true,
    explanation:
      "כן, Python היא שפה מונחית עצמים. היא תומכת במחלקות, אובייקטים, ירושה, הכמסה, פולימורפיזם ועוד מאפיינים של תכנות מונחה עצמים.",
  },
  {
    id: 51,
    question: "האם בפייתון חובה להגדיר את הטיפוס של משתנה בעת יצירתו?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, פייתון היא שפה בעלת טיפוס דינמי. אין צורך להגדיר את הטיפוס של משתנה בעת יצירתו. הטיפוס נקבע אוטומטית בזמן ריצה על פי הערך המוקצה למשתנה.",
  },
  {
    id: 52,
    question: "האם פייתון תומכת בירושה מרובה?",
    type: "yesno",
    correctAnswer: true,
    explanation:
      "כן, פייתון תומכת בירושה מרובה. מחלקה יכולה לרשת ממספר מחלקות אב.",
  },
  {
    id: 53,
    question: "האם משתנים בפייתון הם קבועים (immutable) כברירת מחדל?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, רוב הטיפוסים בפייתון הם משתנים (mutable). עם זאת, ישנם טיפוסים קבועים כמו מחרוזות, מספרים ו-tuples.",
  },
  {
    id: 54,
    question: "האם פייתון משתמשת בנקודה-פסיק (;) בסוף כל הוראה?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, בפייתון אין צורך בנקודה-פסיק בסוף הוראות. ניתן להשתמש בהן, אך זה לא נדרש ולא מקובל.",
  },
  {
    id: 55,
    question: "האם קיים טיפוס נתונים מובנה עבור מערך דו-ממדי בפייתון?",
    type: "yesno",
    correctAnswer: false,
    explanation:
      "לא, אין טיפוס נתונים מובנה למערך דו-ממדי בפייתון. עם זאת, ניתן ליצור מערך דו-ממדי באמצעות רשימה של רשימות.",
  },
  {
    id: 56,
    question: "האם פייתון מאפשרת העמסת אופרטורים (operator overloading)?",
    type: "yesno",
    correctAnswer: true,
    explanation:
      "כן, פייתון מאפשרת העמסת אופרטורים. ניתן להגדיר מחדש את התנהגות האופרטורים הסטנדרטיים עבור מחלקות מותאמות אישית.",
  },
];

export default pythonQuestions;
