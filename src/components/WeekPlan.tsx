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
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setCurrentPlan(data.data[0]);
      } else {
        setCurrentPlan(null);
      }
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
    if (!selectedDay || !weekStart) return;

    setSaving(true);
    try {
      // Update the recipe in local state
      setPlanRecipes((prev) => ({
        ...prev,
        [selectedDay]: recipeTitle,
      }));

      // Fetch current plan or create new one
      const weekStartStr = formatDate(weekStart);
      let planId: number;
      
      if (currentPlan) {
        planId = currentPlan.id;
      } else {
        // Create new plan
        const newPlanRes = await fetch("/api/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            weekStart: weekStartStr,
            [getDayName(selectedDay)]: recipeId 
          }),
        });
        const newPlanData = await newPlanRes.json();
        if (newPlanData.success) {
          setCurrentPlan(newPlanData.data);
          planId = newPlanData.data.id;
        }
      }

      if (planId) {
        // Update existing plan with new meal
        await updatePlanDay(planId, selectedDay, recipeId, recipeTitle);
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    } finally {
      setSaving(false);
    }
  };

  const updatePlanDay = async (planId: number, dayIndex: number, recipeId: number, recipeTitle: string) => {
    const dayName = getDayName(dayIndex);
    
    // Get current plan to preserve other days
    try {
      const currentPlanRes = await fetch(`/api/plans/${planId}`);
      const currentPlanData = await currentPlanRes.json();
      
      const updatedPlan = {
        ...currentPlanData.data.mealPlan,
        [dayName]: recipeId,
      };
      
      await fetch(`/api/plans/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlan),
      });
    } catch (error) {
      console.error("Error updating plan day:", error);
    }
  };

  const getDayName = (index: number): string => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    return days[index];
  };

  const dayRecipes = [
    currentPlan?.mealPlan?.monday
      ? (planRecipes[0] || "Recipe assigned")
      : null,
    currentPlan?.mealPlan?.tuesday
      ? (planRecipes[1] || "Recipe assigned")
      : null,
    currentPlan?.mealPlan?.wednesday
      ? (planRecipes[2] || "Recipe assigned")
      : null,
    currentPlan?.mealPlan?.thursday
      ? (planRecipes[3] || "Recipe assigned")
      : null,
    currentPlan?.mealPlan?.friday
      ? (planRecipes[4] || "Recipe assigned")
      : null,
    currentPlan?.mealPlan?.saturday
      ? (planRecipes[5] || "Recipe assigned")
      : null,
    currentPlan?.mealPlan?.sunday
      ? (planRecipes[6] || "Recipe assigned")
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
