import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";

export const gitLessons = {
  introduction: {
    title: "מה Git שומרת?",
    intro: ["Git היא Version Control System ששומרת snapshots של פרויקט לאורך זמן. במקום קבצים בשם final-final-2, מקבלים history שאפשר להבין, להשוות ולחזור אליו.", "Repository היא תיקיית פרויקט ש־Git עוקבת אחריה. כל commit מתעד שינוי בעל משמעות יחד עם message שמסביר מדוע הוא בוצע."],
    sections: [
      { title: "שלושת המצבים", paragraphs: ["Working tree היא התיקייה שבה עורכים, staging area מכינה את השינוי הבא, ו־repository שומרת commits. המעבר ביניהם הוא לב העבודה היומיומית עם Git."], code: `# שינוי קובץ נמצא ב-working tree\ngit add index.html\n# כעת הוא ב-staging area\ngit commit -m "Add page heading"\n# כעת ה-snapshot נשמר ב-repository`, language: "bash" },
      { title: "בדיקה לפני פעולה", paragraphs: ["git status היא פקודת ההתמצאות החשובה ביותר. היא מציגה branch נוכחי, קבצים ששונו ומה כבר staged, בלי לשנות דבר."], code: `git status\n\n# On branch main\n# Changes not staged for commit:\n#   modified: index.html`, language: "bash", exercise: { id: "git-introduction-fill-status-1", type: "fill_blank", prompt: "איזו פקודה מציגה את מצב ה־repository בלי לשנות אותו?", code: `git ___`, language: "bash", options: [{ id: "status", label: "status" }, { id: "commit", label: "commit" }, { id: "push", label: "push" }], correctOptionId: "status", hint: "שם הפקודה מתאר את המצב הנוכחי.", explanation: "git status היא read-only ומראה מה השתנה, מה staged ובאיזה branch נמצאים." } },
    ], next: { title: "התקנה ו־config", path: "/tutorials/git/setup-config" },
  },
  "setup-config": {
    title: "התקנה ו־config",
    intro: ["Git צריכה לדעת איזה שם ואימייל לצרף ל־commits. המידע הזה אינו login; הוא metadata שמופיע ב־history.", "מגדירים identity פעם אחת ברמת global, ואפשר לדרוס אותה בתוך repository מסוימת. לעולם אין לשים password או token בתוך config שמוצג או משותף."],
    sections: [
      { title: "בדיקת התקנה וזהות", paragraphs: ["הפקודה --version מאשרת שה־CLI זמינה. config --global שומרת ברירת מחדל לכל repositories של המשתמש המקומי."], code: `git --version\ngit config --global user.name "Dana Cohen"\ngit config --global user.email "dana@example.com"`, language: "bash" },
      { title: "קריאת ה־config", paragraphs: ["--list מציגה את ה־config הפעילה. --show-origin מוסיפה מאיזה קובץ הגיע כל value ועוזרת להבין overrides."], code: `git config --list --show-origin\ngit config user.name\ngit config user.email`, language: "bash", exercise: { id: "git-config-fill-global-1", type: "fill_blank", prompt: "איזה flag שומר ברירת מחדל לכל ה־repositories?", code: `git config ___ user.name "Dana"`, language: "bash", options: [{ id: "global", label: "--global" }, { id: "all", label: "--all" }, { id: "remote", label: "--remote" }], correctOptionId: "global", hint: "ה־scope המבוקש הוא המשתמש כולו.", explanation: "--global שומרת את ההגדרה ב־user config. ללא flag, הפקודה פועלת על ה־repository הנוכחית." } },
    ], next: { title: "Repository ראשונה", path: "/tutorials/git/init-status" },
  },
  "init-status": {
    title: "Repository ראשונה",
    intro: ["git init מתחילה repository בתוך תיקייה קיימת. Git יוצרת תיקיית metadata נסתרת בשם .git ואינה משנה את קבצי הפרויקט.", "מריצים init בשורש המדויק של הפרויקט. Repository מקוננת בטעות יכולה לבלבל tracking, ולכן בודקים pwd ו־git status לפני שממשיכים."],
    sections: [
      { title: "התחלה מקומית", paragraphs: ["אחרי init, קבצים קיימים מופיעים כ־untracked עד שמחליטים להוסיף אותם. Git אינה עוקבת אוטומטית אחרי כל מה שבתיקייה."], code: `mkdir learning-site\ncd learning-site\ngit init\ngit status`, language: "bash" },
      { title: "מה Git רואה", paragraphs: ["קובץ untracked טרם השתתף באף commit. לאחר commit ראשון, שינויים נוספים בו יופיעו כ־modified."], code: `# לאחר יצירת index.html\ngit status --short\n# ?? index.html\n\ngit add index.html\ngit status --short\n# A  index.html`, language: "bash", exercise: { id: "git-init-predict-untracked-1", type: "predict_output", prompt: "מה מסמן ?? ב־git status --short?", code: `?? notes.md`, language: "bash", options: [{ id: "untracked", label: "קובץ untracked" }, { id: "deleted", label: "קובץ שנמחק" }, { id: "committed", label: "קובץ שכבר committed" }], correctOptionId: "untracked", hint: "Git עדיין לא קיבלה החלטה לעקוב אחרי הקובץ.", explanation: "?? מציין untracked file: הקובץ קיים ב־working tree אך עדיין לא נוסף ל־staging area או ל־history." } },
    ], next: { title: "Staging ו־commit", path: "/tutorials/git/staging-commits" },
  },
  "staging-commits": {
    title: "Staging ו־commits",
    intro: ["Staging area מאפשרת לבחור בדיוק אילו שינויים ייכנסו ל־commit הבא. כך commit נשאר focused גם אם working tree מכילה עבודה נוספת.", "Commit message טובה משלימה משפט כמו “This commit will…”. היא מתארת את התוצאה, לא רק שמות קבצים או מילים כלליות כמו update."],
    sections: [
      { title: "בחירה מדויקת", paragraphs: ["git add יכולה לקבל קובץ מסוים או path. לאחר מכן בודקים status כדי לוודא שה־staged snapshot מכיל רק את העבודה הרצויה."], code: `git add src/navbar.tsx\ngit add styles/navbar.css\ngit status\ngit commit -m "Add responsive navigation"`, language: "bash" },
      { title: "Commit קטן וקוהרנטי", paragraphs: ["שינוי קוד ותיקון documentation שקשור אליו יכולים להיות commit אחד. refactor לא קשור צריך commit נפרד כדי ש־review ו־revert יהיו ברורים."], code: `git add src/validation.ts tests/validation.test.ts\ngit diff --staged\ngit commit -m "Validate empty email addresses"`, language: "bash", exercise: { id: "git-staging-fill-add-1", type: "fill_blank", prompt: "איזו פקודה מוסיפה קובץ ל־staging area?", code: `git ___ app.js`, language: "bash", options: [{ id: "add", label: "add" }, { id: "save", label: "save" }, { id: "track", label: "track" }], correctOptionId: "add", hint: "זו הפקודה שמכינה תוכן ל־commit הבא.", explanation: "git add מעתיקה את הגרסה הנוכחית של הקובץ ל־staging area. היא עדיין אינה יוצרת commit." } },
    ], next: { title: "diff ו־log", path: "/tutorials/git/diff-log" },
  },
  "diff-log": {
    title: "קריאת diff ו־log",
    intro: ["לפני commit כדאי לקרוא את השינוי ש־Git עומדת לשמור. diff מציגה lines שנוספו והוסרו, ו־log מציגה את ה־history שכבר נשמרה.", "git diff ללא arguments משווה working tree ל־staging area. git diff --staged משווה staging area ל־commit האחרון, ולכן היא הבדיקה הסופית לפני commit."],
    sections: [
      { title: "שני סוגי diff", paragraphs: ["שינוי staged לא יופיע ב־git diff הרגילה. אם output ריק, בודקים status ואז --staged לפני שמניחים שאין שינויים."], code: `git diff\ngit diff --staged\ngit diff -- src/app.js`, language: "bash" },
      { title: "History קריאה", paragraphs: ["--oneline מציגה commit בכל שורה ו־--graph מוסיפה ציור של branches. אפשר להגביל path כדי להבין history של קובץ מסוים."], code: `git log --oneline --graph --decorate --all\ngit log --oneline -- src/app.js\ngit show HEAD`, language: "bash", exercise: { id: "git-diff-fill-staged-1", type: "fill_blank", prompt: "איזה flag מציג את השינויים שהוכנו ל־commit?", code: `git diff ___`, language: "bash", options: [{ id: "staged", label: "--staged" }, { id: "short", label: "--short" }, { id: "global", label: "--global" }], correctOptionId: "staged", hint: "שם ה־flag זהה לשם האזור שמכין את ה־snapshot.", explanation: "git diff --staged מציגה את ההבדל בין staging area לבין commit האחרון." } },
    ], next: { title: ".gitignore", path: "/tutorials/git/gitignore" },
  },
  gitignore: {
    title: "בחירת קבצים עם .gitignore",
    intro: ["לא כל קובץ בפרויקט שייך ל־Git. dependencies שניתנות להתקנה מחדש, build output, קבצי editor ו־secrets מקומיים בדרך כלל נשארים מחוץ ל־repository.", ".gitignore משפיעה על untracked files. היא אינה מפסיקה tracking של קובץ שכבר committed, ולכן secrets שכבר פורסמו דורשים טיפול נוסף והחלפת credentials."],
    sections: [
      { title: "Patterns נפוצים", paragraphs: ["Slash בסוף pattern מסמן directory. כוכבית מתאימה לכמה שמות, וסימן ! יכול להחזיר exception ממוקדת."], code: `node_modules/\ndist/\n.env\n*.log\n!.env.example`, language: "text" },
      { title: "בדיקת pattern", paragraphs: ["git check-ignore מסבירה איזה rule מסתירה path. אם קובץ כבר tracked, git rm --cached מסירה אותו מה־index אך משאירה אותו מקומית; יש להשתמש בזה בזהירות."], code: `git check-ignore -v .env\ngit status --ignored --short\n\n# לקובץ שכבר tracked:\ngit rm --cached .env`, language: "bash", exercise: { id: "git-ignore-predict-node-modules-1", type: "predict_output", prompt: "איזו שורה מתעלמת מכל תיקיית node_modules?", code: `# .gitignore`, language: "text", options: [{ id: "directory", label: "node_modules/" }, { id: "file", label: "node_modules.txt" }, { id: "command", label: "git ignore node_modules" }], correctOptionId: "directory", hint: "Pattern של directory מסתיימת ב־slash.", explanation: "node_modules/ מתאימה לתיקייה בשם זה. .gitignore מכילה patterns, לא פקודות Git." } },
    ], next: { title: "Branches", path: "/tutorials/git/branches" },
  },
  branches: {
    title: "Branches",
    intro: ["Branch היא pointer ניידת ל־commit. היא מאפשרת לפתח feature או fix בלי לערבב עבודה לא גמורה בתוך main.", "יצירת branch אינה מעתיקה את כל הפרויקט. Git מזיזה pointers ומשחזרת working tree לפי ה־commit שנבחר, ולכן switching מהיר."],
    sections: [
      { title: "יצירה ומעבר", paragraphs: ["git switch -c יוצרת branch ועוברת אליה. שם טוב מתאר את העבודה, למשל feature/profile-menu או fix/login-error."], code: `git switch -c feature/profile-menu\ngit status\n# On branch feature/profile-menu\n\ngit switch main`, language: "bash" },
      { title: "רשימת branches", paragraphs: ["הכוכבית מסמנת את ה־branch הנוכחית. -vv מוסיפה upstream ו־commit אחרון ועוזרת להבין את המצב מול remote."], code: `git branch\ngit branch -vv\ngit branch --merged`, language: "bash", exercise: { id: "git-branches-fill-switch-1", type: "fill_blank", prompt: "איזו פקודה יוצרת branch חדשה וגם עוברת אליה?", code: `git switch ___ feature/search`, language: "bash", options: [{ id: "create", label: "-c" }, { id: "delete", label: "-d" }, { id: "force", label: "-f" }], correctOptionId: "create", hint: "ה־flag הוא קיצור של create.", explanation: "git switch -c יוצרת branch חדשה מה־commit הנוכחי ומעבירה אליה את working tree." } },
    ], next: { title: "Merge ו־conflicts", path: "/tutorials/git/merge-conflicts" },
  },
  "merge-conflicts": {
    title: "Merge ו־conflicts",
    intro: ["Merge מחברת history של branch אחת לתוך אחרת. בדרך כלל עוברים ל־target branch ואז מריצים git merge עם שם ה־source branch.", "Conflict אינו תקלה ב־Git; הוא בקשה להחלטה אנושית כאשר שני histories שינו אותו אזור באופן שאי אפשר לשלב אוטומטית."],
    sections: [
      { title: "Merge רגילה", paragraphs: ["לפני merge מוודאים שה־working tree נקייה. אם אין divergence, Git יכולה לבצע fast-forward בלי ליצור merge commit."], code: `git switch main\ngit status\ngit merge feature/profile-menu\ngit log --oneline --graph`, language: "bash" },
      { title: "פתרון conflict", paragraphs: ["פותחים את הקבצים המסומנים, בוחרים את התוכן הנכון ומסירים conflict markers. אחר כך מוסיפים את הקבצים ויוצרים commit שמסיים את ה־merge."], code: `git status\n# both modified: src/menu.js\n\n# לאחר עריכת הקובץ:\ngit add src/menu.js\ngit commit`, language: "bash", exercise: { id: "git-merge-fill-target-1", type: "fill_blank", prompt: "מאיזו branch מריצים merge כדי להכניס feature אל main?", code: `git switch ___\ngit merge feature/search`, language: "bash", options: [{ id: "main", label: "main" }, { id: "feature", label: "feature/search" }, { id: "new", label: "branch חדשה" }], correctOptionId: "main", hint: "עוברים קודם ל־target branch שאליה רוצים להכניס את השינוי.", explanation: "git merge מכניסה את ה־source branch אל ה־branch הנוכחית, ולכן עוברים קודם ל־main." } },
    ], next: { title: "Remotes", path: "/tutorials/git/remotes" },
  },
  remotes: {
    title: "Remotes ו־clone",
    intro: ["Remote היא כתובת שמקשרת repository מקומית ל־repository אחרת, בדרך כלל ב־GitHub או שירות דומה. origin הוא שם מקובל ל־remote הראשית, לא keyword מיוחדת.", "clone מורידה repository ויוצרת remote בשם origin. אם התחלתם מקומית עם init, אפשר להוסיף remote בעזרת git remote add."],
    sections: [
      { title: "Clone ובדיקה", paragraphs: ["לאחר clone נכנסים לתיקייה ובודקים status ו־remote. fetch מעדכנת מידע מהשרת בלי לשנות את working tree."], code: `git clone https://example.com/team/app.git\ncd app\ngit remote -v\ngit fetch origin`, language: "bash" },
      { title: "הוספת origin", paragraphs: ["ל־repository מקומית קיימת מוסיפים URL פעם אחת. אפשר לשנות אותה עם set-url ולבדוק לפני push."], code: `git remote add origin https://example.com/dana/app.git\ngit remote get-url origin\ngit remote set-url origin https://example.com/team/app.git`, language: "bash", exercise: { id: "git-remotes-fill-origin-1", type: "fill_blank", prompt: "איזו פקודה מציגה את שמות וכתובות ה־remotes?", code: `git remote ___`, language: "bash", options: [{ id: "verbose", label: "-v" }, { id: "branch", label: "-b" }, { id: "delete", label: "-d" }], correctOptionId: "verbose", hint: "ה־flag מבקש output מפורט.", explanation: "git remote -v מציגה כל remote יחד עם כתובות fetch ו־push שלה." } },
    ], next: { title: "fetch, pull ו־push", path: "/tutorials/git/sync" },
  },
  sync: {
    title: "fetch, pull ו־push",
    intro: ["fetch מורידה מידע על commits ו־branches בלי לשלב אותו. pull מבצעת fetch ואז integration, ו־push שולחת commits מקומיים ל־remote.", "לפני push כדאי לעדכן את ה־branch ולפתור conflicts מקומית. לעולם אין לבצע force push ל־shared branch בלי להבין מי עוד מסתמך עליה."],
    sections: [
      { title: "סנכרון מודע", paragraphs: ["fetch מאפשרת לבדוק מה השתנה לפני integration. log עם שתי references מציגה commits שנמצאים בצד אחד ולא בשני."], code: `git fetch origin\ngit log --oneline main..origin/main\ngit pull --ff-only origin main`, language: "bash" },
      { title: "Push ראשונה", paragraphs: ["-u קובעת upstream, כך שבפעמים הבאות git push ו־git pull יודעות לאיזו remote branch לפנות."], code: `git switch -c feature/search\ngit push -u origin feature/search\n\n# בהמשך:\ngit push`, language: "bash", exercise: { id: "git-sync-predict-fetch-1", type: "predict_output", prompt: "איזו פקודה מורידה מידע בלי לשלב אותו ב־working branch?", code: `git ___ origin`, language: "bash", options: [{ id: "fetch", label: "fetch" }, { id: "pull", label: "pull" }, { id: "push", label: "push" }], correctOptionId: "fetch", hint: "הפקודה מעדכנת remote-tracking branches בלבד.", explanation: "git fetch מורידה objects ו־references מה־remote אך אינה מבצעת merge או rebase ל־branch הנוכחית." } },
    ], next: { title: "Undo בטוח", path: "/tutorials/git/undo" },
  },
  undo: {
    title: "Undo בטוח",
    intro: ["Git מציעה כמה דרכי undo, וכל אחת פועלת על אזור אחר. לפני פעולה בודקים status ו־diff ומחליטים אם רוצים לשמור את השינוי, להסיר אותו מה־staging או ליצור commit הפוכה.", "ב־shared history מעדיפים revert כי היא אינה מוחקת commits קיימים. reset ו־restore יכולות לאבד עבודה מקומית, ולכן משתמשים בהן עם target מפורש ואחרי בדיקה."],
    sections: [
      { title: "Unstage בלי למחוק", paragraphs: ["git restore --staged מוציאה קובץ מה־staging area ומשאירה את השינוי ב־working tree. כך אפשר לפצל commit בלי לאבד עריכה."], code: `git status\ngit restore --staged src/app.js\ngit diff src/app.js`, language: "bash" },
      { title: "Revert ל־commit שפורסמה", paragraphs: ["git revert יוצרת commit חדשה שמבטלת את השינוי של commit קודמת. ה־history נשארת שלמה וברורה לשאר הצוות."], code: `git log --oneline\ngit revert a1b2c3d\ngit push`, language: "bash", exercise: { id: "git-undo-fill-revert-1", type: "fill_blank", prompt: "איזו פקודה בטוחה לביטול commit שכבר פורסמה?", code: `git ___ a1b2c3d`, language: "bash", options: [{ id: "revert", label: "revert" }, { id: "init", label: "init" }, { id: "add", label: "add" }], correctOptionId: "revert", hint: "הפקודה יוצרת commit חדשה במקום למחוק history.", explanation: "git revert מתעדת undo כ־commit חדשה ולכן מתאימה ל־shared history." } },
    ], next: { title: "Workflow בצוות", path: "/tutorials/git/collaboration" },
  },
  collaboration: {
    title: "Workflow בצוות",
    intro: ["Workflow טובה הופכת שינויים לקלים ל־review ולשילוב. מתחילים מ־main מעודכנת, עובדים ב־feature branch, יוצרים commits focused ופותחים Pull Request.", "Pull Request היא feature של hosting platform, לא פקודת Git. היא מאפשרת discussion, automated checks ו־review לפני merge."],
    sections: [
      { title: "מחזור עבודה", paragraphs: ["מעדכנים main לפני יצירת branch כדי להתחיל מבסיס טרי. לאחר push, פותחים Pull Request ומתארים מה השתנה ואיך בדקתם."], code: `git switch main\ngit pull --ff-only\ngit switch -c feature/course-search\n# edit, test\ngit add .\ngit commit -m "Add course search"\ngit push -u origin feature/course-search`, language: "bash" },
      { title: "לפני review", paragraphs: ["בודקים status נקייה, קוראים diff ו־commits ומריצים tests. אין לכלול secrets, generated files או refactor לא קשור רק כדי “לסדר בדרך”."], code: `git status\ngit diff origin/main...HEAD\ngit log --oneline origin/main..HEAD\nnpm test`, language: "bash", exercise: { id: "git-collaboration-predict-first-step-1", type: "predict_output", prompt: "מה כדאי לעשות לפני יצירת feature branch חדשה?", code: `# בחרו את הצעד ששומר בסיס עדכני`, language: "text", options: [{ id: "update", label: "לעבור ל־main ולעדכן אותה" }, { id: "force", label: "לבצע force push" }, { id: "delete", label: "למחוק את ה־repository" }], correctOptionId: "update", hint: "Feature חדשה צריכה להתחיל מה־commit העדכנית של branch הבסיס.", explanation: "מעבר ל־main ועדכון שלה מצמצמים conflicts ומבטיחים שה־feature branch מתחילה מבסיס עדכני." } },
      { title: "המשך הדרך", paragraphs: ["מכאן כדאי לתרגל repository אמיתית עם branches קצרות ו־Pull Requests קטנות. לאחר שה־workflow יציבה, אפשר ללמוד rebase, tags ו־CI בלי לוותר על status ו־diff לפני פעולות."] },
    ],
  },
} satisfies Record<string, TutorialLessonContent>;

export type GitLessonKey = keyof typeof gitLessons;
