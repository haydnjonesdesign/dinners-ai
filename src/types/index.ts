import type { InferSelectModel } from "drizzle-orm";
import type { recipes, weeklyPlans, mealPlanItems } from "@/db/schema";

// Type exports from schema
export type Recipe = InferSelectModel<typeof recipes>;
export type WeeklyPlan = InferSelectModel<typeof weeklyPlans>;
export type MealPlanItem = InferSelectModel<typeof mealPlanItems>;

// Day of week types
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// Week plan structure
export interface WeeklyPlanInput {
  weekStart: string;
  monday?: number;
  tuesday?: number;
  wednesday?: number;
  thursday?: number;
  friday?: number;
  saturday?: number;
  sunday?: number;
}
