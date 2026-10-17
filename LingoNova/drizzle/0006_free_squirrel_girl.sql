CREATE TABLE `learning_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`teacher_email` text NOT NULL,
	`lesson_id` text,
	`config` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learning_members` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`student_id` text NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `learning_activities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `learning_responses` (
	`id` text PRIMARY KEY NOT NULL,
	`activity_id` text NOT NULL,
	`student_id` text NOT NULL,
	`answer` text DEFAULT '' NOT NULL,
	`result` text DEFAULT '' NOT NULL,
	`feedback` text DEFAULT '' NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`before_key` text,
	`after_key` text,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`activity_id`) REFERENCES `learning_activities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
