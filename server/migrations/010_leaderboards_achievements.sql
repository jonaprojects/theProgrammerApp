CREATE TABLE achievements (
  key text PRIMARY KEY CHECK (key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  metric text NOT NULL CHECK (metric IN (
    'points', 'answered_questions', 'correct_answers', 'completed_lessons',
    'streak_days', 'completed_courses', 'multiplayer_wins'
  )),
  threshold integer NOT NULL CHECK (threshold > 0),
  position smallint NOT NULL UNIQUE CHECK (position > 0),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_achievements (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_key text NOT NULL REFERENCES achievements(key) ON DELETE CASCADE,
  metric_value integer NOT NULL CHECK (metric_value >= 0),
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, achievement_key)
);

CREATE INDEX user_achievements_user_unlocked_idx
  ON user_achievements (user_id, unlocked_at DESC);

CREATE TRIGGER achievements_set_updated_at BEFORE UPDATE ON achievements
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO achievements (key, title, description, icon_name, metric, threshold, position) VALUES
  ('first-steps', 'צעדים ראשונים', 'צברו 100 נקודות', 'sparkles', 'points', 100, 1),
  ('points-500', 'בדרך למעלה', 'צברו 500 נקודות', 'trending-up', 'points', 500, 2),
  ('points-1000', 'אלופי הנקודות', 'צברו 1,000 נקודות', 'trophy', 'points', 1000, 3),
  ('questions-10', 'הסקרנות מתחילה', 'ענו על 10 שאלות שונות', 'help-circle', 'answered_questions', 10, 4),
  ('questions-50', 'לא מפסיקים לשאול', 'ענו על 50 שאלות שונות', 'chatbubbles', 'answered_questions', 50, 5),
  ('correct-10', 'פגיעה מדויקת', 'פתרו נכון 10 שאלות שונות', 'checkmark-circle', 'correct_answers', 10, 6),
  ('correct-50', 'חדים במיוחד', 'פתרו נכון 50 שאלות שונות', 'ribbon', 'correct_answers', 50, 7),
  ('lesson-1', 'שיעור ראשון', 'השלימו את השיעור הראשון', 'book', 'completed_lessons', 1, 8),
  ('lessons-10', 'בקצב מצוין', 'השלימו 10 שיעורים', 'library', 'completed_lessons', 10, 9),
  ('streak-3', 'נכנסים לקצב', 'למדו במשך 3 ימים ברצף', 'flame', 'streak_days', 3, 10),
  ('streak-7', 'שבוע של התמדה', 'למדו במשך 7 ימים ברצף', 'bonfire', 'streak_days', 7, 11),
  ('course-1', 'קו הסיום', 'השלימו קורס ראשון', 'school', 'completed_courses', 1, 12),
  ('multiplayer-win-1', 'ניצחון ראשון', 'נצחו במשחק מול לומד אחר', 'game-controller', 'multiplayer_wins', 1, 13),
  ('multiplayer-wins-10', 'אלופי הזירה', 'נצחו ב-10 משחקים', 'medal', 'multiplayer_wins', 10, 14);
