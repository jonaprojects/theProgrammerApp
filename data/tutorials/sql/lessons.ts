import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";

export const sqlLessons = {
  introduction: {
    title: "איך Database רלציונית חושבת?",
    intro: ["Database רלציונית שומרת מידע ב־tables. כל row מייצגת record אחד, וכל column מייצגת field בעלת משמעות ו־data type מוגדר.", "SQL היא השפה שבה מבקשים מידע ומשנים אותו. מתחילים ב־queries שקוראות נתונים, כי הן מאפשרות להבין את המבנה לפני שמבצעים writes."],
    sections: [
      { title: "Table פשוטה", paragraphs: ["Primary key מזהה כל row באופן ייחודי. בדוגמה, id מפרידה בין courses גם אם לשתיים יש title דומה."], code: `CREATE TABLE courses (\n  id INTEGER PRIMARY KEY,\n  title VARCHAR(100) NOT NULL,\n  level VARCHAR(20) NOT NULL,\n  lessons_count INTEGER NOT NULL\n);`, language: "sql" },
      { title: "Query ראשונה", paragraphs: ["SELECT מציינת אילו columns להחזיר ו־FROM מאיזו table. Query מסתיימת בדרך כלל ב־semicolon."], code: `SELECT title, level\nFROM courses;`, language: "sql", exercise: { id: "sql-introduction-fill-select-1", type: "fill_blank", prompt: "איזו keyword בוחרת columns להחזרה?", code: `___ title\nFROM courses;`, language: "sql", options: [{ id: "select", label: "SELECT" }, { id: "from", label: "FROM" }, { id: "table", label: "TABLE" }], correctOptionId: "select", hint: "ה־keyword מופיעה בתחילת query שקוראת נתונים.", explanation: "SELECT מגדירה את ה־columns שיוחזרו. FROM מגדירה את מקור הנתונים." } },
    ], next: { title: "SELECT", path: "/tutorials/sql/select" },
  },
  select: {
    title: "SELECT ו־aliases",
    intro: ["SELECT יכולה להחזיר columns קיימות וגם expressions מחושבות. עדיף לבחור במפורש את ה־columns שצריכים במקום SELECT *, במיוחד בקוד production.", "Alias נותנת שם ברור ל־column ב־result. היא אינה משנה את schema או את השם המקורי ב־table."],
    sections: [
      { title: "Columns מדויקות", paragraphs: ["סדר ה־columns ב־SELECT קובע את סדרן ב־result. Expression יכולה לחשב value לכל row."], code: `SELECT\n  title,\n  lessons_count,\n  lessons_count * 15 AS estimated_minutes\nFROM courses;`, language: "sql" },
      { title: "DISTINCT", paragraphs: ["DISTINCT מסירה duplicate rows מה־result לפי כל ה־columns שנבחרו. היא אינה מתקנת duplicates ב־table עצמה."], code: `SELECT DISTINCT level\nFROM courses;\n\nSELECT title AS course_title\nFROM courses;`, language: "sql", exercise: { id: "sql-select-fill-alias-1", type: "fill_blank", prompt: "איזו keyword נותנת alias ל־column?", code: `SELECT title ___ course_title\nFROM courses;`, language: "sql", options: [{ id: "as", label: "AS" }, { id: "is", label: "IS" }, { id: "to", label: "TO" }], correctOptionId: "as", hint: "ה־keyword מחברת expression לשם שמופיע ב־result.", explanation: "AS מגדירה alias קריאה ל־column או ל־expression בתוך ה־result." } },
    ], next: { title: "WHERE", path: "/tutorials/sql/filtering" },
  },
  filtering: {
    title: "Filtering עם WHERE",
    intro: ["WHERE מסננת rows לפני שהן חוזרות ל־result. condition יכולה להשוות numbers, strings, dates או לשלב כמה checks.", "Strings נכתבות ב־single quotes. values שמגיעות ממשתמש תמיד עוברות כ־parameters דרך driver, ולא מחברים אותן ידנית ל־SQL string."],
    sections: [
      { title: "Comparisons", paragraphs: ["אפשר להשתמש ב־=, <>, >, >=, < ו־<=. BETWEEN כוללת את שני גבולות הטווח."], code: `SELECT title, lessons_count\nFROM courses\nWHERE lessons_count >= 10;\n\nSELECT title\nFROM courses\nWHERE lessons_count BETWEEN 8 AND 15;`, language: "sql" },
      { title: "AND, OR ו־IN", paragraphs: ["AND דורשת שכל ה־conditions יתקיימו, ו־OR דורשת לפחות אחת. סוגריים הופכים סדר לוגי מורכב למפורש."], code: `SELECT title\nFROM courses\nWHERE level IN ('beginner', 'intermediate')\n  AND lessons_count >= 10;`, language: "sql", exercise: { id: "sql-filtering-predict-condition-1", type: "predict_output", prompt: "אילו courses יוחזרו?", code: `SELECT title\nFROM courses\nWHERE lessons_count >= 12;`, language: "sql", options: [{ id: "matching", label: "רק courses עם 12 שיעורים ומעלה" }, { id: "all", label: "כל ה־courses" }, { id: "less", label: "רק courses עם פחות מ־12" }], correctOptionId: "matching", hint: "הסימן >= כולל גם את 12 עצמו.", explanation: "WHERE משאירה רק rows שבהן lessons_count גדול או שווה ל־12." } },
    ], next: { title: "ORDER BY ו־LIMIT", path: "/tutorials/sql/sorting-limit" },
  },
  "sorting-limit": {
    title: "ORDER BY ו־LIMIT",
    intro: ["ללא ORDER BY, database אינה מבטיחה סדר קבוע ל־rows. אם הסדר חשוב ל־UI או ל־pagination, צריך להגדיר אותו במפורש.", "ASC ממיינת בסדר עולה ו־DESC בסדר יורד. אפשר להוסיף column שנייה כדי לשבור tie וליצור סדר יציב."],
    sections: [
      { title: "מיון יציב", paragraphs: ["ה־database ממיינת קודם לפי lessons_count ואז לפי title בתוך rows בעלות אותו count."], code: `SELECT title, lessons_count\nFROM courses\nORDER BY lessons_count DESC, title ASC;`, language: "sql" },
      { title: "הגבלת result", paragraphs: ["LIMIT מחזירה מספר rows מוגבל. בשילוב ORDER BY היא שימושית ל־top results; ללא ORDER BY לא ברור אילו rows ייבחרו."], code: `SELECT title, lessons_count\nFROM courses\nORDER BY lessons_count DESC, id ASC\nLIMIT 3;`, language: "sql", exercise: { id: "sql-sorting-fill-desc-1", type: "fill_blank", prompt: "איזו keyword ממיינת מהערך הגבוה לנמוך?", code: `ORDER BY score ___;`, language: "sql", options: [{ id: "desc", label: "DESC" }, { id: "asc", label: "ASC" }, { id: "limit", label: "LIMIT" }], correctOptionId: "desc", hint: "השם הוא קיצור של descending.", explanation: "DESC ממיינת בסדר יורד. ASC הייתה מציבה את ה־score הנמוך ראשון." } },
    ], next: { title: "Aggregate functions", path: "/tutorials/sql/aggregates" },
  },
  aggregates: {
    title: "Aggregate functions",
    intro: ["Aggregate function מסכמת כמה rows ל־value אחת. COUNT סופרת, SUM מחברת, AVG מחשבת average ו־MIN או MAX מוצאות קצה.", "COUNT(*) סופרת rows. COUNT(column) אינה סופרת rows שבהן אותה column היא NULL, ולכן ההבדל ביניהן משמעותי."],
    sections: [
      { title: "סיכום table", paragraphs: ["Query ללא GROUP BY מחזירה row מסכמת אחת. aliases הופכות את שמות ה־result ברורים לקוד שקורא אותם."], code: `SELECT\n  COUNT(*) AS course_count,\n  AVG(lessons_count) AS average_lessons,\n  MAX(lessons_count) AS largest_course\nFROM courses;`, language: "sql" },
      { title: "COUNT עם NULL", paragraphs: ["אם description יכולה להיות NULL, שתי הספירות עשויות להיות שונות. הראשונה סופרת כל course והשנייה רק descriptions קיימות."], code: `SELECT\n  COUNT(*) AS all_courses,\n  COUNT(description) AS courses_with_description\nFROM courses;`, language: "sql", exercise: { id: "sql-aggregates-fill-count-1", type: "fill_blank", prompt: "איזו function סופרת את כל ה־rows?", code: `SELECT ___(*)\nFROM lessons;`, language: "sql", options: [{ id: "count", label: "COUNT" }, { id: "sum", label: "SUM" }, { id: "max", label: "MAX" }], correctOptionId: "count", hint: "ה־function מחזירה מספר rows.", explanation: "COUNT(*) סופרת את כל ה־rows שעברו את ה־filter, גם אם חלק מה־columns מכילות NULL." } },
    ], next: { title: "GROUP BY ו־HAVING", path: "/tutorials/sql/grouping" },
  },
  grouping: {
    title: "GROUP BY ו־HAVING",
    intro: ["GROUP BY מחלקת rows לקבוצות ומפעילה aggregate לכל קבוצה. כך אפשר לספור courses לכל level במקום לקבל summary אחת לכל table.", "WHERE מסננת rows לפני grouping. HAVING מסננת groups לאחר חישוב aggregates, ולכן משתמשים בה ל־conditions שתלויות ב־COUNT או AVG."],
    sections: [
      { title: "סיכום לפי category", paragraphs: ["כל column שאינה aggregate ב־SELECT צריכה בדרך כלל להופיע ב־GROUP BY. ה־result מכילה row אחת לכל level."], code: `SELECT\n  level,\n  COUNT(*) AS course_count,\n  AVG(lessons_count) AS average_lessons\nFROM courses\nGROUP BY level;`, language: "sql" },
      { title: "Filter של groups", paragraphs: ["HAVING רצה אחרי grouping ולכן יכולה להשתמש ב־aggregate expression. Alias support בתוך HAVING משתנה בין databases, אז expression מפורשת ניידת יותר."], code: `SELECT level, COUNT(*) AS course_count\nFROM courses\nWHERE lessons_count >= 5\nGROUP BY level\nHAVING COUNT(*) >= 2;`, language: "sql", exercise: { id: "sql-grouping-fill-having-1", type: "fill_blank", prompt: "איזו clause מסננת groups אחרי COUNT?", code: `GROUP BY level\n___ COUNT(*) >= 2;`, language: "sql", options: [{ id: "having", label: "HAVING" }, { id: "where", label: "WHERE" }, { id: "order", label: "ORDER" }], correctOptionId: "having", hint: "WHERE פועלת לפני יצירת ה־groups.", explanation: "HAVING מסננת את ה־groups לאחר ש־COUNT חושבה לכל אחת מהן." } },
    ], next: { title: "JOIN", path: "/tutorials/sql/joins" },
  },
  joins: {
    title: "JOIN בין tables",
    intro: ["Relational design מפרידה ישויות ל־tables ומחברת אותן בעזרת keys. JOIN מאפשרת להחזיר מידע קשור ב־query אחת.", "INNER JOIN מחזירה רק matches. LEFT JOIN שומרת את כל rows מהצד השמאלי וממלאת NULL כשאין match בצד הימני."],
    sections: [
      { title: "INNER JOIN", paragraphs: ["ON מגדירה את הקשר בין foreign key ל־primary key. aliases קצרות מונעות ambiguity כאשר לשתי tables יש column בשם id."], code: `SELECT\n  lessons.title AS lesson_title,\n  courses.title AS course_title\nFROM lessons\nINNER JOIN courses\n  ON courses.id = lessons.course_id;`, language: "sql" },
      { title: "LEFT JOIN וספירה", paragraphs: ["LEFT JOIN מאפשרת לראות גם courses ללא lessons. COUNT של column מהצד הימני תחזיר 0 עבורן, בניגוד ל־COUNT(*)."], code: `SELECT courses.title, COUNT(lessons.id) AS lesson_count\nFROM courses\nLEFT JOIN lessons ON lessons.course_id = courses.id\nGROUP BY courses.id, courses.title;`, language: "sql", exercise: { id: "sql-joins-predict-left-1", type: "predict_output", prompt: "איזו JOIN שומרת גם courses ללא lessons?", code: `SELECT courses.title, lessons.title\nFROM courses\n___ JOIN lessons ON lessons.course_id = courses.id;`, language: "sql", options: [{ id: "left", label: "LEFT" }, { id: "inner", label: "INNER" }, { id: "cross", label: "CROSS" }], correctOptionId: "left", hint: "ה־table שצריך לשמור נמצאת משמאל ל־JOIN.", explanation: "LEFT JOIN מחזירה את כל rows מ־courses גם כאשר לא נמצאה lesson מתאימה." } },
    ], next: { title: "NULL", path: "/tutorials/sql/null" },
  },
  null: {
    title: "עבודה נכונה עם NULL",
    intro: ["NULL מציינת value חסרה או לא ידועה. היא אינה 0, string ריקה או false, ולכן comparison רגילה בעזרת = אינה מתאימה.", "בודקים NULL עם IS NULL או IS NOT NULL. expressions שמשלבות NULL מחזירות לעיתים NULL, ולכן צריך להחליט במפורש מה המשמעות העסקית."],
    sections: [
      { title: "בדיקה מפורשת", paragraphs: ["ה־query הראשונה מוצאת courses ללא description. השנייה מוצאת רק rows שבהן value קיימת."], code: `SELECT title\nFROM courses\nWHERE description IS NULL;\n\nSELECT title\nFROM courses\nWHERE description IS NOT NULL;`, language: "sql" },
      { title: "COALESCE", paragraphs: ["COALESCE מחזירה את ה־value הראשונה שאינה NULL. היא שימושית ל־display fallback, אך לא משנה את הנתון השמור."], code: `SELECT\n  title,\n  COALESCE(description, 'No description') AS description\nFROM courses;`, language: "sql", exercise: { id: "sql-null-fill-is-null-1", type: "fill_blank", prompt: "איזה condition מוצאת rows ללא description?", code: `WHERE description ___;`, language: "sql", options: [{ id: "is-null", label: "IS NULL" }, { id: "equals", label: "= NULL" }, { id: "empty", label: "= ''" }], correctOptionId: "is-null", hint: "NULL משתמשת ב־operator ייעודי.", explanation: "IS NULL בודקת value חסרה. = NULL אינה מחזירה true, ו־string ריקה היא value שונה." } },
    ], next: { title: "INSERT, UPDATE ו־DELETE", path: "/tutorials/sql/writes" },
  },
  writes: {
    title: "INSERT, UPDATE ו־DELETE",
    intro: ["Write queries משנות data ולכן דורשות scope מדויק ובדיקה. מתחילים ב־SELECT עם אותה WHERE כדי לראות אילו rows יושפעו.", "INSERT מוסיפה rows, UPDATE משנה existing rows ו־DELETE מסירה rows. ב־production משתמשים ב־parameters, permissions ו־transactions בהתאם לסיכון."],
    sections: [
      { title: "INSERT מפורשת", paragraphs: ["מציינים column list כדי שה־query לא תהיה תלויה בסדר schema. values צריכות להתאים במספר וב־types."], code: `INSERT INTO courses (title, level, lessons_count)\nVALUES ('SQL Basics', 'beginner', 12)\nRETURNING id, title;`, language: "sql" },
      { title: "UPDATE עם WHERE", paragraphs: ["WHERE חסרה תעדכן כל row ב־table. בודקים קודם SELECT ומעדיפים RETURNING כאשר database תומכת בה."], code: `SELECT id, title\nFROM courses\nWHERE id = 7;\n\nUPDATE courses\nSET lessons_count = 13\nWHERE id = 7\nRETURNING id, lessons_count;`, language: "sql", exercise: { id: "sql-writes-fill-where-1", type: "fill_blank", prompt: "איזו clause מגבילה UPDATE ל־course אחת?", code: `UPDATE courses\nSET level = 'intermediate'\n___ id = 7;`, language: "sql", options: [{ id: "where", label: "WHERE" }, { id: "group", label: "GROUP BY" }, { id: "order", label: "ORDER BY" }], correctOptionId: "where", hint: "זו אותה clause שמסננת SELECT.", explanation: "WHERE מגבילה את rows שה־UPDATE משנה. ללא WHERE, כל rows ב־courses היו מתעדכנות." } },
    ], next: { title: "Constraints", path: "/tutorials/sql/constraints" },
  },
  constraints: {
    title: "Constraints ו־data integrity",
    intro: ["Constraint מעבירה rule עסקי קרוב ל־data. כך כל client שמנסה לכתוב ל־database כפופה לאותו כלל, ולא רק UI מסוימת.", "NOT NULL דורשת value, UNIQUE מונעת duplicates, CHECK בודקת condition ו־FOREIGN KEY שומרת קשר בין tables."],
    sections: [
      { title: "Rules בתוך schema", paragraphs: ["Constraint name הופכת error ו־migration ברורות יותר. CHECK צריכה לשקף rule אמיתי ולא validation שנוטה להשתנות בכל release."], code: `CREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  email VARCHAR(320) NOT NULL UNIQUE,\n  points INTEGER NOT NULL DEFAULT 0,\n  CONSTRAINT users_points_nonnegative CHECK (points >= 0)\n);`, language: "sql" },
      { title: "Foreign key", paragraphs: ["Foreign key מונעת lesson שמפנה ל־course שאינה קיימת. ON DELETE מגדירה behavior מפורש כאשר parent נמחקת."], code: `CREATE TABLE lessons (\n  id BIGINT PRIMARY KEY,\n  course_id BIGINT NOT NULL,\n  title VARCHAR(150) NOT NULL,\n  CONSTRAINT lessons_course_fk\n    FOREIGN KEY (course_id) REFERENCES courses(id)\n    ON DELETE CASCADE\n);`, language: "sql", exercise: { id: "sql-constraints-fill-unique-1", type: "fill_blank", prompt: "איזו constraint מונעת שתי users עם אותו email?", code: `email VARCHAR(320) NOT NULL ___`, language: "sql", options: [{ id: "unique", label: "UNIQUE" }, { id: "default", label: "DEFAULT" }, { id: "order", label: "ORDER BY" }], correctOptionId: "unique", hint: "ה־constraint דורשת value שונה בכל row.", explanation: "UNIQUE יוצרת rule ברמת database שמונעת duplicate values ב־email." } },
    ], next: { title: "Indexes ו־query plans", path: "/tutorials/sql/indexes" },
  },
  indexes: {
    title: "Indexes ו־query plans",
    intro: ["Index היא structure נוספת שעוזרת ל־database למצוא rows בלי לסרוק table שלמה. היא יכולה להאיץ reads, אך צורכת storage ומוסיפה עבודה לכל write.", "לא מוסיפים index לכל column. מתחילים מ־queries אמיתיות, משתמשים ב־EXPLAIN ובוחרים index שמתאימה ל־WHERE, JOIN ו־ORDER BY נפוצות."],
    sections: [
      { title: "Index ממוקדת", paragraphs: ["Index על course_id עוזרת לחפש lessons של course. Composite index יכולה להתאים ל־filter ולמיון יחד, והסדר של columns בה חשוב."], code: `CREATE INDEX lessons_course_id_idx\nON lessons (course_id);\n\nCREATE INDEX lessons_course_position_idx\nON lessons (course_id, position);`, language: "sql" },
      { title: "EXPLAIN", paragraphs: ["EXPLAIN מציגה query plan משוער. EXPLAIN ANALYZE גם מריצה את ה־query, ולכן נזהרים איתה ב־writes וב־production."], code: `EXPLAIN\nSELECT id, title\nFROM lessons\nWHERE course_id = 12\nORDER BY position;`, language: "sql", exercise: { id: "sql-indexes-predict-tradeoff-1", type: "predict_output", prompt: "מהו tradeoff מרכזי של index נוספת?", code: `CREATE INDEX users_email_idx ON users (email);`, language: "sql", options: [{ id: "writes", label: "Reads עשויות להשתפר, אך writes נעשות יקרות יותר" }, { id: "free", label: "היא תמיד חינמית" }, { id: "delete", label: "היא מוחקת duplicate rows" }], correctOptionId: "writes", hint: "ה־database צריכה לעדכן את ה־index בכל שינוי data.", explanation: "Index יכולה לקצר חיפוש, אך דורשת storage ועדכון נוסף ב־INSERT, UPDATE ו־DELETE." } },
    ], next: { title: "Transactions", path: "/tutorials/sql/transactions" },
  },
  transactions: {
    title: "Transactions",
    intro: ["Transaction מקבצת כמה statements ליחידת עבודה אחת. COMMIT שומרת את כולן, ו־ROLLBACK מבטלת את כולן אם משהו נכשל.", "Transactions חשובות כאשר שינוי חלקי ישאיר data לא עקבית, למשל העברת points בין users. הן אינן מחליפות constraints או error handling בקוד application."],
    sections: [
      { title: "הכול או כלום", paragraphs: ["BEGIN פותחת transaction. שתי ה־UPDATE statements צריכות להצליח לפני COMMIT; אחרת מבצעים ROLLBACK."], code: `BEGIN;\n\nUPDATE users SET points = points - 10 WHERE id = 1;\nUPDATE users SET points = points + 10 WHERE id = 2;\n\nCOMMIT;`, language: "sql" },
      { title: "נעילה עקבית", paragraphs: ["SELECT ... FOR UPDATE נועלת rows עד סוף transaction ומונעת race בעדכון read-modify-write. צריך לנעול תמיד בסדר עקבי כדי לצמצם deadlocks."], code: `BEGIN;\n\nSELECT id, points\nFROM users\nWHERE id IN (1, 2)\nORDER BY id\nFOR UPDATE;\n\n-- validate and update\nCOMMIT;`, language: "sql", exercise: { id: "sql-transactions-fill-rollback-1", type: "fill_blank", prompt: "איזו statement מבטלת את שינויי transaction שלא committed?", code: `BEGIN;\nUPDATE users SET points = -10 WHERE id = 1;\n___;`, language: "sql", options: [{ id: "rollback", label: "ROLLBACK" }, { id: "select", label: "SELECT" }, { id: "group", label: "GROUP BY" }], correctOptionId: "rollback", hint: "ה־statement מחזירה את transaction למצב שלפני BEGIN.", explanation: "ROLLBACK מבטלת את כל השינויים שבוצעו ב־transaction הנוכחית ועדיין לא committed." } },
      { title: "המשך הדרך", paragraphs: ["כעת יש בסיס לעבודה בטוחה עם relational data. בהמשך כדאי לתרגל schema אמיתית וללמוד migrations, isolation levels ו־query tuning בעזרת workload מדידה."] },
    ],
  },
} satisfies Record<string, TutorialLessonContent>;

export type SqlLessonKey = keyof typeof sqlLessons;
