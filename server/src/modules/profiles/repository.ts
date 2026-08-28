import type { Queryable } from "../../shared/types.js";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  points: number;
  createdAt: Date;
}

export class ProfileRepository {
  constructor(private readonly database: Queryable) {}

  async get(userId: string): Promise<UserProfile | null> {
    const result = await this.database.query<UserProfile>(`
      SELECT
        id,
        auth_subject AS email,
        display_name AS "displayName",
        bio,
        points,
        created_at AS "createdAt"
      FROM users
      WHERE id = $1 AND auth_provider = 'password'
    `, [userId]);
    return result.rows[0] ?? null;
  }

  async update(userId: string, input: { displayName?: string | undefined; bio?: string | undefined }): Promise<UserProfile | null> {
    const result = await this.database.query<UserProfile>(`
      UPDATE users
      SET
        display_name = COALESCE($2, display_name),
        bio = COALESCE($3, bio)
      WHERE id = $1 AND auth_provider = 'password'
      RETURNING
        id,
        auth_subject AS email,
        display_name AS "displayName",
        bio,
        points,
        created_at AS "createdAt"
    `, [userId, input.displayName ?? null, input.bio ?? null]);
    return result.rows[0] ?? null;
  }
}
