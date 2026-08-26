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
    console.log("Importing missing medicines_mdb records (IDs 1-1000)...");

    const sql = fs.readFileSync("medi_from_mdb_seed.sql", "utf8");

    // Extract the VALUES section.
    const match = sql.match(
      /INSERT INTO medicines_mdb\s*\(m_id,\s*m_txt,\s*m_btxt,\s*m_du\)\s*VALUES\s*([\s\S]*);/
    );

    if (!match) {
      throw new Error("Could not find INSERT statement.");
    }

    const valuesText = match[1];

    // Match each complete (...) row.
    const rows = valuesText.match(/\((?:[^()]|'[^']*')*\)/g);

    if (!rows) {
      throw new Error("Could not find medicine rows.");
    }

    await client.query("BEGIN");

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const idMatch = row.match(/^\(\s*(\d+)\s*,/);

      if (!idMatch) {
        skipped++;
        continue;
      }

      const id = Number(idMatch[1]);

      // Only import missing IDs 1-1000.
      if (id > 1000) {
        skipped++;
        continue;
      }

      await client.query(
        `INSERT INTO medicines_mdb (m_id, m_txt, m_btxt, m_du)
         VALUES ${row}
         ON CONFLICT (m_id) DO NOTHING`
      );

      imported++;
    }

    await client.query("COMMIT");

    const result = await client.query(
      "SELECT COUNT(*) AS count, MIN(m_id), MAX(m_id) FROM medicines_mdb"
    );

    console.log("Import completed.");
    console.log("Imported:", imported);
    console.log("Skipped:", skipped);
    console.log("Total medicines_mdb rows:", result.rows[0].count);
    console.log("ID range:", result.rows[0].min, "-", result.rows[0].max);

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