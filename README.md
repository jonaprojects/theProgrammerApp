# Welcome to your Expo app 👋

## Backend

The PostgreSQL-backed Node.js API lives in [`server/`](./server). Its README documents the architecture, local setup, database migration flow, API endpoints, and authentication boundary.

Useful root commands:

```bash
npm run backend:dev
npm run backend:build
npm run backend:test
npm run backend:migrate
```

From `server/`, use `npm run content:validate` and `npm run content:import` to normalize and load the existing static questions and populated Python tutorials into PostgreSQL.

Questions may include an optional syntax-highlighted snippet:

```ts
codeSnippet: {
  language: "typescript",
  code: "const answer: number = 42;",
}
```

The importer stores the language and source together, the public questions API returns them as `codeSnippet`, and the exercise screen renders the snippet responsively with horizontal scrolling for long lines.

Exercise sessions are persisted locally for 24 hours per topic, including the
randomized question order, current question, skips, selections, and revealed
feedback. Answer submissions are persisted by the API with idempotency keys, so
a connection retry cannot award points or increment progress twice.

Interactive exercises embedded in tutorial lessons are server-backed. Their
attempts, hints, reveals, completion, lesson status, and one-time rewards follow
the signed-in user across devices. Native session tokens are stored in encrypted
Expo SecureStore; the web build uses browser storage.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Run the full development environment

1. Install the app and API dependencies.

   ```bash
   npm install
   npm --prefix server install
   ```

2. Copy `server/.env.example` to `server/.env`, then start PostgreSQL and prepare its content.

   ```bash
   cd server
   docker compose up -d
   npm run db:migrate
   npm run content:validate
   npm run content:import
   cd ..
   ```

3. Start the API in one terminal.

   ```bash
   npm run backend:dev
   ```

4. Start Expo in another terminal.

   ```bash
   npm run web -- --port 8082
   ```

The web app uses `http://localhost:3000/api/v1` by default. Android emulators use
`http://10.0.2.2:3000/api/v1`. To use another API address, copy `.env.example` to
`.env`, set `EXPO_PUBLIC_API_URL`, and restart Expo.

On first launch, create an account with an email address, password, and display
name. The app persists the session, restores it on later launches, and provides
profile editing and logout from the name/avatar in the top navigation.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

The TypeScript files under `data/` remain the authoring source for questions and
tutorials. Runtime catalog, exercise, enrollment, scoring, and progress screens read
from PostgreSQL through the API.

Tutorial authors should follow [`docs/tutorial-writing-guide.md`](./docs/tutorial-writing-guide.md),
which defines the shared Hebrew voice, lesson structure, code-example rules,
exercise standard, terminology, accuracy checks, and mobile review checklist.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
