import { randomUUID } from "node:crypto";

const apiBaseUrl = process.env.SMOKE_API_URL?.replace(/\/$/, "");
const webBaseUrl = process.env.SMOKE_WEB_URL?.replace(/\/$/, "");
const email = process.env.SMOKE_EMAIL;
const password = process.env.SMOKE_PASSWORD;

if (!apiBaseUrl?.endsWith("/api/v1") || !apiBaseUrl.startsWith("https://")) {
  throw new Error("SMOKE_API_URL must be an HTTPS URL ending in /api/v1");
}
if (!webBaseUrl?.startsWith("https://")) throw new Error("SMOKE_WEB_URL must use HTTPS");
if (!email || !password) throw new Error("SMOKE_EMAIL and SMOKE_PASSWORD are required");

let requestCount = 0;
const maximumRequests = 16;

async function request(path, { token, expected = [200], ...init } = {}) {
  requestCount += 1;
  if (requestCount > maximumRequests) throw new Error("Release smoke request budget exceeded");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!expected.includes(response.status)) {
    const body = await response.text();
    throw new Error(`${init.method ?? "GET"} ${path} returned ${response.status}: ${body.slice(0, 500)}`);
  }
  if (response.status === 204) return undefined;
  const payload = await response.json();
  return payload.data;
}

const webHealth = await fetch(`${webBaseUrl}/health`, { signal: AbortSignal.timeout(10_000) });
if (!webHealth.ok) throw new Error(`Web health returned ${webHealth.status}`);

const auth = await request("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
if (!auth?.token) throw new Error("Login did not return a session token");
const token = auth.token;

const profile = await request("/me/profile", { token });
if (profile.email?.toLowerCase() !== email.toLowerCase()) throw new Error("Profile did not match the smoke account");

const courses = await request("/courses");
const course = courses?.find((candidate) => candidate.slug === "html-basics") ?? courses?.[0];
if (!course) throw new Error("No published course is available");
const courseDetails = await request(`/courses/${encodeURIComponent(course.slug)}`);
const lesson = courseDetails.lessons?.[0];
if (!lesson) throw new Error("The selected course has no published lesson");

await request("/me/enrollments", {
  token,
  method: "POST",
  body: JSON.stringify({ courseId: course.id }),
  expected: [204],
});
await request(`/me/courses/${encodeURIComponent(course.slug)}/lessons/${encodeURIComponent(lesson.slug)}/progress`, {
  token,
  method: "PUT",
  body: JSON.stringify({ status: "completed" }),
  expected: [204],
});

if (course.slug === "html-basics") {
  await request("/me/tutorial-exercises/html-introduction-fill-tag-1/submissions", {
    token,
    method: "POST",
    body: JSON.stringify({ action: "reveal", hintUsed: true, idempotencyKey: randomUUID() }),
    expected: [200, 201],
  });
}

const topics = await request("/topics");
const topic = topics?.find((candidate) => candidate.questionCount > 0);
if (!topic) throw new Error("No topic with published questions is available");
const questions = await request(`/topics/${encodeURIComponent(topic.slug)}/questions?limit=1`);
const question = questions?.[0];
const option = question?.options?.[0];
if (!question || !option) throw new Error("A published question did not include an option");
await request("/attempts", {
  token,
  method: "POST",
  body: JSON.stringify({
    questionId: question.id,
    selectedOptionId: option.id,
    idempotencyKey: randomUUID(),
    timeSpentSeconds: 1,
  }),
  expected: [200, 201],
});

const progress = await request("/me/progress", { token });
const enrollment = progress.enrollments?.find((candidate) => candidate.courseSlug === course.slug);
const lessonProgress = enrollment?.lessons?.find((candidate) => candidate.lessonSlug === lesson.slug);
if (lessonProgress?.status !== "completed") throw new Error("Completed lesson progress was not persisted");

await request("/auth/logout", { token, method: "POST", expected: [204] });
await request("/me/profile", { token, expected: [401] });

process.stdout.write(`Bounded release smoke passed (${requestCount} sequential API requests).\n`);
