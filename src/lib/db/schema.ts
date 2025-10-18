import { pgTable, text, timestamp, integer, boolean, json, unique, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// User table
export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  clerkId: text('clerkId').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  imageUrl: text('imageUrl'),
  subscription: text('subscription').notNull().default('free'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  clerkIdIdx: index('clerkId_idx').on(table.clerkId),
  emailIdx: index('email_idx').on(table.email),
}))

// Subscription table
export const subscriptions = pgTable('Subscription', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  tier: text('tier').notNull().default('free'), // free, pro, team, enterprise
  status: text('status').notNull().default('active'), // active, cancelled, expired
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  stripeCustomerId: text('stripeCustomerId').unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Team table
export const teams = pgTable('Team', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  name: text('name').notNull(),
  ownerId: text('ownerId').notNull().references(() => users.id),
  maxUsers: integer('maxUsers').notNull().default(10),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Team Member table
export const teamMembers = pgTable('TeamMember', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'), // admin, member
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  teamUserUnique: unique('team_user_unique').on(table.teamId, table.userId),
}))

// Workspace table
export const workspaces = pgTable('Workspace', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Chat table
export const chats = pgTable('Chat', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspaceId').references(() => workspaces.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('chat_userId_idx').on(table.userId),
}))

// Message table
export const messages = pgTable('Message', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  chatId: text('chatId').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  imageUrl: text('imageUrl'),
  audioUrl: text('audioUrl'),
  audioTranscription: text('audioTranscription'),
  audioDuration: integer('audioDuration'), // в секундах
  // Новые поля для API v2.0.0
  functionCalls: json('functionCalls'), // Function calls в JSON формате
  personalityUsed: text('personalityUsed'), // Использованная личность
  conversationId: text('conversationId'), // ID разговора в Radon API
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  editedAt: timestamp('editedAt'),
  isEdited: boolean('isEdited').notNull().default(false),
}, (table) => ({
  chatIdIdx: index('message_chatId_idx').on(table.chatId),
}))

// Message Edit table
export const messageEdits = pgTable('MessageEdit', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  messageId: text('messageId').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  previousContent: text('previousContent').notNull(),
  editedAt: timestamp('editedAt').notNull().defaultNow(),
})

// Usage Log table
export const usageLogs = pgTable('UsageLog', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  userId: text('userId').notNull().references(() => users.id),
  action: text('action').notNull(), // message, api_call, image_analysis
  count: integer('count').notNull().default(1),
  date: timestamp('date').notNull().defaultNow(),
}, (table) => ({
  userIdDateIdx: index('usageLog_userId_date_idx').on(table.userId, table.date),
}))

// Admin User table
export const adminUsers = pgTable('AdminUser', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  userId: text('userId').notNull().unique().references(() => users.id),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('admin'), // admin, super_admin, owner
  permissions: json('permissions').notNull().default([]),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  lastLoginAt: timestamp('lastLoginAt'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Contact Request table
export const contactRequests = pgTable('ContactRequest', {
  id: text('id').primaryKey().$defaultFn(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('contact'), // contact, support, gdpr, bug_report
  status: text('status').notNull().default('new'), // new, in_progress, resolved, closed
  userAgent: text('userAgent'),
  ipAddress: text('ipAddress'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  resolvedAt: timestamp('resolvedAt'),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  chats: many(chats),
  usageLogs: many(usageLogs),
  ownedTeams: many(teams, { relationName: 'TeamOwner' }),
  teamMemberships: many(teamMembers),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
    relationName: 'TeamOwner',
  }),
  members: many(teamMembers),
  workspaces: many(workspaces),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}))

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  team: one(teams, {
    fields: [workspaces.teamId],
    references: [teams.id],
  }),
  chats: many(chats),
}))

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [chats.workspaceId],
    references: [workspaces.id],
  }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  edits: many(messageEdits),
}))

export const messageEditsRelations = relations(messageEdits, ({ one }) => ({
  message: one(messages, {
    fields: [messageEdits.messageId],
    references: [messages.id],
  }),
}))

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
}))

export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
  user: one(users, {
    fields: [adminUsers.userId],
    references: [users.id],
  }),
}))

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Chat = typeof chats.$inferSelect
export type NewChat = typeof chats.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert
export type TeamMember = typeof teamMembers.$inferSelect
export type NewTeamMember = typeof teamMembers.$inferInsert
export type Workspace = typeof workspaces.$inferSelect
export type NewWorkspace = typeof workspaces.$inferInsert
export type MessageEdit = typeof messageEdits.$inferSelect
export type NewMessageEdit = typeof messageEdits.$inferInsert
export type UsageLog = typeof usageLogs.$inferSelect
export type NewUsageLog = typeof usageLogs.$inferInsert
export type AdminUser = typeof adminUsers.$inferSelect
export type NewAdminUser = typeof adminUsers.$inferInsert
export type ContactRequest = typeof contactRequests.$inferSelect
export type NewContactRequest = typeof contactRequests.$inferInsert
