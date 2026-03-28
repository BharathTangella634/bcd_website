import mysql from 'mysql2/promise';

async function test() {
  const host = '34.14.140.183';
  const user = 'tanuh_website_builder';
  const password = 'Tanuh12345!';
  const database = 'bcd_questionnaire';

  console.log(`Connecting to ${host} as ${user} with DB ${database}...`);

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      database
    });
    console.log('✅ Success!');
    await connection.end();
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

test();
