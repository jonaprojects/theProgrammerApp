CREATE TABLE tutorial_exercises (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN (
    'predict_output', 'fill_blank', 'find_bug', 'order_code', 'trace'
  )),
  prompt text NOT NULL,
  explanation text NOT NULL,
  hint text,
  answer_key jsonb NOT NULL,
  points integer NOT NULL DEFAULT 5 CHECK (points BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tutorial_exercise_progress (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id text NOT NULL REFERENCES tutorial_exercises(id) ON DELETE CASCADE,
  attempts_count integer NOT NULL DEFAULT 0 CHECK (attempts_count >= 0),
  completed boolean NOT NULL DEFAULT false,
  hint_used boolean NOT NULL DEFAULT false,
  solution_revealed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  last_attempted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id),
  CHECK (completed = (completed_at IS NOT NULL))
);

CREATE TABLE tutorial_exercise_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id text NOT NULL REFERENCES tutorial_exercises(id) ON DELETE RESTRICT,
  idempotency_key uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('check', 'reveal')),
  answer jsonb,
  is_correct boolean,
  hint_used boolean NOT NULL DEFAULT false,
  points_awarded integer NOT NULL DEFAULT 0 CHECK (points_awarded >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, idempotency_key),
  CHECK (
    (action = 'check' AND answer IS NOT NULL AND is_correct IS NOT NULL)
    OR (action = 'reveal' AND answer IS NULL AND is_correct IS NULL AND points_awarded = 0)
  )
);

CREATE INDEX tutorial_exercises_lesson_idx ON tutorial_exercises (lesson_id) WHERE status = 'published';
CREATE INDEX tutorial_exercise_progress_user_idx ON tutorial_exercise_progress (user_id, last_attempted_at DESC);
CREATE INDEX tutorial_exercise_submissions_user_idx ON tutorial_exercise_submissions (user_id, created_at DESC);
