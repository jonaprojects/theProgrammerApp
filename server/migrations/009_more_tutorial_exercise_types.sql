ALTER TABLE tutorial_exercises
  DROP CONSTRAINT tutorial_exercises_type_check;

ALTER TABLE tutorial_exercises
  ADD CONSTRAINT tutorial_exercises_type_check CHECK (type IN (
    'predict_output', 'fill_blank', 'find_bug', 'order_code', 'trace',
    'select_multiple', 'match_pairs'
  ));
