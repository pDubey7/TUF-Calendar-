"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/store/calendarStore";
import {
    formatMonthYear,
    getNextMonth,
    getPrevMonth,
    getMonthGrid,
    formatMonthShort,
} from "@/lib/dateUtils";
import { useMemo } from "react";

const MINI_HEADERS = ["M", "T", "W", "T", "F", "S", "S"];

interface MiniMonthGridProps {
    month: Date;
}

function MiniMonthGrid({ month }: MiniMonthGridProps) {
    const days = useMemo(() => getMonthGrid(month), [month]);

    return (
        <div className="p-3">
            <p className="text-xs font-semibold text-center mb-2 text-gray-700 dark:text-gray-200">
                {formatMonthShort(month)}
            </p>
            <div className="grid grid-cols-7 gap-px">
                {MINI_HEADERS.map((h, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-5 h-4 flex items-center justify-center",
                            "text-[10px] font-medium",
                            i === 6 ? "text-cal-coral" : "text-gray-400"
                        )}
                    >
                        {h}
                    </div>
                ))}
                {days.map((day, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "w-5 h-5 flex items-center justify-center",
                            "text-[10px] rounded",
                            !day.isCurrentMonth && "text-gray-300 dark:text-gray-600",
                            day.isCurrentMonth && "text-gray-600 dark:text-gray-300",
                            day.isToday && "bg-cal-blue text-white font-bold rounded-full"
                        )}
                    >
                        {day.dayOfMonth}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function MonthNav() {
    const currentMonth = useCalendarStore((s) => s.currentMonth);
    const goNext = useCalendarStore((s) => s.goNext);
    const goPrev = useCalendarStore((s) => s.goPrev);
    const goToday = useCalendarStore((s) => s.goToday);

    const prevMonth = useMemo(
        () => getPrevMonth(currentMonth),
        [currentMonth]
    );
    const nextMonth = useMemo(
        () => getNextMonth(currentMonth),
        [currentMonth]
    );

    return (
        <div
            className={cn(
                "flex items-center justify-between px-4 py-3",
                "border-b border-gray-100 dark:border-gray-700"
            )}
        >
            {/* Prev arrow with mini month popover */}
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button
                        onClick={goPrev}
                        className={cn(
                            "flex items-center justify-center",
                            "h-9 w-9 rounded-full",
                            "text-gray-600 dark:text-gray-300",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "transition-colors"
                        )}
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content
                        className={cn(
                            "rounded-xl shadow-xl border",
                            "bg-white dark:bg-gray-800",
                            "border-gray-200 dark:border-gray-600",
                            "z-50"
                        )}
                        side="bottom"
                        align="start"
                        sideOffset={8}
                    >
                        <MiniMonthGrid month={prevMonth} />
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            {/* Month/Year display + Today button */}
            <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                    {formatMonthYear(currentMonth)}
                </h2>
                <button
                    onClick={goToday}
                    className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-full",
                        "text-xs font-medium",
                        "bg-cal-blue/10 text-cal-blue",
                        "dark:bg-cal-blue/20 dark:text-cal-blue-light",
                        "hover:bg-cal-blue/20 dark:hover:bg-cal-blue/30",
                        "transition-colors"
                    )}
                    aria-label="Go to today"
                >
                    <CalendarDays className="h-3.5 w-3.5" />
                    Today
                </button>
            </div>

            {/* Next arrow with mini month popover */}
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button
                        onClick={goNext}
                        className={cn(
                            "flex items-center justify-center",
                            "h-9 w-9 rounded-full",
                            "text-gray-600 dark:text-gray-300",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "transition-colors"
                        )}
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content
                        className={cn(
                            "rounded-xl shadow-xl border",
                            "bg-white dark:bg-gray-800",
                            "border-gray-200 dark:border-gray-600",
                            "z-50"
                        )}
                        side="bottom"
                        align="end"
                        sideOffset={8}
                    >
                        <MiniMonthGrid month={nextMonth} />
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
}
