ALTER TABLE `lessons` ADD `student_uid` text;--> statement-breakpoint
ALTER TABLE `payments` ADD `reversal_of` text;--> statement-breakpoint
CREATE UNIQUE INDEX `payments_reversal_of_unique` ON `payments` (`reversal_of`);--> statement-breakpoint
ALTER TABLE `students` ADD `account_uid` text;--> statement-breakpoint
CREATE UNIQUE INDEX `students_account_uid_unique` ON `students` (`account_uid`);