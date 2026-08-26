require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkAdmin() {
  try {
    await client.connect();

    console.log("Connected to PostgreSQL!");

    const result = await client.query("SELECT * FROM admins;");

    console.table(result.rows);

  } catch (error) {
    console.error("Error:", error.message);

  } finally {
    await client.end();
  }
}

checkAdmin();