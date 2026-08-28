export const pythonLessonSlugs: Record<string, string> = {
  Intro: "introduction",
  Installation: "installation",
  FirstPythonProgram: "first-program",
  Datatypes: "data-types",
  Variables: "variables",
  Operators: "operators",
  InputOutput: "input-output",
  IFElse: "conditionals",
  Elif: "elif",
  Loops: "loops",
  Functions: "functions",
  Lists: "lists",
  Strings: "strings",
  Tuples: "tuples",
  Sets: "sets",
  Dicts: "dictionaries",
  OOP_Intro: "classes-and-objects",
  ToString: "string-representation",
  Encapsulation: "encapsulation",
  Inheritance: "inheritance",
  StaticMethods: "static-methods",
  InheritanceAndEncapsulation: "inheritance-and-encapsulation",
  ExternalLibraries: "external-libraries",
};

export const pythonRoutesByLessonSlug = Object.fromEntries(
  Object.entries(pythonLessonSlugs).map(([route, slug]) => [slug, route]),
) as Record<string, string>;
