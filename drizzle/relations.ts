import { relations } from "drizzle-orm/relations";
import { team, workspace, user, subscription, usageLog, teamMember, message, messageEdit, chat } from "./schema";

export const workspaceRelations = relations(workspace, ({one}) => ({
	team: one(team, {
		fields: [workspace.teamId],
		references: [team.id]
	}),
}));

export const teamRelations = relations(team, ({one, many}) => ({
	workspaces: many(workspace),
	user: one(user, {
		fields: [team.ownerId],
		references: [user.id]
	}),
	teamMembers: many(teamMember),
}));

export const subscriptionRelations = relations(subscription, ({one}) => ({
	user: one(user, {
		fields: [subscription.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	subscriptions: many(subscription),
	usageLogs: many(usageLog),
	teams: many(team),
	teamMembers: many(teamMember),
	chats: many(chat),
}));

export const usageLogRelations = relations(usageLog, ({one}) => ({
	user: one(user, {
		fields: [usageLog.userId],
		references: [user.id]
	}),
}));

export const teamMemberRelations = relations(teamMember, ({one}) => ({
	team: one(team, {
		fields: [teamMember.teamId],
		references: [team.id]
	}),
	user: one(user, {
		fields: [teamMember.userId],
		references: [user.id]
	}),
}));

export const messageEditRelations = relations(messageEdit, ({one}) => ({
	message: one(message, {
		fields: [messageEdit.messageId],
		references: [message.id]
	}),
}));

export const messageRelations = relations(message, ({one, many}) => ({
	messageEdits: many(messageEdit),
	chat: one(chat, {
		fields: [message.chatId],
		references: [chat.id]
	}),
}));

export const chatRelations = relations(chat, ({one, many}) => ({
	messages: many(message),
	user: one(user, {
		fields: [chat.userId],
		references: [user.id]
	}),
}));