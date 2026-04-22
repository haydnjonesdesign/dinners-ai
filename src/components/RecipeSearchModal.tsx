"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/types";

interface RecipeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipeId: number, recipeTitle: string) => void;
}

interface SearchRecipe extends Recipe {
  name: string;
  description?: string;
  tags?: string;
}

export function RecipeSearchModal({ isOpen, onClose, onSelect }: RecipeSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<SearchRecipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRecipes(searchQuery);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        fetchRecipes(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const fetchRecipes = async (query: string) => {
    setIsSearching(true);
    try {
      const url = query ? `/api/recipes?q=${encodeURIComponent(query)}&limit=10` : "/api/recipes?limit=10";
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setRecipes(data.data);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectRecipe = async (recipeId: number, recipeTitle: string) => {
    setIsSelecting(true);
    try {
      await onSelect(recipeId, recipeTitle);
      onClose();
    } catch (error) {
      console.error("Error selecting recipe:", error);
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select a Recipe</DialogTitle>
          <DialogDescription>
            Search for a recipe and select it to add to your meal plan.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <Input
            placeholder="Search recipes by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="grid gap-4 max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <p className="text-muted-foreground text-center py-4">Searching...</p>
          ) : recipes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recipes found. Try a different search term.
            </p>
          ) : (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                name={recipe.name}
                description={recipe.description}
                tags={recipe.tags}
                onSelect={handleSelectRecipe}
                isPending={isSelecting}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
