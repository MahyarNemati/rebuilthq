import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Works with Supabase, Neon, or any PostgreSQL connection string
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
