UPDATE lesson_progress
SET completed_at = COALESCE(completed_at, last_accessed_at)
WHERE status = 'completed';

UPDATE lesson_progress
SET completed_at = NULL
WHERE status <> 'completed';

ALTER TABLE lesson_progress
  ADD CONSTRAINT lesson_progress_completion_consistency
  CHECK ((status = 'completed') = (completed_at IS NOT NULL));

UPDATE enrollments e
SET completed_at = COALESCE(e.completed_at, now())
WHERE EXISTS (
  SELECT 1 FROM lessons l
  WHERE l.course_id = e.course_id AND l.status = 'published'
)
AND NOT EXISTS (
  SELECT 1
  FROM lessons l
  LEFT JOIN lesson_progress lp
    ON lp.lesson_id = l.id AND lp.user_id = e.user_id
  WHERE l.course_id = e.course_id
    AND l.status = 'published'
    AND COALESCE(lp.status, 'not_started') <> 'completed'
);

CREATE INDEX lesson_progress_user_accessed_idx
  ON lesson_progress (user_id, last_accessed_at DESC);
