const { Pool } = require('pg'); 
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false  // Allows self-signed SSL certificates
  }
});

module.exports = { pool }; 
