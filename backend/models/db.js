import pkg from 'pg';  // Import the entire pg package
const { Pool } = pkg;  // Extract Pool from the imported package

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

export { pool };
