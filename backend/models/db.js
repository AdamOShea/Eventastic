const { Pool } = require('pg'); // Directly import Pool from the pg package

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

module.exports = { pool }; // Export using CommonJS syntax
