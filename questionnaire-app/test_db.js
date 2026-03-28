import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function test() {
  const host = '34.14.140.183';
  const user = 'tanuh_website_builder';
  const password = 'Tanuh12345!'; // As seen in .env

  console.log(`Connecting to ${host} as ${user}...`);

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      // NO database name here to see if login succeeds
    });
    console.log('✅ LOGIN SUCCESS (without DB selector)!');
    await connection.end();
  } catch (err) {
    console.error('❌ LOGIN FAILED:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('Suggestion: Double check if password is correct or if host % is truly allowed.');
    }
  }
}

test();
