# Databased
Ratings and Reviews API - Software Design Capstone - Hack Reactor

## 1. Install node_modules - you will need to have *Node* installed
- run `npm install` to install dependencies 

## 2. If you *do not* have PostgreSQL installed (I'm using v14), you will need to have Homebrew installed *first*:
- Follow the instructions on the Homebrew [site](https://brew.sh).

## 3. Install Postgres with Homebrew
- Very thorough instructions [here](https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3) 🙏

## 4. Setup PostgreSQL and alter permissions for user:

  // TODO
  
## 5. Run the .SQL script to load the csv files into the database
- Transferring from .CSV files to a temporary table is <u>much</u> faster than transforming the data while simultaneously loading it into the database.
- If all goes well, you should see the following:
  - `Copy & paste terminal output`
- I used SCP to send files to virtual machine (I deployed on AWS: EC2 instances, but the API is designed to be scale agnostic and will work with any cloud service running Ubuntu Server 20.04)

## 6. Set up the .env file to use with the server

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
