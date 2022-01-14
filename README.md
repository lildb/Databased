# **REST API** Docs

A redesigned and scalable Rest API using:

- Express.js
- PostgreSQL
- NGINX
- PM2
- dotenv

Deployed on **AWS** EC2 instances, and stress-tested with:
- K6
- [Loader.io](https://loader.io)


## Getting Started

To run the node server locally:

- Clone this repo
- `npm install` to install project dependencies
- Install **PostgreSQL** and configure per instructions below
- Update the `.env.example` file

## Express Application Server

### 1. Install project dependencies - you will need to have *Node* installed
- run `npm install` to install dependencies



## PostgreSQL Database

The following instructions were used for installing and configuring *Postgres* `v14` on both **Ubuntu 20.04** and **macOS** systems.

##### Why PostgreSQL? :elephant:

The needs of this REST API required the database to return a nested object to the front-end. PostgreSQL is an open source object-relational database, and is known for its reliability and performance. The software is capable of performing aggregate functions that were necessary for the API's `/meta` endpoint.

- [Official Documentation (v14)](https://www.postgresql.org/docs/14/index.html)


#### To Install for **(Ubuntu 20.04)**

###### 1. Update packages

- `apt`, also known as `apt-get`, is a package handler for Ubuntu
- The following commands will update the package lists that are configured inside `/etc/apt/sources.list`

```shell
sudo apt update
sudo apt upgrade
```
Confirm you want to continue by entering `y` when prompted.

- ***Or***, if you prefer to breeze past the confirmation dialogs, use the `-y` option:

```shell
sudo apt update -y && sudo apt upgrade -y
```

###### 2. Install PostgreSQL

```shell
sudo apt install postgresql
```
Confirm you want to continue by entering `y` when prompted.

###### 3. *OPTIONAL*: Assert the service is running:

```shell
sudo systemctl status postgresql
```
Likewise, to start the service:

```shell
sudo systemctl start postgresql
```

And to stop the service:

```shell
sudo systemctl stop postgresql
```


#### To Install PostgreSQL with Homebrew

###### 1. Install Homebrew

- Follow the instructions on the Homebrew [site](https://brew.sh).

###### 2. Install PostgreSQL with Homebrew

- Helpful instructions are available [here](https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3) 🙏

###### 3. *OPTIONAL*: Assert the service is running:

To start the service with Homebrew and automatically enable launch at login:
```shell
brew services start postgresql
```

Check the status of your installed Homebrew services:
```shell
brew services list
```

To stop the service:
```shell
sudo systemctl stop postgresql
```

- **For a full list of available Homebrew commands:**

```shell
brew services -h
```

#### OR, Download an installer for your OS

- [Official PostgreSQL Download Page](https://www.postgresql.org/download/)


### Configure Postgres

###### 1. Access PSQL as `postgres` (the default user)

```shell
sudo -u postgres psql
```

You should see in your terminal :

`postgres=#`

###### 2. Create a database as a test

```sql
CREATE DATABASE your_database;
```
**Note the trailing semicolons in SQL code!**

The semicolon is often, though not always, used in SQL code as a statement terminator.

###### 3. Create a user and password

Wrap your chosen password in *single quotes*:

```sql
CREATE USER your_username WITH PASSWORD 'password';
```

If this was successful, you should see `CREATE ROLE` in the terminal.

###### 4. Alter permissions for the new user:

```sql
GRANT ALL TO your_username ON your_database;
```

 **More Official PostgreSQL resources**

[Getting Started With PostgreSQL](https://www.postgresql.org/docs/14/tutorial-start.html)
[DOCS](https://www.postgresql.org/docs/)



### 5. Run the .SQL script to load the csv files into the database
- From the terminal of your *PostgreSQL* server, run:

```shell
psql postgres -f ./pg_reviews_etl.sql
```

- Transferring from .CSV files to a temporary table first is significantly faster than transforming the data while simultaneously loading it into the database.
- If all goes well, you should see something like the following:


- I used SCP to send .CSV files to my virtual machine instance. This API is designed to be scale-agnostic and will work with any cloud service running Ubuntu Server 20.04.

### 6. Set up the .env file to use with the Express application server instances. The variables should correspond with the *PostgreSQL* config settings

... SSH into the remote machine,
install node, etc...

### 7. Start the Express Server
- `npm start`

### 8. Install *PM2* to daemonize the server process. I'd suggest using a startup script, and configuring to reload if it crashes

### 9. Test your server with K6 (locally) or [loader.io].

### 10. To increase throughput and decrease load on any one particular app server, install NGINX as a web server in front of your app server instances.

 // TODO config NGINX ....
  // load balancing algos
  // caching


## Load Balancer

### NGINX

```nginx

proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=myzone:10m
loader_threshold=300 loader_files=200;

upstream reviews_api {
  server  11.111.111.111:3000/;
  server  2.22.222.222:3000/;
  server  3.33.333.333:3000/;
}

server {
  listen  80;
  listen  [::]:80;

  proxy_cache myzone;
  proxy_cache_valid 5m;

  location / {
    proxy_pass  http://reviews_api;
  }
}

```

### Author

<a href="https://github.com/lildb/Databased/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lildb/Databased" />
</a>
- [Sam Dudley](https://github.com/sbarkerdudley)