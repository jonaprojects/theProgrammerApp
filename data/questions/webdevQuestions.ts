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
  {
    id: 19,
    question: "מה הפונקציה של הפקודה 'console.log' ב-JavaScript?",
    type: "multiple",
    correctAnswer: "היא מדפיסה מידע לקונסולה של הדפדפן.",
    incorrectAnswers: [
      "היא שומרת מידע בקובץ לוג.",
      "היא מייצרת הודעות שגיאה.",
      "היא מבצעת קוד JavaScript בצורה אסינכרונית.",
    ],
  },
  {
    id: 20,
    question: "מה ההבדל בין 'let' ל-'const' ב-JavaScript?",
    type: "multiple",
    correctAnswer:
      "'let' מאפשר לשנות את הערך של משתנה, בעוד ש-'const' אינו מאפשר שינוי.",
    incorrectAnswers: [
      "'let' הוא למשתנים גלובליים ו-'const' למשתנים מקומיים.",
      "'let' הוא למשתנים בתוך פונקציות ו-'const' מחוץ לפונקציות.",
      "'let' ו-'const' הם תחליפים זהים.",
    ],
  },
  {
    id: 21,
    question: "מהו HTML?",
    type: "multiple",
    correctAnswer: "HTML הוא שפת תיוג לבניית מבנה של דפי אינטרנט.",
    incorrectAnswers: [
      "HTML היא שפת תכנות ליצירת אפליקציות.",
      "HTML היא מסד נתונים לניהול תוכן.",
      "HTML היא ספרייה לסטיילינג דפים.",
    ],
  },
  {
    id: 22,
    question: "מהו הפקודה 'npm install' ב-Node.js?",
    type: "multiple",
    correctAnswer: "היא מתקינה את התלויות המפורטות בקובץ package.json.",
    incorrectAnswers: [
      "היא מעדכנת את Node.js לגרסה האחרונה.",
      "היא מייצרת קובץ חדש בשם package.json.",
      "היא מבצעת הרצה של סקריפטים מקובץ package.json.",
    ],
  },
  {
    id: 23,
    question: "מה זה CSS?",
    type: "multiple",
    correctAnswer: "CSS היא שפה לעיצוב מראה של דפי אינטרנט.",
    incorrectAnswers: [
      "CSS היא ספריית JavaScript לטיפול באירועים.",
      "CSS היא מסד נתונים לניהול תוכן.",
      "CSS היא שפת תכנות לבניית דפי אינטרנט.",
    ],
  },
  {
    id: 24,
    question: "מה זה API?",
    type: "multiple",
    correctAnswer:
      "API הוא ממשק לתכנות יישומים המאפשר תקשורת בין תוכנות שונות.",
    incorrectAnswers: [
      "API הוא מסד נתונים לתכנון אינטרנט.",
      "API הוא פרוטוקול לקידוד דפי אינטרנט.",
      "API הוא שפה חדשה לכתיבת קוד.",
    ],
  },
  {
    id: 25,
    question: "מהי React?",
    type: "multiple",
    correctAnswer: "React היא ספריית JavaScript לבניית ממשקי משתמש.",
    incorrectAnswers: [
      "React היא מערכת ניהול תוכן לאתרים.",
      "React היא שפה חדשה לפיתוח צד שרת.",
      "React היא תוסף לדפדפנים לייעול ביצועים.",
    ],
  },
  {
    id: 26,
    question: "מהו AJAX?",
    type: "multiple",
    correctAnswer: "AJAX הוא טכניקת פיתוח שמאפשרת לבצע בקשות HTTP אסינכרוניות.",
    incorrectAnswers: [
      "AJAX הוא פרוטוקול להעברת קבצים בין שרתים.",
      "AJAX הוא כלי ליצירת גרפים ותרשימים.",
      "AJAX הוא מסד נתונים מבוזר.",
    ],
  },
  {
    id: 27,
    question: "מהו 'responsive design'?",
    type: "multiple",
    correctAnswer: "עיצוב תגובתי שמסדר את התוכן לפי גודל המסך של המכשיר.",
    incorrectAnswers: [
      "עיצוב שמקנה לדף אתר אפקטים אנימטיביים.",
      "עיצוב שמתמקד בתוכן בלבד מבלי להתחשב במידות המסך.",
      "עיצוב שמתאים את התוכן רק למחשבים שולחניים.",
    ],
  },
  {
    id: 28,
    question: "מה התפקיד של 'Webpack'?",
    type: "multiple",
    correctAnswer:
      "Webpack הוא כלי בניית מודולים המאפשר קיבוץ של קבצים בפרויקט JavaScript.",
    incorrectAnswers: [
      "Webpack הוא שפה לפיתוח אפליקציות.",
      "Webpack הוא מסד נתונים לניהול גרסאות.",
      "Webpack הוא ניהול תלותים עבור סקריפטים בצד שרת.",
    ],
  },
  {
    id: 29,
    question: "מה ההבדל בין 'class' ל-'id' ב-CSS?",
    type: "multiple",
    correctAnswer:
      "class מאפשרת להחיל סגנונות על מספר אלמנטים, בעוד ש-id מיועדת לאלמנט אחד בלבד.",
    incorrectAnswers: [
      "class מיועדת רק לסגנון אלמנטים ב-JavaScript, ו-id ב-CSS.",
      "class ו-id הם תחליפים זהים ב-CSS.",
      "class משמשת לצורך מיון אלמנטים ו-id לשימוש בפונקציות JavaScript.",
    ],
  },
  {
    id: 30,
    question: "מה זה JSON?",
    type: "multiple",
    correctAnswer:
      "JSON הוא פורמט טקסטואלי לאחסון ולהעברת נתונים בצורה קריאה ומסודרת.",
    incorrectAnswers: [
      "JSON הוא פרוטוקול לתקשורת בין שרתים.",
      "JSON הוא שפת תכנות ליצירת אתרים.",
      "JSON הוא קובץ תמונה דחוס.",
    ],
  },
  {
    id: 31,
    question: "מה זה 'Bootstrap'?",
    type: "multiple",
    correctAnswer:
      "Bootstrap היא ספריית CSS ותוספים ליצירת עיצובים רספונסיביים ומהירים.",
    incorrectAnswers: [
      "Bootstrap היא שפה חדשה לפיתוח אפליקציות.",
      "Bootstrap היא מערכת ניהול תוכן לאתרים.",
      "Bootstrap היא כלי לניהול גרסאות קוד.",
    ],
  },

  {
    id: 33,
    question: "מה תפקיד ה-'package.json' בפרויקט Node.js?",
    type: "multiple",
    correctAnswer: "הקובץ מנהל את התלויות, הסקריפטים והמידע על הפרויקט.",
    incorrectAnswers: [
      "הקובץ מכיל את הקוד של הפרויקט.",
      "הקובץ משמש למעקב אחר שינויים בקוד.",
      "הקובץ נועד להגדיר את הגרסה של Node.js.",
    ],
  },
  {
    id: 34,
    question: "מה זה 'DOM'?",
    type: "multiple",
    correctAnswer:
      "DOM הוא מודל אובייקטים של המסמך שמייצג את מבנה ה-HTML של דף אינטרנט.",
    incorrectAnswers: [
      "DOM הוא פרוטוקול לתקשורת בין דפים.",
      "DOM הוא ספרייה לניהול קבצים.",
      "DOM הוא פורמט תמונה לאתרים.",
    ],
  },
  {
    id: 35,
    question: "מה עושה הפקודה 'git clone'?",
    type: "multiple",
    correctAnswer: "היא יוצרת עותק של מאגר Git מרוחק על מחשב מקומי.",
    incorrectAnswers: [
      "היא עוסקת במיזוג שינויים בין שני מאגרים.",
      "היא מחזירה את הקוד לגרסה קודמת.",
      "היא מקבעת את השינויים שנעשו במאגר.",
    ],
  },
  {
    id: 36,
    question: "מה תפקיד ה-'fetch' ב-JavaScript?",
    type: "multiple",
    correctAnswer: "הפקודה משמשת לשליחת בקשות HTTP ולקבלת תגובות מהשרת.",
    incorrectAnswers: [
      "הפקודה משמשת לניהול נתונים מקומיים בדפדפן.",
      "הפקודה נועדה לטעון קבצים מקומיים.",
      "הפקודה מבצעת סריקות של קוד JavaScript.",
    ],
  },
  {
    id: 37,
    question: "מה זה 'SASS'?",
    type: "multiple",
    correctAnswer:
      "SASS היא שפת סגנון שמביאה תכונות נוספות ל-CSS כמו משתנים ופונקציות.",
    incorrectAnswers: [
      "SASS היא מערכת לניהול נתונים במאגרי מידע.",
      "SASS היא ספריית JavaScript לניהול קבצים.",
      "SASS היא פריימוורק לפיתוח צד שרת.",
    ],
  },
  {
    id: 38,
    question: "מה עושה הפקודה 'npm run start'?",
    type: "multiple",
    correctAnswer:
      "הפקודה מריצה את הסקריפט המוגדר בשם 'start' בקובץ package.json.",
    incorrectAnswers: [
      "הפקודה מתקינה את כל התלויות המפורטות בקובץ package.json.",
      "הפקודה מעדכנת את גרסת ה-NPM לגרסה האחרונה.",
      "הפקודה משדרגת את Node.js לגרסה החדשה ביותר.",
    ],
  },
  {
    id: 39,
    question: "מהו AJAX וכיצד הוא משפר את חווית המשתמש באתרים?",
    type: "multiple",
    correctAnswer:
      "AJAX מאפשר טעינה של נתונים ברקע מבלי לרענן את כל הדף, מה שמשפר את חווית המשתמש.",
    incorrectAnswers: [
      "AJAX מציע שיפור ביצועים על ידי הצגת דפים חדשים מהשרת.",
      "AJAX משפר את הביצועים על ידי דחיסת תמונות בקוד HTML.",
      "AJAX מספק תמיכה בתכנים מולטימדיה באתר.",
    ],
  },
  {
    id: 40,
    question: "מהו ה-HTTP Status Code 404?",
    type: "multiple",
    correctAnswer: "קוד הסטטוס 404 מציין שדף או משאב לא נמצא בשרת.",
    incorrectAnswers: [
      "קוד הסטטוס 404 מציין שגיאה בביצוע הבקשה בשרת.",
      "קוד הסטטוס 404 מציין שהבקשה הושלמה בהצלחה.",
      "קוד הסטטוס 404 מציין שגיאה בנתוני המשתמש הנכנס.",
    ],
  },
  {
    id: 41,
    question: "מהו שימוש ה-'localStorage' ב-JavaScript?",
    type: "multiple",
    correctAnswer:
      "'localStorage' מאפשרת לאחסן נתונים בצורה מקומית בדפדפן, שנשמרת בין סשנים שונים.",
    incorrectAnswers: [
      "'localStorage' משמשת לשמירת קבצים גדולים בדפדפן.",
      "'localStorage' משמשת לניהול פרופילים של משתמשים.",
      "'localStorage' משמשת לשליחת נתונים לשרת.",
    ],
  },
  {
    id: 42,
    question: "מהי מטרת ה-'WebSocket'?",
    type: "multiple",
    correctAnswer:
      "'WebSocket' מאפשרת תקשורת דו-כיוונית בזמן אמת בין הלקוח לשרת.",
    incorrectAnswers: [
      "'WebSocket' משמשת להגדלת מהירות טעינת הדפים.",
      "'WebSocket' משמשת לניהול קבצים במערכת הקבצים של הדפדפן.",
      "'WebSocket' משמשת לטעינת נתונים בעיכוב מסוים.",
    ],
  },
  {
    id: 43,
    question: "מה זה 'Responsive Web Design'?",
    type: "multiple",
    correctAnswer:
      "Responsive Web Design עיצוב אתרים שמתאים את המראה לגודל המסך של המכשיר.",
    incorrectAnswers: [
      "Responsive Web Design עיצוב אתרים שמתמקד בתמונות בלבד.",
      "Responsive Web Design הוא טכניקת קידוד למנועי חיפוש.",
      "Responsive Web Design מתמקד ביצירת עיצובים סטטיים בלבד.",
    ],
  },
  {
    id: 44,
    question: "מהו 'CDN' וכיצד הוא משפר את ביצועי אתרי אינטרנט?",
    type: "multiple",
    correctAnswer:
      "CDN (Content Delivery Network) מפיץ תוכן דרך שרתים שונים ברחבי העולם, מה שמקטין את זמן הטעינה.",
    incorrectAnswers: [
      "CDN מספק אבטחת מידע נוספת לאתרים.",
      "CDN הוא פרוטוקול לטעינת תמונות באיכות גבוהה.",
      "CDN משפר את הביצועים על ידי אופטימיזציה של קוד JavaScript.",
    ],
  },
  {
    id: 45,
    question: "מה זה 'CSS Grid' ומה היתרון שלו?",
    type: "multiple",
    correctAnswer:
      "'CSS Grid' היא מערכת ליצירת פריסות רשת שמאפשרת עיצוב גמיש ומדויק יותר של דפי אינטרנט.",
    incorrectAnswers: [
      "'CSS Grid' היא ספריית JavaScript ליצירת תרשימים.",
      "'CSS Grid' היא שפה נפרדת לעיצוב אנימציות.",
      "'CSS Grid' משמשת לניהול של קבצים ברשת.",
    ],
  },
  {
    id: 46,
    question: "מהו 'RESTful API'?",
    type: "multiple",
    correctAnswer:
      "'RESTful API' הוא פרוטוקול לתקשורת בין שרתים ולקוחות בעזרת HTTP, תוך שימוש בשיטות GET, POST, PUT ו-DELETE.",
    incorrectAnswers: [
      "'RESTful API' הוא פרוטוקול לאחסון נתונים בקובץ JSON.",
      "'RESTful API' הוא שפת תכנות לפיתוח אתרי אינטרנט.",
      "'RESTful API' הוא כלי לניהול גרסאות של קוד.",
    ],
  },
  {
    id: 47,
    question: "מהו 'Single Page Application' (SPA)?",
    type: "multiple",
    correctAnswer:
      "SPA הוא יישום אינטרנטי שבו כל התוכן מוצג בדף יחיד, והניווט מתבצע באמצעות טעינה דינמית של תוכן.",
    incorrectAnswers: [
      "SPA הוא דף אינטרנט עם תוכן סטטי בלבד.",
      "SPA הוא מערכת ניהול תוכן לעיצוב אתרים.",
      "SPA הוא כלי לבדיקת ביצועי אתרי אינטרנט.",
    ],
  },
  {
    id: 48,
    question: "מהי הפונקציה של ה-'npm init'?",
    type: "multiple",
    correctAnswer:
      "'npm init' יוצר קובץ package.json חדש בפרויקט ומגדיר את המידע הבסיסי שלו.",
    incorrectAnswers: [
      "'npm init' מתקין את כל התלויות של הפרויקט.",
      "'npm init' מעדכן את הגרסה של Node.js.",
      "'npm init' מבצע בדיקות על קוד JavaScript.",
    ],
  },
  {
    id: 49,
    question: "מהו תפקיד ה-'HTML meta tags'?",
    type: "multiple",
    correctAnswer:
      "meta tags מספקים מידע על הדף כגון תיאור, מילות מפתח והגדרות נוספות לקטלוג ולשימוש בדפדפנים.",
    incorrectAnswers: [
      "meta tags נועדו לצורך עיצוב גרפי של הדף.",
      "meta tags הם חלק מקוד JavaScript לניהול דינמיקה.",
      "meta tags משמשים לטעינת קבצים חיצוניים.",
    ],
  },
  {
    id: 50,
    question: "מתי הושק ה-WWW (World Wide Web) לראשונה?",
    type: "multiple",
    correctAnswer: "ה-WWW הושק לראשונה בשנת 1991 על ידי טים ברנרס-לי.",
    incorrectAnswers: [
      "ה-WWW הושק בשנת 1989 על ידי טים ברנרס-לי.",
      "ה-WWW הושק בשנת 1995 על ידי מארק צוקרברג.",
      "ה-WWW הושק בשנת 2000 על ידי ביל גייטס.",
    ],
  },
  {
    id: 51,
    question: "מהי השפה הראשונה שפותחה במיוחד ליצירת דפי אינטרנט?",
    type: "multiple",
    correctAnswer: "HTML הייתה השפה הראשונה שפותחה במיוחד ליצירת דפי אינטרנט.",
    incorrectAnswers: [
      "CSS הייתה השפה הראשונה שפותחה ליצירת דפי אינטרנט.",
      "JavaScript הייתה השפה הראשונה שפותחה ליצירת דפי אינטרנט.",
      "PHP הייתה השפה הראשונה שפותחה ליצירת דפי אינטרנט.",
    ],
  },
  {
    id: 52,
    question: "מתי הוכרזה גרסת ה-HTML5 כתקן רשמי?",
    type: "multiple",
    correctAnswer: "HTML5 הוכרזה כתקן רשמי בשנת 2014.",
    incorrectAnswers: [
      "HTML5 הוכרזה כתקן רשמי בשנת 2008.",
      "HTML5 הוכרזה כתקן רשמי בשנת 2010.",
      "HTML5 הוכרזה כתקן רשמי בשנת 2016.",
    ],
  },
  {
    id: 53,
    question: "מי היה המפתח הראשי של הדפדפן הראשון, Mosaic?",
    type: "multiple",
    correctAnswer: "מרק אנדרסן היה המפתח הראשי של הדפדפן הראשון, Mosaic.",
    incorrectAnswers: [
      "טימ ברנרס-לי היה המפתח הראשי של הדפדפן הראשון, Mosaic.",
      "ביל גייטס היה המפתח הראשי של הדפדפן הראשון, Mosaic.",
      "לינוס טורוואלדס היה המפתח הראשי של הדפדפן הראשון, Mosaic.",
    ],
  },
  {
    id: 54,
    question: "מהו השם המקורי של JavaScript?",
    type: "multiple",
    correctAnswer: "השם המקורי של JavaScript היה 'Mocha' ולאחר מכן Livescript.",
    incorrectAnswers: [
      "השם המקורי של JavaScript היה 'JScript'.",
      "השם המקורי של JavaScript היה 'JavaLang'.",
      "השם המקורי של JavaScript היה 'ScriptLang'.",
    ],
  },
];

export default webDevQuestions;
