ALTER TABLE lessons
  ADD COLUMN source_key text UNIQUE;

ALTER TABLE questions
  ADD COLUMN source_key text UNIQUE;

ALTER TABLE question_options
  ADD COLUMN active boolean NOT NULL DEFAULT true;

CREATE INDEX questions_source_key_idx ON questions (source_key)
  WHERE source_key IS NOT NULL;
