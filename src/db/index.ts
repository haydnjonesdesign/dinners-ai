import { drizzle } from "drizzle-orm/better-sqlite";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database(process.env.DATABASE_URL || "./dev.sqlite");
export const db = drizzle(sqlite, { schema });
