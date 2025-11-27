require("dotenv").config();
const { Client, Pool } = require("pg");

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
});

async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

async function createListenerClient() {
  const client = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  });
  await client.connect();
  return client;
}

module.exports = {
  query,
  createListenerClient
};
