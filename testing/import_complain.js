require("dotenv").config();
const fs = require("fs");
const { Client } = require("pg");

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL.");
    console.log("Importing complain data...");

    const sql = fs.readFileSync("complain_seed.sql", "utf8");

    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");

    const result = await client.query(
      "SELECT COUNT(*) AS count FROM complain"
    );

    console.log("Complain seed imported successfully.");
    console.log("Complain rows:", result.rows[0].count);
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {}

    console.error("Import failed:", error.message);
  } finally {
    await client.end();
  }
}

main();