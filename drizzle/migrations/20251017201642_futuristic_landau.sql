CREATE TABLE "AdminUser" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"permissions" json DEFAULT '[]'::json NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastLoginAt" timestamp,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "AdminUser_userId_unique" UNIQUE("userId"),
	CONSTRAINT "AdminUser_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Chat" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"workspaceId" text,
	"title" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ContactRequest" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'contact' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"userAgent" text,
	"ipAddress" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"resolvedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "MessageEdit" (
	"id" text PRIMARY KEY NOT NULL,
	"messageId" text NOT NULL,
	"previousContent" text NOT NULL,
	"editedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" text PRIMARY KEY NOT NULL,
	"chatId" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"imageUrl" text,
	"audioUrl" text,
	"audioTranscription" text,
	"audioDuration" integer,
	"functionCalls" json,
	"personalityUsed" text,
	"conversationId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"editedAt" timestamp,
	"isEdited" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"tier" text DEFAULT 'free' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"currentPeriodEnd" timestamp,
	"stripeCustomerId" text,
	"stripeSubscriptionId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Subscription_userId_unique" UNIQUE("userId"),
	CONSTRAINT "Subscription_stripeCustomerId_unique" UNIQUE("stripeCustomerId"),
	CONSTRAINT "Subscription_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId")
);
--> statement-breakpoint
CREATE TABLE "TeamMember" (
	"id" text PRIMARY KEY NOT NULL,
	"teamId" text NOT NULL,
	"userId" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_user_unique" UNIQUE("teamId","userId")
);
--> statement-breakpoint
CREATE TABLE "Team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"ownerId" text NOT NULL,
	"maxUsers" integer DEFAULT 10 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UsageLog" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"action" text NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"clerkId" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"imageUrl" text,
	"subscription" text DEFAULT 'free' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_clerkId_unique" UNIQUE("clerkId"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Workspace" (
	"id" text PRIMARY KEY NOT NULL,
	"teamId" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_workspaceId_Workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MessageEdit" ADD CONSTRAINT "MessageEdit_messageId_Message_id_fk" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_Team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_User_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_teamId_Team_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "adminUser_userId_idx" ON "AdminUser" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "adminUser_email_idx" ON "AdminUser" USING btree ("email");--> statement-breakpoint
CREATE INDEX "chat_userId_idx" ON "Chat" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "chat_workspaceId_idx" ON "Chat" USING btree ("workspaceId");--> statement-breakpoint
CREATE INDEX "contactRequest_email_idx" ON "ContactRequest" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contactRequest_status_idx" ON "ContactRequest" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messageEdit_messageId_idx" ON "MessageEdit" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "message_chatId_idx" ON "Message" USING btree ("chatId");--> statement-breakpoint
CREATE INDEX "message_conversationId_idx" ON "Message" USING btree ("conversationId");--> statement-breakpoint
CREATE INDEX "subscription_userId_idx" ON "Subscription" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "subscription_stripeCustomerId_idx" ON "Subscription" USING btree ("stripeCustomerId");--> statement-breakpoint
CREATE INDEX "team_ownerId_idx" ON "Team" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "usageLog_userId_date_idx" ON "UsageLog" USING btree ("userId","date");--> statement-breakpoint
CREATE INDEX "clerkId_idx" ON "User" USING btree ("clerkId");--> statement-breakpoint
CREATE INDEX "email_idx" ON "User" USING btree ("email");--> statement-breakpoint
CREATE INDEX "workspace_teamId_idx" ON "Workspace" USING btree ("teamId");