import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";

export const htmlLessons = {
  introduction: {
    title: "מה זה HTML?",
    intro: [
      "כל אתר מתחיל מתוכן שהדפדפן יודע להבין. HTML היא השפה שמתארת מה נמצא בדף: כותרת, פסקה, תמונה, קישור או טופס.",
      "HTML אינה שפת תכנות. אין בה תנאים או לולאות; היא שפת סימון שמעניקה לתוכן מבנה ומשמעות. העיצוב יגיע בהמשך מ־CSS וההתנהגות מ־JavaScript.",
    ],
    sections: [
      {
        title: "תגיות ואלמנטים",
        paragraphs: ["רוב האלמנטים נכתבים בעזרת תגית פתיחה, תוכן ותגית סגירה. שם התגית מסביר לדפדפן איזה תפקיד יש לתוכן."],
        code: `<h1>האתר הראשון שלי</h1>\n<p>כאן מתחיל התוכן.</p>`,
        language: "html",
      },
      {
        title: "מה הדפדפן עושה?",
        paragraphs: ["הדפדפן קורא את ה־HTML מלמעלה למטה ובונה ממנו עץ של אלמנטים. לכן מבנה מסודר עוזר גם לדפדפן, גם לקוראי מסך וגם לנו כמפתחים."],
        code: `<h2>התחביבים שלי</h2>\n<p>אני אוהב לצלם ולבשל.</p>`,
        language: "html",
        exercise: {
          id: "html-introduction-fill-tag-1",
          type: "fill_blank",
          prompt: "איזו תגית חסרה כדי ליצור פסקה?",
          code: `<___>ברוכים הבאים לאתר שלי</___>`,
          language: "html",
          options: [{ id: "p", label: "p" }, { id: "h1", label: "h1" }, { id: "img", label: "img" }],
          correctOptionId: "p",
          hint: "שם התגית מגיע מהמילה paragraph.",
          explanation: "התגית <p> מייצגת פסקה. משתמשים ב־<h1> לכותרת ראשית וב־<img> לתמונה.",
        },
      },
    ],
    next: { title: "מבנה מסמך", path: "/tutorials/html/document-structure" },
  },
  "document-structure": {
    title: "מבנה מסמך HTML",
    intro: [
      "דף HTML אמיתי זקוק למסגרת קבועה. המסגרת אומרת לדפדפן באיזה תקן להשתמש, היכן נמצא מידע על הדף והיכן נמצא התוכן שרואים.",
      "בהתחלה המבנה נראה מעט טקסי, אבל במהרה הוא יהפוך להרגל. כדאי להתחיל ממנו בכל קובץ חדש במקום לתקן מסמך חלקי מאוחר יותר.",
    ],
    sections: [
      { title: "השלד הבסיסי", paragraphs: ["DOCTYPE מודיע שמדובר ב־HTML מודרני. האלמנט html עוטף את כל המסמך, head מכיל מידע עבור הדפדפן ו־body מכיל את מה שיופיע בדף."], code: `<!doctype html>\n<html lang="he" dir="rtl">\n  <head>\n    <meta charset="UTF-8">\n    <title>האתר שלי</title>\n  </head>\n  <body>\n    <h1>שלום!</h1>\n  </body>\n</html>`, language: "html" },
      { title: "קינון והזחה", paragraphs: ["אלמנט שנמצא בתוך אלמנט אחר נקרא ילד שלו. הזחה אינה חובה לדפדפן, אך היא מראה מיד מה נמצא בתוך מה ומונעת תגיות סגירה במקום הלא נכון."], code: `<body>\n  <main>\n    <h1>הבלוג שלי</h1>\n    <p>פוסט ראשון בדרך.</p>\n  </main>\n</body>`, language: "html", exercise: { id: "html-document-structure-fill-body-1", type: "fill_blank", prompt: "איזו תגית עוטפת את התוכן שמוצג בחלון הדפדפן?", code: `<html lang="he">\n  <head><title>דוגמה</title></head>\n  <___><h1>שלום</h1></___>\n</html>`, language: "html", options: [{ id: "body", label: "body" }, { id: "head", label: "head" }, { id: "title", label: "title" }], correctOptionId: "body", hint: "חשבו על גוף המסמך.", explanation: "כל התוכן החזותי של הדף נמצא בתוך body. האלמנט head מיועד למידע על המסמך." } },
    ],
    next: { title: "טקסט וכותרות", path: "/tutorials/html/text-content" },
  },
  "text-content": {
    title: "טקסט וכותרות",
    intro: ["טקסט טוב מתחיל בהיררכיה ברורה. כותרות מחלקות את הדף לנושאים, ופסקאות מחלקות הסבר ארוך ליחידות שקל לקרוא.", "בחירת תגית לפי משמעות חשובה יותר מבחירתה לפי מראה. אפשר לשנות מראה ב־CSS, אבל המבנה הסמנטי נשאר שימושי למנועי חיפוש ולטכנולוגיות מסייעות."],
    sections: [
      { title: "כותרות ופסקאות", paragraphs: ["h1 היא הכותרת הראשית של העמוד. אחריה משתמשים ב־h2 לתת־נושאים וב־h3 לנושאים שבתוכם, בלי לדלג על רמות רק בגלל גודל הטקסט."], code: `<h1>מדריך לטיול בצפון</h1>\n<p>כל מה שכדאי להכין לפני היציאה.</p>\n\n<h2>ציוד מומלץ</h2>\n<p>מים, כובע ונעליים נוחות.</p>`, language: "html" },
      { title: "הדגשה עם משמעות", paragraphs: ["strong מסמנת חשיבות ו־em מסמנת הדגשה בקול. לעומתן, br רק שוברת שורה ואינה תחליף לפסקאות נפרדות."], code: `<p><strong>חשוב:</strong> המסלול נסגר בשעה 17:00.</p>\n<p>מומלץ להגיע <em>לפני</em> שעות העומס.</p>`, language: "html", exercise: { id: "html-text-fill-heading-1", type: "fill_blank", prompt: "איזו תגית מתאימה לכותרת הראשית של העמוד?", code: `<___>מתכונים קלים</___>\n<p>ארוחות שאפשר להכין בחצי שעה.</p>`, language: "html", options: [{ id: "h1", label: "h1" }, { id: "strong", label: "strong" }, { id: "p", label: "p" }], correctOptionId: "h1", hint: "לכל עמוד יש כותרת ראשית שמספרת מה הנושא שלו.", explanation: "h1 מגדירה את הכותרת הראשית. strong מדגישה קטע בתוך תוכן ו־p יוצרת פסקה." } },
    ],
    next: { title: "קישורים ונתיבים", path: "/tutorials/html/links-and-paths" },
  },
  "links-and-paths": {
    title: "קישורים ונתיבים",
    intro: ["קישורים מחברים בין עמודים והופכים אוסף קבצים לאתר שאפשר לנווט בו. אלמנט a עוטף טקסט או תוכן אחר, והמאפיין href מציין לאן לעבור.", "טקסט הקישור צריך לתאר את היעד. ניסוח כמו ״קראו את מדריך ההרשמה״ מועיל יותר מ״לחצו כאן״, במיוחד למי שמנווט בעזרת קורא מסך."],
    sections: [
      { title: "קישור חיצוני ופנימי", paragraphs: ["כתובת מלאה מתאימה לאתר אחר. נתיב יחסי מתאים לעמוד בתוך אותו אתר ונשאר תקין גם כשמעבירים את הפרויקט לדומיין חדש."], code: `<a href="https://developer.mozilla.org/">תיעוד MDN</a>\n<a href="about.html">אודות</a>\n<a href="pages/contact.html">יצירת קשר</a>`, language: "html" },
      { title: "קישור לחלק בעמוד", paragraphs: ["מזהה id נותן לאלמנט כתובת פנימית ייחודית. href שמתחיל ב־# גולל אל אותו אלמנט."], code: `<a href="#ingredients">דלגו למרכיבים</a>\n\n<h2 id="ingredients">מרכיבים</h2>\n<p>קמח, מים ושמרים.</p>`, language: "html", exercise: { id: "html-links-fill-href-1", type: "fill_blank", prompt: "איזה מאפיין חסר בקישור?", code: `<a ___="contact.html">דברו איתנו</a>`, language: "html", options: [{ id: "href", label: "href" }, { id: "src", label: "src" }, { id: "alt", label: "alt" }], correctOptionId: "href", hint: "המאפיין מחזיק את יעד הקישור.", explanation: "href מגדיר את הכתובת שאליה הקישור מוביל. src משמש בדרך כלל למשאב מוטמע כמו תמונה." } },
    ],
    next: { title: "תמונות", path: "/tutorials/html/images" },
  },
  images: {
    title: "תמונות וטקסט חלופי",
    intro: ["תמונה יכולה להסביר, להמחיש או ליצור אווירה. האלמנט img מציג קובץ תמונה בעזרת src, והוא אינו זקוק לתגית סגירה.", "התמונה עלולה לא להיטען, ולא כל משתמש רואה אותה. לכן alt מתאר את המידע שבתמונה ומאפשר לקורא מסך להעביר אותו למשתמש."],
    sections: [
      { title: "תמונה עם תיאור", paragraphs: ["כתבו תיאור קצר שמוסר את מטרת התמונה בהקשר הנוכחי. width ו־height עוזרים לדפדפן לשמור מראש מקום ולמנוע קפיצה של התוכן בזמן הטעינה."], code: `<img\n  src="images/bread.jpg"\n  alt="כיכר לחם מחמצת פרוסה על קרש"\n  width="640"\n  height="426"\n>`, language: "html" },
      { title: "תמונה עם כיתוב", paragraphs: ["figure מאגדת מדיה עם figcaption. בתמונה דקורטיבית שאין בה מידע משתמשים ב־alt ריק, כדי שקורא המסך ידלג עליה."], code: `<figure>\n  <img src="map.png" alt="מפת המסלול מהחניון לתצפית">\n  <figcaption>המסלול המסומן באורך 2 ק״מ.</figcaption>\n</figure>\n\n<img src="dots.svg" alt="">`, language: "html", exercise: { id: "html-images-fill-alt-1", type: "fill_blank", prompt: "איזה מאפיין מספק חלופה טקסטואלית לתמונה?", code: `<img src="team.jpg" ___="ארבעה חברי צוות במשרד">`, language: "html", options: [{ id: "alt", label: "alt" }, { id: "title", label: "title" }, { id: "href", label: "href" }], correctOptionId: "alt", hint: "שמו הוא קיצור של alternative text.", explanation: "alt מתאר את משמעות התמונה כאשר אי אפשר לראות אותה או כשהקובץ לא נטען." } },
    ],
    next: { title: "רשימות", path: "/tutorials/html/lists" },
  },
  lists: {
    title: "רשימות",
    intro: ["כאשר כמה פריטים שייכים יחד, רשימה מסבירה את הקשר ביניהם טוב יותר משורות טקסט נפרדות. HTML מציעה רשימה לא־מסודרת, רשימה ממוספרת ורשימת מונחים.", "כל פריט ברשימות ul ו־ol נעטף ב־li. בחירה לפי משמעות מאפשרת לדפדפן ולקורא מסך לדווח גם על סוג הרשימה וגם על מספר הפריטים."],
    sections: [
      { title: "סדר חשוב או לא?", paragraphs: ["ul מתאימה לאוסף שאין בו סדר מחייב. ol מתאימה לשלבים, דירוג או כל רצף שבו החלפת הסדר משנה את המשמעות."], code: `<h2>ציוד</h2>\n<ul>\n  <li>בקבוק מים</li>\n  <li>כובע</li>\n</ul>\n\n<h2>הכנה</h2>\n<ol>\n  <li>מחממים תנור</li>\n  <li>מערבבים את החומרים</li>\n</ol>`, language: "html" },
      { title: "רשימה מקוננת", paragraphs: ["אפשר לשים רשימה נוספת בתוך li. חשוב שהרשימה הפנימית תהיה ילדה של הפריט שהיא מפרטת, ולא אחות שלו."], code: `<ul>\n  <li>פיתוח אתרים\n    <ul>\n      <li>HTML</li>\n      <li>CSS</li>\n    </ul>\n  </li>\n</ul>`, language: "html", exercise: { id: "html-lists-predict-ordered-1", type: "predict_output", prompt: "איזו תגית יוצרת רשימה שבה סדר השלבים חשוב?", code: `<___>\n  <li>פותחים את הקובץ</li>\n  <li>שומרים את השינוי</li>\n</___>`, language: "html", options: [{ id: "ol", label: "ol" }, { id: "ul", label: "ul" }, { id: "p", label: "p" }], correctOptionId: "ol", hint: "Ordered list היא רשימה מסודרת.", explanation: "ol יוצרת רשימה ממוספרת ומבטאת סדר. ul מתאימה לפריטים שאין ביניהם סדר מחייב." } },
    ],
    next: { title: "מבנה סמנטי", path: "/tutorials/html/semantic-structure" },
  },
  "semantic-structure": {
    title: "מבנה סמנטי של עמוד",
    intro: ["עמוד שלם מורכב מאזורים בעלי תפקיד: ניווט, תוכן מרכזי, מאמר ותחתית. תגיות סמנטיות נותנות לתפקידים האלה שמות ברורים במקום לעטוף הכול ב־div.", "המבנה אינו משנה לבדו את העיצוב. הערך שלו הוא בהבנת הקוד, בניווט בעזרת טכנולוגיות מסייעות וביכולת של מנועי חיפוש לזהות את החלק המרכזי."],
    sections: [
      { title: "אבני הבניין", paragraphs: ["header מכילה פתיח, nav קישורי ניווט, main את התוכן הייחודי לעמוד ו־footer מידע מסכם. בדרך כלל יש main אחת בכל עמוד."], code: `<header>\n  <h1>המגזין</h1>\n  <nav aria-label="ניווט ראשי">...</nav>\n</header>\n<main>\n  <article>...</article>\n</main>\n<footer>© 2026 המגזין</footer>`, language: "html" },
      { title: "section או article?", paragraphs: ["article הוא תוכן שיכול לעמוד בפני עצמו, כמו פוסט או כרטיס חדשות. section מקבצת חלק בנושא מסוים ולרוב מתחילה בכותרת."], code: `<main>\n  <section>\n    <h2>חדשות אחרונות</h2>\n    <article>\n      <h3>הספרייה נפתחה</h3>\n      <p>שעות הפעילות החדשות...</p>\n    </article>\n  </section>\n</main>`, language: "html", exercise: { id: "html-semantic-fill-main-1", type: "fill_blank", prompt: "איזו תגית עוטפת את התוכן העיקרי והייחודי של העמוד?", code: `<header>...</header>\n<___>\n  <h1>הכתבה</h1>\n</___>\n<footer>...</footer>`, language: "html", options: [{ id: "main", label: "main" }, { id: "nav", label: "nav" }, { id: "footer", label: "footer" }], correctOptionId: "main", hint: "בדרך כלל יש ממנה אחת בעמוד.", explanation: "main מסמנת את התוכן המרכזי. header, nav ו־footer מתארות אזורי תמיכה אחרים." } },
    ],
    next: { title: "מאפיינים ומכלים", path: "/tutorials/html/attributes" },
  },
  attributes: {
    title: "מאפיינים, id ו־class",
    intro: ["מאפיינים מוסיפים מידע לאלמנט בתוך תגית הפתיחה. כבר פגשנו href, src ו־alt; כעת נשתמש במאפיינים כלליים שעובדים כמעט על כל אלמנט.", "class מיועד לקבוצה של אלמנטים ו־id מזהה אלמנט יחיד בעמוד. השמות אינם משנים את המראה בעצמם, אך מאפשרים ל־CSS ול־JavaScript למצוא את האלמנטים."],
    sections: [
      { title: "בחירת שם שימושי", paragraphs: ["שם שמתאר תפקיד, כמו product-card, נשאר ברור גם כשהצבע משתנה. אפשר להצמיד כמה classes לאותו אלמנט ולהפריד ביניהן ברווח."], code: `<article class="product-card featured">\n  <h2 id="product-title">מחברת</h2>\n  <p class="price">12 ₪</p>\n</article>`, language: "html" },
      { title: "div ו־span", paragraphs: ["כשאין תגית סמנטית מתאימה, div מקבצת אזור שלם ו־span עוטפת קטע קטן בתוך שורה. אין להשתמש בהן במקום אלמנט בעל משמעות רק מטעמי נוחות."], code: `<div class="notice">\n  <p>המשלוח יגיע בתוך <span class="days">3 ימים</span>.</p>\n</div>`, language: "html", exercise: { id: "html-attributes-fill-class-1", type: "fill_blank", prompt: "איזה מאפיין מתאים לסגנון משותף לכמה כרטיסים?", code: `<article ___="course-card">HTML</article>\n<article ___="course-card">CSS</article>`, language: "html", options: [{ id: "class", label: "class" }, { id: "id", label: "id" }, { id: "href", label: "href" }], correctOptionId: "class", hint: "id צריך להיות ייחודי, אבל כאן הקבוצה חוזרת.", explanation: "class מיועד לסיווג חוזר של כמה אלמנטים. id מזהה אלמנט יחיד בעמוד." } },
    ],
    next: { title: "טבלאות", path: "/tutorials/html/tables" },
  },
  tables: {
    title: "טבלאות נתונים",
    intro: ["טבלה מתאימה לנתונים שיש ביניהם קשר של שורות ועמודות, כמו מערכת שעות או מחירון. היא אינה כלי לסידור כללי של עמוד; לכך משתמשים ב־CSS.", "מבנה נכון מאפשר להבין איזה ערך שייך לאיזו כותרת. הדבר חשוב במיוחד במסך קטן ובקורא מסך, שבו אי אפשר תמיד לראות את כל הטבלה בבת אחת."],
    sections: [
      { title: "שורות, כותרות ותאים", paragraphs: ["table עוטפת את הטבלה, tr יוצרת שורה, th תא כותרת ו־td תא נתונים. caption נותנת לטבלה שם קצר וברור."], code: `<table>\n  <caption>שעות פתיחה</caption>\n  <tr>\n    <th scope="col">יום</th>\n    <th scope="col">שעות</th>\n  </tr>\n  <tr>\n    <td>ראשון</td>\n    <td>09:00–17:00</td>\n  </tr>\n</table>`, language: "html" },
      { title: "חלוקה לראש וגוף", paragraphs: ["thead ו־tbody מארגנות טבלה ארוכה בלי לשנות את הנתונים. scope מסביר אם th היא כותרת של עמודה או של שורה."], code: `<table>\n  <thead><tr><th scope="col">שם</th><th scope="col">ציון</th></tr></thead>\n  <tbody>\n    <tr><th scope="row">נועה</th><td>92</td></tr>\n    <tr><th scope="row">אורי</th><td>88</td></tr>\n  </tbody>\n</table>`, language: "html", exercise: { id: "html-tables-fill-cell-1", type: "fill_blank", prompt: "איזו תגית מתאימה לתא נתונים רגיל?", code: `<tr>\n  <th scope="row">HTML</th>\n  <___>12 שיעורים</___>\n</tr>`, language: "html", options: [{ id: "td", label: "td" }, { id: "tr", label: "tr" }, { id: "caption", label: "caption" }], correctOptionId: "td", hint: "Table data הוא תא שמחזיק ערך.", explanation: "td היא תא נתונים. tr עוטפת שורה שלמה ו־caption מתארת את הטבלה." } },
    ],
    next: { title: "טפסים בסיסיים", path: "/tutorials/html/forms" },
  },
  forms: {
    title: "טפסים בסיסיים",
    intro: ["טופס מאפשר למשתמש לשלוח מידע: חיפוש, הרשמה, משוב או הזמנה. form עוטפת את השדות ומגדירה לאן ובאיזו דרך יישלחו הנתונים.", "טופס טוב אינו רק אוסף תיבות. לכל שדה צריך להיות label ברור, סדר הגיוני וכפתור שמספר מה יקרה אחרי הלחיצה."],
    sections: [
      { title: "שדה ותווית", paragraphs: ["המאפיין for של label צריך להתאים ל־id של input. כך לחיצה על התווית ממקדת את השדה וקורא מסך יודע להקריא את שמו."], code: `<form action="/subscribe" method="post">\n  <label for="email">כתובת אימייל</label>\n  <input id="email" name="email" type="email">\n  <button type="submit">הרשמה</button>\n</form>`, language: "html" },
      { title: "למה name חשוב?", paragraphs: ["id מחבר את השדה לתווית; name הוא שם המפתח שנשלח לשרת. שדה ללא name יכול להופיע ולעבוד בדפדפן, אך הערך שלו לא ייכלל בשליחה רגילה."], code: `<label for="full-name">שם מלא</label>\n<input id="full-name" name="fullName" type="text">\n\n<label for="message">הודעה</label>\n<textarea id="message" name="message"></textarea>`, language: "html", exercise: { id: "html-forms-fill-for-1", type: "fill_blank", prompt: "איזה ערך צריך להיות ב־for כדי לחבר את התווית לשדה?", code: `<label for="___">סיסמה</label>\n<input id="password" name="password" type="password">`, language: "html", options: [{ id: "password", label: "password" }, { id: "name", label: "name" }, { id: "submit", label: "submit" }], correctOptionId: "password", hint: "הערך צריך להיות זהה ל־id של השדה.", explanation: "for=\"password\" מתחבר ל־id=\"password\". ההתאמה מאפשרת הפעלה נגישה של השדה דרך התווית." } },
    ],
    next: { title: "סוגי שדות", path: "/tutorials/html/form-controls" },
  },
  "form-controls": {
    title: "סוגי שדות ובחירה",
    intro: ["בחירת type מתאים נותנת למשתמש מקלדת נכונה במובייל ולעיתים גם בדיקה בסיסית. אימייל, מספר, תאריך וסיסמה אינם צריכים להיראות ולהתנהג בדיוק כמו טקסט רגיל.", "כאשר יש כמה אפשרויות, radio מתאימה לבחירה אחת ו־checkbox לבחירות עצמאיות. select מתאימה לרשימה סגורה וארוכה יחסית."],
    sections: [
      { title: "סוגי input נפוצים", paragraphs: ["הסוג מתאר את הנתון הצפוי. עדיין צריך לבדוק את המידע בשרת, מפני שבדיקות הדפדפן משפרות חוויה אך אינן מנגנון אבטחה."], code: `<input name="email" type="email">\n<input name="age" type="number" min="0">\n<input name="birthday" type="date">\n<input name="password" type="password">`, language: "html" },
      { title: "בחירה אחת או כמה", paragraphs: ["כפתורי radio באותה קבוצה חולקים name. לכל אפשרות נותנים value שיישלח כאשר היא מסומנת."], code: `<fieldset>\n  <legend>בחרו גודל</legend>\n  <label><input type="radio" name="size" value="s"> קטן</label>\n  <label><input type="radio" name="size" value="m"> בינוני</label>\n</fieldset>\n<label><input type="checkbox" name="updates"> שלחו לי עדכונים</label>`, language: "html", exercise: { id: "html-controls-predict-email-1", type: "predict_output", prompt: "איזה type יעזור להציג מקלדת אימייל ולבדוק מבנה בסיסי?", code: `<label for="contact">אימייל</label>\n<input id="contact" name="contact" type="___">`, language: "html", options: [{ id: "email", label: "email" }, { id: "text", label: "text" }, { id: "password", label: "password" }], correctOptionId: "email", hint: "לסוג השדה יש אותו שם כמו הנתון המבוקש.", explanation: "type=\"email\" מתאים לכתובת אימייל ומעניק התנהגות שימושית במיוחד במכשירים ניידים." } },
    ],
    next: { title: "אימות טפסים", path: "/tutorials/html/form-validation" },
  },
  "form-validation": {
    title: "אימות טפסים ברור ונגיש",
    intro: ["אימות עוזר למשתמש לתקן מידע חסר או לא תקין לפני השליחה. המטרה אינה להאשים אלא להסביר מה נדרש ואיך להתקדם.", "HTML מספקת כללים פשוטים כמו required, minlength, maxlength, min ו־max. הם קו ראשון נוח, אך השרת חייב לבדוק שוב כל קלט שמגיע אליו."],
    sections: [
      { title: "כללי אימות מובנים", paragraphs: ["required מסמן שדה חובה. כדאי לציין זאת גם בטקסט, כדי שהמשמעות לא תישען רק על צבע או על סימן חזותי."], code: `<label for="username">שם משתמש (חובה)</label>\n<input\n  id="username"\n  name="username"\n  required\n  minlength="3"\n  maxlength="20"\n>`, language: "html" },
      { title: "עזרה והודעות", paragraphs: ["טקסט עזרה צריך להיות סמוך לשדה. aria-describedby מחבר אותו לשדה, כך שקורא מסך יקריא גם את ההנחיה."], code: `<label for="code">קוד בן 6 ספרות</label>\n<input id="code" name="code" inputmode="numeric" pattern="[0-9]{6}" aria-describedby="code-help">\n<p id="code-help">לדוגמה: 123456</p>`, language: "html", exercise: { id: "html-validation-fill-required-1", type: "fill_blank", prompt: "איזה מאפיין מונע שליחה רגילה כשהשדה ריק?", code: `<input name="displayName" ___>`, language: "html", options: [{ id: "required", label: "required" }, { id: "checked", label: "checked" }, { id: "selected", label: "selected" }], correctOptionId: "required", hint: "שם המאפיין אומר שהערך נדרש.", explanation: "required מפעיל בדיקת חובה מובנית בדפדפן. עדיין צריך לבצע אימות נוסף בצד השרת." } },
    ],
    next: { title: "ה־head של העמוד", path: "/tutorials/html/head-metadata" },
  },
  "head-metadata": {
    title: "כותרת ומידע ב־head",
    intro: ["ה־head אינו מוצג כתוכן רגיל, אבל הוא משפיע על שם הלשונית, קידוד הטקסט, תצוגת המובייל ותיאור העמוד במנועי חיפוש.", "כדאי לכתוב את המידע הזה בתחילת העבודה. title מדויק ו־lang נכון משפרים ניווט, שיתוף ונגישות בלי לשנות את גוף העמוד."],
    sections: [
      { title: "הגדרות חיוניות", paragraphs: ["charset צריך להופיע מוקדם ומאפשר להציג עברית ותווים נוספים כראוי. viewport גורם לרוחב העמוד להתאים לרוחב המכשיר במקום להציג גרסה מוקטנת של אתר שולחני."], code: `<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>מתכונים מהירים | המטבח שלי</title>\n</head>`, language: "html" },
      { title: "תיאור וקישור ל־CSS", paragraphs: ["description מסכמת את העמוד בקצרה. link טוענת גיליון סגנונות חיצוני; היא אינה קישור שהמשתמש לוחץ עליו."], code: `<meta name="description" content="מתכונים פשוטים לארוחות של אמצע השבוע.">\n<link rel="stylesheet" href="styles.css">\n<link rel="icon" href="favicon.svg" type="image/svg+xml">`, language: "html", exercise: { id: "html-head-fill-viewport-1", type: "fill_blank", prompt: "איזו הגדרה עוזרת לעמוד להתאים לרוחב מסך נייד?", code: `<meta name="viewport" content="___">`, language: "html", options: [{ id: "device", label: "width=device-width, initial-scale=1" }, { id: "desktop", label: "width=1200" }, { id: "charset", label: "UTF-8" }], correctOptionId: "device", hint: "הרוחב צריך להגיע מרוחב המכשיר.", explanation: "width=device-width מתאים את אזור התצוגה למסך, ו־initial-scale=1 מתחיל ללא הגדלה או הקטנה." } },
    ],
    next: { title: "אודיו, וידאו והטמעה", path: "/tutorials/html/media" },
  },
  media: {
    title: "אודיו, וידאו והטמעה",
    intro: ["HTML יכולה להציג אודיו ווידאו בלי תוסף חיצוני. controls מספק כפתורי הפעלה נגישים של הדפדפן, ו־source מאפשר להציע יותר מפורמט אחד.", "מדיה עלולה לצרוך נתונים ולהפריע למשתמש. הימנעו מהפעלה אוטומטית עם קול, ספקו כתוביות לווידאו ותנו למשתמש שליטה."],
    sections: [
      { title: "וידאו עם כתוביות", paragraphs: ["poster מציגה תמונת פתיחה. track מחברת קובץ כתוביות; kind ו־srclang מתארים את תפקידו ואת שפתו."], code: `<video controls width="640" poster="lesson-cover.jpg">\n  <source src="lesson.mp4" type="video/mp4">\n  <track kind="captions" src="lesson-he.vtt" srclang="he" label="עברית" default>\n  הדפדפן אינו תומך בווידאו.\n</video>`, language: "html" },
      { title: "הטמעת עמוד חיצוני", paragraphs: ["iframe מציגה עמוד אחר בתוך העמוד שלנו. title תמציתי מסביר מה נמצא במסגרת. יש להטמיע רק שירות מהימן ורק כאשר ההטמעה באמת מועילה."], code: `<iframe\n  src="https://www.youtube.com/embed/VIDEO_ID"\n  title="הדגמה של מבנה מסמך HTML"\n  loading="lazy"\n  allowfullscreen\n></iframe>`, language: "html", exercise: { id: "html-media-fill-controls-1", type: "fill_blank", prompt: "איזה מאפיין מציג למשתמש כפתורי הפעלה ועוצמת קול?", code: `<audio ___>\n  <source src="intro.mp3" type="audio/mpeg">\n</audio>`, language: "html", options: [{ id: "controls", label: "controls" }, { id: "autoplay", label: "autoplay" }, { id: "poster", label: "poster" }], correctOptionId: "controls", hint: "המטרה היא לתת את השליטה למשתמש.", explanation: "controls מציג את ממשק הנגן המובנה. autoplay עלול להתחיל מדיה בלי שביקשו, ו־poster שייך לווידאו." } },
    ],
    next: { title: "עמוד שלם ונגיש", path: "/tutorials/html/accessibility" },
  },
  accessibility: {
    title: "בונים עמוד שלם ונגיש",
    intro: ["נגישות אינה שכבה שמוסיפים בסוף. היא תוצאה של החלטות קטנות שכבר למדנו: שפה נכונה, כותרות בסדר הגיוני, אלמנטים סמנטיים, תוויות וטקסט חלופי.", "הכלל הפשוט הוא להתחיל ב־HTML הנכון לתפקיד. אלמנט מובנה כמו button מגיע עם מקלדת, מיקוד ומשמעות, בעוד div שנראה כמו כפתור דורש לשחזר את כל ההתנהגות בעצמנו."],
    sections: [
      { title: "דף קטן ושלם", paragraphs: ["בדוגמה הבאה יש שלד תקין, קישור דילוג, ניווט, תוכן מרכזי וטופס בעל תווית. זה בסיס שאפשר לעצב בלי לאבד את המבנה."], code: `<!doctype html>\n<html lang="he" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>הספרייה השכונתית</title>\n</head>\n<body>\n  <a href="#content">דלגו לתוכן</a>\n  <header>\n    <nav aria-label="ניווט ראשי"><a href="index.html">בית</a></nav>\n  </header>\n  <main id="content">\n    <h1>הספרייה השכונתית</h1>\n    <p>ספרים, מפגשים וסדנאות לכל הגילים.</p>\n  </main>\n</body>\n</html>`, language: "html" },
      { title: "בדיקה לפני פרסום", paragraphs: ["עברו על הדף רק עם מקלדת, הגדילו את הטקסט ובדקו במסך צר. ודאו שיש כותרת עמוד ברורה, focus נראה, alt שימושי לכל תמונת מידע ו־label לכל שדה."], code: `<form action="/search" method="get">\n  <label for="query">חיפוש בספרייה</label>\n  <input id="query" name="q" type="search">\n  <button type="submit">חיפוש</button>\n</form>`, language: "html", exercise: { id: "html-accessibility-predict-button-1", type: "predict_output", prompt: "איזה אלמנט מתאים לפעולה ששולחת טופס?", code: `<form>\n  <input name="query" type="search">\n  <___ type="submit">חיפוש</___>\n</form>`, language: "html", options: [{ id: "button", label: "button" }, { id: "div", label: "div" }, { id: "span", label: "span" }], correctOptionId: "button", hint: "בחרו באלמנט שמגיע עם התנהגות מקלדת ומשמעות מובנות.", explanation: "button הוא כפתור אמיתי ונגיש כברירת מחדל. div ו־span אינם פעולות אינטראקטיביות." } },
      { title: "לאן ממשיכים?", paragraphs: ["כעת יש לכם בסיס HTML מלא. הצעד הטבעי הבא הוא CSS לעיצוב רספונסיבי, ולאחריו JavaScript להתנהגות—תוך שמירה על המסמך הסמנטי שבניתם."] },
    ],
  },
} satisfies Record<string, TutorialLessonContent>;

export type HtmlLessonKey = keyof typeof htmlLessons;
