DROP INDEX "adminUsers_userId_idx";--> statement-breakpoint
DROP INDEX "adminUsers_email_idx";--> statement-breakpoint
DROP INDEX "chat_workspaceId_idx";--> statement-breakpoint
DROP INDEX "contactRequests_email_idx";--> statement-breakpoint
DROP INDEX "contactRequests_status_idx";--> statement-breakpoint
DROP INDEX "contactRequests_type_idx";--> statement-breakpoint
DROP INDEX "messageEdits_messageId_idx";--> statement-breakpoint
DROP INDEX "chatId_idx";--> statement-breakpoint
DROP INDEX "role_idx";--> statement-breakpoint
DROP INDEX "subscription_userId_idx";--> statement-breakpoint
DROP INDEX "subscription_stripeCustomerId_idx";--> statement-breakpoint
DROP INDEX "teams_ownerId_idx";--> statement-breakpoint
DROP INDEX "usageLogs_userId_date_idx";--> statement-breakpoint
DROP INDEX "workspaces_teamId_idx";--> statement-breakpoint
ALTER TABLE "AdminUser" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "AdminUser" ALTER COLUMN "permissions" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ContactRequest" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "MessageEdit" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Subscription" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "TeamMember" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Team" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "UsageLog" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Workspace" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_workspaceId_Workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "message_chatId_idx" ON "Message" USING btree ("chatId");--> statement-breakpoint
CREATE INDEX "usageLog_userId_date_idx" ON "UsageLog" USING btree ("userId","date");--> statement-breakpoint
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_stripeCustomerId_unique" UNIQUE("stripeCustomerId");--> statement-breakpoint
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId");