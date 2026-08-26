require('dotenv').config();
const fs = require('fs');
const { Client } = require('pg');

async function main() {
    const sql = fs.readFileSync('bdismedi_seed.sql', 'utf8');

    // Extract all m_id values from INSERT statements
    const matches = [...sql.matchAll(/\(\s*\d+\s*,\s*\d+\s*,\s*(\d+)\s*,/g)];
    const seedMedicineIds = [...new Set(matches.map(m => Number(m[1])))];

    console.log(`Medicine IDs found in bdismedi_seed.sql: ${seedMedicineIds.length}`);

    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    await client.connect();

    const result = await client.query(`
        SELECT m_id
        FROM medicines_mdb
        WHERE m_id = ANY($1::int[])
    `, [seedMedicineIds]);

    const existingIds = new Set(result.rows.map(row => Number(row.m_id)));

    const missingIds = seedMedicineIds.filter(id => !existingIds.has(id));

    console.log(`Medicine IDs existing in medicines_mdb: ${existingIds.size}`);
    console.log(`Missing medicine IDs: ${missingIds.length}`);

    if (missingIds.length > 0) {
        console.log('\nMissing IDs:');
        console.log(missingIds.join(', '));
    } else {
        console.log('\nNo missing medicine IDs found.');
    }

    await client.end();
}

main().catch(error => {
    console.error('\nERROR:');
    console.error(error.message);
    process.exit(1);
});