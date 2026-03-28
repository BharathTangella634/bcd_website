import mysql from 'mysql2/promise';

async function test() {
  const host = '34.14.140.183';
  const user = 'tanuh_website_builder';
  const password = 'Tanuh12345!';

  console.log(`Final Test: Connecting to ${host} as ${user} with SSL (bypassing all checks)...`);

  try {
    const connection = await mysql.createConnection({
      host,
      user,
      password,
      ssl: {
          rejectUnauthorized: false,
          // We don't set servername to avoid the IP check error
      }
    });
    console.log('✅ LOGIN SUCCESS!');
    await connection.end();
  } catch (err) {
    if (err.message.includes('servername')) {
       // if it still fails on servername, try with a fake servername
       try {
           const conn2 = await mysql.createConnection({
               host,
               user,
               password,
               ssl: {
                   rejectUnauthorized: false,
                   servername: 'localhost' 
               }
           });
           console.log('✅ LOGIN SUCCESS (with fake servername)!');
           await conn2.end();
           return;
       } catch (err2) {
           console.error('❌ Failed even with fake servername:', err2.message);
       }
    }
    console.error('❌ Failed:', err.message);
  }
}

test();
