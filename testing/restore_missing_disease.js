require("dotenv").config();
const fs = require("fs");
const { Client } = require("pg");

async function main() {
    const missingIds = new Set([
        999, 1838, 1955, 2279, 3970,
        3993, 4861, 5786, 6695, 6971, 7168
    ]);

    const lines = fs.readFileSync("disease_seed.sql", "utf8").split(/\r?\n/);

    const selected = [];

    for (const line of lines) {
        const match = line.match(/^\s*\((\d+),/);

        if (match && missingIds.has(Number(match[1]))) {
            selected.push(line.trim().replace(/,$/, ""));
        }
    }

    console.log("Disease records found in seed:", selected.length);

    if (selected.length !== missingIds.size) {
        throw new Error("Not all 11 disease records were found.");
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

        for (const row of selected) {
            await client.query(`
                INSERT INTO disease
                (s_id, d_id, rub_id, s_bname, s_name, sbr_id)
                VALUES ${row}
                ON CONFLICT (s_id) DO NOTHING
            `);
        }

        await client.query("COMMIT");

        const result = await client.query(`
            SELECT COUNT(*) AS count
            FROM disease
            WHERE s_id IN (
                999,1838,1955,2279,3970,
                3993,4861,5786,6695,6971,7168
            )
        `);

        console.log("Restored disease records:", result.rows[0].count);
        console.log("Disease restoration completed.");

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