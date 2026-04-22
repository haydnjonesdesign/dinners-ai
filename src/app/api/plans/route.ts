import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { weeklyPlans } from "@/db/schema";
import { eq, and, ilike } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const weekStart = body.weekStart;
    const mealPlan = body;

    if (!weekStart) {
      return NextResponse.json(
        { success: false, error: "weekStart is required" },
        { status: 400 }
      );
    }

    const existingPlans = await db
      .select()
      .from(weeklyPlans)
      .where(eq(weeklyPlans.weekStart, weekStart));

    if (existingPlans.length === 0) {
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

    return NextResponse.json(
      { success: false, error: "No plan found with this weekStart" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const weekStart = searchParams.get("weekStart");

    let query = db.select().from(weeklyPlans);

    if (weekStart) {
      query = db
        .select()
        .from(weeklyPlans)
        .where(eq(weeklyPlans.weekStart, weekStart));
    }

    const result = await query;

    if (result.length === 0 && weekStart) {
      return NextResponse.json(
        { success: true, data: null, message: "No plan found for this week" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.map((plan) => ({
        id: plan.id,
        weekStart: plan.weekStart,
        mealPlan: JSON.parse(plan.mealPlan),
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekStart, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = body;

    if (!weekStart) {
      return NextResponse.json(
        { success: false, error: "weekStart is required" },
        { status: 400 }
      );
    }

    const mealPlan: Record<string, number | null> = {};
    if (monday) mealPlan.monday = monday;
    if (tuesday) mealPlan.tuesday = tuesday;
    if (wednesday) mealPlan.wednesday = wednesday;
    if (thursday) mealPlan.thursday = thursday;
    if (friday) mealPlan.friday = friday;
    if (saturday) mealPlan.saturday = saturday;
    if (sunday) mealPlan.sunday = sunday;

    const existingPlans = await db
      .select()
      .from(weeklyPlans)
      .where(eq(weeklyPlans.weekStart, weekStart));

    if (existingPlans.length > 0) {
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
    console.error("Error creating/updating meal plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create/update meal plan" },
      { status: 500 }
    );
  }
}
