import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";

export const javascriptLessons = {
  introduction: {
    title: "מה JavaScript מוסיפה לדף?",
    intro: ["HTML בונה את התוכן ו־CSS מעצבת אותו. JavaScript מוסיפה behavior: תגובה ללחיצה, בדיקת טופס, שינוי תוכן וטעינת מידע בלי לרענן את כל העמוד.", "הקוד רץ בדפדפן לפי סדר ברור. בתחילת הקורס נעבוד עם values ו־functions קטנות, ורק אחר כך נחבר אותן ל־DOM של עמוד אמיתי."],
    sections: [
      { title: "פקודה ראשונה", paragraphs: ["console.log מציגה value ב־Console של DevTools. היא שימושית ללמידה ולבדיקה, אבל אינה תוכן שמופיע למשתמש בתוך הדף."], code: `console.log("Hello, JavaScript!");\nconsole.log(2 + 3); // 5`, language: "javascript" },
      { title: "חיבור קובץ JavaScript", paragraphs: ["שומרים את הקוד בקובץ נפרד וטוענים אותו עם script. המאפיין defer מחכה שה־HTML ייקרא לפני הרצת הקוד, בלי לעכב את בניית הדף."], code: `<!-- לפני סגירת head -->\n<script src="app.js" defer></script>\n\n<!-- app.js -->\nconsole.log("The page is ready");`, language: "html", exercise: { id: "javascript-introduction-predict-console-1", type: "predict_output", prompt: "מה יודפס ב־Console?", code: `console.log(4 * 3);`, language: "javascript", options: [{ id: "12", label: "12" }, { id: "43", label: "43" }, { id: "none", label: "לא יודפס דבר" }], correctOptionId: "12", hint: "הסימן * מבצע כפל.", explanation: "JavaScript מחשבת 4 כפול 3 ומעבירה את התוצאה 12 ל־console.log." } },
    ], next: { title: "Variables ו־types", path: "/tutorials/javascript/variables-types" },
  },
  "variables-types": {
    title: "Variables ו־types",
    intro: ["Variable נותן שם ל־value כדי שנוכל להשתמש בו שוב. שם ברור כמו userName או itemCount מסביר את תפקיד המידע טוב יותר משם קצר וחסר הקשר.", "ברוב המקרים מגדירים variable בעזרת const. משתמשים ב־let רק כאשר אותו שם צריך לקבל value חדש בהמשך; אין צורך ב־var בקוד מודרני למתחילים."],
    sections: [
      { title: "const ו־let", paragraphs: ["const מונעת assignment חדש לאותו שם. let מאפשרת שינוי מבוקר, למשל counter שעולה לאחר כל פעולה."], code: `const courseName = "JavaScript";\nlet completedLessons = 2;\n\ncompletedLessons = completedLessons + 1;\nconsole.log(completedLessons); // 3`, language: "javascript" },
      { title: "Types בסיסיים", paragraphs: ["string מחזיקה טקסט, number מספר, boolean אחד משני values ו־null מציינת value ריק שנבחר במפורש. typeof עוזרת לבדוק type בזמן פיתוח."], code: `const name = "Dana";\nconst score = 95;\nconst isComplete = false;\nconst selectedLesson = null;\n\nconsole.log(typeof score); // number`, language: "javascript", exercise: { id: "javascript-variables-fill-let-1", type: "fill_blank", prompt: "איזו מילת מפתח מתאימה ל־counter שישתנה?", code: `___ counter = 0;\ncounter = counter + 1;`, language: "javascript", options: [{ id: "let", label: "let" }, { id: "const", label: "const" }, { id: "type", label: "type" }], correctOptionId: "let", hint: "ה־variable מקבל assignment חדש בשורה השנייה.", explanation: "let מאפשרת לשנות את ה־value. const הייתה גורמת לשגיאה בזמן ה־assignment השני." } },
    ], next: { title: "Operators והשוואות", path: "/tutorials/javascript/operators" },
  },
  operators: {
    title: "Operators והשוואות",
    intro: ["Operators מבצעים חישוב, השוואה או שילוב של conditions. התוצאה של comparison היא boolean, ולכן אפשר להשתמש בה ישירות בתוך if.", "ב־JavaScript מעדיפים equality strict בעזרת === ו־!==. הן משוות גם value וגם type ומונעות conversions מפתיעים."],
    sections: [
      { title: "חישוב והשוואה", paragraphs: ["ה־remainder operator מחזיר את השארית מחילוק. הוא שימושי לבדיקת זוגיות, בעוד operators כמו >= ו־< בודקים טווחים."], code: `const total = 12 + 8;\nconst average = total / 2;\nconst isEven = total % 2 === 0;\n\nconsole.log(average); // 10\nconsole.log(isEven); // true`, language: "javascript" },
      { title: "Conditions משולבים", paragraphs: ["&& דורש שכל ה־conditions יהיו true, ואילו || דורש לפחות אחד. הסימן ! הופך boolean ל־value הנגדי."], code: `const age = 20;\nconst hasTicket = true;\n\nconst canEnter = age >= 18 && hasTicket;\nconsole.log(canEnter); // true`, language: "javascript", exercise: { id: "javascript-operators-predict-strict-1", type: "predict_output", prompt: "מה יודפס?", code: `console.log("5" === 5);`, language: "javascript", options: [{ id: "false", label: "false" }, { id: "true", label: "true" }, { id: "error", label: "שגיאה" }], correctOptionId: "false", hint: "=== משווה גם את ה־type.", explanation: "ה־string \"5\" וה־number 5 נראים דומים, אך types שונים ולכן comparison strict מחזירה false." } },
    ], next: { title: "Strings ו־template literals", path: "/tutorials/javascript/strings" },
  },
  strings: {
    title: "Strings ו־template literals",
    intro: ["String היא רצף תווים. אפשר לקרוא את האורך שלה, לחפש טקסט וליצור string חדשה, אבל הפעולות אינן משנות את ה־string המקורית.", "Template literal נכתבת בין backticks ומאפשרת לשלב expressions בעזרת ${}. כך משפטים עם variables נשארים קלים לקריאה."],
    sections: [
      { title: "פעולות שימושיות", paragraphs: ["trim מסירה whitespace מהקצוות, includes בודקת אם קטע קיים ו־toLowerCase מחזירה גרסה באותיות קטנות."], code: `const rawName = "  Dana  ";\nconst cleanName = rawName.trim();\n\nconsole.log(cleanName.length); // 4\nconsole.log(cleanName.includes("an")); // true`, language: "javascript" },
      { title: "שילוב values בטקסט", paragraphs: ["בתוך ${} אפשר לשים variable או expression קצר. לתהליך מורכב עדיף לתת שם לפני יצירת ה־string."], code: "const learner = \"Noam\";\nconst completed = 4;\nconst message = `${learner} completed ${completed} lessons`;\n\nconsole.log(message);", language: "javascript", exercise: { id: "javascript-strings-fill-template-1", type: "fill_blank", prompt: "איזה expression משלב את name בתוך template literal?", code: "const name = \"Roni\";\nconst message = `Hello, ___!`;", language: "javascript", options: [{ id: "expression", label: "${name}" }, { id: "plain", label: "name" }, { id: "quotes", label: "\"name\"" }], correctOptionId: "expression", hint: "Template literal משתמשת בסימן דולר ובסוגריים מסולסלים.", explanation: "${name} מבקשת מ־JavaScript להציב את ה־value של name בתוך ה־string." } },
    ], next: { title: "Conditions", path: "/tutorials/javascript/conditionals" },
  },
  conditionals: {
    title: "Conditions עם if",
    intro: ["Condition מאפשרת לקוד לבחור behavior לפי מצב נוכחי. if מריצה block רק כשה־expression שלה truthy, ו־else מטפלת במקרה החלופי.", "למתחילים כדאי להשתמש ב־boolean comparisons מפורשות. זה קל יותר לקריאה מאשר להסתמך מוקדם מדי על כללי truthy ו־falsy."],
    sections: [
      { title: "if, else if ו־else", paragraphs: ["ה־conditions נבדקות מלמעלה למטה ורק ה־block הראשון שמתאים רץ. לכן מתחילים במקרה המדויק או הגבוה ביותר."], code: `const score = 82;\n\nif (score >= 90) {\n  console.log("Excellent");\n} else if (score >= 70) {\n  console.log("Good");\n} else {\n  console.log("Keep practicing");\n}`, language: "javascript" },
      { title: "Early return", paragraphs: ["בתוך function אפשר לטפל קודם במקרה שלא מאפשר להמשיך ולהחזיר result מיד. כך ה־happy path נשאר פחות מקונן."], code: `function ticketMessage(age) {\n  if (age < 18) {\n    return "Adult required";\n  }\n\n  return "You can continue";\n}`, language: "javascript", exercise: { id: "javascript-conditionals-predict-branch-1", type: "predict_output", prompt: "איזו הודעה תודפס?", code: `const temperature = 28;\n\nif (temperature > 30) {\n  console.log("Hot");\n} else {\n  console.log("Comfortable");\n}`, language: "javascript", options: [{ id: "comfortable", label: "Comfortable" }, { id: "hot", label: "Hot" }, { id: "both", label: "Hot וגם Comfortable" }], correctOptionId: "comfortable", hint: "28 אינו גדול מ־30.", explanation: "ה־condition של if מחזירה false, ולכן רק ה־else block רץ." } },
    ], next: { title: "Arrays", path: "/tutorials/javascript/arrays" },
  },
  arrays: {
    title: "Arrays",
    intro: ["Array שומרת רשימה מסודרת של values. לכל item יש index שמתחיל ב־0, ולכן ה־item הראשון נמצא ב־array[0].", "const מונעת assignment של array אחרת לשם, אך עדיין אפשר לעדכן את התוכן בעזרת methods כמו push. זה הבדל חשוב בין ה־variable לבין object שהיא מפנה אליו."],
    sections: [
      { title: "קריאה ועדכון", paragraphs: ["length מחזירה את מספר ה־items. push מוסיפה לסוף ו־pop מסירה ומחזירה את ה־item האחרון."], code: `const languages = ["HTML", "CSS"];\n\nlanguages.push("JavaScript");\nconsole.log(languages[0]); // HTML\nconsole.log(languages.length); // 3`, language: "javascript" },
      { title: "map ו־filter", paragraphs: ["map יוצרת array חדשה עם result לכל item. filter יוצרת array חדשה שמכילה רק items שעברו condition."], code: "const scores = [55, 82, 91];\nconst passing = scores.filter((score) => score >= 60);\nconst labels = scores.map((score) => `Score: ${score}`);\n\nconsole.log(passing); // [82, 91]", language: "javascript", exercise: { id: "javascript-arrays-predict-length-1", type: "predict_output", prompt: "מה יודפס?", code: `const colors = ["red", "blue"];\ncolors.push("green");\nconsole.log(colors.length);`, language: "javascript", options: [{ id: "3", label: "3" }, { id: "2", label: "2" }, { id: "green", label: "green" }], correctOptionId: "3", hint: "push מוסיפה item אחד לפני קריאת length.", explanation: "ה־array התחילה עם שני items, push הוסיפה item שלישי ולכן length היא 3." } },
    ], next: { title: "Loops", path: "/tutorials/javascript/loops" },
  },
  loops: {
    title: "Loops",
    intro: ["Loop חוזרת על אותה פעולה עבור כמה values. כשעוברים על array, for...of היא בדרך כלל האפשרות הברורה ביותר למתחילים.", "for רגילה מועילה כשצריך index או שליטה מדויקת במספר החזרות. בכל loop חשוב לוודא שה־condition תגיע למצב false."],
    sections: [
      { title: "for...of", paragraphs: ["בכל iteration ה־variable מקבלת את ה־item הבא. הקוד אינו צריך לנהל index בעצמו."], code: "const topics = [\"variables\", \"arrays\", \"functions\"];\n\nfor (const topic of topics) {\n  console.log(`Learning ${topic}`);\n}", language: "javascript" },
      { title: "for עם counter", paragraphs: ["ה־loop מתחילה ב־0, ממשיכה כל עוד i קטנה מ־3 ומגדילה את i אחרי כל iteration."], code: `for (let i = 0; i < 3; i += 1) {\n  console.log(i);\n}\n// 0, 1, 2`, language: "javascript", exercise: { id: "javascript-loops-predict-count-1", type: "predict_output", prompt: "כמה פעמים תודפס המילה Hi?", code: `for (let i = 0; i < 3; i += 1) {\n  console.log("Hi");\n}`, language: "javascript", options: [{ id: "3", label: "3 פעמים" }, { id: "2", label: "2 פעמים" }, { id: "4", label: "4 פעמים" }], correctOptionId: "3", hint: "ה־values של i הם 0, 1 ו־2.", explanation: "ה־condition מתקיימת בשלוש iterations: עבור i שווה 0, 1 ו־2." } },
    ], next: { title: "Functions", path: "/tutorials/javascript/functions" },
  },
  functions: {
    title: "Functions",
    intro: ["Function מרכזת פעולה בעלת שם שאפשר להפעיל שוב. parameters הם השמות שה־function מצפה לקבל, ו־arguments הם ה־values שנמסרים בזמן הקריאה.", "Function טובה עושה דבר אחד ברור ומחזירה result כאשר הקוד שקרא לה צריך להמשיך לעבוד איתו. console.log אינה תחליף ל־return."],
    sections: [
      { title: "Declaration ו־return", paragraphs: ["return מסיימת את הריצה ומעבירה value בחזרה. ללא return מפורש, ה־result הוא undefined."], code: `function calculateTotal(price, quantity) {\n  return price * quantity;\n}\n\nconst total = calculateTotal(12, 3);\nconsole.log(total); // 36`, language: "javascript" },
      { title: "Arrow function", paragraphs: ["Arrow function היא syntax קצר ונפוץ ב־callbacks. בתחילת הדרך עדיף להשתמש ב־block ו־return מפורש כשיש יותר מצעד אחד."], code: `const double = (number) => number * 2;\n\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map((number) => double(number));\nconsole.log(doubled); // [2, 4, 6]`, language: "javascript", exercise: { id: "javascript-functions-fill-return-1", type: "fill_blank", prompt: "איזו keyword מחזירה את result?", code: `function square(number) {\n  ___ number * number;\n}`, language: "javascript", options: [{ id: "return", label: "return" }, { id: "console", label: "console.log" }, { id: "const", label: "const" }], correctOptionId: "return", hint: "הקוד שקורא ל־function צריך לקבל את ה־value.", explanation: "return מעבירה את result אל מקום הקריאה. console.log רק מציגה אותו ב־Console." } },
    ], next: { title: "Objects", path: "/tutorials/javascript/objects" },
  },
  objects: {
    title: "Objects",
    intro: ["Object מקבץ properties ששייכות לאותה ישות. במקום variables נפרדות לשם, מחיר וזמינות, אפשר לשמור אותן תחת product אחד.", "Property נקראת בדרך כלל בעזרת dot notation. bracket notation מועילה כששם ה־property מגיע מ־variable או אינו identifier רגיל."],
    sections: [
      { title: "יצירה וגישה", paragraphs: ["Object literal נכתבת בסוגריים מסולסלים. אפשר לקרוא property, לעדכן אותה ולהוסיף property חדשה."], code: `const course = {\n  title: "JavaScript",\n  lessons: 12,\n  published: true,\n};\n\nconsole.log(course.title);\ncourse.lessons = 13;`, language: "javascript" },
      { title: "Destructuring", paragraphs: ["Destructuring מוציאה properties לשמות מקומיים. היא נוחה כש־function משתמשת בכמה fields מתוך object."], code: "function courseLabel({ title, lessons }) {\n  return `${title}: ${lessons} lessons`;\n}\n\nconsole.log(courseLabel(course));", language: "javascript", exercise: { id: "javascript-objects-fill-property-1", type: "fill_blank", prompt: "איזו expression קוראת את title?", code: `const book = { title: "Clean Code" };\nconsole.log(___);`, language: "javascript", options: [{ id: "dot", label: "book.title" }, { id: "bare", label: "title" }, { id: "array", label: "book[0]" }], correctOptionId: "dot", hint: "ה־property שייכת ל־object בשם book.", explanation: "dot notation נכתבת כ־object.property, ולכן book.title מחזירה את ה־string." } },
    ], next: { title: "DOM", path: "/tutorials/javascript/dom" },
  },
  dom: {
    title: "עבודה עם ה־DOM",
    intro: ["ה־DOM הוא הייצוג ש־JavaScript מקבלת למסמך HTML. אפשר למצוא element, לקרוא את התוכן שלה ולשנות state או class.", "ה־DOM API משפיעה על העמוד שהמשתמש רואה. לפני שינוי צריך לוודא שה־element נמצאה, ולשמור את ה־HTML אחראי למבנה ואת CSS אחראית לעיצוב."],
    sections: [
      { title: "בחירת element", paragraphs: ["querySelector מקבלת CSS selector ומחזירה את ההתאמה הראשונה או null. לכן optional chaining שימושית כשה־element אינה מובטחת."], code: `const heading = document.querySelector("h1");\nconst status = document.querySelector("#status");\n\nconsole.log(heading?.textContent);`, language: "javascript" },
      { title: "שינוי תוכן ו־class", paragraphs: ["textContent מתאימה לטקסט ואינה מפרשת HTML. classList מאפשרת להוסיף או להסיר class שהעיצוב שלה מוגדר ב־CSS."], code: `const message = document.querySelector("#message");\n\nif (message) {\n  message.textContent = "The lesson is complete";\n  message.classList.add("success");\n}`, language: "javascript", exercise: { id: "javascript-dom-fill-selector-1", type: "fill_blank", prompt: "איזה selector מוצא element עם id בשם status?", code: `const status = document.querySelector("___");`, language: "javascript", options: [{ id: "id", label: "#status" }, { id: "class", label: ".status" }, { id: "tag", label: "status#" }], correctOptionId: "id", hint: "CSS id selector מתחיל ב־#.", explanation: "querySelector משתמשת ב־CSS selectors, ולכן #status בוחר id בשם status." } },
    ], next: { title: "Events וטפסים", path: "/tutorials/javascript/events-forms" },
  },
  "events-forms": {
    title: "Events וטפסים",
    intro: ["Event מודיעה שמשהו קרה: click, input או submit. addEventListener מחברת function שתופעל כאשר ה־event מגיעה.", "בטופס מקשיבים ל־submit ולא רק ללחיצה על הכפתור, כדי לתמוך גם ב־Enter ובדרכי הפעלה נגישות. preventDefault עוצרת זמנית את השליחה הרגילה כש־JavaScript מטפלת בה."],
    sections: [
      { title: "Click event", paragraphs: ["ה־callback רצה בכל לחיצה. שינוי aria-expanded יחד עם class שומר גם את ה־state הנגיש וגם את העיצוב מסונכרנים."], code: `const button = document.querySelector("#menu-button");\nconst menu = document.querySelector("#menu");\n\nbutton?.addEventListener("click", () => {\n  const open = menu?.classList.toggle("open") ?? false;\n  button.setAttribute("aria-expanded", String(open));\n});`, language: "javascript" },
      { title: "קריאת FormData", paragraphs: ["FormData קוראת fields בעלי name מתוך form. ממירים את ה־value ל־string ובודקים אותה לפני שימוש."], code: `const form = document.querySelector("#signup");\n\nform?.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  const email = String(data.get("email") ?? "").trim();\n  console.log(email);\n});`, language: "javascript", exercise: { id: "javascript-events-fill-submit-1", type: "fill_blank", prompt: "לאיזו event כדאי להאזין בטופס?", code: `form.addEventListener("___", handleForm);`, language: "javascript", options: [{ id: "submit", label: "submit" }, { id: "hover", label: "hover" }, { id: "load", label: "load" }], correctOptionId: "submit", hint: "ה־event מופעלת גם בלחיצה על הכפתור וגם ב־Enter.", explanation: "submit היא ה־event הסמנטית של form ותומכת בכל דרכי השליחה הרגילות." } },
    ], next: { title: "Async ו־fetch", path: "/tutorials/javascript/async-fetch" },
  },
  "async-fetch": {
    title: "Async JavaScript ו־fetch",
    intro: ["בקשה לשרת לוקחת זמן, ולכן JavaScript אינה יכולה להחזיר את ה־result מיד. Promise מייצגת עבודה שתסתיים בעתיד, ו־await מחכה לה בתוך async function בלי לחסום את כל הדף.", "בזמן הבקשה צריך להציג loading state, ובכישלון הודעה ברורה. fetch אינה זורקת error אוטומטית עבור status כמו 404, ולכן בודקים response.ok."],
    sections: [
      { title: "בקשה בטוחה", paragraphs: ["try מטפל ב־happy path ו־catch בכישלון. response.json מחזירה Promise נוספת ולכן גם לה מחכים."], code: "async function loadCourses() {\n  try {\n    const response = await fetch(\"/api/courses\");\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n\n    const courses = await response.json();\n    console.log(courses);\n  } catch (error) {\n    console.error(\"Could not load courses\", error);\n  }\n}", language: "javascript" },
      { title: "Loading state", paragraphs: ["finally רצה גם בהצלחה וגם בכישלון. לכן היא מקום מתאים לכיבוי loading state שהופעלה לפני הבקשה."], code: `async function refresh() {\n  setLoading(true);\n  try {\n    const response = await fetch("/api/progress");\n    if (!response.ok) throw new Error("Request failed");\n    renderProgress(await response.json());\n  } finally {\n    setLoading(false);\n  }\n}`, language: "javascript", exercise: { id: "javascript-async-fill-await-1", type: "fill_blank", prompt: "איזו keyword מחכה ל־Promise בתוך async function?", code: `async function load() {\n  const response = ___ fetch("/api/items");\n}`, language: "javascript", options: [{ id: "await", label: "await" }, { id: "return", label: "return" }, { id: "defer", label: "defer" }], correctOptionId: "await", hint: "ה־keyword מופיעה לפני expression שמחזירה Promise.", explanation: "await עוצרת את המשך ה־async function עד שה־Promise מסתיימת ומחזירה את ה־response." } },
      { title: "המשך הדרך", paragraphs: ["כעת אפשר לבנות interaction מלא: לקרוא input, להגיב ל־event, לעדכן DOM ולטעון מידע. בהמשך כדאי ללמוד modules, testing ו־framework רק אחרי שהבסיס הזה מרגיש ברור."] },
    ],
  },
} satisfies Record<string, TutorialLessonContent>;

export type JavascriptLessonKey = keyof typeof javascriptLessons;
