CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`service_slug` text NOT NULL,
	`service_name` text NOT NULL,
	`customer_name` text NOT NULL,
	`whatsapp` text NOT NULL,
	`email` text,
	`notes` text,
	`appointment_date` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `appointment_slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`appointment_id` text NOT NULL,
	`slot_key` text NOT NULL,
	FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `appointment_slots_slot_key_unique` ON `appointment_slots` (`slot_key`);
--> statement-breakpoint
CREATE TABLE `service_overrides` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`short` text NOT NULL,
	`description` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`price_label` text NOT NULL,
	`category` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `schedule_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`start_at` text NOT NULL,
	`end_at` text NOT NULL,
	`reason` text,
	`created_at` text NOT NULL
);
