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
    console.log("Preparing bcomplain data...");

    const file = fs.readFileSync("bcomplain_full_seed.sql", "utf8");

    // Extract individual value rows.
    const lines = file
      .split(/\r?\n/)
      .filter(line => line.trim().startsWith("("));

    let imported = 0;
    let skipped = 0;

    await client.query("BEGIN");

    for (const line of lines) {
      // Skip rows where rub_id (3rd value) is NULL.
      const match = line.match(
        /^\((\d+),\s*(\d+),\s*([^,]+),\s*(.*)\),?$/
      );

      if (!match) {
        skipped++;
        continue;
      }

      const s_id = Number(match[1]);
      const d_id = Number(match[2]);
      const rub_id_text = match[3].trim();

      if (rub_id_text.toUpperCase() === "NULL") {
        skipped++;
        continue;
      }

      const rest = match[4];

      // Safely extract the remaining 3 values.
      const values = parseValues(rest);

      if (!values || values.length !== 3) {
        skipped++;
        continue;
      }

      await client.query(
        `INSERT INTO bcomplain
         (s_id, d_id, rub_id, s_bname, s_name, sbr_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          s_id,
          d_id,
          Number(rub_id_text),
          values[0],
          values[1],
          values[2] === "NULL" ? null : Number(values[2])
        ]
      );

      imported++;
    }

    await client.query("COMMIT");

    const result = await client.query(
      "SELECT COUNT(*) AS count FROM bcomplain"
    );

    console.log("bcomplain import completed.");
    console.log("Imported:", imported);
    console.log("Skipped:", skipped);
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

// Basic parser for the final three SQL values.
function parseValues(text) {
  const values = [];
  let current = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === "'") {
      if (inQuote && text[i + 1] === "'") {
        current += "''";
        i++;
        continue;
      }

      inQuote = !inQuote;
      current += char;
      continue;
    }

    if (char === "," && !inQuote) {
      values.push(cleanValue(current));
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    values.push(cleanValue(current));
  }

  return values;
}

function cleanValue(value) {
  value = value.trim();

  if (value.toUpperCase() === "NULL") {
    return "NULL";
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }

  return value;
}

main();