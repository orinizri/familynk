import { migrate } from "node-pg-migrate";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, "../../migrations");

export default async function runMigrations() {
  console.log("🔄 Applying database migrations…");
  try {
    await migrate({
      databaseUrl: process.env.PLUSGRADE_DATABASE_URL,
      dir: MIGRATIONS_DIR,
      direction: "up",
      count: Infinity, // run all pending
      migrationsTable: "pgmigrations", // default, you can change
      schema: "public",
      log: (msg) => console.log("»", msg),
    });
    console.log("✅ Migrations complete");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

// If you run this file directly (`node runMigrations.js`)
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}
