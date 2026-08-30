export interface TopicManifestEntry {
  slug: string;
  title: string;
  description: string;
  sourceFile?: string;
}

export interface LessonManifestEntry {
  slug: string;
  sourceFile: string;
}

export interface CatalogLessonManifestEntry {
  key: string;
  slug: string;
}

export const topicManifest: readonly TopicManifestEntry[] = [
  {
    slug: "python",
    title: "פייתון",
    description: "שאלות על שפת Python, התחביר והספרייה הסטנדרטית.",
    sourceFile: "pythonQuestions.ts",
  },
  {
    slug: "web-development",
    title: "פיתוח אתרים",
    description: "שאלות על HTML, CSS, JavaScript ופיתוח Web.",
    sourceFile: "webdevQuestions.ts",
  },
  {
    slug: "object-oriented-programming",
    title: "תכנות מונחה עצמים",
    description: "שאלות על מחלקות, אובייקטים ועקרונות OOP.",
    sourceFile: "oopQuestions.ts",
  },
  {
    slug: "networks",
    title: "תקשורת ורשתות",
    description: "שאלות על פרוטוקולים, מודלים ורשתות מחשבים.",
    sourceFile: "networksQuestions.ts",
  },
  {
    slug: "c-language",
    title: "שפת C",
    description: "שאלות על שפת C, זיכרון ותחביר.",
    sourceFile: "clang.ts",
  },
  {
    slug: "assembly",
    title: "שפת אסמבלי",
    description: "שאלות על Assembly, מעבדים וזיכרון.",
    sourceFile: "assembly.ts",
  },
  {
    slug: "cybersecurity",
    title: "אבטחת מידע וסייבר",
    description: "שאלות על הצפנה, אבטחת יישומים, זהויות ואיומים נפוצים.",
  },
  {
    slug: "databases",
    title: "מסדי נתונים",
    description: "שאלות על SQL, מודלים רלציוניים, אינדקסים וטרנזקציות.",
  },
  {
    slug: "git",
    title: "Git וניהול גרסאות",
    description: "שאלות על commits, branches, מיזוג ועבודה משותפת עם Git.",
  },
  {
    slug: "algorithms",
    title: "אלגוריתמים ומבני נתונים",
    description: "שאלות על סיבוכיות, חיפוש, מיון ומבני נתונים בסיסיים.",
  },
] as const;

export const expandedCatalogSourceFiles = [
  "catalogExpansion.ts",
  "catalogExpansionAdvanced.ts",
] as const;

export const pythonLessonManifest: readonly LessonManifestEntry[] = [
  { slug: "introduction", sourceFile: "Intro.tsx" },
  { slug: "installation", sourceFile: "Installation.tsx" },
  { slug: "first-program", sourceFile: "FirstPythonProgram.tsx" },
  { slug: "data-types", sourceFile: "Datatypes.tsx" },
  { slug: "variables", sourceFile: "Variables.tsx" },
  { slug: "operators", sourceFile: "Operators.tsx" },
  { slug: "input-output", sourceFile: "InputOutput.tsx" },
  { slug: "conditionals", sourceFile: "IFElse.tsx" },
] as const;

export const pythonLessonCatalogManifest: readonly CatalogLessonManifestEntry[] = [
  { key: "Elif", slug: "elif" },
  { key: "Loops", slug: "loops" },
  { key: "Functions", slug: "functions" },
  { key: "Lists", slug: "lists" },
  { key: "Strings", slug: "strings" },
  { key: "Tuples", slug: "tuples" },
  { key: "Sets", slug: "sets" },
  { key: "Dicts", slug: "dictionaries" },
  { key: "OOP_Intro", slug: "classes-and-objects" },
  { key: "ToString", slug: "string-representation" },
  { key: "Encapsulation", slug: "encapsulation" },
  { key: "Inheritance", slug: "inheritance" },
  { key: "StaticMethods", slug: "static-methods" },
  { key: "InheritanceAndEncapsulation", slug: "inheritance-and-encapsulation" },
  { key: "ExternalLibraries", slug: "external-libraries" },
] as const;

export const pythonCourse = {
  slug: "python-basics",
  title: "קורס תכנות בפייתון",
  description:
    "קורס פייתון בעברית למתחילים, מהתקנה ותוכנית ראשונה ועד קלט, אופרטורים והתניות.",
  languageCode: "he",
  imageKey: "assets/images/courses/pythonCourseCard.png",
} as const;

export const htmlLessonCatalogManifest: readonly CatalogLessonManifestEntry[] = [
  { key: "introduction", slug: "introduction" },
  { key: "document-structure", slug: "document-structure" },
  { key: "text-content", slug: "text-content" },
  { key: "links-and-paths", slug: "links-and-paths" },
  { key: "images", slug: "images" },
  { key: "lists", slug: "lists" },
  { key: "semantic-structure", slug: "semantic-structure" },
  { key: "attributes", slug: "attributes" },
  { key: "tables", slug: "tables" },
  { key: "forms", slug: "forms" },
  { key: "form-controls", slug: "form-controls" },
  { key: "form-validation", slug: "form-validation" },
  { key: "head-metadata", slug: "head-metadata" },
  { key: "media", slug: "media" },
  { key: "accessibility", slug: "accessibility" },
] as const;

