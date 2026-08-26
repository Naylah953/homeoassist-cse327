require("dotenv").config();
const fs = require("fs");
const { Client } = require("pg");

const seedFile = process.argv[2];
const tableName = process.argv[3];

async function main() {
  if (!seedFile || !tableName) {
    console.log("Usage: node import_simple_seed.js <seed-file> <table>");
    process.exit(1);
  }

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
    console.log(`Importing ${tableName}...`);

    const sql = fs.readFileSync(seedFile, "utf8");

    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");

    const result = await client.query(
      `SELECT COUNT(*) FROM ${tableName}`
    );

    console.log(`${tableName} import completed.`);
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