require("dotenv").config();
const { Client } = require("pg");

async function main() {
    const ids = [
        350, 999, 1838, 1955, 2279, 2991, 3970,
        3993, 4357, 4861, 5786, 6695, 6971, 7168
    ];

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    });

    await client.connect();

    const result = await client.query(
        `SELECT d_id
         FROM disease
         WHERE d_id = ANY($1::int[])
         ORDER BY d_id`,
        [ids]
    );

    const found = result.rows.map(row => Number(row.d_id));
    const missing = ids.filter(id => !found.includes(id));

    console.log("Disease IDs found:", found.join(", "));
    console.log("Found count:", found.length, "of", ids.length);
    console.log("Missing disease IDs:", missing.length);

    if (missing.length > 0) {
        console.log("Missing:", missing.join(", "));
    }

    await client.end();
}

main().catch(error => {
    console.error("ERROR:", error.message);
    process.exit(1);
});