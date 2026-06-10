const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'db',
      database: process.env.DB_DATABASE || 'srilaxmi',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432', 10),
    };

const pool = new Pool(poolConfig);

async function initDb() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255),
      contact_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      country VARCHAR(100) NOT NULL,
      product_interest VARCHAR(255) NOT NULL,
      currency VARCHAR(10) DEFAULT 'EUR',
      message TEXT,
      uploaded_file_url TEXT,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('PostgreSQL: "enquiries" table initialized successfully.');
  } catch (error) {
    console.error('PostgreSQL: Error initializing "enquiries" table:', error.message);
    throw error;
  }
}

module.exports = {
  pool,
  initDb
};
