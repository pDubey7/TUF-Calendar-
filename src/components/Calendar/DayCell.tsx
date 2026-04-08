"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { HolidayDot } from "./HolidayDot";
import type { MonthGridDay } from "@/lib/dateUtils";
import { isDateInRange, isRangeStart, isRangeEnd, format } from "@/lib/dateUtils";
import { StickyNote as StickyNoteIcon, Plus } from "lucide-react";
import { useCalendarStore } from "@/store/calendarStore";

interface DayCellProps {
    day: MonthGridDay;
    rangeStart: Date | null;
    rangeEnd: Date | null;
    tooltipText: string;
    holidayName: string | null;
    isFocused: boolean;
    onSelect: (date: Date) => void;
    onFocus: (date: Date) => void;
}

export function DayCell({
    day,
    rangeStart,
    rangeEnd,
    tooltipText,
    holidayName,
    isFocused,
    onSelect,
    onFocus,
}: DayCellProps) {
    const addFloatingNote = useCalendarStore((s) => s.addFloatingNote);
    const isStart = isRangeStart(day.date, rangeStart);
    const isEnd = isRangeEnd(day.date, rangeEnd);
    const inRange = isDateInRange(day.date, rangeStart, rangeEnd);
    const isEndpoint = isStart || isEnd;

    const handleAddNote = () => {
        const dateKey = format(day.date, "yyyy-MM-dd");
        // Start the note at a random position near the click or center
        const x = Math.random() * 200 + 50;
        const y = Math.random() * 200 + 50;
        addFloatingNote(dateKey, x, y);
    };

    return (
        <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root>
                <Popover.Root>
                    <Tooltip.Trigger asChild>
                        <Popover.Trigger asChild>
                            <div
                                role="gridcell"
                                tabIndex={day.isCurrentMonth ? 0 : -1}
                                aria-label={`${day.date.toDateString()}${holidayName ? `, ${holidayName}` : ""}${isStart ? ", range start" : ""}${isEnd ? ", range end" : ""}${inRange && !isEndpoint ? ", in selected range" : ""}`}
                                aria-selected={isEndpoint || inRange}
                                className={cn(
                                    "group relative flex items-center justify-center",
                                    "h-10 w-full min-w-[2.75rem] cursor-pointer select-none",
                                    "rounded-lg text-sm font-medium",
                                    "transition-all duration-150 ease-out",
                                    // Base states
                                    !day.isCurrentMonth && "text-gray-300 dark:text-gray-600",
                                    day.isCurrentMonth && "text-gray-700 dark:text-gray-200",
                                    day.isSunday && day.isCurrentMonth && "text-cal-coral",
                                    day.isWeekend && day.isCurrentMonth && !day.isSunday && "text-red-300 dark:text-red-400/60",
                                    // Today
                                    day.isToday && !isEndpoint && [
                                        "bg-cal-blue text-white font-bold",
                                        "shadow-md shadow-cal-blue/30",
                                    ],
                                    // Range endpoints
                                    isEndpoint && [
                                        "bg-cal-blue text-white font-bold",
                                        "shadow-md shadow-cal-blue/30",
                                        "z-10",
                                    ],
                                    // In range (between start and end)
                                    inRange && !isEndpoint && [
                                        "bg-cal-blue-light/30 dark:bg-cal-blue/20",
                                    ],
                                    // Range connector shape
                                    inRange && !isEndpoint && "rounded-none",
                                    isStart && rangeEnd && "rounded-l-lg rounded-r-none",
                                    isEnd && rangeStart && "rounded-r-lg rounded-l-none",
                                    isStart && !rangeEnd && "rounded-lg",
                                    // Hover
                                    day.isCurrentMonth && !isEndpoint && !day.isToday && [
                                        "hover:scale-105 hover:border hover:border-cal-blue/30",
                                        "hover:bg-gray-50 dark:hover:bg-gray-700/50",
                                    ],
                                    // Focus ring
                                    isFocused && "day-focus-ring"
                                )}
                                onPointerDown={() => {
                                    if (day.isCurrentMonth) {
                                        onSelect(day.date);
                                    }
                                }}
                                onFocus={() => onFocus(day.date)}
                            >
                                <span className="relative z-10">{day.dayOfMonth}</span>

                                {/* Hover indicator for sticky note */}
                                {day.isCurrentMonth && (
                                    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-cal-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}

                                {holidayName && day.isCurrentMonth && (
                                    <HolidayDot holidayName={holidayName} />
                                )}
                            </div>
                        </Popover.Trigger>
                    </Tooltip.Trigger>

                    {day.isCurrentMonth && (
                        <Popover.Portal>
                            <Popover.Content
                                className={cn(
                                    "rounded-lg p-2 bg-white dark:bg-gray-800",
                                    "shadow-xl border border-gray-200 dark:border-gray-700",
                                    "z-50 animate-in fade-in zoom-in-95 duration-200"
                                )}
                                side="top"
                                sideOffset={5}
                            >
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={handleAddNote}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-md",
                                            "text-xs font-semibold whitespace-nowrap",
                                            "bg-cal-blue text-white hover:bg-cal-blue/90 transition-colors"
                                        )}
                                    >
                                        <StickyNoteIcon className="h-3 w-3" />
                                        Add Sticky Note
                                    </button>
                                </div>
                                <Popover.Arrow className="fill-white dark:fill-gray-800" />
                            </Popover.Content>
                        </Popover.Portal>
                    )}
                </Popover.Root>

                {day.isCurrentMonth && (
                    <Tooltip.Portal>
                        <Tooltip.Content
                            className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-medium",
                                "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
                                "shadow-lg z-50",
                                "animate-in fade-in-0 zoom-in-95"
                            )}
                            sideOffset={5}
                        >
                            {tooltipText}
                            <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-100" />
                        </Tooltip.Content>
                    </Tooltip.Portal>
                )}
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
