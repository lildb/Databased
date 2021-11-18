-- DROP DATABASE reviews;

CREATE DATABASE reviews;

\c reviews;

CREATE SCHEMA IF NOT EXISTS reviews AUTHORIZATION ciele;

SET TIME ZONE 'UTC';

-- CREATE TABLE reviews.list (
--   id INT PRIMARY KEY NOT NULL,
--   product_id INT NOT NULL,
--   rating SMALLINT NOT NULL,
--   date TIMESTAMPTZ,
--   summary VARCHAR NOT NULL,
--   body VARCHAR,
--   recommend BOOLEAN,
--   reported BOOLEAN,
--   reviewer_name VARCHAR(30) NOT NULL,
--   reviewer_email VARCHAR(40),
--   response VARCHAR,
--   helpfulness SMALLINT
-- );

-- CREATE TEMP TABLE importreviews (
--   id INT,
--   product_id INT,
--   rating SMALLINT,
--   date BIGINT,
--   summary VARCHAR NOT NULL,
--   body VARCHAR,
--   recommend BOOLEAN,
--   reported BOOLEAN,
--   reviewer_name VARCHAR NOT NULL,
--   reviewer_email VARCHAR,
--   response VARCHAR,
--   helpfulness SMALLINT
-- );


-- \copy importreviews from './csv/reviews.csv' delimiter ',' csv header;

-- INSERT INTO reviews.list (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
-- SELECT id, product_id, rating, to_timestamp(date / 1000), summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness
-- FROM importreviews;


-- CREATE TABLE IF NOT EXISTS reviews.photos (
--   id INT NOT NULL,
--   review_id INT NOT NULL,
--   url VARCHAR(160),
--   FOREIGN KEY(review_id) REFERENCES reviews.list(id)
-- );

-- \copy reviews.photos from './csv/reviews_photos.csv' delimiter ',' csv header;



-- CREATE TABLE IF NOT EXISTS reviews.traits (
--   id INT PRIMARY KEY NOT NULL,
--   -- product_id INT NOT NULL REFERENCES reviews.list(product_id),
--   product_id INT NOT NULL,
--   name VARCHAR(10) NOT NULL
-- );

-- CREATE TEMP TABLE importtraits (
--   id INT,
--   product_id INT,
--   name VARCHAR
-- );

-- \copy importtraits from './csv/characteristics.csv' delimiter ',' csv header;

-- INSERT INTO reviews.traits SELECT id, product_id, name FROM importtraits;




-- CREATE TABLE IF NOT EXISTS reviews.trait_reviews (
--   id INT PRIMARY KEY NOT NULL,
--   -- characteristic_id INT NOT NULL REFERENCES reviews.list(product_id),
--   characteristic_id INT NOT NULL,
--   review_id INT NOT NULL REFERENCES reviews.list(id),
--   value SMALLINT
-- );


-- CREATE TEMP TABLE importtraitsreviews (
--   id INT,
--   characteristic_id INT,
--   review_id INT,
--   value INT
-- );


-- \copy importtraitsreviews from './csv/characteristic_reviews.csv' delimiter ',' quote '"'csv header;

-- INSERT INTO reviews.trait_reviews SELECT id, characteristic_id, review_id, value FROM importtraitsreviews;








/*  Execute this file from the command line by typing:


psql -U ciele postgres -f ./server/db/schema.sql

  *  to create the database, schema, and the tables.
  *  note: opens to database 'postgres' then \c to database 'reviews'

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