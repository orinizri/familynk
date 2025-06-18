import pkg from "pg";
import { DATABASE_URL } from "../config/env.js";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: false, // Set to true if using Heroku or PlanetScale, etc.
});

export default pool;
