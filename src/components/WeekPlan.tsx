"use client";

import { useState, useEffect } from "react";
import { WeekPlan, Recipe } from "@/types";
import { DayCell } from "@/components/DayCell";
import { RecipeSearchModal } from "@/components/RecipeSearchModal";
import { getWeekStart, formatDate } from "@/lib/mealUtils";

interface WeekPlanState {
  weekStart: Date;
  plans: WeekPlan[];
  currentPlanId: number | null;
  loading: boolean;
  saving: boolean;
}

export function WeekPlan() {
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart());
  const [currentPlan, setCurrentPlan] = useState<WeekPlan | null>(null);
  const [planRecipes, setPlanRecipes] = useState<Record<number, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current week's plan
  useEffect(() => {
    fetchCurrentWeekPlan();
  }, [weekStart]);

  const fetchCurrentWeekPlan = async () => {
    setLoading(true);
    try {
      const weekStartStr = formatDate(weekStart);
      const response = await fetch(`/api/plans?weekStart=${weekStartStr}`);
      // Note: We'll need to implement this endpoint or use a different approach
      // For now, let's create a placeholder
      console.log(`Fetching plan for week starting ${weekStartStr}`);
    } catch (error) {
      console.error("Error fetching week plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipe = (dayIndex: number, recipeId: number, _recipeTitle: string) => {
    setSelectedDay(dayIndex);
    setIsModalOpen(true);
  };

  const handleSelectRecipe = async (recipeId: number, recipeTitle: string) => {
    if (!selectedDay || !currentPlan) return;

    setSaving(true);
    try {
      // Update the recipe in local state
      setPlanRecipes((prev) => ({
        ...prev,
        [selectedDay]: recipeTitle,
      }));

      // Save to API - we need to implement this properly
      await updatePlanDay(selectedDay, recipeId);
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  const updatePlanDay = async (dayIndex: number, recipeId: number) => {
    // For now, we'll just log - need to implement proper API call
    console.log(`Updating day ${dayIndex} with recipe ${recipeId}`);
  };

  const dayRecipes = [
    currentPlan?.mealPlan?.monday
      ? planRecipes[0] || "Recipe assigned"
      : null,
    currentPlan?.mealPlan?.tuesday
      ? planRecipes[1] || "Recipe assigned"
      : null,
    currentPlan?.mealPlan?.wednesday
      ? planRecipes[2] || "Recipe assigned"
      : null,
    currentPlan?.mealPlan?.thursday
      ? planRecipes[3] || "Recipe assigned"
      : null,
    currentPlan?.mealPlan?.friday
      ? planRecipes[4] || "Recipe assigned"
      : null,
    currentPlan?.mealPlan?.saturday
      ? planRecipes[5] || "Recipe assigned"
      : null,
    currentPlan?.mealPlan?.sunday
      ? planRecipes[6] || "Recipe assigned"
      : null,
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Weekly Meal Planner</h1>
        <p className="mt-2 text-muted-foreground">
          Select meals for this week: {weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
        <button
          onClick={() => setWeekStart(getWeekStart())}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Start from today
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <DayCell
            key={dayIndex}
            dayIndex={dayIndex}
            currentDate={weekStart}
            recipeId={null}
            recipeTitle={dayRecipes[dayIndex]}
            onAddRecipe={handleAddRecipe}
            isPending={saving}
          />
        ))}
      </div>

      <RecipeSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectRecipe}
      />
    </div>
  );
}
