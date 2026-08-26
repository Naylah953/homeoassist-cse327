/**
 * HomeoAssist — Database Migration Script
 *
 * Runs schema.sql then seeds all data from acid.mdb exports + app data.
 *
 * Run: node migrate.js
 *
 * Seed order (respects FK dependencies):
 *   1. schema.sql           — create all tables
 *   2. sbr01_seed.sql       — symptom_rubrics (38 rows from acid.mdb sbr01)
 *   3. bsbr01_seed.sql      — b_symptom_rubrics (25 rows)
 *   4. sbr01cc_seed.sql     — sbr01cc (9 rows)
 *   5. medi_from_mdb_seed   — medicines_mdb (1,612 rows)
 *   6. medicines_seed.sql   — medicines (app medicine table)
 *   7. dose_seed.sql        — dose (8 rows)
 *   8. potency_seed.sql     — potency (20 rows)
 *   9. bcomplain_full_seed  — bcomplain (7,289 Bengali repertory symptoms)
 *  10. complain_seed.sql    — complain (65,348 English repertory)
 *  11. disease_seed.sql     — disease (65,440 rows)
 *  12. bdismedi_seed.sql    — b_dis_medi (65,795 symptom↔medicine links)
 *  13. dismedi_seed.sql     — dis_medi (434,532 rows — large, ~30s)
 *  14. man01_seed.sql       — m_antidote (787 rows)
 *  15. mco01_seed.sql       — m_compare (154 rows)
 *  16. mfo01_seed.sql       — m_followup (1,251 rows)
 *  17. min01_seed.sql       — m_indication (96 rows)
 *  + app seeds: admins, doctors, patients
 */

const { Pool } = require('pg');
const bcrypt   = require('bcrypt');
const fs       = require('fs');
const path     = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ── PostgreSQL connection ──────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST     || '127.0.0.1',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'homeoassist',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'oyshiaka123',
});

// ── Helpers ────────────────────────────────────────────────
async function hash(plain) {
  return bcrypt.hash(plain, 10);
}

/**
 * Run a SQL file against the database.
 *
 * For schema files (isSchema=true): run as a single query so DDL executes
 * in the correct order without splitting issues.
 *
 * For seed files: split on semicolons and run each INSERT individually so
 * we can skip duplicate-key errors and resume partial loads.
 */
