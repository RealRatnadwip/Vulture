import "./load-env";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/vulture";

async function main() {
  console.log("🦅 [Vulture] Connecting to TigerDB to clear application data...");
  const sql = postgres(connectionString, { max: 1 });

  try {
    console.log("-> Truncating messages, group_members, groups, users...");
    await sql`TRUNCATE TABLE messages, group_members, groups, users CASCADE;`;
    console.log("[Vulture] TigerDB tables cleared successfully!");
  } catch (err) {
    console.error("[Vulture] Error clearing database:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
