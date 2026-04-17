/**
 * Database client.
 *
 * Strategy: graceful degradation.
 *   - If DATABASE_URL is set, use Neon serverless driver + Drizzle.
 *   - If not, `db` is null and callers fall back to the TypeScript fixtures.
 *
 * This lets the site deploy anywhere immediately; provisioning Postgres is a
 * single env-var flip.
 */
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const url = process.env.DATABASE_URL;

export const hasDb = Boolean(url);

export const db = url ? drizzle(neon(url), { schema }) : (null as unknown as ReturnType<typeof drizzle>);

export * from "./schema";