async function runSqlFile(filePath, label, isSchema = false) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  ${label}: file not found — ${path.basename(filePath)}`);
    return;
  }

  const sql = fs.readFileSync(filePath, 'utf8');

  if (isSchema) {
    // Run the entire DDL as one shot
    try {
      await pool.query(sql);
      console.log(`   ✅ ${label} — executed`);
    } catch (err) {
      console.warn(`   ⚠️  ${label} error: ${err.message.slice(0, 200)}`);
    }
    return;
  }

  // Seed mode: split on semicolons and run each statement individually
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let ok = 0;
  for (const stmt of statements) {
    try {
      await pool.query(stmt);
      ok++;
    } catch (err) {
      // Skip duplicate key errors (re-runnable) but log others
      if (!err.message.includes('duplicate key') && !err.message.includes('already exists')) {
        console.warn(`   ⚠️  ${label} stmt error: ${err.message.slice(0, 120)}`);
      }
    }
  }
  console.log(`   ✅ ${label} — ${ok} statements executed`);
}

// ── 0. Schema ──────────────────────────────────────────────
async function runSchema() {
  console.log('\n🏗️  Running schema.sql...');
  await runSqlFile(path.join(__dirname, 'schema.sql'), 'schema', true);
}

// ── 1-4. Rubric / reference tables ────────────────────────
async function seedRubrics() {
  console.log('\n📋 Seeding rubric tables...');
  await runSqlFile(path.join(__dirname, 'sbr01_seed.sql'),   'symptom_rubrics (sbr01)');
  await runSqlFile(path.join(__dirname, 'bsbr01_seed.sql'),  'b_symptom_rubrics (bsbr01)');
  await runSqlFile(path.join(__dirname, 'sbr01cc_seed.sql'), 'sbr01cc');
}

// ── 5-6. Medicines ─────────────────────────────────────────
async function seedMedicines() {
  console.log('\n💊 Seeding medicines...');
  await runSqlFile(path.join(__dirname, 'medi_from_mdb_seed.sql'), 'medicines_mdb (1,612 rows)');

  // App medicines table — use existing medicines_seed.sql if present
  const appMediSeed = path.join(__dirname, 'medicines_seed.sql');
  if (fs.existsSync(appMediSeed)) {
    const check = await pool.query('SELECT COUNT(*) FROM medicines');
    if (parseInt(check.rows[0].count) > 0) {
      console.log(`   ℹ️  medicines already has ${check.rows[0].count} rows — skipping`);
    } else {
      await runSqlFile(appMediSeed, 'medicines (app)');
    }
  }
}

// ── 7-8. Dose & Potency ────────────────────────────────────
async function seedDosePotency() {
  console.log('\n📏 Seeding dose & potency...');
  await runSqlFile(path.join(__dirname, 'dose_seed.sql'),    'dose (8 rows)');
  await runSqlFile(path.join(__dirname, 'potency_seed.sql'), 'potency (20 rows)');
}

// ── 9-11. Symptom repertory tables ────────────────────────
async function seedSymptoms() {
  console.log('\n📖 Seeding symptom repertory...');

  const bCheck = await pool.query('SELECT COUNT(*) FROM bcomplain');
  if (parseInt(bCheck.rows[0].count) > 0) {
    console.log(`   ℹ️  bcomplain already has ${bCheck.rows[0].count} rows — skipping`);
  } else {
    await runSqlFile(path.join(__dirname, 'bcomplain_full_seed.sql'), 'bcomplain (7,289 rows)');
  }

  const cCheck = await pool.query('SELECT COUNT(*) FROM complain');
  if (parseInt(cCheck.rows[0].count) > 0) {
    console.log(`   ℹ️  complain already has ${cCheck.rows[0].count} rows — skipping`);
  } else {
    console.log('   ⏳ complain (65,348 rows) — this may take ~30s...');
    await runSqlFile(path.join(__dirname, 'complain_seed.sql'), 'complain (65,348 rows)');
  }

  const dCheck = await pool.query('SELECT COUNT(*) FROM disease');
  if (parseInt(dCheck.rows[0].count) > 0) {
    console.log(`   ℹ️  disease already has ${dCheck.rows[0].count} rows — skipping`);
  } else {
    console.log('   ⏳ disease (65,440 rows) — this may take ~30s...');
    await runSqlFile(path.join(__dirname, 'disease_seed.sql'), 'disease (65,440 rows)');
  }
}

// ── 12-13. Symptom ↔ Medicine junction tables ─────────────
async function seedSymptomMedi() {
  console.log('\n🔗 Seeding symptom-medicine links...');

  const bdCheck = await pool.query('SELECT COUNT(*) FROM b_dis_medi');
  if (parseInt(bdCheck.rows[0].count) > 0) {
    console.log(`   ℹ️  b_dis_medi already has ${bdCheck.rows[0].count} rows — skipping`);
  } else {
    await runSqlFile(path.join(__dirname, 'bdismedi_seed.sql'), 'b_dis_medi (65,795 rows)');
  }

  const dmCheck = await pool.query('SELECT COUNT(*) FROM dis_medi');
  if (parseInt(dmCheck.rows[0].count) > 0) {
    console.log(`   ℹ️  dis_medi already has ${dmCheck.rows[0].count} rows — skipping`);
  } else {
    console.log('   ⏳ dis_medi (434,532 rows) — this may take ~2 min...');
    await runSqlFile(path.join(__dirname, 'dismedi_seed.sql'), 'dis_medi (434,532 rows)');
  }
}

// ── 14-17. Medicine relationship tables ───────────────────
async function seedMediRelations() {
  console.log('\n🔬 Seeding medicine relationships...');
  await runSqlFile(path.join(__dirname, 'man01_seed.sql'), 'm_antidote (787 rows)');
  await runSqlFile(path.join(__dirname, 'mco01_seed.sql'), 'm_compare (154 rows)');
  await runSqlFile(path.join(__dirname, 'mfo01_seed.sql'), 'm_followup (1,251 rows)');
  await runSqlFile(path.join(__dirname, 'min01_seed.sql'), 'm_indication (96 rows)');
}

// ── App seeds: Admin ───────────────────────────────────────
async function seedAdmin() {
  console.log('\n👤 Seeding admin...');
  const pw = await hash('admin123');
  await pool.query(
    `INSERT INTO admins (username, email, password)
     VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
    ['admin_sys', 'admin@homeoassist.com', pw]
  );
  console.log('   ✅ Admin seeded  (email: admin@homeoassist.com  password: admin123)');
}

