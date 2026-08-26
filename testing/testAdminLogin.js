require("dotenv").config();

const bcrypt = require("bcrypt");
const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testAdminLogin() {
  try {
    await client.connect();

    const result = await client.query(
      "SELECT * FROM admins WHERE username = $1",
      ["admin_sys"]
    );

    if (result.rows.length === 0) {
      console.log("Admin not found.");
      return;
    }

    const admin = result.rows[0];

    // Replace this only if your actual admin password is different
    const password = "admin123";

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    console.log("Admin found:", admin.username);
    console.log("Password match:", passwordMatch);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
}

testAdminLogin();
