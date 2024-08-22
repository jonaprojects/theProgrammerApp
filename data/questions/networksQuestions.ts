import type { Questions } from "./models";

const networksQuestions: Questions = [
  {
    id: 0,
    question: "מה הפרוטוקול העיקרי שמשמש לשליחה של דפי אינטרנט ברשת?",
    type: "multiple",
    correctAnswer: "HTTP",
    incorrectAnswers: ["ARP", "DNS", "HTML"],
  },
  {
    id: 1,
    question: "מה התפקיד של פרוטוקול DNS?",
    type: "multiple",
    correctAnswer: "מקבל כתובת URL באנגלית ומחזיר את כתובת ה-IP המתאימה לה",
    incorrectAnswers: [
      "מקבל כתובת IP ומחזיר כתובת MAC מתאימה לה",
      "שמירה של דפי אינטרנט באופן לוקאלי בלקוח",
      "שליחה של אימיילים בין מכשירים",
    ],
  },
  {
    id: 2,
    question: "איך קוראים למודל שמתאר את תהליך התקשורת בין רכיבים שונים?",
    type: "multiple",
    correctAnswer: "מודל 5 השכבות",
    incorrectAnswers: [
      "מודל התקשורת האוניברסלי",
      "מודל שכבות הבצל",
      "backpropagation",
    ],
  },
  {
    id: 3,
    question:
      "איך קוראים לשכבה הנמוכה ביותר במודל השכבות, אשר אחראית על מעבר המידע כרצף של סיביות דרך תווך?",
    type: "multiple",
    correctAnswer: "השכבה הפיזית",
    incorrectAnswers: ["השכבה הבסיסית", "שכבת התווך", "שכבת הבסיס"],
  },
  {
    id: 4,
    question: "באופן כללי, מהם ההבדלים בין TCP לבין UDP?",
    type: "multiple",
    correctAnswer:
      "ב-TCP המידע מועבר באופן אמין יותר בעוד ש-UDP מאפשר מעבר מהיר יותר של מידע",
    incorrectAnswers: [
      "ב-TCP המידע מועבר באופן פחות אמין בעוד ש-UDP מאפשר מעבר מהיר יותר של מידע",
      "ב-UDP המידע מועבר באופן אמין יותר בעוד ש-TCP מאפשר מעבר מהיר יותר של מידע",
      "TCP הוא פרוטוקול חדש ובטוח יותר ולכן תמיד מומלץ להשתמש בו ולא ב-UDP",
    ],
  },
  {
    id: 5,
    question: "איזה פרוטוקול מאופיין בתהליך ״לחיצת היד המשולשת״?",
    type: "multiple",
    correctAnswer: "TCP",
    incorrectAnswers: ["UDP", "ARP", "SMTP"],
  },
  {
    id: 6,
    question: "באיזה פרוטוקול משתמשים על מנת לשלוח הודעות ping משורת הפקודה?",
    type: "multiple",
    correctAnswer: "ICMP",
    incorrectAnswers: ["IP", "UDP", "TCP"],
  },
  {
    id: 7,
    question: "כיצד נהוג לבצע שאילתות לדפי אינטרנט?",
    type: "multiple",
    correctAnswer: "בקשת GET",
    incorrectAnswers: ["בקשת POST", "בקשת PUT", "בקשת fetch"],
  },
  {
    id: 8,
    question: "מתי נוצר אתר האינטרנט הראשון בעולם",
    type: "multiple",
    correctAnswer: "1991",
    incorrectAnswers: ["1985", "1987", "1996"],
  },
  {
    id: 9,
    question: "איך קוראים לתהליך שבו שולפים מידע מאתרי אינטרנט קיימים ברשת?",
    type: "yesno",
    correctAnswer: true,
  },
  {
    id: 10,
    question:
      "איזה קוד שגיאה בפרוטוקול HTTP מצביע על כך שהמשאב שהתבקש אינו קיים?",
    type: "multiple",
    correctAnswer: "404",
    incorrectAnswers: ["403", "200", "305"],
  },
  {
    id: 11,
    question: "איזה קוד בפרוטוקול HTTP מסמל שהבקשה והתגובה התבצעו כראוי?",
    type: "multiple",
    correctAnswer: "200",
    incorrectAnswers: ["305", "404", "302"],
  },
  {
    id: 12,
    question: "לאיזו שכבה במודל 5 השכבות משויך מכשיר ה-switch?",
    type: "multiple",
    correctAnswer: "שכבת הקו (שכבה 2)",
    incorrectAnswers: [
      "שכבת הרשת (שכבה 3)",
      "שכבת התעבורה (שכבה 4)",
      "שכבת האפלקיציה (שכבה 5)",
    ],
  },
  {
    id: 13,
    question: "מה ההבדל העיקרי בפונקציונליות של Switch לעומת Hub?",
    type: "multiple",
    correctAnswer:
      "Switch מעביר את הפקטות המתאימות לכתובות MAC המתאימות ברשת, בעוד ש-hub משדר את ההודעות לכל המכשירים המחוברים אליו.",
    incorrectAnswers: [
      "Switch עובד בשכבת הרשת (שכבה 3) בעוד ש-Hub עובד בשכבת הקו (שכבה 2)",
      "Hub עובד בשכבת הרשת (שכבה 3) בעוד ש-Switch עובד בשכבת הקו (שכבה 2)",
      "Switch מחבר בין רשתות שונות בעוד ש-Hub משמש לחיבור בין מכשירים באותה הרשת באמצעות כבלי \nאת׳רנט (Ethernet).",
    ],
  },
  {
    id: 14,
    question: "לאיזו שכבה במודל 5 השכבות משויכות כתובות MAC?",
    type: "multiple",
    correctAnswer: "שכבת הקו (שכבה 2)",
    incorrectAnswers: [
      "שכבת הרשת (שכבה 3)",
      "שכבת התעבורה (שכבה 4)",
      "שכבת האפלקיציה (שכבה 5)",
    ],
  },
  {
    id: 15,
    question: "לאיזו שכבה במודל 5 השכבות משויכות כתובות IP?",
    type: "multiple",
    correctAnswer: "שכבת הרשת (שכבה 3)",
    incorrectAnswers: [
      "שכבת הקו (שכבה 2)",
      "שכבת התעבורה (שכבה 4)",
      "שכבת האפלקיציה (שכבה 5)",
    ],
  },
  {
    id: 16,
    question: "באיזה פורט (port) פועל בדרך כלל פרוטוקול HTTP?",
    type: "multiple",
    correctAnswer: "80",
    incorrectAnswers: ["70", "50", "400"],
  },
  {
    id: 17,
    question: "באיזה פורט (port) פועל בדרך כלל פרוטוקול ?HTTPS",
    type: "multiple",
    correctAnswer: "443",
    incorrectAnswers: ["70", "128", "336"],
  },
  {
    id: 18,
    question: "מה ההבדל העיקרי בין HTTP לבין HTTPS?",
    type: "multiple",
    correctAnswer:
      "מידע שעובר ב-HTTPS מוצפן באמצעות SSL/TLS ותעודות (certificates) דיגיטליות.",
    incorrectAnswers: [
      "HTTPS מאפשרת שליחה של קבצי וידאו בין שרתים במהירות רבה יותר באמצעות שימוש בשירותי CDN",
      "HTTPS היא גרסה מהירה ומשופרת יותר של HTTP ולכן חוסכת זמן ריצה בביצוע בקשות בדפי אינטרנט.",
      "אין הבדל משמעותי, אלו שתי גרסאות מאוד דומות של אותו הפרוטוקול שפותחו על ידי חברות מתחרות.",
    ],
  },
];

export default networksQuestions;
