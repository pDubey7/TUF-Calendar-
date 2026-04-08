"use client";

import { useMemo } from "react";
import { getHolidayForDate, getHolidaysForMonth } from "@/lib/holidays";

export function useHolidays(month: number) {
    const holidaysInMonth = useMemo(
        () => getHolidaysForMonth(month),
        [month]
    );

    const getHoliday = (day: number): string | null => {
        return getHolidayForDate(month, day);
    };

    return { holidaysInMonth, getHoliday };
}
