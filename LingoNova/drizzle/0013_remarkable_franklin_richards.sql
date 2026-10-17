CREATE TABLE `account_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`uid` text NOT NULL,
	`secret_hash` text NOT NULL,
	`device` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_seen` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sessions_uid_idx` ON `account_sessions` (`uid`);--> statement-breakpoint
CREATE TABLE `audit_events` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_uid` text NOT NULL,
	`actor_email` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`details` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_date_idx` ON `audit_events` (`created_at`);--> statement-breakpoint
CREATE TABLE `auth_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lesson_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`uid` text NOT NULL,
	`kind` text NOT NULL,
	`message` text NOT NULL,
	`requested_at` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trial_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	`consent_version` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`uid` text PRIMARY KEY NOT NULL,
	`email_reminder` integer DEFAULT true NOT NULL,
	`whatsapp_reminder` integer DEFAULT false NOT NULL,
	`goal` text DEFAULT '' NOT NULL,
	`deletion_requested_at` text
);
--> statement-breakpoint
ALTER TABLE `lessons` ADD `is_test` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `payments` ADD `method` text DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `level` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `notes` text DEFAULT '' NOT NULL;