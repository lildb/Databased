CREATE DATABASE IF NOT EXISTS reviews;

USE reviews;

CREATE TABLE IF NOT EXISTS reviews_list (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  /* can this be changed from a string to an int? assuming i change the front end code to match */
  rating TINYINT NOT NULL, /* maybe use enums */
  reviewer_name VARCHAR(20) NOT NULL,
  recommended BOOLEAN,
  summary VARCHAR(40) NOT NULL,
  body VARCHAR(200) NOT NULL,
  helpfulness SMALLINT,
  has_photos BOOLEAN NOT NULL DEFAULT false, /* reference table of JSON urls by review_id*/
  PRIMARY KEY(id),
  FOREIGN KEY (product_id) REFERENCES products_meta.product_id
);

CREATE TABLE IF NOT EXISTS products_meta (
  id INT NOT NULL ,
  results INT NOT NULL, /* qty of reviews */
  recommended SMALLINT,
  not_recommended SMALLINT,
  1_star SMALLINT DEFAULT 0,
  2_star SMALLINT DEFAULT 0,
  3_star SMALLINT DEFAULT 0,
  4_star SMALLINT DEFAULT 0,
  5_star SMALLINT DEFAULT 0,
  PRIMARY KEY id
)

CREATE TABLE IF NOT EXISTS characteristics (
  id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(12) NOT NULL,
  value FLOAT DEFAULT 3,
  PRIMARY KEY(id),
  FOREIGN KEY(product_id) REFERENCES products_meta.id
);


CREATE TABLE IF NOT EXISTS products_reviews (
  /* many to many - product_id to review_id */
  PRIMARY KEY(review_id)
  FOREIGN KEY(review_id) REFERENCES reviews.id
  FOREIGN KEY(product_id) REFERENCES products_meta.id
);


CREATE TABLE IF NOT EXISTS reviewers_emails (
  name varchar(20) NOT NULL,
  email VARCHAR(36) NOT NULL,
  PRIMARY KEY(email),
  FOREIGN KEY(name) REFERENCES reviews.reviewer_name /* maybe extraneous */
);

CREATE TABLE IF NOT EXISTS photos (
  review_id INT NOT NULL,
  photos JSON, /* array of url strings */
  FOREIGN KEY(review_id) REFERENCES reviews.id
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.
 */
