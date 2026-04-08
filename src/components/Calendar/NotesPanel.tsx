"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/store/calendarStore";
import { getMonthKey, getRangeKey } from "@/lib/dateUtils";

type NoteTab = "month" | "range";

const MAX_CHARS = 500;

export function NotesPanel() {
    const currentMonth = useCalendarStore((s) => s.currentMonth);
    const rangeStart = useCalendarStore((s) => s.rangeStart);
    const rangeEnd = useCalendarStore((s) => s.rangeEnd);
    const notes = useCalendarStore((s) => s.notes);
    const setNote = useCalendarStore((s) => s.setNote);

    const [activeTab, setActiveTab] = useState<NoteTab>("month");
    const [showSaved, setShowSaved] = useState(false);
    const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hasRange = rangeStart !== null && rangeEnd !== null;
    const monthKey = getMonthKey(currentMonth);
    const rangeKey = hasRange ? getRangeKey(rangeStart, rangeEnd) : null;

    const currentKey = activeTab === "month" ? monthKey : rangeKey;
    const currentValue = currentKey ? notes[currentKey] ?? "" : "";

    // Switch to month tab if range becomes unavailable
    useEffect(() => {
        if (!hasRange && activeTab === "range") {
            setActiveTab("month");
        }
    }, [hasRange, activeTab]);

    const handleBlur = useCallback(() => {
        // Flash "Saved ✓"
        setShowSaved(true);
        if (savedTimerRef.current) {
            clearTimeout(savedTimerRef.current);
        }
        savedTimerRef.current = setTimeout(() => {
            setShowSaved(false);
        }, 1500);
    }, []);

    const handleChange = useCallback(
        (value: string) => {
            if (!currentKey) return;
            if (value.length <= MAX_CHARS) {
                setNote(currentKey, value);
            }
        },
        [currentKey, setNote]
    );

    return (
        <div className="px-2 md:px-4 pb-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-2">
                <button
                    onClick={() => setActiveTab("month")}
                    className={cn(
                        "px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors",
                        activeTab === "month"
                            ? "bg-[var(--notepad-bg)] text-gray-800 dark:text-gray-100 border border-b-0 border-gray-200 dark:border-gray-600"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                    aria-label="Month note"
                >
                    📝 Month Note
                </button>
                <button
                    onClick={() => hasRange && setActiveTab("range")}
                    disabled={!hasRange}
                    className={cn(
                        "px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors",
                        activeTab === "range"
                            ? "bg-[var(--notepad-bg)] text-gray-800 dark:text-gray-100 border border-b-0 border-gray-200 dark:border-gray-600"
                            : "text-gray-500 dark:text-gray-400",
                        !hasRange && "opacity-40 cursor-not-allowed"
                    )}
                    aria-label="Range note"
                >
                    📅 Range Note
                </button>

                {/* Saved indicator */}
                {showSaved && (
                    <span className="ml-auto text-xs text-emerald-500 font-medium animate-saved-flash">
                        Saved ✓
                    </span>
                )}
            </div>

            {/* Notepad textarea */}
            <div
                className={cn(
                    "relative rounded-b-lg rounded-tr-lg",
                    "border border-gray-200 dark:border-gray-600",
                    "overflow-hidden"
                )}
            >
                <textarea
                    className={cn(
                        "notepad-lines w-full resize-none px-4",
                        "min-h-[128px] md:min-h-[160px]",
                        "text-sm text-gray-700 dark:text-gray-200",
                        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-cal-blue/30",
                        "font-sans"
                    )}
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={
                        activeTab === "month"
                            ? "Write notes for this month..."
                            : "Write notes for the selected date range..."
                    }
                    maxLength={MAX_CHARS}
                    aria-label={
                        activeTab === "month"
                            ? `Notes for ${monthKey}`
                            : `Notes for range ${rangeKey ?? ""}`
                    }
                />

                {/* Character counter */}
                <div
                    className={cn(
                        "absolute bottom-1 right-2",
                        "text-[10px] tabular-nums",
                        currentValue.length > MAX_CHARS * 0.9
                            ? "text-cal-coral"
                            : "text-gray-400 dark:text-gray-500"
                    )}
                >
                    {currentValue.length}/{MAX_CHARS}
                </div>
            </div>
        </div>
    );
}
