const bcrypt = require('bcrypt');
const pool = require('./db');

async function main() {
  try {
    const hash = await bcrypt.hash('raisa@12345', 10);

    const result = await pool.query(
      'UPDATE patients SET password = $1 WHERE id = $2 RETURNING id, email',
      [hash, 1]
    );

    console.log('UPDATED:', result.rows);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

main();
