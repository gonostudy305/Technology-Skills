"use client";

import { useEffect, useState } from "react";

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = Math.max(1, documentHeight - viewportHeight);
      const next = (scrollTop / scrollableHeight) * 100;
      setProgress(clampPercentage(next));
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="sticky top-16 z-40 h-[2px] w-full bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-[var(--color-accent)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
