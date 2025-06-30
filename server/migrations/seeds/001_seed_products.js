// backend/migrations/seeds/001_seed_products.js
import fs from "fs/promises";
import path from "path";
import pool from "../../src/db/pool.js";
import { fileURLToPath } from "url";

async function seed() {
  const client = await pool.connect();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    console.log("🔄 Starting seed…");
    await client.query("BEGIN");
    console.log("🗑  Truncating tables…");

    await client.query(`
      TRUNCATE TABLE product_charges, product_assignments
      RESTART IDENTITY CASCADE
    `);

    console.log("📂 Loading JSON files…");
    const baseDir = path.resolve(__dirname, "../../data");
    const assignmentsJSON = await fs.readFile(
      path.join(baseDir, "product_assignment.json"),
      "utf-8"
    );
    const chargesJSON = await fs.readFile(
      path.join(baseDir, "product_charges.json"),
      "utf-8"
    );
    const productAssignments = JSON.parse(assignmentsJSON);
    const productCharges = JSON.parse(chargesJSON);

    console.log(`ℹ️  Loaded ${productAssignments.length} assignments`);
    console.log(`ℹ️  Loaded ${productCharges.length} charges`);

    // --- Batch insert assignments ---
    const batchSize = 5000;
    for (let i = 0; i < productAssignments.length; i += batchSize) {
      const batch = productAssignments.slice(i, i + batchSize);
      console.log(
        `➡️  Inserting assignments batch ${i}-${i + batch.length - 1}`
      );

      // build multi-row INSERT
      const placeholders = batch
        .map((_, idx) => {
          const offset = idx * 3;
          return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
        })
        .join(",\n  ");

      const sql = `
        INSERT INTO product_assignments (id, reservation_uuid, name)
        VALUES
          ${placeholders}
        ON CONFLICT (id) DO NOTHING
      `;
      const values = batch.flatMap(({ id, reservation_uuid, name }) => [
        id,
        reservation_uuid,
        name,
      ]);

      await client.query(sql, values);
    }

    console.log("✅ All assignment batches inserted");

    console.log("🔧 Resetting assignment ID sequence…");
    await client.query(`
      SELECT setval(
        pg_get_serial_sequence('product_assignments','id'),
        COALESCE(MAX(id), 0)
      )
      FROM product_assignments
    `);

    // --- Batch insert charges ---
    for (let i = 0; i < productCharges.length; i += batchSize) {
      const batch = productCharges.slice(i, i + batchSize);
      console.log(`➡️  Inserting charges batch ${i}-${i + batch.length - 1}`);

      const placeholders = batch
        .map((_, idx) => {
          const offset = idx * 3;
          return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
        })
        .join(",\n  ");

      const sql = `
        INSERT INTO product_charges (
          special_product_assignment_id,
          active,
          amount
        )
        VALUES
          ${placeholders}
        ON CONFLICT DO NOTHING
      `;
      const values = batch.flatMap(
        ({ special_product_assignment_id, active, amount }) => [
          special_product_assignment_id,
          active,
          amount,
        ]
      );

      await client.query(sql, values);
    }

    console.log("✅ All charge batches inserted");

    await client.query("COMMIT");
    console.log("🎉 Seed completed successfully");
  } catch (err) {
    console.error("❌ Seed failed—rolling back:", err);
    await client.query("ROLLBACK");
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
