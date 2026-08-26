require('dotenv').config();

const { Client } = require('pg');

const c = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function main() {
  await c.connect();

  const admins = await c.query(
    'SELECT id, username, email FROM admins ORDER BY id'
  );

  const doctors = await c.query(
    'SELECT id, name, email FROM doctors ORDER BY id'
  );

  const patients = await c.query(
    'SELECT id, name, email FROM patients ORDER BY id'
  );

  console.log('\nADMINS:');
  console.table(admins.rows);

  console.log('\nDOCTORS:');
  console.table(doctors.rows);

  console.log('\nPATIENTS:');
  console.table(patients.rows);

  await c.end();
}

main().catch(error => {
  console.error(error.message);
  c.end();
});