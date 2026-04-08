"use client";

import { cn } from "@/lib/utils";
import { DayCell } from "./DayCell";
import { getMonthGrid } from "@/lib/dateUtils";
import { useRangeSelection } from "@/hooks/useRangeSelection";
import { useHolidays } from "@/hooks/useHolidays";
import { useCalendarStore } from "@/store/calendarStore";
import { useMemo } from "react";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
    month: Date;
}

export function CalendarGrid({ month }: CalendarGridProps) {
    const { rangeStart, rangeEnd, handleDaySelect, getTooltipText } =
        useRangeSelection();
    const { getHoliday } = useHolidays(month.getMonth());
    const focusedDay = useCalendarStore((s) => s.focusedDay);
    const setFocusedDay = useCalendarStore((s) => s.setFocusedDay);

    const days = useMemo(() => getMonthGrid(month), [month]);

    return (
        <div className="px-2 pb-4 md:px-4">
            {/* Column headers */}
            <div
                className="grid grid-cols-7 gap-0.5 mb-1"
                role="row"
                aria-label="Days of the week"
            >
                {WEEKDAY_HEADERS.map((header, idx) => (
                    <div
                        key={header}
                        className={cn(
                            "flex items-center justify-center",
                            "h-8 text-xs font-semibold uppercase tracking-wider",
                            idx === 6
                                ? "text-cal-coral"
                                : "text-gray-500 dark:text-gray-400"
                        )}
                        role="columnheader"
                    >
                        {header}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div
                className="grid grid-cols-7 gap-0.5"
                role="grid"
                aria-label="Calendar days"
            >
                {days.map((day, idx) => {
                    const holiday = day.isCurrentMonth
                        ? getHoliday(day.dayOfMonth)
                        : null;
                    const isFocused =
                        focusedDay !== null &&
                        day.date.getTime() === focusedDay.getTime();

                    return (
                        <DayCell
                            key={idx}
                            day={day}
                            rangeStart={rangeStart}
                            rangeEnd={rangeEnd}
                            tooltipText={getTooltipText(day.date)}
                            holidayName={holiday}
                            isFocused={isFocused}
                            onSelect={handleDaySelect}
                            onFocus={setFocusedDay}
                        />
                    );
                })}
            </div>
        </div>
    );
}
