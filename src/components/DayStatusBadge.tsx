export interface DayStatusBadgeProps {
  hasRecipe: boolean;
}

export function DayStatusBadge({ hasRecipe }: DayStatusBadgeProps) {
  if (hasRecipe) {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        ✓ Selected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
      Empty
    </span>
  );
}
