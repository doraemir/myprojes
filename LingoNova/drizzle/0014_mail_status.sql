ALTER TABLE lessons ADD COLUMN reminder_mail_status TEXT NOT NULL DEFAULT 'pending';
--> statement-breakpoint
CREATE TABLE student_words (id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES students(id), teacher_email TEXT NOT NULL, word TEXT NOT NULL, meaning TEXT NOT NULL, learned_at TEXT NOT NULL, UNIQUE(student_id,teacher_email,word));
