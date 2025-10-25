import fs from "node:fs";
import { sql } from "../lib/db.js";

async function setupDb() {
  try {
    const createSql = fs.readFileSync(
      "./scripts/001-create-tables.sql",
      "utf8",
    );
    await sql.unsafe(createSql);
    const seedSql = fs.readFileSync("./scripts/002-seed-labels.sql", "utf8");
    await sql.unsafe(seedSql);
    console.log("Database setup complete");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

setupDb();
