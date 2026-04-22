export const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export type DayOfWeek = (typeof daysOfWeek)[number];

export const getDayLabel = (date: Date, dayIndex: number): string => {
  const weekStart = new Date(date);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + dayIndex);
  return weekStart.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const getWeekStart = (date?: Date): Date => {
  const d = date || new Date();
  const weekStart = new Date(d);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};
