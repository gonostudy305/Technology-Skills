"use client";

import { useEffect, useState } from "react";

export default function SimulationControls() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        const container = document.getElementById("article-content-container");
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen().catch((err) => {
                console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="flex justify-end p-2 border-b border-zinc-100 bg-zinc-50 rounded-t-2xl">
            <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                aria-label="Toàn màn hình simulation"
            >
                <i className={`fa-solid ${isFullscreen ? "fa-compress" : "fa-expand"}`}></i>
                {isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            </button>
        </div>
    );
}
