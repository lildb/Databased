# Databased
A redesigned Rest API using Express.js, PostgreSQL, NGINX, and PM2. Deployed on AWS t2.micro instances, and tested with k6 and Loader.io.

## 1. Install project dependencies - you will need to have *Node* installed
- run `npm install` to install dependencies

## 2. If you *do not* have PostgreSQL installed (I'm using v14), you will need to have Homebrew installed *first*:
- Follow the instructions on the Homebrew [site](https://brew.sh).
- If you have Postgres installed already, continue to step 4.

## 3. Install Postgres with Homebrew
- Very thorough instructions [here](https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3) 🙏

## 4. Setup PostgreSQL and alter permissions for user:

  // TODO

## 5. Run the .SQL script to load the csv files into the database
- From the terminal of your *PostgreSQL* server, run:
```bash


- Transferring from .CSV files to a temporary table is <u>much</u> faster than transforming the data while simultaneously loading it into the database.
- If all goes well, you should see something like the following:

```bash
  CREATE DATABASE
  You are now connected to database "reviews" as user "ciele".
  CREATE TABLE
  CREATE TABLE
  COPY 5774952
  INSERT 0 950072
  CREATE TABLE
  INSERT 0 5774952
  DROP TABLE
  CREATE INDEX
  CREATE TABLE
  CREATE TABLE
  COPY 2742540
  INSERT 0 2742540
  DROP TABLE
  CREATE INDEX
  CREATE VIEW
  CREATE TYPE
  CREATE TABLE
  CREATE TABLE
  COPY 3347679
  INSERT 0 3180473
  CREATE INDEX
  CREATE TABLE
  CREATE TABLE
  COPY 19327575
  INSERT 0 19327575
  DROP TABLE
  CREATE INDEX
  CREATE VIEW
  CREATE VIEW
  SELECT 3180473
  CREATE INDEX
  CREATE VIEW
  CREATE VIEW
  CREATE VIEW
  CREATE VIEW
```

- I used SCP to send .CSV files to my virtual machine (AWS: EC2 instance). This API is designed to be scale-agnostic and will work with any cloud service running Ubuntu Server 20.04.

## 6. Set up the .env file to use with the Express application server instances

... SSH into the remote machine,
install node, etc...

## 7. Start the Express Server
- `npm start`

## 8. Install *PM2* to daemonize the server process. I'd suggest using a startup script, and configuring to reload if it crashes

## 9. Test your server with K6 (locally) or [loader.io].

## 10. To increase throughput and decrease load on any one particular app server, install NGINX as a web server in front of your app server instances.

 // TODO config NGINX ....
  // load balancing algos
  // caching
