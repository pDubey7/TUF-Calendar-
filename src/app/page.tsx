"use client";

import { CalendarRoot } from "@/components/Calendar/CalendarRoot";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-start justify-center py-8 px-4 md:py-12">
      <CalendarRoot />
    </main>
  );
}
