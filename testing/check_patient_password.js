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
    "SELECT id, name, email, phone, password FROM patients WHERE phone = $1",
    ["+8801700000099"]
  );

  if (r.rows.length === 0) {
    console.log("Patient not found");
    return;
  }

  const user = r.rows[0];

  console.log("Patient:", user.name);
  console.log("Email:", user.email);
  console.log("Phone:", user.phone);
  console.log("Hash:", user.password);

  console.log("patient123 matches:", await bcrypt.compare("patient123", user.password));
}

main()
  .catch(console.error)
  .finally(() => c.end());
