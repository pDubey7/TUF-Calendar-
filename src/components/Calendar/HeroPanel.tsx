"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatMonthYear } from "@/lib/dateUtils";
import { useImageTheme } from "@/hooks/useImageTheme";

/** Month-themed Unsplash image URLs */
const MONTH_IMAGES: Record<number, { url: string; alt: string }> = {
    0: {
        url: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1200&h=600&fit=crop",
        alt: "Snow-capped mountains in January",
    },
    1: {
        url: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1200&h=600&fit=crop",
        alt: "Winter forest in February",
    },
    2: {
        url: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1200&h=600&fit=crop",
        alt: "Cherry blossoms in March",
    },
    3: {
        url: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1200&h=600&fit=crop",
        alt: "Spring flowers in April",
    },
    4: {
        url: "https://images.unsplash.com/photo-1495587419418-8bea7e0d5e71?w=1200&h=600&fit=crop",
        alt: "Green meadow in May",
    },
    5: {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop",
        alt: "Summer sunset in June",
    },
    6: {
        url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&h=600&fit=crop",
        alt: "Tropical beach in July",
    },
    7: {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop",
        alt: "Mountain lake in August",
    },
    8: {
        url: "https://images.unsplash.com/photo-1535608577102-bb54e62fe045?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Autumn leaves in September",
    },
    9: {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
        alt: "Mountain peaks in October",
    },
    10: {
        url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=600&fit=crop",
        alt: "Foggy forest in November",
    },
    11: {
        url: "https://images.unsplash.com/photo-1548777123-e216912df7d8?w=1200&h=600&fit=crop",
        alt: "Snowy landscape in December",
    },
};

interface HeroPanelProps {
    month: Date;
    darkMode: boolean;
}

export function HeroPanel({ month, darkMode }: HeroPanelProps) {
    const monthIndex = month.getMonth();
    const imageData = MONTH_IMAGES[monthIndex] ?? MONTH_IMAGES[0];

    // Extract dominant color for accent tinting
    useImageTheme(imageData.url);

    return (
        <div
            className={cn(
                "relative w-full overflow-hidden",
                "h-48 md:h-72 lg:h-80"
            )}
        >
            {/* Hero image */}
            <Image
                src={imageData.url}
                alt={imageData.alt}
                fill
                className="object-cover"
                priority
                crossOrigin="anonymous"
                sizes="(max-width: 768px) 100vw, 900px"
            />

            {/* Dark mode overlay */}
            {darkMode && (
                <div className="absolute inset-0 bg-black/40 z-10" />
            )}

            {/* Blue geometric chevron accent */}
            <svg
                className="absolute bottom-0 left-0 w-full z-20"
                viewBox="0 0 900 120"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    d="M0,120 L0,60 L450,0 L900,60 L900,120 Z"
                    fill="var(--cal-accent)"
                    opacity="0.85"
                />
                <path
                    d="M0,120 L0,80 L450,20 L900,80 L900,120 Z"
                    fill="var(--cal-accent)"
                    opacity="0.6"
                />
            </svg>

            {/* Month/Year text */}
            <div
                className={cn(
                    "absolute bottom-4 left-0 right-0 z-30",
                    "flex flex-col items-center justify-center",
                    "text-white"
                )}
            >
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
                    {formatMonthYear(month)}
                </h1>
            </div>
        </div>
    );
}
