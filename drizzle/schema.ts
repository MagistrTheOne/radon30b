import { pgTable, index, foreignKey, text, timestamp, unique, integer, json, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const workspace = pgTable("Workspace", {
	id: text().default('cuid()').primaryKey().notNull(),
	teamId: text().notNull(),
	name: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("workspaces_teamId_idx").using("btree", table.teamId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "Workspace_teamId_Team_id_fk"
		}).onDelete("cascade"),
]);

export const subscription = pgTable("Subscription", {
	id: text().default('cuid()').primaryKey().notNull(),
	userId: text().notNull(),
	tier: text().default('free').notNull(),
	status: text().default('active').notNull(),
	currentPeriodEnd: timestamp({ mode: 'string' }),
	stripeCustomerId: text(),
	stripeSubscriptionId: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("subscription_stripeCustomerId_idx").using("btree", table.stripeCustomerId.asc().nullsLast().op("text_ops")),
	index("subscription_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Subscription_userId_User_id_fk"
		}).onDelete("cascade"),
	unique("Subscription_userId_unique").on(table.userId),
]);

export const usageLog = pgTable("UsageLog", {
	id: text().default('cuid()').primaryKey().notNull(),
	userId: text().notNull(),
	action: text().notNull(),
	count: integer().default(1).notNull(),
	date: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("usageLogs_userId_date_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.date.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UsageLog_userId_User_id_fk"
		}),
]);

export const team = pgTable("Team", {
	id: text().default('cuid()').primaryKey().notNull(),
	name: text().notNull(),
	ownerId: text().notNull(),
	maxUsers: integer().default(10).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("teams_ownerId_idx").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "Team_ownerId_User_id_fk"
		}),
]);

export const teamMember = pgTable("TeamMember", {
	id: text().default('cuid()').primaryKey().notNull(),
	teamId: text().notNull(),
	userId: text().notNull(),
	role: text().default('member').notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [team.id],
			name: "TeamMember_teamId_Team_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "TeamMember_userId_User_id_fk"
		}).onDelete("cascade"),
	unique("team_user_unique").on(table.teamId, table.userId),
]);

export const messageEdit = pgTable("MessageEdit", {
	id: text().default('cuid()').primaryKey().notNull(),
	messageId: text().notNull(),
	previousContent: text().notNull(),
	editedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("messageEdits_messageId_idx").using("btree", table.messageId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "MessageEdit_messageId_Message_id_fk"
		}).onDelete("cascade"),
]);

export const message = pgTable("Message", {
	id: text().default('cuid()').primaryKey().notNull(),
	chatId: text().notNull(),
	role: text().notNull(),
	content: text().notNull(),
	imageUrl: text(),
	audioUrl: text(),
	audioTranscription: text(),
	audioDuration: integer(),
	functionCalls: json(),
	personalityUsed: text(),
	conversationId: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	editedAt: timestamp({ mode: 'string' }),
	isEdited: boolean().default(false).notNull(),
}, (table) => [
	index("chatId_idx").using("btree", table.chatId.asc().nullsLast().op("text_ops")),
	index("role_idx").using("btree", table.role.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Message_chatId_Chat_id_fk"
		}).onDelete("cascade"),
]);

export const chat = pgTable("Chat", {
	id: text().default('cuid()').primaryKey().notNull(),
	userId: text().notNull(),
	workspaceId: text(),
	title: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("chat_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("chat_workspaceId_idx").using("btree", table.workspaceId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_User_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("User", {
	id: text().primaryKey().notNull(),
	clerkId: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	name: text(),
	imageUrl: text(),
	subscription: text().default('free').notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("clerkId_idx").using("btree", table.clerkId.asc().nullsLast().op("text_ops")),
	index("email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("User_clerkId_unique").on(table.clerkId),
	unique("User_email_unique").on(table.email),
]);

export const adminUser = pgTable("AdminUser", {
	id: text().default('cuid()').primaryKey().notNull(),
	userId: text().notNull(),
	email: text().notNull(),
	role: text().default('admin').notNull(),
	permissions: json().default([]).notNull(),
	isActive: boolean().default(true).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	lastLoginAt: timestamp({ mode: 'string' }),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("adminUsers_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("adminUsers_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	unique("AdminUser_userId_unique").on(table.userId),
	unique("AdminUser_email_unique").on(table.email),
]);

export const contactRequest = pgTable("ContactRequest", {
	id: text().default('cuid()').primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	subject: text().notNull(),
	message: text().notNull(),
	type: text().default('contact').notNull(),
	status: text().default('new').notNull(),
	userAgent: text(),
	ipAddress: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	resolvedAt: timestamp({ mode: 'string' }),
}, (table) => [
	index("contactRequests_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("contactRequests_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("contactRequests_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
]);
