"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface HolidayDotProps {
    holidayName: string;
}

export function HolidayDot({ holidayName }: HolidayDotProps) {
    return (
        <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <span
                        className={cn(
                            "absolute bottom-0.5 left-1/2 -translate-x-1/2",
                            "h-1.5 w-1.5 rounded-full",
                            "bg-amber-500 dark:bg-amber-400",
                            "animate-dot-pulse cursor-pointer"
                        )}
                        aria-label={`Holiday: ${holidayName}`}
                    />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={cn(
                            "rounded-md px-3 py-1.5 text-xs font-medium",
                            "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
                            "shadow-lg",
                            "animate-in fade-in-0 zoom-in-95",
                            "z-50"
                        )}
                        sideOffset={5}
                    >
                        {holidayName}
                        <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-100" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
