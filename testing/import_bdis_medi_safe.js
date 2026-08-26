require("dotenv").config();
const fs = require("fs");
const { Client } = require("pg");

async function main() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    try {
        const sql = fs.readFileSync("bdismedi_seed.sql", "utf8");

        const rows = sql.match(/\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);

        if (!rows) {
            throw new Error("No b_dis_medi rows found.");
        }

        await client.connect();

        await client.query("BEGIN");

        let imported = 0;
        let skipped = 0;

        for (const row of rows) {
            const values = row
                .replace(/[()]/g, "")
                .split(",")
                .map(v => Number(v.trim()));

            const [sd_id, s_id, m_id, m_v] = values;

            // These two records reference medicine IDs
            // that do not exist in the original acid.mdb.
            if (m_id === 1613 || m_id === 7854) {
                skipped++;
                continue;
            }

            await client.query(
                `INSERT INTO b_dis_medi (sd_id, s_id, m_id, m_v)
                 VALUES ($1, $2, $3, $4)`,
                [sd_id, s_id, m_id, m_v]
            );

            imported++;
        }

        await client.query("COMMIT");

        const result = await client.query(
            "SELECT COUNT(*) AS count FROM b_dis_medi"
        );

        console.log("Import completed successfully.");
        console.log("Imported:", imported);
        console.log("Skipped invalid legacy rows:", skipped);
        console.log("Total b_dis_medi rows:", result.rows[0].count);

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