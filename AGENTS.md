# AGENTS.md - Dinner AI Project

## Project Overview

**Dinner AI** is an AI-powered dinner planning application that helps users plan their weekly meals. The application allows users to:

- Browse a database of recipes and meals
- Select meals for each day of the week
- Plan dinner menus for the upcoming week
- Manage their meal schedules with an intuitive interface

## Tech Stack

- **Framework:** Next.js (App Router)
- **ORM:** Drizzle ORM
- **Database:** SQLite (local development, easy migration path)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Language:** TypeScript

## Directory Structure

```
dinners-ai/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── (routes)/         # Route groups
│   ├── components/           # React components
│   ├── lib/                  # Utilities and configurations
│   ├── db/                   # Database schema and Drizzle setup
│   └── types/                # TypeScript type definitions
├── scripts/                  # Migration and seed scripts
├── tests/                    # Test files
├── drizzle.config.ts         # Drizzle ORM configuration
└── package.json
```

## Setup & Installation

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm
- SQLite3

### Install Dependencies

```bash
pnpm install
```

### Environment Setup

```bash
# Initialize Next.js with TypeScript, Tailwind, ESLint, and App Router
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack

y (answer yes to prompts)
```

Create a `.env.local` file:

```env
DATABASE_URL="./dev.sqlite"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate Drizzle schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database with sample recipes (optional)
pnpm db:seed
```

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm typecheck

# Run linter
pnpm lint

# Run tests
pnpm test

# Generate Drizzle schema
pnpm db:generate

# Run Drizzle migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Studio (Drizzle ORM GUI for database exploration)
pnpm db:studio
```

## Coding Standards

### TypeScript

- Strict mode enabled (`"strict": true` in tsconfig)
- No `any` types unless explicitly documented
- Use interfaces for public APIs, types for internal constructs
- Define types for all function parameters and return values
- Use utility types (`Partial`, `Pick`, `Omit`) where appropriate

### File & Folder Naming

- Components: PascalCase (`UserProfile.tsx`, `MealCard.tsx`)
- Pages: Lowercase with hyphens (`dinner-plan.tsx`, `recipe-details.tsx`)
- Utilities: Lowercase with descriptive names (`formatDate.ts`, `mealCalculator.ts`)
- Types: PascalCase with descriptive prefix (`User.ts`, `Recipe.ts`)

### Component Structure

```tsx
// File: components/MealCard.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Recipe } from "@/types";

interface MealCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
  isSelected?: boolean;
}

export function MealCard({ recipe, onSelect, isSelected }: MealCardProps) {
  // Implementation
}
```

### Props & State

- Use `interface` for component props
- Prefer functional components with hooks
- Use `React.FC` only when necessary
- Avoid prop drilling; use context for deep state

### Async/Await

- Always use proper error handling with `try/catch`
- Avoid `async/await` in event handlers; use inline async/await patterns
- Document error states in UI

### Drizzle ORM

- Define schema in separate modules (`src/db/schema.ts`)
- Use `db.insert()`, `db.select()`, `db.update()`, `db.delete()` methods
- Type-safe queries using Drizzle's typed API
- Index relationships with foreign keys

### Tailwind & shadcn/ui

- Use Tailwind utility classes consistently
- Avoid inline styles; use Tailwind for all styling
- shadcn/ui components should be imported directly from `components/ui`
- Customize theme in `globals.css`

### Testing

- Unit tests: Vitest + React Testing Library
- E2E tests: Playwright
- Test file naming: `*.test.tsx` or `*.spec.tsx`
- Mock dependencies; isolate business logic

### Git & Commits

- Use conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
- Write clear, descriptive commit messages
- Small, focused commits over large monolithic ones
- Push regularly to main branch; avoid feature branches unless collaborating

## Database Schema Example

```ts
// src/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ingredients: text("ingredients").notNull(), // JSON string
  instructions: text("instructions").notNull(), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const weeklyPlan = sqliteTable("weekly_plan", {
  id: integer("id").primaryKey(),
  weekStart: text("week_start").notNull(),
  mealPlan: text("meal_plan").notNull(), // JSON: { day: recipeId }
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
```

## Best Practices

1. **DRY principle:** Avoid code duplication; extract reusable logic
2. **Separation of concerns:** Split UI, logic, and data layers clearly
3. **Accessibility:** Use semantic HTML, ARIA labels, and keyboard navigation
4. **Performance:** Use Next.js built-in optimizations (`next/image`, code splitting)
5. **Security:** Sanitize inputs, validate user data, use HTTPS in production
6. **Documentation:** Document complex logic; inline comments only where necessary

## Contributing

1. Fork the repository
2. Create a feature branch (`feature/your-feature-name`)
3. Make your changes
4. Write tests if applicable
5. Ensure lint, typecheck, and tests pass
6. Push and open a pull request

---

> "Good code is its own best documentation." — Steve McConnell
