import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { newDb } from "pg-mem";

const { Pool } = pg;

let _pool: any;

if (process.env.DATABASE_URL) {
  _pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else if (process.env.NODE_ENV === "development") {
  // Use an in-memory Postgres for local development
  const mem = newDb();

// Automatically create tables from Drizzle schema
mem.public.none(`
  CREATE TABLE IF NOT EXISTS ngos (
    id SERIAL PRIMARY KEY,
    name TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    description TEXT
  );
`);

const adapter = mem.adapters.createPg();
_pool = new adapter.Pool();
} else {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = _pool;
export const db = drizzle(_pool, { schema });