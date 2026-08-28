import { loadConfig, loadLocalEnvFile } from "../config/env.js";
import { createPool } from "../db/pool.js";
import { ContentImportService } from "./import-service.js";
import { loadLegacyContent } from "./load-content.js";

try {
  const bundle = await loadLegacyContent();
  if (process.argv.includes("--dry-run")) {
    const summary = {
      topics: bundle.topics.length,
      questions: bundle.topics.reduce((total, topic) => total + topic.questions.length, 0),
      options: bundle.topics.reduce(
        (total, topic) => total + topic.questions.reduce(
          (topicTotal, question) => topicTotal + question.options.length,
          0,
        ),
        0,
      ),
      courses: 1,
      lessons: bundle.lessons.length,
      skippedEmptyLessons: bundle.skippedEmptyLessons,
      normalizations: bundle.normalizations,
      rejections: bundle.rejections,
    };
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    if (summary.rejections.length > 0) process.exitCode = 2;
  } else {
    loadLocalEnvFile();
    const pool = createPool(loadConfig());
    try {
      const summary = await new ContentImportService(pool).import(bundle);
      process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
      if (summary.rejections.length > 0) process.exitCode = 2;
    } finally {
      await pool.end();
    }
  }
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
}
