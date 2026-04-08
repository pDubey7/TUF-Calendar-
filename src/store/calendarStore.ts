import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FloatingNote {
    id: string;
    date: string; // YYYY-MM-DD
    text: string;
    isCompleted: boolean;
    x: number;
    y: number;
    color: string;
}

interface CalendarState {
    currentMonth: Date;
    rangeStart: Date | null;
    rangeEnd: Date | null;
    clickCount: number;
    notes: Record<string, string>;
    darkMode: boolean;
    focusedDay: Date | null;
    floatingNotes: FloatingNote[];
}

interface CalendarActions {
    goNext: () => void;
    goPrev: () => void;
    goToday: () => void;
    setCurrentMonth: (date: Date) => void;
    selectDay: (date: Date) => void;
    clearRange: () => void;
    setNote: (key: string, value: string) => void;
    toggleDarkMode: () => void;
    setFocusedDay: (date: Date | null) => void;
    addFloatingNote: (date: string, x: number, y: number) => void;
    updateFloatingNote: (id: string, updates: Partial<FloatingNote>) => void;
    deleteFloatingNote: (id: string) => void;
}

export type CalendarStore = CalendarState & CalendarActions;

function addMonthsSimple(date: Date, count: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + count);
    return d;
}

const NOTE_COLORS = [
    "#fff9db", // soft yellow
    "#ffe3e3", // soft red
    "#e7f5ff", // soft blue
    "#ebfbee", // soft green
    "#f3f0ff", // soft purple
    "#fff4e6", // soft orange
];

export const useCalendarStore = create<CalendarStore>()(
    persist(
        (set, get) => ({
            currentMonth: new Date(),
            rangeStart: null,
            rangeEnd: null,
            clickCount: 0,
            notes: {},
            darkMode: false,
            focusedDay: null,
            floatingNotes: [],

            goNext: () =>
                set((s) => ({ currentMonth: addMonthsSimple(s.currentMonth, 1) })),

            goPrev: () =>
                set((s) => ({ currentMonth: addMonthsSimple(s.currentMonth, -1) })),

            goToday: () => set({ currentMonth: new Date() }),

            setCurrentMonth: (date: Date) => set({ currentMonth: date }),

            selectDay: (date: Date) => {
                const { clickCount, rangeStart } = get();

                if (clickCount === 0) {
                    // First click — set start
                    set({ rangeStart: date, rangeEnd: null, clickCount: 1 });
                } else if (clickCount === 1) {
                    // Second click — set end, auto-swap if needed
                    if (rangeStart) {
                        const start =
                            date < rangeStart ? date : rangeStart;
                        const end =
                            date < rangeStart ? rangeStart : date;
                        set({ rangeStart: start, rangeEnd: end, clickCount: 2 });
                    }
                } else {
                    // Third click — reset and start new
                    set({ rangeStart: date, rangeEnd: null, clickCount: 1 });
                }
            },

            clearRange: () =>
                set({ rangeStart: null, rangeEnd: null, clickCount: 0 }),

            setNote: (key: string, value: string) =>
                set((s) => ({ notes: { ...s.notes, [key]: value } })),

            toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

            setFocusedDay: (date: Date | null) => set({ focusedDay: date }),

            addFloatingNote: (date: string, x: number, y: number) => {
                const newNote: FloatingNote = {
                    id: Math.random().toString(36).substring(2, 9),
                    date,
                    text: "",
                    isCompleted: false,
                    x,
                    y,
                    color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
                };
                set((s) => ({ floatingNotes: [...s.floatingNotes, newNote] }));
            },

            updateFloatingNote: (id: string, updates: Partial<FloatingNote>) => {
                set((s) => ({
                    floatingNotes: s.floatingNotes.map((n) =>
                        n.id === id ? { ...n, ...updates } : n
                    ),
                }));
            },

            deleteFloatingNote: (id: string) => {
                set((s) => ({
                    floatingNotes: s.floatingNotes.filter((n) => n.id !== id),
                }));
            },
        }),
        {
            name: "tuf-calendar-store",
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.clickCount = 0;
                    state.rangeStart = null;
                    state.rangeEnd = null;
                }
            },
            partialize: (state) => ({
                notes: state.notes,
                darkMode: state.darkMode,
                currentMonth: state.currentMonth.toISOString(),
                floatingNotes: state.floatingNotes,
            }),
            merge: (persisted, current) => {
                const p = persisted as Record<string, unknown> | undefined;
                if (!p) return current;
                return {
                    ...current,
                    notes: (p.notes as Record<string, string>) ?? current.notes,
                    darkMode: typeof p.darkMode === "boolean" ? p.darkMode : current.darkMode,
                    currentMonth: typeof p.currentMonth === "string"
                        ? new Date(p.currentMonth)
                        : current.currentMonth,
                    floatingNotes: (p.floatingNotes as FloatingNote[]) ?? current.floatingNotes,
                };
            },
        }
    )
);
