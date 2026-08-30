import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";

export const cssLessons = {
  introduction: {
    title: "מה זה CSS?",
    intro: [
      "HTML מתאר מה נמצא בדף; CSS קובעת איך התוכן נראה ומסתדר. בעזרתה שולטים בצבעים, spacing, גודל טקסט, layout והתאמה למסכים שונים.",
      "CSS אינה מחליפה מבנה HTML נכון. מתחילים ממסמך ברור ונגיש, ואז מוסיפים שכבת עיצוב שאפשר לשנות בלי לכתוב מחדש את התוכן.",
    ],
    sections: [
      { title: "CSS rule ראשון", paragraphs: ["CSS rule מורכב מ־selector שבוחר אלמנטים ומבלוק של declarations. בכל declaration יש property, נקודתיים, value ונקודה־פסיק."], code: `h1 {\n  color: #0f766e;\n  font-size: 2rem;\n}`, language: "css" },
      { title: "חיבור stylesheet", paragraphs: ["מקובל לשמור CSS ב־stylesheet נפרד ולטעון אותו מתוך head. כך כמה עמודים יכולים להשתמש באותו עיצוב וה־HTML נשאר קריא."], code: `/* styles.css */\nbody {\n  background-color: #f8fafc;\n  color: #1e293b;\n}\n\n/* בתוך <head> */\n/* <link rel="stylesheet" href="styles.css"> */`, language: "css", exercise: { id: "css-introduction-fill-property-1", type: "fill_blank", prompt: "איזה property משנה את צבע הטקסט?", code: `p {\n  ___: #334155;\n}`, language: "css", options: [{ id: "color", label: "color" }, { id: "background", label: "background" }, { id: "width", label: "width" }], correctOptionId: "color", hint: "שם ה־property מתאר ישירות את צבע התוכן.", explanation: "color משנה את צבע הטקסט. background משנה את הרקע ו־width את הרוחב." } },
      {
        title: "תרגול מהיר",
        exercises: [
          {
            id: "css-introduction-select-responsive-1",
            type: "select_multiple",
            prompt: "אילו declarations עוזרות ל־component להתאים למסך צר?",
            code: `.card {\n  width: 100%;\n  max-width: 40rem;\n  min-width: 900px;\n}`,
            language: "css",
            options: [
              { id: "width", label: "width: 100%" },
              { id: "max", label: "max-width: 40rem" },
              { id: "min", label: "min-width: 900px" },
            ],
            correctOptionIds: ["width", "max"],
            hint: "חפשו values שמאפשרות לרוחב להתכווץ ומגבילות רק את הגודל המרבי.",
            explanation: "width: 100% מאפשרת לכרטיס להתכווץ ו־max-width מגבילה אותו במסך רחב. min-width: 900px עלולה ליצור גלילה אופקית.",
          },
          {
            id: "css-introduction-match-properties-1",
            type: "match_pairs",
            prompt: "התאימו כל property להשפעה שלה.",
            leftItems: [
              { id: "color", label: "color" },
              { id: "padding", label: "padding" },
              { id: "margin", label: "margin" },
            ],
            rightItems: [
              { id: "outside", label: "spacing חיצוני" },
              { id: "text", label: "צבע הטקסט" },
              { id: "inside", label: "spacing פנימי" },
            ],
            correctMatches: ["color:text", "padding:inside", "margin:outside"],
            hint: "padding נמצאת בתוך ה־border; margin נמצאת מחוץ לו.",
            explanation: "color קובעת את צבע הטקסט, padding מוסיפה spacing בתוך ה־border ו־margin מוסיפה spacing מחוץ לו.",
          },
        ],
      },
    ],
    next: { title: "Cascade", path: "/tutorials/css/cascade" },
  },
  cascade: {
    title: "Cascade ו־Inheritance",
    intro: ["לעיתים כמה כללים מנסים לעצב את אותו אלמנט. ה־Cascade היא מערכת ההחלטות שבוחרת איזה value ינצח לפי מקור הכלל, חשיבות, specificity וסדר.", "ב־Inheritance, properties כמו color ו־font-family עוברים מה־parent לילדים. properties של layout, כמו margin ו־width, אינם עוברים בדרך כלל כי לכל אלמנט נדרש מבנה משלו."],
    sections: [
      { title: "כאשר ה־specificity זהה", paragraphs: ["אם לשני selectors יש אותה specificity והם מגדירים את אותו property, הכלל שמופיע מאוחר יותר מנצח. כדאי לנצל זאת במודע ולא לצבור תיקונים אקראיים בסוף הקובץ."], code: `p { color: navy; }\np { color: teal; }\n\n/* הפסקה תהיה בצבע teal */`, language: "css" },
      { title: "Inheritance ו־value מפורש", paragraphs: ["הילדים יורשים את color של ה־body, אלא אם CSS rule ממוקד יותר נותן להם צבע אחר. ה־value inherit מבקש Inheritance במפורש ו־initial מחזיר לברירת המחדל של ה־property."], code: `body { color: #334155; }\n.notice { color: #b91c1c; }\n.notice a { color: inherit; }`, language: "css", exercise: { id: "css-cascade-predict-order-1", type: "predict_output", prompt: "איזה צבע יחול על הפסקה?", code: `p { color: blue; }\np { color: green; }`, language: "css", options: [{ id: "green", label: "ירוק" }, { id: "blue", label: "כחול" }, { id: "both", label: "שני הצבעים" }], correctOptionId: "green", hint: "לשני ה־selectors יש אותה specificity; בדקו מי מופיע אחרון.", explanation: "כאשר ה־specificity זהה, ה־declaration המאוחרת יותר מנצחת ולכן הצבע יהיה ירוק." } },
    ],
    next: { title: "Selectors", path: "/tutorials/css/selectors" },
  },
  selectors: {
    title: "Selectors מדויקים",
    intro: ["Selector קובע אילו אלמנטים יקבלו את הכלל. selector טוב מבטא קבוצה או קשר ברור, בלי להיות תלוי מדי במבנה פנימי שעלול להשתנות.", "class היא הבחירה הנפוצה לעיצוב component. type selector מתאים לכלל בסיסי רחב, ו־id נשמר בדרך כלל לזיהוי ייחודי ולא כבסיס לעיצוב."],
    sections: [
      { title: "תגית, class וקשר", paragraphs: ["נקודה בוחרת class. רווח בוחר צאצאים בכל עומק, והסימן > בוחר ילדים ישירים בלבד."], code: `p { line-height: 1.7; }\n.card { border-radius: 12px; }\n.card a { color: teal; }\n.card > h2 { margin-top: 0; }`, language: "css" },
      { title: "Attribute selectors ושילובים", paragraphs: ["Attribute selector שימושי למצבים שה־HTML כבר מתאר, למשל סוג שדה. שילוב של classes מאפשר variations קטנות בלי לשכפל component שלם."], code: `input[type="email"] { direction: ltr; }\n.button.primary { background: #0f766e; }\n.button.secondary { background: transparent; }`, language: "css", exercise: { id: "css-selectors-fill-class-1", type: "fill_blank", prompt: "איזה selector בוחר אלמנטים עם class בשם card?", code: `___card {\n  padding: 1rem;\n}`, language: "css", options: [{ id: "dot", label: "." }, { id: "hash", label: "#" }, { id: "star", label: "*" }], correctOptionId: "dot", hint: "class מתחילה בנקודה ב־CSS selector.", explanation: ".card בוחר class. הסימן # בוחר id והכוכבית בוחרת את כל האלמנטים." } },
    ],
    next: { title: "Box Model", path: "/tutorials/css/box-model" },
  },
  "box-model": {
    title: "Box Model",
    intro: ["כל אלמנט מצויר כקופסה: תוכן במרכז, padding סביבו, border מסביב ל־padding ו־margin שמרחיק אותו מקופסאות אחרות.", "הבנת השכבות האלה פותרת את רוב תעלומות הריווח. padding מגדיל את השטח הפנימי והלחיץ; margin יוצר מרחק חיצוני ואינו חלק מהרקע."],
    sections: [
      { title: "padding ו־margin", paragraphs: ["אפשר לתת value לכל הצדדים, לציר אנכי ואופקי, או לכל צד בנפרד. Logical properties עם inline ו־block עובדים טוב גם בכיוון כתיבה RTL."], code: `.card {\n  padding: 1rem 1.25rem;\n  margin-block: 1.5rem;\n  border: 1px solid #cbd5e1;\n}`, language: "css" },
      { title: "box-sizing צפוי", paragraphs: ["ברירת המחדל מוסיפה padding ו־border לרוחב שהגדרנו. border-box כולל אותם בתוך width ולכן מקל מאוד על חישובי layout."], code: `*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n.panel {\n  width: 100%;\n  padding: 24px;\n}`, language: "css", exercise: { id: "css-box-model-fill-padding-1", type: "fill_blank", prompt: "איזה property יוצר רווח בין התוכן ל־border?", code: `.button {\n  ___: 0.75rem 1rem;\n  border: 1px solid teal;\n}`, language: "css", options: [{ id: "padding", label: "padding" }, { id: "margin", label: "margin" }, { id: "gap", label: "gap" }], correctOptionId: "padding", hint: "הרווח המבוקש נמצא בתוך ה־Box Model.", explanation: "padding יוצר spacing פנימי בין התוכן ל־border. margin נמצא מחוץ ל־border." } },
    ],
    next: { title: "טיפוגרפיה", path: "/tutorials/css/typography" },
  },
  typography: {
    title: "טיפוגרפיה קריאה",
    intro: ["טיפוגרפיה טובה עוזרת לקורא להבין סדר ולהישאר מרוכז. משפחת גופן, גודל, עובי, גובה שורה ואורך שורה פועלים יחד; שינוי קיצוני באחד מהם פוגע בשאר.", "טקסט גוף צריך להישאר נוח להגדלה. לכן מעדיפים rem לגדלים, גובה שורה נדיב וניגודיות מספקת במקום להסתמך על טקסט קטן כדי להכניס יותר למסך."],
    sections: [
      { title: "בסיס עקבי", paragraphs: ["רשימת גופנים כוללת חלופות למקרה שהגופן הראשון לא נטען. line-height ללא יחידה גדלה יחד עם הטקסט ושומרת על קצב קריא."], code: `body {\n  font-family: "Heebo", Arial, sans-serif;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n\nh1 { font-size: 2rem; line-height: 1.2; }`, language: "css" },
      { title: "אורך שורה ויישור", paragraphs: ["שורות ארוכות מדי קשות למעקב. max-inline-size מגבילה את רוחב הטקסט בלי לקבוע רוחב קשיח, ו־text-align: start מכבד גם RTL וגם LTR."], code: `.article {\n  max-inline-size: 65ch;\n  margin-inline: auto;\n}\n\np { text-align: start; }`, language: "css", exercise: { id: "css-typography-fill-line-height-1", type: "fill_blank", prompt: "איזה property מגדיל את המרווח בין שורות טקסט?", code: `p {\n  ___: 1.7;\n}`, language: "css", options: [{ id: "line-height", label: "line-height" }, { id: "letter-spacing", label: "letter-spacing" }, { id: "font-weight", label: "font-weight" }], correctOptionId: "line-height", hint: "ה־property מתייחס לגובה של כל שורה.", explanation: "line-height קובעת את גובה השורה וכך את המרווח האנכי בין שורות סמוכות." } },
    ],
    next: { title: "צבעים ורקעים", path: "/tutorials/css/colors-backgrounds" },
  },
  "colors-backgrounds": {
    title: "צבעים, רקעים וצללים",
    intro: ["צבע יוצר היררכיה ואופי, אבל אסור שיהיה הדרך היחידה להעביר מידע. טקסט ורקע צריכים ניגודיות טובה, ומצב שגיאה צריך לכלול גם הודעה או סמל.", "אפשר לכתוב צבעים ב־hex, ב־rgb או ב־hsl. משתני CSS עוזרים לתת לצבעים שמות תפקידיים ולשמור על עקביות בכל האתר."],
    sections: [
      { title: "פלטת צבעים חוזרת", paragraphs: ["משתנים שמוגדרים ב־:root זמינים בכל המסמך. שם כמו --color-primary מתאר תפקיד וקל יותר לשנות אותו משם שמקובע לגוון מסוים."], code: `:root {\n  --color-primary: #0f766e;\n  --color-surface: #ffffff;\n  --color-text: #1e293b;\n}\n\n.card {\n  color: var(--color-text);\n  background-color: var(--color-surface);\n}`, language: "css" },
      { title: "עומק עדין", paragraphs: ["gradient ו־box-shadow יכולים להפריד אזורים, אך שימוש כבד יוצר עומס. צל רך ורדיוס עקבי בדרך כלל מספיקים לכרטיס."], code: `.hero { background: linear-gradient(135deg, #0f766e, #0891b2); }\n.card {\n  border-radius: 1rem;\n  box-shadow: 0 8px 24px rgb(15 23 42 / 0.12);\n}`, language: "css", exercise: { id: "css-colors-fill-variable-1", type: "fill_blank", prompt: "איך משתמשים במשתנה CSS בשם --color-primary?", code: `.button {\n  background-color: ___;\n}`, language: "css", options: [{ id: "var", label: "var(--color-primary)" }, { id: "name", label: "--color-primary" }, { id: "hash", label: "#color-primary" }], correctOptionId: "var", hint: "קוראים למשתנה בעזרת פונקציה מובנית.", explanation: "התחביר var(--color-primary) מחזיר את ערך המשתנה. אפשר גם לספק ערך חלופי כארגומנט שני." } },
    ],
    next: { title: "יחידות וגודל", path: "/tutorials/css/units-sizing" },
  },
  "units-sizing": {
    title: "יחידות וגודל גמיש",
    intro: ["יחידה קובעת למה המספר מתייחס. px מתאימה לפרטים קטנים ומדויקים, rem קשורה לגודל הטקסט הראשי, אחוזים קשורים להורה ו־vw או vh קשורות למסך.", "Responsive Design מעדיף גבולות גמישים על מספרים קשיחים. width: 100% עם max-width מאפשרת ל־component להתכווץ במסך קטן בלי להימתח מדי במסך רחב."],
    sections: [
      { title: "Component שלא חורג", paragraphs: ["max-width מגבילה את הגבול העליון ו־margin-inline: auto ממרכזת את ה־container. padding שומר מרווח בצדדים גם כשהמסך צר."], code: `.container {\n  width: 100%;\n  max-width: 72rem;\n  margin-inline: auto;\n  padding-inline: 1rem;\n}`, language: "css" },
      { title: "min, max ו־clamp", paragraphs: ["clamp בוחרת ערך גמיש בתוך minimum ו־maximum. היא שימושית לכותרת שגדלה עם המסך אך נשארת קריאה בשני הקצוות."], code: `h1 {\n  font-size: clamp(2rem, 5vw, 4rem);\n}\n\nimg {\n  max-width: 100%;\n  height: auto;\n}`, language: "css", exercise: { id: "css-units-fill-max-width-1", type: "fill_blank", prompt: "איזה כלל מונע מתמונה להיות רחבה מה־container שלה?", code: `img {\n  ___: 100%;\n  height: auto;\n}`, language: "css", options: [{ id: "max-width", label: "max-width" }, { id: "min-width", label: "min-width" }, { id: "position", label: "position" }], correctOptionId: "max-width", hint: "אנו קובעים גבול עליון לרוחב.", explanation: "max-width: 100% מאפשרת לתמונה להצטמצם עם ה־container, אך אינה מגדילה תמונה קטנה מעבר לגודלה הטבעי." } },
    ],
    next: { title: "תצוגה ומיקום", path: "/tutorials/css/display-positioning" },
  },
  "display-positioning": {
    title: "display ומיקום",
    intro: ["display קובעת כיצד אלמנט משתתף ב־layout. block תופס שורה, inline זורם בתוך טקסט, ו־inline-block משלב זרימה בשורה עם אפשרות לתת גודל ו־spacing מלאים.", "position מוציאה component חלקית מה־document flow. משתמשים בה כשיש קשר מיקום אמיתי—למשל badge על כרטיס—ולא כדי לתקן layout שאמור להיבנות ב־Flexbox או Grid."],
    sections: [
      { title: "סוגי תצוגה", paragraphs: ["none מסירה רכיב גם מהתצוגה וגם מעץ הנגישות. אם התוכן צריך להישאר לקורא מסך, נדרשת טכניקה ייעודית ולא display: none."], code: `.nav-link { display: inline-block; padding: 0.5rem; }\n.mobile-only { display: none; }\n.card { display: block; }`, language: "css" },
      { title: "relative ו־absolute", paragraphs: ["אלמנט absolute ממוקם ביחס ל־positioned ancestor הקרוב ביותר. לכן נותנים לכרטיס position: relative ואז מצמידים אליו badge בלי להזיז את שאר התוכן."], code: `.card { position: relative; }\n.badge {\n  position: absolute;\n  inset-block-start: 0.75rem;\n  inset-inline-end: 0.75rem;\n}`, language: "css", exercise: { id: "css-display-fill-relative-1", type: "fill_blank", prompt: "איזה position נותנים לכרטיס כדי ש־absolute יתמקם ביחס אליו?", code: `.card { position: ___; }\n.badge { position: absolute; }`, language: "css", options: [{ id: "relative", label: "relative" }, { id: "fixed", label: "fixed" }, { id: "static", label: "static" }], correctOptionId: "relative", hint: "הערך שומר את הכרטיס ב־document flow והופך אותו לעוגן מיקום.", explanation: "position: relative אינו מזיז את הכרטיס בפני עצמו, אך הופך אותו ל־positioning container של צאצא absolute." } },
    ],
    next: { title: "Flexbox", path: "/tutorials/css/flexbox" },
  },
  flexbox: {
    title: "Layout עם Flexbox",
    intro: ["Flexbox מסדרת פריטים לאורך ציר מרכזי אחד—שורה או עמודה. היא מצוינת לניווט, קבוצת כפתורים, כרטיס עם אייקון וטקסט או יישור אנכי.", "ההורה הופך ל־flex container והילדים הישירים הופכים ל־flex items. רוב החלטות ה־layout, כמו כיוון, gap ויישור, נכתבות על ההורה."],
    sections: [
      { title: "Main axis ו־cross axis", paragraphs: ["justify-content פועלת לאורך ה־main axis ו־align-items לאורך ה־cross axis. ה־property gap מוסיף רווח רק בין ה־items ונוח יותר מ־margin על כל item."], code: `.actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}`, language: "css" },
      { title: "Wrapping וגמישות", paragraphs: ["flex-wrap מאפשרת ל־items לעבור שורה. flex: 1 1 16rem אומר שכרטיס יכול לגדול, להתכווץ ומתחיל מ־flex-basis של 16rem."], code: `.cards {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.cards > article { flex: 1 1 16rem; }`, language: "css", exercise: { id: "css-flexbox-fill-gap-1", type: "fill_blank", prompt: "איזה property יוצר רווח אחיד בין Flex items?", code: `.toolbar {\n  display: flex;\n  ___: 0.75rem;\n}`, language: "css", options: [{ id: "gap", label: "gap" }, { id: "padding", label: "padding" }, { id: "border", label: "border" }], correctOptionId: "gap", hint: "ה־property עובד בין ה־items ב־layout.", explanation: "gap יוצר רווח בין ה־items בלי להוסיף רווח בקצוות החיצוניים של ה־container." } },
    ],
    next: { title: "CSS Grid", path: "/tutorials/css/grid" },
  },
  grid: {
    title: "Layout עם CSS Grid",
    intro: ["Grid מתאימה ל־layout בשני צירים: rows ו־columns יחד. היא שימושית לגלריה, לוח נתונים או מבנה עמוד שבו אזורים צריכים להתיישר זה מול זה.", "אין תחרות בין Grid ל־Flexbox. Grid מצוינת למבנה הרחב; Flexbox מצוינת ליישור תוכן בתוך כל אזור. לעיתים משתמשים בשתיהן באותו component."],
    sections: [
      { title: "עמודות חוזרות", paragraphs: ["repeat חוסכת חזרה ו־fr מחלקת את המקום הפנוי. minmax עם auto-fit יוצרת רשת שמוסיפה או מורידה עמודות לפי הרוחב הזמין."], code: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));\n  gap: 1rem;\n}`, language: "css" },
      { title: "Named areas", paragraphs: ["grid-template-areas מאפשרת לשרטט את מבנה העמוד בצורה קריאה. כל component מקבל את שם ה־area שאליו הוא שייך."], code: `.page {\n  display: grid;\n  grid-template-columns: 16rem 1fr;\n  grid-template-areas: "sidebar content";\n}\n.sidebar { grid-area: sidebar; }\n.content { grid-area: content; }`, language: "css", exercise: { id: "css-grid-fill-display-1", type: "fill_blank", prompt: "איזה value מפעיל Grid על ה־container?", code: `.gallery {\n  display: ___;\n  grid-template-columns: repeat(3, 1fr);\n}`, language: "css", options: [{ id: "grid", label: "grid" }, { id: "block", label: "block" }, { id: "absolute", label: "absolute" }], correctOptionId: "grid", hint: "שם ה־value זהה לשם שיטת ה־layout.", explanation: "display: grid הופך את האלמנט ל־Grid container ואת ילדיו הישירים ל־Grid items." } },
    ],
    next: { title: "Responsive Design", path: "/tutorials/css/responsive-design" },
  },
  "responsive-design": {
    title: "Responsive Design",
    intro: ["Responsive design מתאים את התוכן למרחב הזמין במקום לבנות אתר נפרד לכל מכשיר. מתחילים במסך צר, שבו ההחלטות החשובות ברורות, ומרחיבים כאשר יש מקום.", "Breakpoint צריך להגיע מהמקום שבו התוכן כבר אינו נוח—not משם של דגם טלפון. לפני media query, כדאי לבדוק אם יחידות גמישות, wrap או Grid אוטומטית כבר פותרות את הבעיה."],
    sections: [
      { title: "Mobile first", paragraphs: ["הכלל הבסיסי מתאים למסך צר. media query עם min-width מוסיפה שינוי רק כאשר יש מספיק מקום, ולכן מספר החריגים נשאר קטן."], code: `.layout { display: block; }\n\n@media (min-width: 48rem) {\n  .layout {\n    display: grid;\n    grid-template-columns: 18rem 1fr;\n    gap: 2rem;\n  }\n}`, language: "css" },
      { title: "Fluid layout", paragraphs: ["Components צריכים להתכווץ בלי horizontal scrolling. תמונות גמישות, טקסט שאינו זעיר ו־container עם padding קבוע יוצרים בסיס טוב לטווח רחב של מסכים."], code: `.page {\n  width: min(100% - 2rem, 70rem);\n  margin-inline: auto;\n}\nimg, video { max-width: 100%; height: auto; }`, language: "css", exercise: { id: "css-responsive-fill-media-1", type: "fill_blank", prompt: "איזה תנאי מפעיל עיצוב החל מרוחב 48rem ומעלה?", code: `@media (___: 48rem) {\n  .nav { display: flex; }\n}`, language: "css", options: [{ id: "min", label: "min-width" }, { id: "max", label: "max-height" }, { id: "width", label: "width" }], correctOptionId: "min", hint: "Mobile first מוסיף שינויים כשהרוחב מגיע לסף המינימלי.", explanation: "min-width מפעיל את הכללים ברוחב 48rem ומעלה ומשאיר את ברירת המחדל למסכים צרים." } },
    ],
    next: { title: "Pseudo-classes ו־pseudo-elements", path: "/tutorials/css/pseudo-classes" },
  },
  "pseudo-classes": {
    title: "Pseudo-classes ו־pseudo-elements",
    intro: ["Pseudo-class בוחרת state כמו hover, focus או checked. pseudo-element בוחרת חלק וירטואלי כמו ::before, בלי להוסיף אלמנט חדש ל־HTML.", "ה־hover state אינו מספיק, כי במסך מגע אין סמן ומקלדת משתמשת ב־focus. כל פעולה צריכה feedback ברור גם ב־focus-visible, והמידע עצמו לא צריך להתקיים רק באפקט חזותי."],
    sections: [
      { title: "משוב לפעולה", paragraphs: ["focus-visible מציגה טבעת כאשר היא מועילה למשתמש מקלדת. אין להסיר outline בלי לספק חלופה בולטת לפחות באותה מידה."], code: `.button:hover { background: #115e59; }\n.button:focus-visible {\n  outline: 3px solid #22d3ee;\n  outline-offset: 3px;\n}\n.button:disabled { opacity: 0.55; }`, language: "css" },
      { title: "תוכן דקורטיבי", paragraphs: ["::before ו־::after מתאימים לקישוט שלא מוסר מידע חיוני. content נדרש כדי ליצור את ה־pseudo-elements, גם אם הערך ריק."], code: `.external-link::after {\n  content: " ↗";\n}\n.card::before {\n  content: "";\n  display: block;\n  height: 4px;\n  background: teal;\n}`, language: "css", exercise: { id: "css-pseudo-fill-focus-1", type: "fill_blank", prompt: "איזה state נותן feedback ברור למשתמשי מקלדת?", code: `.link:___ {\n  outline: 3px solid cyan;\n}`, language: "css", options: [{ id: "focus", label: "focus-visible" }, { id: "hover", label: "hover" }, { id: "first", label: "first-child" }], correctOptionId: "focus", hint: "ה־state מופעל כשה־focus צריך להיראות.", explanation: "focus-visible מאפשר להציג focus ring ברור בעיקר בניווט מקלדת, בלי להסתמך על hover." } },
    ],
    next: { title: "מעברים ואנימציה", path: "/tutorials/css/transitions-animation" },
  },
  "transitions-animation": {
    title: "מעברים ואנימציה עדינה",
    intro: ["תנועה יכולה להסביר שינוי מצב ולגרום לממשק להרגיש טבעי. היא צריכה להיות קצרה, צפויה ומשנית למשימה—לא מכשול שהמשתמש מחכה שיסתיים.", "transition מתאימה למעבר בין שני מצבים, למשל צבע רגיל ו־hover. keyframes מתאימה לרצף מורכב יותר, אך ברוב הממשקים כדאי להתחיל במעבר פשוט."],
    sections: [
      { title: "Transition ממוקדת", paragraphs: ["מגדירים רק את ה־properties שצריכים להשתנות, במקום transition: all. transform ו־opacity בדרך כלל חלקים יותר מ־properties שמשנים layout."], code: `.button {\n  transition: transform 160ms ease, background-color 160ms ease;\n}\n.button:hover {\n  transform: translateY(-2px);\n  background-color: #115e59;\n}`, language: "css" },
      { title: "כיבוד העדפת תנועה", paragraphs: ["חלק מהמשתמשים מבקשים במערכת פחות תנועה. media query של prefers-reduced-motion מאפשרת לבטל או לצמצם אנימציות עבורם."], code: `@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    scroll-behavior: auto !important;\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}`, language: "css", exercise: { id: "css-motion-fill-transition-1", type: "fill_blank", prompt: "איזה property מחליק את שינוי הצבע בין states?", code: `.button {\n  ___: background-color 160ms ease;\n}`, language: "css", options: [{ id: "transition", label: "transition" }, { id: "transform", label: "transform" }, { id: "animation-name", label: "animation-name" }], correctOptionId: "transition", hint: "מדובר במעבר בין value רגיל ל־hover value.", explanation: "transition מגדירה איזה property ישתנה, כמה זמן יימשך המעבר ובאיזה קצב." } },
    ],
    next: { title: "ארגון CSS", path: "/tutorials/css/organization" },
  },
  organization: {
    title: "ארגון CSS ו־components",
    intro: ["קובץ CSS קטן יכול להפוך במהירות לקשה לתחזוקה. סדר קבוע, naming עקבי ו־components בעלי אחריות ברורה חשובים יותר מטריק שמקצר שתי שורות.", "מומלץ להתחיל בהגדרות בסיס ומשתנים, להמשיך ב־layout וב־components ולסיים בהתאמות נקודתיות. selector קצר המבוסס על class בדרך כלל יציב יותר משרשרת ארוכה של אלמנטים."],
    sections: [
      { title: "Component עם variation", paragraphs: ["Base class מחזיקה את כללי ה־component, ו־modifier class מוסיפה רק את ההבדל. כך אין צורך להעתיק padding, border-radius וטיפוגרפיה לכל סוג כפתור."], code: `.button {\n  padding: 0.75rem 1rem;\n  border-radius: 0.5rem;\n  font: inherit;\n}\n.button--primary { background: teal; color: white; }\n.button--quiet { background: transparent; color: teal; }`, language: "css" },
      { title: "Layers ו־specificity נמוכה", paragraphs: ["אפשר להשתמש ב־@layer כדי להצהיר במפורש על סדר קבוצות הכללים. :where עוזרת לכתוב defaults שקל לדרוס בלי !important."], code: `@layer reset, base, components, utilities;\n\n@layer base {\n  :where(h1, h2, p) { margin-block-start: 0; }\n}\n@layer components {\n  .card { padding: 1rem; }\n}`, language: "css", exercise: { id: "css-organization-fill-class-1", type: "fill_blank", prompt: "איזה שם מייצג primary variation של button?", code: `.button { padding: 0.75rem; }\n.___ { background: teal; }`, language: "css", options: [{ id: "modifier", label: "button--primary" }, { id: "deep", label: "main div button.primary" }, { id: "all", label: "*" }], correctOptionId: "modifier", hint: "השם מתחיל ב־base component ומוסיף תיאור variation.", explanation: "button--primary היא variation ממוקדת של button ושומרת את רוב הכללים ב־base class." } },
    ],
    next: { title: "דף responsive ונגיש", path: "/tutorials/css/accessible-page" },
  },
  "accessible-page": {
    title: "בונים דף responsive ונגיש",
    intro: ["עיצוב איכותי מחבר את כל העקרונות: Cascade צפויה, טיפוגרפיה קריאה, layout גמיש, focus states ותנועה מכבדת. המטרה אינה להציג כמה שיותר properties, אלא ליצור ממשק רגוע שעובד במצבים שונים.", "לפני פרסום בדקו מסך צר ורחב, הגדלת טקסט, ניווט מקלדת וניגודיות. ודאו שאין horizontal scrolling ושמידע חשוב אינו תלוי רק בצבע, hover או אנימציה."],
    sections: [
      { title: "כרטיס גמיש", paragraphs: ["ה־component הבא משתמש במשתנים, Grid אוטומטית, spacing גמיש ו־focus ring. הוא מתכווץ בלי breakpoint מיוחד ונשאר קריא במסך רחב."], code: `:root {\n  --primary: #0f766e;\n  --surface: #ffffff;\n  --text: #1e293b;\n}\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: 1rem;\n}\n.card {\n  padding: clamp(1rem, 3vw, 1.5rem);\n  color: var(--text);\n  background: var(--surface);\n  border: 1px solid #cbd5e1;\n  border-radius: 1rem;\n}`, language: "css" },
      { title: "בדיקת states", paragraphs: ["כפתור צריך להישאר ברור ב־default, hover, focus ו־disabled states. ה־focus ring נמצא מחוץ ל־component ולכן אינו משנה את ה־layout."], code: `.card a { color: var(--primary); }\n.card a:focus-visible {\n  outline: 3px solid #22d3ee;\n  outline-offset: 3px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .card { transition: transform 160ms ease; }\n  .card:hover { transform: translateY(-2px); }\n}`, language: "css", exercise: { id: "css-accessible-page-predict-priority-1", type: "predict_output", prompt: "איזו בדיקה חשובה לפני פרסום עמוד responsive?", code: `/* בחרו את הבדיקה שנותנת את הכיסוי הרחב ביותר */`, language: "css", options: [{ id: "all", label: "מסך צר, הגדלת טקסט וניווט מקלדת" }, { id: "desktop", label: "רק מסך מחשב רחב" }, { id: "color", label: "רק הצבע הראשי" }], correctOptionId: "all", hint: "עיצוב טוב צריך להמשיך לעבוד עם מכשיר ושיטת ניווט שונים.", explanation: "שילוב של מסך צר, הגדלת טקסט ומקלדת חושף בעיות layout ונגישות שלא רואים בבדיקת מחשב רגילה בלבד." } },
      { title: "לאן ממשיכים?", paragraphs: ["כעת אפשר לתרגל בבניית דף אמיתי ולשנות בכל פעם החלטה אחת. בהמשך כדאי ללמוד DevTools, Design Systems ו־CSS מתקדמת, תוך שמירה על בסיס פשוט ונגיש."] },
    ],
  },
} satisfies Record<string, TutorialLessonContent>;

export type CssLessonKey = keyof typeof cssLessons;
