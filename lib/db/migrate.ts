import "./load-env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/vulture";

async function main() {
  console.log("🦅 [Vulture] Running database migrations...");
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: "./drizzle/migrations" });
    console.log("✅ [Vulture] Migrations applied successfully!");
  } catch (err) {
    console.error("❌ [Vulture] Migration error:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
