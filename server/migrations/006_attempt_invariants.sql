ALTER TABLE attempts
  ADD COLUMN explanation text,
  ADD COLUMN correct_option_id uuid REFERENCES question_options(id) ON DELETE RESTRICT,
  ADD COLUMN correct_option_label text;

UPDATE attempts a
SET
  explanation = q.explanation,
  correct_option_id = correct_option.id,
  correct_option_label = correct_option.label
FROM questions q
JOIN LATERAL (
  SELECT qo.id, qo.label
  FROM question_options qo
  WHERE qo.question_id = q.id AND qo.is_correct
  ORDER BY qo.active DESC, qo.position
  LIMIT 1
) correct_option ON true
WHERE q.id = a.question_id;

ALTER TABLE attempts
  ALTER COLUMN correct_option_id SET NOT NULL,
  ALTER COLUMN correct_option_label SET NOT NULL;

ALTER TABLE question_options
  ADD CONSTRAINT question_options_id_question_unique UNIQUE (id, question_id);

ALTER TABLE attempts
  ADD CONSTRAINT attempts_selected_option_question_fk
    FOREIGN KEY (selected_option_id, question_id)
    REFERENCES question_options (id, question_id) ON DELETE RESTRICT,
  ADD CONSTRAINT attempts_correct_option_question_fk
    FOREIGN KEY (correct_option_id, question_id)
    REFERENCES question_options (id, question_id) ON DELETE RESTRICT;

CREATE UNIQUE INDEX question_options_one_active_correct_idx
  ON question_options (question_id)
  WHERE active AND is_correct;
