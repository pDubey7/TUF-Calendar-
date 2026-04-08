"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/store/calendarStore";
import { BindingRing } from "./BindingRing";
import { HeroPanel } from "./HeroPanel";
import { MonthNav } from "./MonthNav";
import { CalendarGrid } from "./CalendarGrid";
import { RangeSummaryBar } from "./RangeSummaryBar";
import { NotesPanel } from "./NotesPanel";
import { NotesOverlay } from "./NotesOverlay";
import {
    getMonthGrid,
    isSameDay,
    addMonths,
    subMonths,
    getMonthKey,
} from "@/lib/dateUtils";

export function CalendarRoot() {
    const currentMonth = useCalendarStore((s) => s.currentMonth);
    const darkMode = useCalendarStore((s) => s.darkMode);
    const toggleDarkMode = useCalendarStore((s) => s.toggleDarkMode);
    const focusedDay = useCalendarStore((s) => s.focusedDay);
    const setFocusedDay = useCalendarStore((s) => s.setFocusedDay);
    const selectDay = useCalendarStore((s) => s.selectDay);
    const clearRange = useCalendarStore((s) => s.clearRange);
    const setCurrentMonth = useCalendarStore((s) => s.setCurrentMonth);

    const [direction, setDirection] = useState(0);
    const [hydrated, setHydrated] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);
    const prevMonthKeyRef = useRef(getMonthKey(currentMonth));

    // Hydration guard
    useEffect(() => {
        setHydrated(true);
    }, []);

    // Track direction from month changes
    useEffect(() => {
        const newKey = getMonthKey(currentMonth);
        if (newKey !== prevMonthKeyRef.current) {
            setDirection(newKey > prevMonthKeyRef.current ? 1 : -1);
            prevMonthKeyRef.current = newKey;
        }
    }, [currentMonth]);

    // Apply dark mode to <html>
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", darkMode);
        }
    }, [darkMode]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Skip if typing in an input or textarea
            const target = e.target as HTMLElement;
            const tagName = target.tagName.toUpperCase();
            if (
                tagName === "INPUT" ||
                tagName === "TEXTAREA" ||
                tagName === "BUTTON" ||
                tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            if (!focusedDay) {
                // Initialize focus to first day of current month if nothing focused
                if (
                    e.key === "ArrowRight" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowDown" ||
                    e.key === "ArrowUp"
                ) {
                    const grid = getMonthGrid(currentMonth);
                    const firstDay = grid.find((d) => d.isCurrentMonth);
                    if (firstDay) {
                        setFocusedDay(firstDay.date);
                    }
                    e.preventDefault();
                    return;
                }
            }

            if (!focusedDay) return;

            const grid = getMonthGrid(currentMonth);
            const currentIdx = grid.findIndex((d) => isSameDay(d.date, focusedDay));
            if (currentIdx === -1) return;

            let newIdx = currentIdx;

            switch (e.key) {
                case "ArrowRight":
                    newIdx = Math.min(currentIdx + 1, grid.length - 1);
                    e.preventDefault();
                    break;
                case "ArrowLeft":
                    newIdx = Math.max(currentIdx - 1, 0);
                    e.preventDefault();
                    break;
                case "ArrowDown":
                    newIdx = Math.min(currentIdx + 7, grid.length - 1);
                    e.preventDefault();
                    break;
                case "ArrowUp":
                    newIdx = Math.max(currentIdx - 7, 0);
                    e.preventDefault();
                    break;
                case "Enter":
                case " ":
                    if (grid[currentIdx].isCurrentMonth) {
                        selectDay(focusedDay);
                    }
                    e.preventDefault();
                    return;
                case "Escape":
                    clearRange();
                    e.preventDefault();
                    return;
                default:
                    return;
            }

            const newDay = grid[newIdx];
            setFocusedDay(newDay.date);

            // If we go past the current month grid, navigate months
            if (!newDay.isCurrentMonth) {
                if (newIdx < 7) {
                    setCurrentMonth(subMonths(currentMonth, 1));
                } else {
                    setCurrentMonth(addMonths(currentMonth, 1));
                }
            }
        },
        [focusedDay, currentMonth, selectDay, clearRange, setFocusedDay, setCurrentMonth]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Page-flip animation variants
    const flipVariants = {
        enter: (dir: number) => ({
            rotateY: dir > 0 ? 90 : -90,
            opacity: 0,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            rotateY: dir > 0 ? -90 : 90,
            opacity: 0,
        }),
    };

    if (!hydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 rounded-full border-4 border-cal-blue border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div
            ref={calendarRef}
            className={cn(
                "calendar-container mx-auto w-full max-w-[56rem] relative",
                "bg-white dark:bg-cal-dark-card",
                "rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40",
                "overflow-hidden",
                "transition-colors duration-300"
            )}
        >
            {/* Dark mode toggle */}
            <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6">
                <button
                    onClick={toggleDarkMode}
                    className={cn(
                        "flex items-center justify-center",
                        "h-10 w-10 rounded-full",
                        "bg-white/20 dark:bg-black/30 backdrop-blur-md",
                        "text-white",
                        "hover:bg-white/30 dark:hover:bg-black/40",
                        "transition-all duration-200",
                        "shadow-lg"
                    )}
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {darkMode ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Spiral binding */}
            <BindingRing />

            {/* Hero Panel */}
            <HeroPanel month={currentMonth} darkMode={darkMode} />

            {/* Perspective wrapper for page-flip */}
            <div style={{ perspective: "1200px" }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={getMonthKey(currentMonth)}
                        custom={direction}
                        variants={flipVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            type: "tween",
                            duration: 0.4,
                            ease: "easeInOut",
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Month nav */}
                        <MonthNav />

                        {/* Calendar grid */}
                        <CalendarGrid month={currentMonth} />

                        {/* Range summary */}
                        <RangeSummaryBar />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Notes */}
            <NotesPanel />

            {/* Floating Notes Overlay */}
            <NotesOverlay />
        </div>
    );
}
