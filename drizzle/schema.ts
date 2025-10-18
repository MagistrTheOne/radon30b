import { pgTable, foreignKey, text, timestamp, integer, jsonb, boolean, uniqueIndex, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const workspace = pgTable("Workspace", {
	id: text().primaryKey().notNull(),
	teamId: text().notNull(),
	name: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "Workspace_teamId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const message = pgTable("Message", {
	id: text().primaryKey().notNull(),
	chatId: text().notNull(),
	role: text().notNull(),
	content: text().notNull(),
	imageUrl: text(),
	audioUrl: text(),
	audioTranscription: text(),
	audioDuration: integer(),
	functionCalls: jsonb(),
	personalityUsed: text(),
	conversationId: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	editedAt: timestamp({ precision: 3, mode: 'string' }),
	isEdited: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Message_chatId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const subscription = pgTable("Subscription", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	tier: text().default('free').notNull(),
	status: text().default('active').notNull(),
	currentPeriodEnd: timestamp({ precision: 3, mode: 'string' }),
	stripeCustomerId: text(),
	stripeSubscriptionId: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("Subscription_stripeCustomerId_key").using("btree", table.stripeCustomerId.asc().nullsLast().op("text_ops")),
	uniqueIndex("Subscription_stripeSubscriptionId_key").using("btree", table.stripeSubscriptionId.asc().nullsLast().op("text_ops")),
	uniqueIndex("Subscription_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Subscription_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const usageLog = pgTable("UsageLog", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	action: text().notNull(),
	count: integer().default(1).notNull(),
	date: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("UsageLog_userId_date_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.date.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UsageLog_userId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const team = pgTable("Team", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	ownerId: text().notNull(),
	maxUsers: integer().default(10).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "Team_ownerId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const teamMember = pgTable("TeamMember", {
	id: text().primaryKey().notNull(),
	teamId: text().notNull(),
	userId: text().notNull(),
	role: text().default('member').notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("TeamMember_teamId_userId_key").using("btree", table.teamId.asc().nullsLast().op("text_ops"), table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "TeamMember_teamId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "TeamMember_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const messageEdit = pgTable("MessageEdit", {
	id: text().primaryKey().notNull(),
	messageId: text().notNull(),
	previousContent: text().notNull(),
	editedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "MessageEdit_messageId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const adminUser = pgTable("AdminUser", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	email: text().notNull(),
	role: text().default('admin').notNull(),
	permissions: jsonb().default([]).notNull(),
	isActive: boolean().default(true).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	lastLoginAt: timestamp({ precision: 3, mode: 'string' }),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("AdminUser_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("AdminUser_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("User", {
	id: text().primaryKey().notNull(),
	clerkId: text().notNull(),
	email: text().notNull(),
	name: text(),
	imageUrl: text(),
	subscription: text().default('free').notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("User_clerkId_key").using("btree", table.clerkId.asc().nullsLast().op("text_ops")),
	uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const contactRequest = pgTable("ContactRequest", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	subject: text().notNull(),
	message: text().notNull(),
	type: text().default('contact').notNull(),
	status: text().default('new').notNull(),
	userAgent: text(),
	ipAddress: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	resolvedAt: timestamp({ precision: 3, mode: 'string' }),
});

export const chat = pgTable("Chat", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	workspaceId: text(),
	title: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspace.id],
			name: "Chat_workspaceId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
]);
