import { drizzle } from "drizzle-orm/neon-http";
// drizzle() is the function used to create a database connection with Drizzle using Neon’s HTTP-based driver
// This is optimized for serverless environments like Vercel or Netlify.
import { neon } from "@neondatabase/serverless";
// Imports the HTTP client from Neon to connect to a PostgreSQL database hosted on Neon.
// neon() allows you to connect to Neon using HTTP, which is stateless and serverless-friendly (no need for long-lived TCP connections like in traditional DB clients).
import * as schema from "./schema";
// Imports all the tables and relations you've defined in schema.ts, it is passed to Drizzle

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // optional, only if needed here

if (!process.env.DATABASE_URL) {
	throw new Error("Missing DATABASE_URL in environment");
}

// This creates the actual client connection to your Neon PostgreSQL database.
// The ! tells TypeScript “I’m sure this environment variable is defined” — if it’s not, your app will crash at runtime.
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

export { sql };
