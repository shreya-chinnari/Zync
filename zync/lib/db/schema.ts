import { relations } from "drizzle-orm";
import {
	pgTable,
	boolean,
	timestamp,
	uuid,
	integer,
	text,
} from "drizzle-orm/pg-core";

export const files = pgTable("files", {
	id: uuid("id").defaultRandom().primaryKey(),

	// basic file/folder info
	name: text("name").notNull(),
	path: text("path").notNull(), // /document/project/resume
	size: integer("size").notNull(),
	type: text("type").notNull(), // e.g., "file" or "folder"

	// storage info
	fileUrl: text("file_url").notNull(), // URL to access the file
	thumbnailUrl: text("thumbnail_url"), // optional thumbnail URL

	// ownership info
	userId: text("user_id").notNull(), // ID of the user who owns the file
	parentId: uuid("parent_id"), // ID of the parent folder, if any

	// file/folder flags
	isFolder: boolean("is_folder").default(false).notNull(),
	isStarred: boolean("is_starred").default(false).notNull(),
	isTrash: boolean("is_trash").default(false).notNull(),

	// timestamps
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// relation with the same table for parent-child relationships
export const filesRelations = relations(files, ({ one, many }) => ({
	parent: one(files, {
		fields: [files.parentId],
		references: [files.id],
	}),
	// relationship to children files/folders
	children: many(files),
}));

// type definitions for file/folder
export type File = typeof files.$inferSelect;
export const NewFile = files.$inferInsert;

/*
parent : each file/folder can have one parent folder
children : each folder can have multiple children files/folders
*/
