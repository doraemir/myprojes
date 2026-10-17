ALTER TABLE `live_rooms` ADD `invited` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
CREATE INDEX `live_room_lesson_idx` ON `live_rooms` (`lesson_id`,`ended_at`,`heartbeat`);--> statement-breakpoint
CREATE INDEX `live_event_room_idx` ON `live_events` (`room_id`,`id`);--> statement-breakpoint
CREATE INDEX `live_peer_room_idx` ON `live_peers` (`room_id`,`heartbeat`);