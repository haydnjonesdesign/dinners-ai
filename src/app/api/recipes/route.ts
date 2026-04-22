import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = db.select().from(recipes).limit(limit);

    if (searchQuery) {
      query = db
        .select()
        .from(recipes)
        .where(ilike(recipes.name, `%${searchQuery}%`))
        .limit(limit);
    }

    const result = await query;

    return NextResponse.json({
      success: true,
      data: result,
      count: result.length,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
