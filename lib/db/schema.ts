import { pgTable, text, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
	id: uuid("id").defaultRandom().primaryKey(),

	// basic file/folder information
	name: text("name").notNull(),
	path: text("path").notNull(), // /document/project/resume
	size: integer("size").notNull(),
	type: text("type").notNull(), // "folder"

	// storage information
	fileUrl: text("file_url").notNull(), // URL to access file
	thumbnailUrl: text("thumbnail_url"),

	// ownership
	userId: text("user_id").notNull(),
	parentId: uuid("parent_id"), // Parent folder id (null for root items)

	// file/folder flags
	isFolder: boolean("is_folder").default(false).notNull(), // we will assume everything to be file unless marked as folder
	isStarred: boolean("is_starred").default(false).notNull(),
	isTrash: boolean("is_trash").default(false).notNull(),

	// timestamps
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/*
parent : A file or folder can belong to a parent folder.

   Defines a self-referencing 1-to-1 relationship:
   Each file or folder can have exactly one parent folder.

   We're using the same files table here because the parent is also just another record in the same table.



children : A folder can have many child files or folders.
*/

export const filesRelations = relations(files, ({ one, many }) => ({
	parent: one(files, {
		fields: [files.parentId], // foreign key
		references: [files.id], // the primary key that parentId refers to (i.e., files.id) | self-reference
	}),

	// relationship to child file/folder
	// You don’t need to provide fields manually here because Drizzle auto-detects it from the parent relationship above.
	children: many(files),
}));

// type definations {optional}

export const File = typeof files.$inferSelect;
/*
✍️ This extracts the TypeScript type of one row (record) in the files table — like what you get when you SELECT * FROM files.

🔐 It gives you automatic type safety in your app — so whenever you're working with data from the files table (in components, APIs, etc.), TypeScript will know exactly what fields (like name, id, etc.) exist and their types (like string, boolean, etc.).

🔄 You don't have to manually write or update types every time the database schema changes — Drizzle keeps it in sync for you, reducing bugs and improving developer productivity.
*/

export const NewFile = typeof files.$inferInsert;

/*
✍️ Defines the type for inserting new rows into the files table — like what your form or API sends to create a new file or folder.

🔐 Automatically matches your table schema, so if a column is optional (like thumbnailUrl or parentId), it knows you can leave it out — no guessing.

🔄 Keeps your insert logic in sync with the database — if you add or remove columns in the table, the insert type updates automatically.
*/
