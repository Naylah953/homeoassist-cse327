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
    console.log("Importing b_dis_medi...");

    const sql = fs.readFileSync("bdismedi_seed.sql", "utf8");

    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");

    const result = await client.query(
      "SELECT COUNT(*) FROM b_dis_medi"
    );

    console.log("b_dis_medi import completed.");
    console.log("Database rows:", result.rows[0].count);

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