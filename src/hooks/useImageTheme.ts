"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const DEFAULT_ACCENT = "#2563eb";

/**
 * Extract dominant color from a loaded image via canvas pixel sampling.
 * Requires crossOrigin="anonymous" on the image element.
 */
export function useImageTheme(imageUrl: string): {
    accentColor: string;
    isLoading: boolean;
} {
    const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT);
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const extractColor = useCallback((url: string) => {
        if (typeof window === "undefined") return;

        setIsLoading(true);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.onload = () => {
            try {
                if (!canvasRef.current) {
                    canvasRef.current = document.createElement("canvas");
                }
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    setIsLoading(false);
                    return;
                }

                // Sample a small area for performance
                const sampleSize = 50;
                canvas.width = sampleSize;
                canvas.height = sampleSize;
                ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

                const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
                const data = imageData.data;

                let totalR = 0;
                let totalG = 0;
                let totalB = 0;
                let count = 0;

                // Sample center region (middle 60%)
                const startX = Math.floor(sampleSize * 0.2);
                const endX = Math.floor(sampleSize * 0.8);
                const startY = Math.floor(sampleSize * 0.2);
                const endY = Math.floor(sampleSize * 0.8);

                for (let y = startY; y < endY; y++) {
                    for (let x = startX; x < endX; x++) {
                        const idx = (y * sampleSize + x) * 4;
                        const r = data[idx];
                        const g = data[idx + 1];
                        const b = data[idx + 2];

                        // Skip very dark and very light pixels
                        const brightness = (r + g + b) / 3;
                        if (brightness > 30 && brightness < 230) {
                            totalR += r;
                            totalG += g;
                            totalB += b;
                            count++;
                        }
                    }
                }

                if (count > 0) {
                    const avgR = Math.round(totalR / count);
                    const avgG = Math.round(totalG / count);
                    const avgB = Math.round(totalB / count);

                    // Boost saturation slightly for a more vibrant accent
                    const max = Math.max(avgR, avgG, avgB);
                    const min = Math.min(avgR, avgG, avgB);
                    const saturation = max > 0 ? (max - min) / max : 0;

                    if (saturation > 0.1) {
                        setAccentColor(`rgb(${avgR}, ${avgG}, ${avgB})`);
                    }
                    // If too desaturated, keep default blue
                }
            } catch {
                // Canvas tainted or other error — keep default
            } finally {
                setIsLoading(false);
            }
        };

        img.onerror = () => {
            setIsLoading(false);
        };
    }, []);

    useEffect(() => {
        if (imageUrl) {
            extractColor(imageUrl);
        }
    }, [imageUrl, extractColor]);

    // Set CSS variable on document root
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.style.setProperty("--cal-accent", accentColor);
        }
    }, [accentColor]);

    return { accentColor, isLoading };
}
