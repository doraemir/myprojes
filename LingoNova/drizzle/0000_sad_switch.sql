CREATE TABLE `lessons` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`starts_at` text NOT NULL,
	`topic` text NOT NULL,
	`email` text NOT NULL,
	`reminder_minutes` integer NOT NULL,
	`reminder_sent` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_name_unique` ON `students` (`name`);