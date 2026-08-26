/**
 * HomeoAssist — seed app users only (admin, doctors, patients).
 * Repertory data is imported separately via mdb_import.py.
 * Run: node seed_users.js
 */
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'homeoassist',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'oyshiaka123',
});

const DOCTORS = [
  ['Dr. Anika Rahman',    'anika@homeoassist.com',   '#HOM-4821', 'Allergies & Respiratory', 'MD Homeopathy (BHMS, Gold Medalist)',      12, 800,  4.9, 214],
  ['Dr. Rahim Uddin',     'rahim@homeoassist.com',   '#HOM-3910', 'Digestive & IBS',         'BHMS, MD (Homeo Gastro)',                   9, 700,  4.7, 156],
  ['Dr. Reema Chowdhury', 'reema@homeoassist.com',   '#HOM-5102', "Women's Health",          'BHMS, FCMH (Gynecology)',                  15, 900,  4.8, 302],
  ['Dr. Imran Shah',      'imran@homeoassist.com',   '#HOM-2891', 'Skin & Dermatology',      'BHMS, Dip. Homeopathic Dermatology',        7, 650,  4.6,  98],
  ['Dr. Shahida Shereen', 'shahida@homeoassist.com', '#HOM-6019', 'Paediatrics',             'BHMS, MD (Paediatric Homeopathy)',         11, 750,  4.8, 187],
  ['Dr. Karim Khan',      'karim@homeoassist.com',   '#HOM-1108', 'Joint & Arthritis',       'BHMS, MD (Homeopathic Rheumatology)',      18, 1000, 4.9, 341],
];

const PATIENTS = [
  ['Raisa Hossain', 'raisa@email.com', '+8801700000001', 28, 'Female'],
  ['Kamal Ahmed',   'kamal@email.com', '+8801700000002', 35, 'Male'],
];

async function main() {
  const adminPw = await bcrypt.hash('admin123', 10);
  await pool.query(
    `INSERT INTO admins (username, email, password)
     VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
    ['admin_sys', 'admin@homeoassist.com', adminPw]
  );
  console.log('admin seeded');

  const docPw = await bcrypt.hash('doctor123', 10);
  for (const [name, email, reg, spec, qual, exp, fee, rating, reviews] of DOCTORS) {
    await pool.query(
      `INSERT INTO doctors (name, email, password, reg_no, specialty, qualifications,
                            experience_yrs, fee, rating, review_count, is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true) ON CONFLICT (email) DO NOTHING`,
      [name, email, docPw, reg, spec, qual, exp, fee, rating, reviews]
    );
  }
  console.log(`${DOCTORS.length} doctors seeded`);

  const patPw = await bcrypt.hash('patient123', 10);
  for (const [name, email, phone, age, gender] of PATIENTS) {
    await pool.query(
      `INSERT INTO patients (name, email, password, phone, age, gender)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (email) DO NOTHING`,
      [name, email, patPw, phone, age, gender]
    );
  }
  console.log(`${PATIENTS.length} patients seeded`);
}

main()
  .then(() => pool.end())
  .catch((e) => { console.error(e.message); pool.end(); process.exit(1); });