export const htmlCourse = {
  slug: "html-basics",
  title: "HTML למתחילים",
  description: "קורס HTML מקיף בעברית: ממבנה מסמך וטקסט ועד טפסים, מדיה ונגישות.",
  languageCode: "he",
  imageKey: "assets/images/courses/htmlCourseCard.png",
} as const;

export const cssLessonCatalogManifest: readonly CatalogLessonManifestEntry[] = [
  { key: "introduction", slug: "introduction" },
  { key: "cascade", slug: "cascade" },
  { key: "selectors", slug: "selectors" },
  { key: "box-model", slug: "box-model" },
  { key: "typography", slug: "typography" },
  { key: "colors-backgrounds", slug: "colors-backgrounds" },
  { key: "units-sizing", slug: "units-sizing" },
  { key: "display-positioning", slug: "display-positioning" },
  { key: "flexbox", slug: "flexbox" },
  { key: "grid", slug: "grid" },
  { key: "responsive-design", slug: "responsive-design" },
  { key: "pseudo-classes", slug: "pseudo-classes" },
  { key: "transitions-animation", slug: "transitions-animation" },
  { key: "organization", slug: "organization" },
  { key: "accessible-page", slug: "accessible-page" },
] as const;

export const cssCourse = {
  slug: "css-basics",
  title: "CSS למתחילים",
  description: "קורס CSS מקיף בעברית: מ־Cascade ו־Box Model ועד Flexbox, Grid ו־Responsive Design נגיש.",
  languageCode: "he",
  imageKey: "assets/images/courses/cssCourseCard.png",
} as const;

export const javascriptLessonCatalogManifest: readonly CatalogLessonManifestEntry[] = [
  { key: "introduction", slug: "introduction" },
  { key: "variables-types", slug: "variables-types" },
  { key: "operators", slug: "operators" },
  { key: "strings", slug: "strings" },
  { key: "conditionals", slug: "conditionals" },
  { key: "arrays", slug: "arrays" },
  { key: "loops", slug: "loops" },
  { key: "functions", slug: "functions" },
  { key: "objects", slug: "objects" },
  { key: "dom", slug: "dom" },
  { key: "events-forms", slug: "events-forms" },
  { key: "async-fetch", slug: "async-fetch" },
] as const;

export const gitLessonCatalogManifest: readonly CatalogLessonManifestEntry[] = [
  { key: "introduction", slug: "introduction" },
  { key: "setup-config", slug: "setup-config" },
  { key: "init-status", slug: "init-status" },
  { key: "staging-commits", slug: "staging-commits" },
  { key: "diff-log", slug: "diff-log" },
  { key: "gitignore", slug: "gitignore" },
  { key: "branches", slug: "branches" },
  { key: "merge-conflicts", slug: "merge-conflicts" },
  { key: "remotes", slug: "remotes" },
  { key: "sync", slug: "sync" },
  { key: "undo", slug: "undo" },
  { key: "collaboration", slug: "collaboration" },
] as const;

export const sqlLessonCatalogManifest: readonly CatalogLessonManifestEntry[] = [
  { key: "introduction", slug: "introduction" },
  { key: "select", slug: "select" },
  { key: "filtering", slug: "filtering" },
  { key: "sorting-limit", slug: "sorting-limit" },
  { key: "aggregates", slug: "aggregates" },
  { key: "grouping", slug: "grouping" },
  { key: "joins", slug: "joins" },
  { key: "null", slug: "null" },
  { key: "writes", slug: "writes" },
  { key: "constraints", slug: "constraints" },
  { key: "indexes", slug: "indexes" },
  { key: "transactions", slug: "transactions" },
] as const;

export const javascriptCourse = {
  slug: "javascript-basics",
  title: "JavaScript למתחילים",
  description: "מ־variables ו־functions ועד DOM, events וטעינת data עם fetch.",
  languageCode: "he",
  imageKey: "assets/images/courses/javascriptCourseCard.png",
} as const;

export const gitCourse = {
  slug: "git-basics",
  title: "Git למתחילים",
  description: "Version control מעשי: commits, branches, merge, remotes ו־workflow בטוח בצוות.",
  languageCode: "he",
  imageKey: "assets/images/courses/gitCourseCard.png",
} as const;

export const sqlCourse = {
  slug: "sql-basics",
  title: "SQL למתחילים",
  description: "קריאת data, JOIN, writes בטוחות, constraints, indexes ו־transactions.",
  languageCode: "he",
  imageKey: "assets/images/courses/sqlCourseCard.png",
} as const;

export const courseManifest = [
  pythonCourse,
  htmlCourse,
  cssCourse,
  javascriptCourse,
  gitCourse,
  sqlCourse,
] as const;
