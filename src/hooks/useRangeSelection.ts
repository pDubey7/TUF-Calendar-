"use client";

import { useCallback } from "react";
import { useCalendarStore } from "@/store/calendarStore";

export function useRangeSelection() {
    const rangeStart = useCalendarStore((s) => s.rangeStart);
    const rangeEnd = useCalendarStore((s) => s.rangeEnd);
    const clickCount = useCalendarStore((s) => s.clickCount);
    const selectDay = useCalendarStore((s) => s.selectDay);
    const clearRange = useCalendarStore((s) => s.clearRange);

    const handleDaySelect = useCallback(
        (date: Date) => {
            selectDay(date);
        },
        [selectDay]
    );

    const getTooltipText = useCallback(
        (date: Date): string => {
            if (clickCount === 0) {
                return "Select as start";
            }
            if (clickCount === 1) {
                if (rangeStart && date.getTime() === rangeStart.getTime()) {
                    return "Start date";
                }
                return "Select as end";
            }
            // clickCount === 2
            if (rangeStart && date.getTime() === rangeStart.getTime()) {
                return "Start date";
            }
            if (rangeEnd && date.getTime() === rangeEnd.getTime()) {
                return "End date";
            }
            if (rangeStart && rangeEnd) {
                if (date >= rangeStart && date <= rangeEnd) {
                    return "In range";
                }
            }
            return "Click to start new selection";
        },
        [clickCount, rangeStart, rangeEnd]
    );

    return {
        rangeStart,
        rangeEnd,
        clickCount,
        handleDaySelect,
        clearRange,
        getTooltipText,
    };
}
