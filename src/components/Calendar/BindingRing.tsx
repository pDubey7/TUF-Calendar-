"use client";

import { cn } from "@/lib/utils";

export function BindingRing() {
    const rings = Array.from({ length: 13 }, (_, i) => i);

    return (
        <div
            className={cn(
                "relative flex items-end justify-center gap-6 px-8 py-0",
                "h-10 overflow-hidden"
            )}
            aria-hidden="true"
        >
            {rings.map((i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="binding-wire" />
                    <div
                        className={cn(
                            "binding-hole",
                            "relative -mt-2.5 z-10"
                        )}
                    />
                </div>
            ))}
        </div>
    );
}
