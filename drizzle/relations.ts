import { relations } from "drizzle-orm/relations";
import { teams, workspaces, users, subscriptions, usageLogs, teamMembers, messages, messageEdits, chats } from "./schema";

export const workspaceRelations = relations(workspaces, ({one}) => ({
	team: one(teams, {
		fields: [workspaces.teamId],
		references: [teams.id]
	}),
}));

export const teamRelations = relations(teams, ({one, many}) => ({
	workspaces: many(workspaces),
	user: one(users, {
		fields: [teams.ownerId],
		references: [users.id]
	}),
	teamMembers: many(teamMembers),
}));

export const subscriptionRelations = relations(subscriptions, ({one}) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	}),
}));

export const userRelations = relations(users, ({many}) => ({
	subscriptions: many(subscriptions),
	usageLogs: many(usageLogs),
	teams: many(teams),
	teamMembers: many(teamMembers),
	chats: many(chats),
}));

export const usageLogRelations = relations(usageLogs, ({one}) => ({
	user: one(users, {
		fields: [usageLogs.userId],
		references: [users.id]
	}),
}));

export const teamMemberRelations = relations(teamMembers, ({one}) => ({
	team: one(teams, {
		fields: [teamMembers.teamId],
		references: [teams.id]
	}),
	user: one(users, {
		fields: [teamMembers.userId],
		references: [users.id]
	}),
}));

export const messageEditRelations = relations(messageEdits, ({one}) => ({
	message: one(messages, {
		fields: [messageEdits.messageId],
		references: [messages.id]
	}),
}));

export const messageRelations = relations(messages, ({one, many}) => ({
	messageEdits: many(messageEdits),
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id]
	}),
}));

export const chatRelations = relations(chats, ({one, many}) => ({
	messages: many(messages),
	user: one(users, {
		fields: [chats.userId],
		references: [users.id]
	}),
}));