DROP DATABASE reviews;

CREATE DATABASE reviews;

\c reviews;

CREATE SCHEMA IF NOT EXISTS reviews AUTHORIZATION ciele;

CREATE TABLE reviews.products (
  id INT PRIMARY KEY NOT NULL

  -- characteristics TEXT, -- fix this
  -- quality SMALLINT,
  -- size SMALLINT,
  -- width SMALLINT,
  -- fit SMALLINT,
  -- len SMALLINT,
  -- comfort SMALLINT

);


CREATE TEMP TABLE importreviews (
  id INT,
  product_id INT,
  rating SMALLINT,
  date BIGINT,
  summary TEXT,
  body TEXT,
  recommend BOOLEAN DEFAULT TRUE,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name TEXT,
  reviewer_email TEXT,
  response TEXT,
  helpfulness SMALLINT DEFAULT 0
);

\copy importreviews from './csv/reviews.csv' delimiter ',' csv header;

INSERT INTO reviews.products (id)
SELECT DISTINCT product_id
FROM importreviews
ORDER BY product_id;


CREATE TABLE reviews.list (
  id INT PRIMARY KEY NOT NULL,
  product_id INT REFERENCES reviews.products(id),
  rating SMALLINT NOT NULL,
  date TIMESTAMPTZ,
  summary VARCHAR(120) NOT NULL,
  body VARCHAR(480),
  response VARCHAR(110),
  recommend BOOLEAN,
  reviewer_name VARCHAR(30) NOT NULL,
  reviewer_email VARCHAR(40) NOT NULL,
  helpfulness SMALLINT,
  reported BOOLEAN
);

INSERT INTO reviews.list (id, product_id, rating, date, summary, body, response, recommend, reviewer_name, reviewer_email, helpfulness, reported)
SELECT id, product_id, rating,
date_trunc('day', to_timestamp(date / 1000) AT TIME ZONE 'UTC'),
summary, body, response, recommend, reviewer_name, reviewer_email, helpfulness, reported
FROM importreviews;


CREATE TABLE reviews.photos (
  id INT PRIMARY KEY NOT NULL,
  url VARCHAR(160),
  review_id INT REFERENCES reviews.list(id)
);

CREATE TEMP TABLE importphotos (
  id INT,
  review_id INT,
  url TEXT
);


\copy importphotos from './csv/reviews_photos.csv' delimiter ',' csv header;

INSERT INTO reviews.photos (id, review_id, url)
SELECT id, review_id, url
FROM importphotos;


CREATE INDEX r_p_idx ON reviews.list (product_id, id, reported) WHERE (reported = false); --index reviews by product id, then review id, exclude reported reviews


CREATE INDEX r_ph_idx ON reviews.photos (review_id, reviews.photos.id); --index reviews by review id, then photo id


-- CREATE OR REPLACE VIEW reviews.meta AS
-- SELECT product_id, jsonb_object_agg(rating, count) AS ratings
-- FROM (SELECT product_id, rating, count(*) from reviews.list group by product_id, rating) foo
-- GROUP BY product_id
-- ORDER BY product_id; --Count all reviews by product_id, convert into objects -- works

CREATE OR REPLACE VIEW reviews.meta AS
SELECT product_id,
jsonb_object_agg(rating, count) AS ratings,
jsonb_object_agg(recommend, count) AS recommended
FROM (SELECT product_id, rating, recommend, count(*)
FROM reviews.list
GROUP BY product_id, rating, recommend) foo
GROUP BY product_id
ORDER BY product_id;






INSERT INTO reviews.products (ratings)
SELECT reviews.products.id, avg(reviews.list.rating)
FROM reviews.list
GROUP BY reviews.products.id, reviews.list.product_id; -- not quite


-- alter table reviews.products drop column ratings; alter table reviews.products add column ratings real; -- testing this while figuring out how to insert into, with the result of a select statement

-- //////////////


-- CREATE TABLE IF NOT EXISTS reviews.specs (
--   id INT PRIMARY KEY NOT NULL,
--   -- product_id INT NOT NULL REFERENCES reviews.list(product_id),
--   product_id INT NOT NULL,
--   name VARCHAR(10) NOT NULL
-- );

-- CREATE TEMP TABLE importspecs (
--   id INT,
--   product_id INT,
--   name VARCHAR
-- );

-- \copy importspecs from './csv/characteristics.csv' delimiter ',' csv header;

-- INSERT INTO reviews.specs SELECT id, product_id, name FROM importspecs;




-- CREATE TABLE IF NOT EXISTS reviews.spec_reviews (
--   id INT PRIMARY KEY NOT NULL,
--   -- characteristic_id INT NOT NULL REFERENCES reviews.list(product_id),
--   characteristic_id INT NOT NULL,
--   review_id INT NOT NULL REFERENCES reviews.list(id),
--   value SMALLINT
-- );


-- CREATE TEMP TABLE importspecsreviews (
--   id INT,
--   characteristic_id INT,
--   review_id INT,
--   value INT
-- );


-- \copy importspecsreviews from './csv/characteristic_reviews.csv' delimiter ',' quote '"'csv header;

-- INSERT INTO reviews.spec_reviews SELECT id, characteristic_id, review_id, value FROM importspecsreviews;


-- CREATE TABLE IF NOT EXISTS reviews.meta (
--   id INT PRIMARY KEY NOT NULL,
--   rating real
-- );

-- INSERT INTO reviews.meta (product_id) SELECT DISTINCT product_id from reviews.list ORDER BY product_id;
-- INSERT INTO reviews.meta (rating) SELECT avg(rating) from reviews.list WHERE (product_id=(SELECT product_id from reviews.meta));




/*  Execute this file from the command line by typing:


psql -U ciele postgres -f ./db/pgschemaNew.sql

  *  to create the database, schema, and the tables.
  *  note: opens to database 'postgres' then \c to database 'reviews'

  head -7 answers_photos.csv

*/

/*


 select * from reviews.list left join reviews.photos on (reviews.list.id = reviews.photos.review_id)
where (reviews.list.product_id=3456);

*/

