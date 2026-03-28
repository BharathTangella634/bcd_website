import mysql from 'mysql2/promise';

async function test() {
  const host = '34.14.140.183';
  const user = 'tanuh_website_builder';
  const password = 'Tanuh12345!';

  console.log(`Connecting to ${host} as ${user} with SSL (bypassing servername checks)...`);

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      ssl: {
          rejectUnauthorized: false,
          servername: 'dummyhost' // workaround for Node error
      }
    });
    console.log('✅ LOGIN SUCCESS (with SSL)!');
    await connection.end();
  } catch (err) {
    console.error('❌ LOGIN FAILED (SSL_CONFIG):', err.message);
  }
}

test();
