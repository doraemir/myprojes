CREATE TABLE `auth_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `credentials` (
	`user_id` text PRIMARY KEY NOT NULL,
	`hash` text NOT NULL,
	`salt` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `password_links` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires` text NOT NULL
);
