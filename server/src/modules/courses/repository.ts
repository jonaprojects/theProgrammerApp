import type { Queryable } from "../../shared/types.js";

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  languageCode: string;
  imageKey: string | null;
  lessonCount: number;
}

interface LessonRow {
  id: string;
  slug: string;
  title: string;
  position: number;
  content: unknown[];
}

export interface Course extends CourseRow {
  lessons?: LessonRow[];
}

const courseSelection = `
  SELECT
    c.id,
    c.slug,
    c.title,
    c.description,
    c.language_code AS "languageCode",
    c.image_key AS "imageKey",
    count(l.id)::integer AS "lessonCount"
  FROM courses c
  LEFT JOIN lessons l ON l.course_id = c.id AND l.status = 'published'
`;

export class CourseRepository {
  constructor(private readonly database: Queryable) {}

  async listPublished(): Promise<Course[]> {
    const result = await this.database.query<CourseRow>(`${courseSelection}
      WHERE c.status = 'published'
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    return result.rows;
  }

  async findPublishedBySlug(slug: string): Promise<Course | null> {
    const courseResult = await this.database.query<CourseRow>(`${courseSelection}
      WHERE c.status = 'published' AND c.slug = $1
      GROUP BY c.id
    `, [slug]);
    const course = courseResult.rows[0];
    if (!course) return null;

    const lessonsResult = await this.database.query<LessonRow>(`
      SELECT id, slug, title, position, content
      FROM lessons
      WHERE course_id = $1 AND status = 'published'
      ORDER BY position
    `, [course.id]);

    return { ...course, lessons: lessonsResult.rows };
  }
}
