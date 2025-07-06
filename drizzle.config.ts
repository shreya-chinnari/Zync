// import "dotenv/config";
// 🔸 Option 1 (commented out): This would auto-load environment variables from a default `.env` file.
// 🔸 You're not using this because you want to load `.env.local` specifically.

import * as dotenv from "dotenv";
// ✅ Import the `dotenv` library to load environment variables manually from a file.

import { defineConfig } from "drizzle-kit";
// ✅ Import the helper function from Drizzle CLI used to define the config for Drizzle ORM.

dotenv.config({ path: ".env.local" });
// ✅ Load environment variables from a file named `.env.local` instead of the default `.env`.

if (!process.env.DATABASE_URL) {
	throw new Error("Database url is not set in .env.local");
}
// ✅ Safety check: Make sure the required `DATABASE_URL` exists in the environment file.
// 🛑 If it's missing, stop and show a clear error.

export default defineConfig({
	schema: "./lib/db/schema.ts",
	// ✅ This tells Drizzle where your schema file is (where all tables and relations are defined).

	out: "./drizzle",
	// ✅ This tells Drizzle to save all generated files (like SQL migrations) into the `drizzle` folder.

	dialect: "postgresql",
	// ✅ Specify the SQL dialect you're using. Here it's PostgreSQL (used by Neon, Supabase, etc.).

	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	// ✅ Tell Drizzle how to connect to your database using the URL from your `.env.local`.
	// ❗ The exclamation mark (!) means “I’m sure it’s defined” — and you’ve already checked that above.

	// Optional configuration below:
	migrations: {
		table: "__drizzle_migration",
		schema: "public",
	},
	// ✅ Define how and where migration history is tracked in the DB.
	// Drizzle will use a special table (`__drizzle_migration`) in the `public` schema to store migration history.

	verbose: true,
	// ✅ Show detailed logs when running Drizzle commands (like `db push` or `migrate`).
	// Helpful for debugging or understanding what’s going on.

	strict: true,
	// ✅ Enable strict mode: Drizzle will throw errors if there are unsafe or conflicting schema definitions.
});
