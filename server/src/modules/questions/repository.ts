import type { Queryable } from "../../shared/types.js";

interface TopicRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  questionCount: number;
}

interface QuestionRow {
  id: string;
  prompt: string;
  type: "multiple_choice" | "boolean";
  difficulty: number;
  codeSnippet: { language: string; code: string } | null;
}

interface OptionRow {
  id: string;
  questionId: string;
  label: string;
  position: number;
}

export interface PublicQuestion extends QuestionRow {
  options: OptionRow[];
}

export class QuestionRepository {
  constructor(private readonly database: Queryable) {}

  async listTopics(): Promise<TopicRow[]> {
    const result = await this.database.query<TopicRow>(`
      WITH eligible_questions AS (
        SELECT q.id, q.topic_id
        FROM questions q
        JOIN question_options qo ON qo.question_id = q.id AND qo.active
        WHERE q.status = 'published'
        GROUP BY q.id
        HAVING count(*) >= 2 AND count(*) FILTER (WHERE qo.is_correct) = 1
      )
      SELECT
        t.id,
        t.slug,
        t.title,
        t.description,
        count(q.id)::integer AS "questionCount"
      FROM topics t
      LEFT JOIN eligible_questions q ON q.topic_id = t.id
      GROUP BY t.id
      ORDER BY t.title
    `);
    return result.rows;
  }

  async listPublishedByTopic(topicSlug: string, limit: number): Promise<PublicQuestion[] | null> {
    const topicResult = await this.database.query<{ id: string }>(
      "SELECT id FROM topics WHERE slug = $1",
      [topicSlug],
    );
    const topic = topicResult.rows[0];
    if (!topic) return null;

    const questionsResult = await this.database.query<QuestionRow>(`
      WITH eligible_questions AS (
        SELECT q.id
        FROM questions q
        JOIN question_options qo ON qo.question_id = q.id AND qo.active
        WHERE q.topic_id = $1 AND q.status = 'published'
        GROUP BY q.id
        HAVING count(*) >= 2 AND count(*) FILTER (WHERE qo.is_correct) = 1
      )
      SELECT
        q.id,
        q.prompt,
        q.type,
        q.difficulty,
        CASE
          WHEN q.code IS NULL THEN NULL
          ELSE json_build_object('language', q.code_language, 'code', q.code)
        END AS "codeSnippet"
      FROM questions q
      JOIN eligible_questions eligible ON eligible.id = q.id
      ORDER BY random()
      LIMIT $2
    `, [topic.id, limit]);

    const questionIds = questionsResult.rows.map(({ id }) => id);
    if (questionIds.length === 0) return [];

    const optionsResult = await this.database.query<OptionRow>(`
      SELECT
        id,
        question_id AS "questionId",
        label,
        position
      FROM question_options
      WHERE question_id = ANY($1::uuid[]) AND active
      ORDER BY question_id, position
    `, [questionIds]);
    const optionsByQuestion = new Map<string, OptionRow[]>();
    for (const option of optionsResult.rows) {
      const options = optionsByQuestion.get(option.questionId) ?? [];
      options.push(option);
      optionsByQuestion.set(option.questionId, options);
    }

    return questionsResult.rows.map((question) => ({
      ...question,
      options: optionsByQuestion.get(question.id) ?? [],
    }));
  }
}
