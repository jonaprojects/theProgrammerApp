ALTER TABLE questions
  ADD COLUMN code text,
  ADD COLUMN code_language text,
  ADD CONSTRAINT questions_code_snippet_complete CHECK (
    (code IS NULL AND code_language IS NULL)
    OR (
      code IS NOT NULL
      AND char_length(code) > 0
      AND code_language IS NOT NULL
      AND code_language ~ '^[a-z0-9+#._-]+$'
    )
  );
