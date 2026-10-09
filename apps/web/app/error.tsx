"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error:", error.message);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-xl place-items-center px-5 text-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Something went wrong</p>
        <h1 className="mt-3 font-display text-5xl">We could not prepare this page</h1>
        <p className="mt-4 leading-relaxed text-muted">Your saved questionnaire draft is still in this browser session.</p>
        <button type="button" onClick={reset} className="mt-7 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white">Try again</button>
      </div>
    </div>
  );
}

