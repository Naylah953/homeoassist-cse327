require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');

async function main() {
  const password = 'imran@12345';
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'UPDATE doctors SET password = $1 WHERE id = 4 RETURNING id, email',
    [hash]
  );

  console.log('UPDATED:', result.rows);
  await pool.end();
}

main().catch(err => {
  console.error(err.message);
  pool.end();
});