import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { weeklyPlans } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekStart, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = body;

    // Validate required fields
    if (!weekStart) {
      return NextResponse.json(
        { success: false, error: "weekStart is required" },
        { status: 400 }
      );
    }

    // Build meal plan object
    const mealPlan: Record<string, number | null> = {};
    if (monday) mealPlan.monday = monday;
    if (tuesday) mealPlan.tuesday = tuesday;
    if (wednesday) mealPlan.wednesday = wednesday;
    if (thursday) mealPlan.thursday = thursday;
    if (friday) mealPlan.friday = friday;
    if (saturday) mealPlan.saturday = saturday;
    if (sunday) mealPlan.sunday = sunday;

    // Check if plan exists
    const existingPlans = await db
      .select()
      .from(weeklyPlans)
      .where(sql`${weeklyPlans.weekStart} = ${weekStart}`);

    if (existingPlans.length > 0) {
      // Update existing plan
      const [existing] = existingPlans;
      await db
        .update(weeklyPlans)
        .set({
          mealPlan: JSON.stringify(mealPlan),
          updatedAt: new Date(),
        })
        .where(eq(weeklyPlans.id, existing.id));

      return NextResponse.json({
        success: true,
        data: {
          id: existing.id,
          weekStart: existing.weekStart,
          mealPlan,
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      // Create new plan
      const result = await db
        .insert(weeklyPlans)
        .values({
          weekStart,
          mealPlan: JSON.stringify(mealPlan),
        })
        .returning();

      return NextResponse.json({
        success: true,
        data: {
          id: result[0].id,
          weekStart,
          mealPlan,
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Error creating meal plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create meal plan" },
      { status: 500 }
    );
  }
}
