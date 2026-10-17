CREATE TABLE `accounts` (
	`uid` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'student' NOT NULL,
	`permissions` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`paid_at` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`recorded_by` text NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `lessons` ADD `teacher_email` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `fee_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `completed_at` text;--> statement-breakpoint
ALTER TABLE `students` ADD `email` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `owner_email` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `default_fee_cents` integer DEFAULT 0 NOT NULL;