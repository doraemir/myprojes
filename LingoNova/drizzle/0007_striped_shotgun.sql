CREATE INDEX `idx_learning_teacher` ON `learning_activities` (`teacher_email`);--> statement-breakpoint
CREATE INDEX `idx_learning_members_activity` ON `learning_members` (`activity_id`);--> statement-breakpoint
CREATE INDEX `idx_learning_members_student` ON `learning_members` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_learning_responses_activity` ON `learning_responses` (`activity_id`);