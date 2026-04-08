"use client";

import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/store/calendarStore";
import { formatRangeDisplay } from "@/lib/dateUtils";

export function RangeSummaryBar() {
    const rangeStart = useCalendarStore((s) => s.rangeStart);
    const rangeEnd = useCalendarStore((s) => s.rangeEnd);
    const clearRange = useCalendarStore((s) => s.clearRange);

    if (!rangeStart) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center px-4 py-2.5",
                    "text-sm text-gray-400 dark:text-gray-500"
                )}
            >
                Click a day to start selecting a range
            </div>
        );
    }

    if (!rangeEnd) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center px-4 py-2.5",
                    "text-sm text-cal-blue dark:text-cal-blue-light font-medium"
                )}
            >
                Now click another day to complete the range
            </div>
        );
    }

    const { label } = formatRangeDisplay(rangeStart, rangeEnd);

    return (
        <div
            className={cn(
                "flex items-center justify-between px-4 py-2.5",
                "bg-cal-blue/5 dark:bg-cal-blue/10",
                "border-t border-gray-100 dark:border-gray-700"
            )}
            role="status"
            aria-live="polite"
        >
            <span className="text-sm font-medium text-cal-blue dark:text-cal-blue-light">
                {label}
            </span>
            <button
                onClick={clearRange}
                className={cn(
                    "text-xs font-medium px-2 py-1 rounded",
                    "text-gray-500 dark:text-gray-400",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "transition-colors"
                )}
                aria-label="Clear selection"
            >
                Clear
            </button>
        </div>
    );
}
