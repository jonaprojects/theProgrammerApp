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
