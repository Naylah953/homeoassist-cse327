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

    const sql = fs.readFileSync("min01_seed.sql", "utf8");

    const match = sql.match(
      /INSERT INTO m_indication\s*\(min_id,\s*m_id,\s*m_in\)\s*VALUES\s*([\s\S]*);/
    );

    if (!match) {
      throw new Error("Could not find m_indication INSERT statement.");
    }

    const values = match[1]
      .trim()
      .replace(/;$/, "");

    const rows = values.match(/\([^()]+\)/g);

    if (!rows) {
      throw new Error("Could not find seed rows.");
    }

    console.log("Records found in seed:", rows.length);

    await client.query("BEGIN");

    let imported = 0;

    for (const row of rows) {
      await client.query(
        `INSERT INTO m_indication (min_id, m_id, m_in)
         VALUES ${row}
         ON CONFLICT (min_id) DO NOTHING`
      );

      imported++;
    }

    await client.query("COMMIT");

    const result = await client.query(
      "SELECT COUNT(*) AS count, MIN(min_id), MAX(min_id) FROM m_indication"
    );

    console.log("Import completed successfully.");
    console.log("Imported:", imported);
    console.log("Total m_indication rows:", result.rows[0].count);
    console.log(
      "ID range:",
      result.rows[0].min,
      "-",
      result.rows[0].max
    );

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