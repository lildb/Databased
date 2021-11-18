DROP DATABASE reviews;

CREATE DATABASE reviews;

\c reviews;

CREATE SCHEMA IF NOT EXISTS reviews AUTHORIZATION ciele;

SET TIME ZONE='Zulu';

CREATE TABLE reviews.list (
  id INT PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  rating SMALLINT NOT NULL,
  date TIMESTAMPTZ,
  summary VARCHAR(80) NOT NULL,
  body VARCHAR(300),
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(30) NOT NULL,
  reviewer_email VARCHAR(36),
  response VARCHAR(80),
  helpfulness SMALLINT
);

CREATE TEMP TABLE importreviews (
  id INT,
  product_id INT,
  rating SMALLINT,
  date BIGINT,
  summary VARCHAR(80) NOT NULL,
  body VARCHAR(300),
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(30) NOT NULL,
  reviewer_email VARCHAR(36),
  response VARCHAR(80),
  helpfulness SMALLINT
);


\copy importreviews from './csv/reviews.csv' delimiter ',' csv header;

INSERT INTO reviews.list (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
SELECT id, product_id, rating, to_timestamp(date / 1000), summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness
FROM importreviews;


-- id
-- product_id
-- rating
-- date
-- summary
-- body
-- recommend
-- reported
-- reviewer_name
-- reviewer_email
-- response
-- helpfulness // headers from CSV file



-- CREATE TABLE IF NOT EXISTS photos (
--   id INT NOT NULL,
--   review_id INT NOT NULL,
--   url VARCHAR(160)
--   -- FOREIGN KEY(review_id) REFERENCES list(id)
-- );

/*  Execute this file from the command line by typing:


psql -U ciele -d reviews -f ./server/db/schema.sql

  *  to create the database, schema, and the tables.

login:

psql -U ciele -d reviews





  head -7 answers_photos.csv

 */


-- JOIN TABLES OR QUERIES:

-- CREATE TABLE IF NOT EXISTS products_meta (
--   id INT NOT NULL ,
--   results INT NOT NULL, /* qty of reviews */
--   recommended SMALLINT,
--   not_recommended SMALLINT,
--   1_star SMALLINT DEFAULT 0,
--   2_star SMALLINT DEFAULT 0,
--   3_star SMALLINT DEFAULT 0,
--   4_star SMALLINT DEFAULT 0,
--   5_star SMALLINT DEFAULT 0,
--   PRIMARY KEY id
-- );






-- \copy date (reviewer_email) from './csv/test.csv' delimiter ',' csv header


-- \copy list from './csv/reviews.csv' delimiter ',' csv header
