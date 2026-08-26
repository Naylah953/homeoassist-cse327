require("dotenv").config();
const fs = require("fs");
const { Client } = require("pg");

async function main() {
    const missingIds = new Set([
        401, 1000, 1919, 2000, 2282,
        2351, 3000, 3992, 4000, 4461,
        5000, 5952, 5954, 5955, 6000,
        6711, 6713, 7000, 7289
    ]);

    const lines = fs.readFileSync("bcomplain_full_seed.sql", "utf8")
        .split(/\r?\n/);

    const records = [];

    for (const line of lines) {
        const match = line.match(
            /^\s*\((\d+),\s*([^,]+),\s*([^,]+),\s*(.*)\),?;?$/
        );

        if (!match) continue;

        const s_id = Number(match[1]);

        if (!missingIds.has(s_id)) continue;

        const d_id = match[2].trim();
        const rub_id = match[3].trim();
        const rest = match[4].replace(/;$/, "").trim();

        records.push({
            s_id,
            d_id,
            rub_id: rub_id === "NULL" ? "1" : rub_id,
            rest
        });
    }

    console.log("bcomplain records found in seed:", records.length);

    if (records.length !== missingIds.size) {
        throw new Error("Not all 19 bcomplain records were found.");
    }

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        await client.connect();
        await client.query("BEGIN");

        for (const r of records) {
            await client.query(`
                INSERT INTO bcomplain
                (s_id, d_id, rub_id, ${r.rest.split(",").length >= 2 ? "s_bname, s_name, sbr_id" : "s_bname, s_name, sbr_id"})
                VALUES (${r.s_id}, ${r.d_id}, ${r.rub_id}, ${r.rest})
                ON CONFLICT (s_id) DO NOTHING
            `);
        }

        await client.query("COMMIT");

        const result = await client.query(`
            SELECT COUNT(*) AS count
            FROM bcomplain
            WHERE s_id IN (
                401,1000,1919,2000,2282,
                2351,3000,3992,4000,4461,
                5000,5952,5954,5955,6000,
                6711,6713,7000,7289
            )
        `);

        console.log("Restored bcomplain records:", result.rows[0].count);
        console.log("bcomplain restoration completed.");

    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch {}

        console.error("Restoration failed:", error.message);
    } finally {
        await client.end();
    }
}

main();