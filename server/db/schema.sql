CREATE DATABASE reviews;

\c reviews;

-- SET TIME ZONE = zulu;

CREATE SCHEMA reviews

CREATE TABLE list (
  id INT PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  rating SMALLINT NOT NULL,
  -- date TIMESTAMPTZ,
  summary VARCHAR(80) NOT NULL,
  body VARCHAR(300),
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(30) NOT NULL,
  reviewer_email VARCHAR(36),
  response VARCHAR(80),
  helpfulness SMALLINT
)

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



-- CREATE TABLE IF NOT EXISTS reviews.traits (
--   id INT PRIMARY KEY UNIQUE NOT NULL,
--   product_id INT NOT NULL REFERENCES list(product_id),
--   name VARCHAR(12) NOT NULL
-- );



-- CREATE TABLE IF NOT EXISTS products_reviews (
--   /* many to many - product_id to review_id */
--   PRIMARY KEY(review_id)
--   FOREIGN KEY(review_id) REFERENCES reviews.list.id
--   FOREIGN KEY(product_id) REFERENCES reviews.list.product_id
-- );


-- CREATE TABLE IF NOT EXISTS users (
--   name varchar(20) NOT NULL,
--   email VARCHAR(36) NOT NULL,
--   PRIMARY KEY(email),
--   FOREIGN KEY(name) REFERENCES reviews.list.reviewer_name /* maybe extraneous */
-- );

CREATE TABLE IF NOT EXISTS photos (
  id INT NOT NULL,
  review_id INT NOT NULL,
  url VARCHAR(160)
  -- FOREIGN KEY(review_id) REFERENCES list(id)
);

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



\copy reviews.list from './csv/test.csv' delimiter ',' csv header


-- \copy list from './csv/reviews.csv' delimiter ',' csv header