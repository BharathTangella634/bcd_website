import { getPool } from './mysql_explorer/db.js';

async function test() {
  console.log('Testing the integrated getPool() connection...');
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 as ok');
    if (rows && rows[0].ok === 1) {
      console.log('✅ Integrated Connection Successful!');
    }
    await pool.end();
  } catch (err) {
    console.error('❌ Integrated Connection Failed:', err.message);
  }
}

test();
