import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  json, 
  primaryKey,
  index,
  unique
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
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

// Chats table
export const chats = pgTable('Chat', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: text('workspaceId').references(() => workspaces.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('chat_userId_idx').on(table.userId),
  workspaceIdIdx: index('chat_workspaceId_idx').on(table.workspaceId),
}))

// Messages table
export const messages = pgTable('Message', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chatId').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content', { mode: 'text' }).notNull(),
  imageUrl: text('imageUrl'),
  audioUrl: text('audioUrl'),
  audioTranscription: text('audioTranscription', { mode: 'text' }),
  audioDuration: integer('audioDuration'),
  functionCalls: json('functionCalls'),
  personalityUsed: text('personalityUsed'),
  conversationId: text('conversationId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  editedAt: timestamp('editedAt'),
  isEdited: boolean('isEdited').notNull().default(false),
}, (table) => ({
  chatIdIdx: index('message_chatId_idx').on(table.chatId),
  conversationIdIdx: index('message_conversationId_idx').on(table.conversationId),
}))

// Subscriptions table
export const subscriptions = pgTable('Subscription', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  tier: text('tier').notNull().default('free'),
  status: text('status').notNull().default('active'),
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  stripeCustomerId: text('stripeCustomerId').unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('subscription_userId_idx').on(table.userId),
  stripeCustomerIdIdx: index('subscription_stripeCustomerId_idx').on(table.stripeCustomerId),
}))

// Usage logs table
export const usageLogs = pgTable('UsageLog', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id),
  action: text('action').notNull(),
  count: integer('count').notNull().default(1),
  date: timestamp('date').notNull().defaultNow(),
}, (table) => ({
  userIdDateIdx: index('usageLog_userId_date_idx').on(table.userId, table.date),
}))

// Teams table
export const teams = pgTable('Team', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  ownerId: text('ownerId').notNull().references(() => users.id),
  maxUsers: integer('maxUsers').notNull().default(10),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  ownerIdIdx: index('team_ownerId_idx').on(table.ownerId),
}))

// Team members table
export const teamMembers = pgTable('TeamMember', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  teamUserUnique: unique('team_user_unique').on(table.teamId, table.userId),
}))

// Workspaces table
export const workspaces = pgTable('Workspace', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  teamId: text('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  teamIdIdx: index('workspace_teamId_idx').on(table.teamId),
}))

// Message edits table
export const messageEdits = pgTable('MessageEdit', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  messageId: text('messageId').notNull().references(() => messages.id, { onDelete: 'cascade' }),
  previousContent: text('previousContent', { mode: 'text' }).notNull(),
  editedAt: timestamp('editedAt').notNull().defaultNow(),
}, (table) => ({
  messageIdIdx: index('messageEdit_messageId_idx').on(table.messageId),
}))

// Admin users table
export const adminUsers = pgTable('AdminUser', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().unique(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('admin'),
  permissions: json('permissions').notNull().default([]),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  lastLoginAt: timestamp('lastLoginAt'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('adminUser_userId_idx').on(table.userId),
  emailIdx: index('adminUser_email_idx').on(table.email),
}))

// Contact requests table
export const contactRequests = pgTable('ContactRequest', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message', { mode: 'text' }).notNull(),
  type: text('type').notNull().default('contact'),
  status: text('status').notNull().default('new'),
  userAgent: text('userAgent'),
  ipAddress: text('ipAddress'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  resolvedAt: timestamp('resolvedAt'),
}, (table) => ({
  emailIdx: index('contactRequest_email_idx').on(table.email),
  statusIdx: index('contactRequest_status_idx').on(table.status),
}))

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  chats: many(chats),
  subscriptionData: one(subscriptions),
  usageLogs: many(usageLogs),
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
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

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
}))

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
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

export const messageEditsRelations = relations(messageEdits, ({ one }) => ({
  message: one(messages, {
    fields: [messageEdits.messageId],
    references: [messages.id],
  }),
}))

// Export all tables
export const schema = {
  users,
  chats,
  messages,
  subscriptions,
  usageLogs,
  teams,
  teamMembers,
  workspaces,
  messageEdits,
  adminUsers,
  contactRequests,
}