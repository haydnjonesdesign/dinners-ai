"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecipeCardProps {
  id: number;
  name: string;
  description?: string;
  tags?: string;
  onSelect: (id: number, name: string) => void;
  isPending: boolean;
}

export function RecipeCard({ id, name, description, tags, onSelect, isPending }: RecipeCardProps) {
  const tagArray = tags ? JSON.parse(tags) : [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg">{name}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-2">
        {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
        {tagArray.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tagArray.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                {tag}
              </span>
            ))}
            {tagArray.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                +{tagArray.length - 3} more
              </span>
            )}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onSelect(id, name)}
          disabled={isPending}
        >
          Select
        </Button>
      </CardContent>
    </Card>
  );
}
