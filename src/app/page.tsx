"use client";

import { Suspense } from "react";
import Header from "@/components/header";
import Gallery from "@/components/gallery";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen p-12 bg-white dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <Header />
        <Suspense fallback={<GallerySkeleton />}>
          <Gallery />
        </Suspense>
      </div>
    </main>
  );
}