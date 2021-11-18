require('dotenv').config();

const { Client, Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  databse: process.env.PGDATABASE
})

pool.connect((err, client, done) => {
  if (err) throw err;

  try {

  } catch (error) {

  } finally {
    done();
  }
})


new Date(1446309338000).toISOString()