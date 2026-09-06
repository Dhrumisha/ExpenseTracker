import dotenv from 'dotenv';
import path from 'path';
import { Pool } from 'pg';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const host = process.env.PGHOSTNAME;
const isLocalHost =
  !host || host === 'localhost' || host === '127.0.0.1' || host === '::1';

const pool = new Pool({
  user: process.env.PGUSERNAME,
  host,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
  // Local Postgres usually has no SSL. Render/cloud requires it.
  ssl: isLocalHost ? false : { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

export default pool;
