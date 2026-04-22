CREATE TABLE `meal_plan_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week_plan_id` integer NOT NULL,
	`day_of_week` text NOT NULL,
	`recipe_id` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`week_plan_id`) REFERENCES `weekly_plans`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`ingredients` text NOT NULL,
	`instructions` text NOT NULL,
	`prep_time` integer,
	`cook_time` integer,
	`servings` integer,
	`difficulty` text,
	`tags` text,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weekly_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week_start` text NOT NULL,
	`meal_plan` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
