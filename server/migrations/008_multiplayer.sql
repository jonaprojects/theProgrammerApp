CREATE TABLE multiplayer_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(8) NOT NULL UNIQUE CHECK (code ~ '^[A-Z2-9]{8}$'),
  host_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE RESTRICT,
  visibility text NOT NULL CHECK (visibility IN ('private', 'public')),
  status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'active', 'finished', 'cancelled')),
  question_count smallint NOT NULL CHECK (question_count BETWEEN 5 AND 20),
  round_duration_seconds smallint NOT NULL DEFAULT 20
    CHECK (round_duration_seconds BETWEEN 10 AND 60),
  current_question_position smallint NOT NULL DEFAULT 0 CHECK (current_question_position >= 0),
  round_started_at timestamptz,
  round_ends_at timestamptz,
  round_revealed_at timestamptz,
  winner_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  rewards_applied boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 minutes'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (current_question_position <= question_count),
  CHECK (round_ends_at IS NULL OR round_started_at IS NOT NULL),
  CHECK (round_revealed_at IS NULL OR round_started_at IS NOT NULL)
);

CREATE TABLE multiplayer_players (
  match_id uuid NOT NULL REFERENCES multiplayer_matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 80),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'left', 'forfeited')),
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  correct_count smallint NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
  answered_count smallint NOT NULL DEFAULT 0 CHECK (answered_count >= 0),
  reward_points smallint NOT NULL DEFAULT 0 CHECK (reward_points >= 0),
  joined_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (match_id, user_id),
  CHECK (correct_count <= answered_count)
);

CREATE TABLE multiplayer_match_questions (
  match_id uuid NOT NULL REFERENCES multiplayer_matches(id) ON DELETE CASCADE,
  position smallint NOT NULL CHECK (position > 0),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
  PRIMARY KEY (match_id, position),
  UNIQUE (match_id, question_id)
);

CREATE TABLE multiplayer_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES multiplayer_matches(id) ON DELETE CASCADE,
  question_position smallint NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  selected_option_id uuid NOT NULL REFERENCES question_options(id) ON DELETE RESTRICT,
  idempotency_key uuid NOT NULL,
  is_correct boolean NOT NULL,
  response_ms integer NOT NULL CHECK (response_ms >= 0),
  points_awarded integer NOT NULL CHECK (points_awarded >= 0),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, question_position, user_id),
  UNIQUE (match_id, user_id, idempotency_key),
  FOREIGN KEY (match_id, question_position)
    REFERENCES multiplayer_match_questions(match_id, position) ON DELETE CASCADE
);

CREATE INDEX multiplayer_matches_public_queue_idx
  ON multiplayer_matches (topic_id, question_count, created_at)
  WHERE visibility = 'public' AND status = 'waiting';
CREATE INDEX multiplayer_matches_host_idx ON multiplayer_matches (host_user_id, updated_at DESC);
CREATE INDEX multiplayer_players_user_idx ON multiplayer_players (user_id, joined_at DESC);
CREATE INDEX multiplayer_answers_match_round_idx
  ON multiplayer_answers (match_id, question_position, submitted_at);

CREATE TRIGGER multiplayer_matches_set_updated_at BEFORE UPDATE ON multiplayer_matches
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
