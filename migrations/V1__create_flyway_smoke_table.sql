CREATE TABLE IF NOT EXISTS flyway_smoke_test (
  id SERIAL PRIMARY KEY,
  note VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO flyway_smoke_test (note)
VALUES ('flyway smoke test migration applied');
