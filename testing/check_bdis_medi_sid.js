require("dotenv").config();
const fs = require("fs");
const { Client } = require("pg");

async function main() {
    const sql = fs.readFileSync("bdismedi_seed.sql", "utf8");

    const rows = sql.match(/\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);

    if (!rows) {
        throw new Error("No b_dis_medi rows found.");
    }

    const seedSids = [
        ...new Set(
            rows.map(row => {
                const values = row
                    .replace(/[()]/g, "")
                    .split(",")
                    .map(v => Number(v.trim()));

                return values[1];
            })
        )
    ];

    console.log("Unique s_id values in bdismedi_seed.sql:", seedSids.length);

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    await client.connect();

    const result = await client.query(
        `SELECT s_id
         FROM bcomplain
         WHERE s_id = ANY($1::int[])`,
        [seedSids]
    );

    const existing = new Set(result.rows.map(row => Number(row.s_id)));

    const missing = seedSids.filter(id => !existing.has(id));

    console.log("Existing s_id values:", existing.size);
    console.log("Missing s_id values:", missing.length);

    if (missing.length > 0) {
        console.log("\nMissing s_id:");
        console.log(missing.join(", "));
    }

    await client.end();
}

main().catch(error => {
    console.error("\nERROR:");
    console.error(error.message);
    process.exit(1);
});