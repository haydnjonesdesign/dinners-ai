"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DayStatusBadge } from "@/components/DayStatusBadge";
import { DayOfWeek, getDayLabel } from "@/lib/mealUtils";

interface DayCellProps {
  dayIndex: number;
  currentDate: Date;
  recipeId: number | null;
  recipeTitle: string | null;
  onAddRecipe: (dayIndex: number, recipeId: number, recipeTitle: string) => void;
  isPending: boolean;
}

const daysLabel = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function DayCell({
  dayIndex,
  currentDate,
  recipeId,
  recipeTitle,
  onAddRecipe,
  isPending,
}: DayCellProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
    // Trigger modal in parent - for now we'll use a placeholder
    onAddRecipe(dayIndex, 0, "");
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{daysLabel[dayIndex]}</h3>
            <p className="text-sm text-muted-foreground">
              {getDayLabel(currentDate, dayIndex)}
            </p>
          </div>
          <DayStatusBadge hasRecipe={!!recipeId} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-2">
        {recipeId && recipeTitle ? (
          <div className="flex-1">
            <p className="font-medium">{recipeTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">Recipe assigned</p>
          </div>
        ) : (
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">No meal selected</p>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full"
          onClick={handleAddClick}
          disabled={isPending}
        >
          {recipeId ? "Change" : "Add"}
        </Button>
      </CardContent>
    </Card>
  );
}
