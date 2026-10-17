CREATE TABLE `live_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` text NOT NULL,
	`sender` text NOT NULL,
	`recipient` text DEFAULT '' NOT NULL,
	`kind` text NOT NULL,
	`payload` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `live_rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `live_peers` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`uid` text NOT NULL,
	`name` text NOT NULL,
	`approved` integer DEFAULT 0 NOT NULL,
	`heartbeat` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `live_rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `live_rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`host_uid` text NOT NULL,
	`started_at` integer NOT NULL,
	`heartbeat` integer NOT NULL,
	`ended_at` integer,
	FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON UPDATE no action ON DELETE cascade
);
