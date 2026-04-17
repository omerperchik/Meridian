/**
 * Apply migrations to the configured database.
 * Usage: DATABASE_URL=... npm run db:migrate
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const client = drizzle(neon(url));
  await migrate(client, { migrationsFolder: "./db/migrations" });
  console.log("✓ migrations applied");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
