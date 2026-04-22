import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { weeklyPlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { planId: string } }
) {
  try {
    const planId = parseInt(params.planId);

    const result = await db
      .select()
      .from(weeklyPlans)
      .where(eq(weeklyPlans.id, planId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    const plan = result[0];

    return NextResponse.json({
      success: true,
      data: {
        id: plan.id,
        weekStart: plan.weekStart,
        mealPlan: JSON.parse(plan.mealPlan),
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch plan" },
      { status: 500 }
    );
  }
}
