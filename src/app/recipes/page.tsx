export default function RecipesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Browse Recipes</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover new dinner ideas for your weekly meal plan
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-lg border bg-card p-4 shadow transition-shadow hover:shadow-md"
            >
              <div className="aspect-video w-full rounded-md bg-muted" />
              <h3 className="mt-4 font-semibold">Sample Recipe {i}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A delicious dinner option for your weekly meal plan
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
