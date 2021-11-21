\c testing;

DROP TABLE IF EXISTS test;

CREATE TABLE test (
  id INT PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT,
  summary VARCHAR NOT NULL,
  body VARCHAR,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness SMALLINT
);

\copy test from './csv/test.csv' delimiter ',' csv header;


/*

Execute this file:

  psql -U ciele postgres -f ./tests/pgtest.sql

*/
