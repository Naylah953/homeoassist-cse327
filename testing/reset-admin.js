require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');

async function main() {
  const password = 'Admin@12345';
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'UPDATE admins SET password = $1 WHERE email = $2 RETURNING id, username, email',
    [hash, 'admin@homeoassist.com']
  );

  console.log('UPDATED:', result.rows);

  await pool.end();
}

main().catch(err => {
  console.error(err.message);
  pool.end();
});