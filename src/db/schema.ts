import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Recipes table for storing dinner meal options
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  ingredients: text("ingredients").notNull(), // JSON string
  instructions: text("instructions").notNull(), // JSON string
  prepTime: integer("prep_time"), // minutes
  cookTime: integer("cook_time"), // minutes
  servings: integer("servings"),
  difficulty: text("difficulty"), // easy, medium, hard
  tags: text("tags"), // JSON array
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Weekly meal plan table
export const weeklyPlans = sqliteTable("weekly_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekStart: text("week_start").notNull(), // ISO date string (e.g., "2026-04-20")
  mealPlan: text("meal_plan").notNull(), // JSON: { monday: recipeId, tuesday: recipeId, ... }
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Meal plan items for individual day planning
export const mealPlanItems = sqliteTable("meal_plan_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekPlanId: integer("week_plan_id")
    .notNull()
    .references(() => weeklyPlans.id),
  dayOfWeek: text("day_of_week").notNull(), // "monday", "tuesday", etc.
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});
