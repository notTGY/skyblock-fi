import fs from "node:fs";
import { sql } from "../lib/db.js";

async function setupDb() {
  try {
    const sqlContent = fs.readFileSync("./scripts/setup-db.sql", "utf8");
    await sql.unsafe(sqlContent);
    console.log("Database setup complete");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

setupDb();
