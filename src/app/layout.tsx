import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dinner AI - Weekly Meal Planner",
  description: "Plan your weekly dinners with AI-powered meal suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
