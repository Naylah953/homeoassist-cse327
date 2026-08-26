require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcrypt");

const c = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function main() {
  await c.connect();

  const r = await c.query(
    "SELECT password FROM admins WHERE email = $1",
    ["admin@homeoassist.com"]
  );

  console.log(
    "admin123 matches:",
    await bcrypt.compare("admin123", r.rows[0].password)
  );
}

main().catch(console.error).finally(() => c.end());
