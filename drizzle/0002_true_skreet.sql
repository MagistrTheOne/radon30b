ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_stripeCustomerId_unique";--> statement-breakpoint
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_stripeSubscriptionId_unique";--> statement-breakpoint
ALTER TABLE "AdminUser" DROP CONSTRAINT "AdminUser_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_workspaceId_Workspace_id_fk";
--> statement-breakpoint
DROP INDEX "message_chatId_idx";--> statement-breakpoint
DROP INDEX "usageLog_userId_date_idx";--> statement-breakpoint
ALTER TABLE "AdminUser" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "AdminUser" ALTER COLUMN "permissions" SET DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "ContactRequest" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "MessageEdit" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "Subscription" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "TeamMember" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "Team" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "UsageLog" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
ALTER TABLE "Workspace" ALTER COLUMN "id" SET DEFAULT 'cuid()';--> statement-breakpoint
CREATE INDEX "adminUsers_userId_idx" ON "AdminUser" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "adminUsers_email_idx" ON "AdminUser" USING btree ("email");--> statement-breakpoint
CREATE INDEX "chat_workspaceId_idx" ON "Chat" USING btree ("workspaceId");--> statement-breakpoint
CREATE INDEX "contactRequests_email_idx" ON "ContactRequest" USING btree ("email");--> statement-breakpoint
CREATE INDEX "contactRequests_status_idx" ON "ContactRequest" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contactRequests_type_idx" ON "ContactRequest" USING btree ("type");--> statement-breakpoint
CREATE INDEX "messageEdits_messageId_idx" ON "MessageEdit" USING btree ("messageId");--> statement-breakpoint
CREATE INDEX "chatId_idx" ON "Message" USING btree ("chatId");--> statement-breakpoint
CREATE INDEX "role_idx" ON "Message" USING btree ("role");--> statement-breakpoint
CREATE INDEX "subscription_userId_idx" ON "Subscription" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "subscription_stripeCustomerId_idx" ON "Subscription" USING btree ("stripeCustomerId");--> statement-breakpoint
CREATE INDEX "teams_ownerId_idx" ON "Team" USING btree ("ownerId");--> statement-breakpoint
CREATE INDEX "usageLogs_userId_date_idx" ON "UsageLog" USING btree ("userId","date");--> statement-breakpoint
CREATE INDEX "workspaces_teamId_idx" ON "Workspace" USING btree ("teamId");