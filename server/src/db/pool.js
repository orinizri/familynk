import { Pool } from "pg";
import { DATABASE_URL, NODE_ENV } from "../config/env.js";
import dotenv from "dotenv";
dotenv.config();

const isProduction = NODE_ENV === "production";

// Connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // for Heroku, Render, etc.
    : false,
  max: 20, // up to 20 clients in the pool
  idleTimeoutMillis: 30000, // close & remove idle clients after 30s
  connectionTimeoutMillis: 2000, // return an error after 2s if connection could not be established
});

// Health-check helper
export async function checkDbConnection() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("✅ Database connection OK");
  } finally {
    client.release();
  }
}

pool.on("error", (err, client) => {
  console.error("Unexpected PG client error", err);
  // Ideally report to your monitoring service here
});

export default pool;
