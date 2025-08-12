import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Database config: ', {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'flutterProject',
  port: process.env.DB_PORT || '5432',
});

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'flutterProject',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on('connect', () => {
  console.log('✅ Connected' );
});

pool.on('error', err => {
  console.log('❌ Database Error', err);
});

export default pool;
