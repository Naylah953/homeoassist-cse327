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

    const sql = fs.readFileSync("rubrics_seed.sql", "utf8");
    await client.query(sql);

    console.log("Rubric seed imported successfully.");

    const result = await client.query(
      "SELECT COUNT(*) AS count FROM symptom_rubrics"
    );

    console.log("Rubric rows:", result.rows[0].count);
  } catch (error) {
    console.error("Import failed:", error.message);
  } finally {
    await client.end();
  }
}

main();