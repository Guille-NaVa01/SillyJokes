import pg from "pg";

const { Pool } = pg;

// Reads from env vars when running in Docker; falls back to local-dev defaults.
const pool = new Pool({
  user:     process.env.PGUSER     || "postgres",
  host:     process.env.PGHOST     || "localhost",
  database: process.env.PGDATABASE || "all_jokes",
  password: process.env.PGPASSWORD || "12345",
  port:     parseInt(process.env.PGPORT || "5432"),
});

export default pool;