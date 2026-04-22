import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          Dinner{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          Plan your weekly dinners with intelligent meal planning
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/plan"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium transition-colors hover:bg-primary/90"
          >
            Start Planning
          </Link>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            Browse Recipes
          </Link>
        </div>
      </div>
    </main>
  );
}
