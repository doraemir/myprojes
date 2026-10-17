ALTER TABLE `accounts` ADD `name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `lessons` ADD `creation_mail_status` text DEFAULT 'legacy' NOT NULL;