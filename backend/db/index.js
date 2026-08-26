const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const pool = new Pool({
  host:     process.env.DB_HOST     || '127.0.0.1',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'homeoassist',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'oyshiaka123',
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

module.exports = pool;
