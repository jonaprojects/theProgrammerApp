# Tutorial writing guide

This guide defines the shared writing standard for tutorials in The Programmer.
It is based on the existing Hebrew Python lessons and should be used for new
lessons, rewrites, examples, hints, and exercises.

## The voice

Write like a patient guide sitting beside the learner. The reader is capable,
curious, and probably new to the specific topic.

- Write in clear, conversational Hebrew.
- Address learners in the plural when an instruction needs a subject: "שימו לב",
  "נסו", "עברו שורה־שורה".
- Prefer inviting language such as "אפשר", "נניח ש...", "כך נוכל..." and
  "לדוגמה" over commands and formal definitions.
- Be encouraging without praise filler. Explain what happened and why instead of
  saying only "כל הכבוד".
- Never make the learner feel behind. Say "עדיין לא צריך לזכור..." when a detail
  will be taught later.
- Do not use jokes, slang, or metaphors that obscure the technical idea.

The desired feeling is: **simple, concrete, accurate, and calm**.

## The teaching sequence

Teach one mental step at a time. A strong section usually follows this order:

1. Explain what the idea lets us do.
2. Connect it to something familiar or a realistic goal.
3. Show the smallest complete code example.
4. Walk through the important lines or state changes.
5. Point out one likely misconception or mistake.
6. Let the learner confirm the idea with a short exercise.

Lead with purpose before terminology. For example, explain that a loop avoids
repeating the same command before defining `for` formally.

Analogies are welcome when they shorten the path to understanding. Always return
from the analogy to the exact programming behavior. A variable may be introduced
as a drawer, but the lesson must also explain assignment, name, type, and value.

## Lesson structure

Every lesson must contain:

- A short introduction that answers “what is this?” and “why do I need it?”
- Descriptive section headings that help scanning.
- At least three explanatory paragraphs across the lesson.
- At least two worked code examples, except a true introductory lesson, which may
  use one.
- An explanation after important code—not code left to explain itself.
- Exactly one lightweight interactive exercise that practices material already
  taught in the lesson.
- A clear next lesson or course-completion action.

Keep sections focused. If a section needs several unrelated examples or more than
three substantial paragraphs, split it under another heading.

## Paragraphs and sentences

- Keep paragraphs to one idea, normally two to four sentences.
- Prefer direct sentences and active verbs.
- Replace abstract claims with observable behavior.
- Explain cause and effect explicitly: “התנאי מתקיים, ולכן רק בלוק `if` רץ.”
- Use transitions such as "למשל", "באופן דומה", "לעומת זאת" and "לכן" only
  when they clarify the relationship.
- Avoid repeating the code word for word. Explain the state change, rule, or
  decision that the learner cannot see immediately.
- Introduce no more than a few new terms in one paragraph.

## Code examples

Code is part of the explanation, not decoration.

- Use the smallest runnable example that demonstrates the point.
- Keep names meaningful: `total_price`, `student`, and `has_ticket` are better than
  `x` unless the name itself is irrelevant.
- Prefer realistic but emotionally neutral scenarios.
- Show expected output with a comment when it removes ambiguity.
- Keep syntax, indentation, casing, and library usage correct.
- Never mix terminal commands and Python code in the same snippet.
- Specify the correct snippet language for syntax highlighting.
- Introduce complexity gradually; do not hide an untaught concept inside an
  otherwise beginner-level example.
- When showing unsafe or invalid code, label it clearly and explain the resulting
  error or risk.
- Verify examples by running them when practical.

After a multi-line example, walk through execution in the order Python follows.
For changing values, state the intermediate values explicitly.

## Hebrew and technical terminology

Use Hebrew for the explanation and preserve the exact spelling of code elements.

| Concept | Preferred wording |
|---|---|
| variable | משתנה |
| value | ערך |
| type | טיפוס |
| string | מחרוזת (`str`) |
| Boolean | ערך בוליאני, `True` או `False` |
| function | פונקציה; use פעולה when discussing a class method in the current course voice |
| class / object | מחלקה / אובייקט |
| loop | לולאה |
| condition | תנאי |
| assignment | השמה, followed by a plain-language explanation |
| library / package | ספרייה / חבילה; explain the distinction when it matters |

Write keywords and identifiers exactly as code: `if`, `else`, `self`, `print`,
`__init__`. Do not translate them into look-alike Hebrew text. Use the Hebrew
maqaf (`־`) when joining Hebrew and Latin text where appropriate, such as
"ה־`if`". Avoid unnecessary English when a familiar Hebrew term is clearer.

Distinguish language rules from conventions. For example, Python enforces
indentation, but `_name` as protected access is a convention rather than an
access-control mechanism.

## Exercises

Exercises should feel like a quick win, not homework.

- Test one idea that the lesson just demonstrated.
- A learner who understood the example should answer in roughly 15–45 seconds.
- Prefer predicting output, filling one blank, tracing a short value, locating one
  bug, or ordering a few lines.
- Keep answer options parallel in style and similar enough to require thought.
- Use plausible wrong answers based on common misconceptions.
- Do not use trick wording or introduce untaught syntax.
- Keep the prompt self-contained and unambiguous.
- Write a hint that points to the rule without revealing the answer.
- Write feedback that explains the execution or rule, not merely that the answer
  is correct.
- Revealing a solution must still teach: show the answer and the reason.

Good feedback:

> מתחילים ב־4, מוסיפים 3 ומקבלים 7, ואז מכפילים ב־2 ומקבלים 14.

Weak feedback:

> 14 היא התשובה הנכונה.

## Accuracy and trust

- Verify technical claims against current primary documentation when they may
  have changed, especially installation, tooling, package versions, and platform
  behavior.
- Never present a convention as an enforced security boundary.
- Mention meaningful failure modes close to the code that can cause them.
- Avoid absolute words such as "תמיד" and "אף פעם" unless the language rule truly
  guarantees them.
- Keep examples internally consistent: every referenced variable, constructor,
  import, and method must exist.
- Do not recommend deleting or replacing system-managed Python installations.

## Mobile reading and accessibility

- Assume a narrow 320-pixel-wide screen first.
- Use short headings and options that wrap cleanly.
- Avoid long unbroken prose, identifiers, or code lines when a clearer version is
  possible.
- Do not rely on color alone to communicate correctness or completion.
- Give interactive controls meaningful labels and visible states.
- Keep code left-to-right while surrounding explanations remain right-to-left.
- Check the lesson at both narrow and wide mobile widths before publishing.

## Before publishing

Confirm all of the following:

- The introduction states the purpose in beginner-friendly language.
- Each section teaches one idea in a logical order.
- Every new term is explained before or when it first appears.
- The code runs and its stated output is correct.
- Important code is followed by a “why” explanation.
- The lesson contains enough examples without repeating itself.
- The exercise covers taught material and has one indisputable answer.
- The hint helps without giving the answer away.
- Correct feedback explains the reasoning.
- Terminology is consistent with nearby lessons.
- Technical claims distinguish rules, conventions, and recommendations.
- The page is readable without horizontal overflow at mobile widths.
- Navigation, progress saving, and exercise completion work.

If a lesson passes this checklist, it should sound like the existing course while
remaining clear enough for a learner encountering the topic for the first time.
