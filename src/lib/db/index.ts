import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  const client = postgres(process.env.DATABASE_URL);
  return drizzle(client, { schema });
}

// Lazy init — avoids crashing at build time when env vars aren't available
let _db: ReturnType<typeof createDb> | undefined;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

// For backward compat — will throw at runtime if DATABASE_URL missing, not at import time
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop: string) {
    const instance = getDb();
    const value = (instance as unknown as Record<string, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