// ── App seeds: Doctors ─────────────────────────────────────
async function seedDoctors() {
  console.log('\n🩺 Seeding doctors...');
  const doctors = [
    { name: 'Dr. Anika Rahman',    email: 'anika@homeoassist.com',   reg: '#HOM-4821', specialty: 'Allergies & Respiratory', qual: 'MD Homeopathy (BHMS, Gold Medalist)', exp: 12, fee: 800,  rating: 4.9, reviews: 214 },
    { name: 'Dr. Rahim Uddin',     email: 'rahim@homeoassist.com',   reg: '#HOM-3910', specialty: 'Digestive & IBS',          qual: 'BHMS, MD (Homeo Gastro)',              exp: 9,  fee: 700,  rating: 4.7, reviews: 156 },
    { name: 'Dr. Reema Chowdhury', email: 'reema@homeoassist.com',   reg: '#HOM-5102', specialty: "Women's Health",           qual: 'BHMS, FCMH (Gynecology)',              exp: 15, fee: 900,  rating: 4.8, reviews: 302 },
    { name: 'Dr. Imran Shah',      email: 'imran@homeoassist.com',   reg: '#HOM-2891', specialty: 'Skin & Dermatology',       qual: 'BHMS, Dip. Homeopathic Dermatology',   exp: 7,  fee: 650,  rating: 4.6, reviews: 98  },
    { name: 'Dr. Shahida Shereen', email: 'shahida@homeoassist.com', reg: '#HOM-6019', specialty: 'Paediatrics',              qual: 'BHMS, MD (Paediatric Homeopathy)',      exp: 11, fee: 750,  rating: 4.8, reviews: 187 },
    { name: 'Dr. Karim Khan',      email: 'karim@homeoassist.com',   reg: '#HOM-1108', specialty: 'Joint & Arthritis',        qual: 'BHMS, MD (Homeopathic Rheumatology)',   exp: 18, fee: 1000, rating: 4.9, reviews: 341 },
  ];

  const pw = await hash('doctor123');
  for (const d of doctors) {
    await pool.query(
      `INSERT INTO doctors (name, email, password, reg_no, specialty, qualifications, experience_yrs, fee, rating, review_count, is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true) ON CONFLICT (email) DO NOTHING`,
      [d.name, d.email, pw, d.reg, d.specialty, d.qual, d.exp, d.fee, d.rating, d.reviews]
    );
  }
  console.log(`   ✅ ${doctors.length} doctors seeded  (password: doctor123)`);
}

// ── App seeds: Patients ────────────────────────────────────
async function seedPatients() {
  console.log('\n🧑 Seeding patients...');
  const patients = [
    { name: 'Raisa Hossain', email: 'raisa@email.com', phone: '+8801700000001', age: 28, gender: 'Female' },
    { name: 'Kamal Ahmed',   email: 'kamal@email.com', phone: '+8801700000002', age: 35, gender: 'Male'   },
  ];

  const pw = await hash('patient123');
  for (const p of patients) {
    await pool.query(
      `INSERT INTO patients (name, email, password, phone, age, gender)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (email) DO NOTHING`,
      [p.name, p.email, pw, p.phone, p.age, p.gender]
    );
  }
  console.log(`   ✅ ${patients.length} patients seeded  (password: patient123)`);
}

// ── Print summary ──────────────────────────────────────────
async function printSummary() {
  console.log('\n📊 Row counts:');
  const tables = [
    'symptom_rubrics','b_symptom_rubrics','sbr01cc',
    'medicines_mdb','medicines','dose','potency',
    'bcomplain','complain','disease',
    'b_dis_medi','dis_medi',
    'm_antidote','m_compare','m_followup','m_indication',
    'admins','doctors','patients',
  ];
  for (const t of tables) {
    try {
      const r = await pool.query(`SELECT COUNT(*) FROM ${t}`);
      console.log(`   ${t.padEnd(22)} ${r.rows[0].count}`);
    } catch (_) {
      console.log(`   ${t.padEnd(22)} (table not found)`);
    }
  }
}

// ── Main runner ────────────────────────────────────────────
async function main() {
  console.log('🚀 HomeoAssist — Full Database Migration');
  console.log('=========================================');
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');

    await runSchema();
    await seedRubrics();
    await seedMedicines();
    await seedDosePotency();
    await seedSymptoms();
    await seedSymptomMedi();
    await seedMediRelations();
    await seedAdmin();
    await seedDoctors();
    await seedPatients();
    await printSummary();

    console.log('\n🎉 Migration complete!\n');
  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
