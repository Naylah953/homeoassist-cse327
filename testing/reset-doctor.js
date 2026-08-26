const bcrypt = require('bcrypt');
const pool = require('./db');

async function main() {
  try {
    const hash = await bcrypt.hash('Doctor@12345', 10);

    const result = await pool.query(
      'UPDATE doctors SET password = $1 WHERE id = $2 RETURNING id, email',
      [hash, 1]
    );

    console.log(result.rows);
  } catch (err) {
    console.error(err.message);
  } finally {
    await pool.end();
  }
}

main();
