import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isToday as fnsIsToday,
    isSameDay as fnsIsSameDay,
    isSameMonth,
    isWeekend as fnsIsWeekend,
    isSunday,
    addMonths,
    subMonths,
    differenceInCalendarDays,
    isWithinInterval,
    isBefore,
    isAfter,
    getDay,
} from "date-fns";

export interface MonthGridDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
    isSunday: boolean;
    dayOfMonth: number;
}

/**
 * Generate a 6-row × 7-col grid for a given month.
 * Week starts on Monday (weekStartsOn: 1).
 */
export function getMonthGrid(month: Date): MonthGridDay[] {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    // Ensure exactly 42 cells (6 rows)
    while (days.length < 42) {
        const lastDay = days[days.length - 1];
        const nextDay = new Date(lastDay);
        nextDay.setDate(nextDay.getDate() + 1);
        days.push(nextDay);
    }

    return days.slice(0, 42).map((date) => ({
        date,
        isCurrentMonth: isSameMonth(date, month),
        isToday: fnsIsToday(date),
        isWeekend: fnsIsWeekend(date),
        isSunday: isSunday(date),
        dayOfMonth: date.getDate(),
    }));
}

export function formatMonthYear(date: Date): string {
    return format(date, "MMMM yyyy");
}

export function formatMonthShort(date: Date): string {
    return format(date, "MMM yyyy");
}

export function formatDayLabel(date: Date): string {
    return format(date, "EEEE, MMMM d, yyyy");
}

export function formatRangeDisplay(
    start: Date,
    end: Date
): { label: string; days: number } {
    const days = differenceInCalendarDays(end, start) + 1;
    const startStr = format(start, "MMM d");
    const endStr = format(end, "MMM d");
    return {
        label: `${startStr} → ${endStr} · ${days} day${days !== 1 ? "s" : ""} selected`,
        days,
    };
}

export function getMonthKey(date: Date): string {
    return format(date, "yyyy-MM");
}

export function getRangeKey(start: Date, end: Date): string {
    return `${format(start, "yyyy-MM-dd")}_${format(end, "yyyy-MM-dd")}`;
}

export function isDateInRange(
    date: Date,
    start: Date | null,
    end: Date | null
): boolean {
    if (!start || !end) return false;
    return isWithinInterval(date, { start, end });
}

export function isRangeStart(date: Date, start: Date | null): boolean {
    if (!start) return false;
    return fnsIsSameDay(date, start);
}

export function isRangeEnd(date: Date, end: Date | null): boolean {
    if (!end) return false;
    return fnsIsSameDay(date, end);
}

export function isSameDay(a: Date, b: Date): boolean {
    return fnsIsSameDay(a, b);
}

export function isToday(date: Date): boolean {
    return fnsIsToday(date);
}

export function getNextMonth(date: Date): Date {
    return addMonths(date, 1);
}

export function getPrevMonth(date: Date): Date {
    return subMonths(date, 1);
}

export function ensureStartBeforeEnd(
    a: Date,
    b: Date
): { start: Date; end: Date } {
    if (isAfter(a, b)) {
        return { start: b, end: a };
    }
    return { start: a, end: b };
}

export function getColumnIndex(date: Date): number {
    // Monday = 0, Sunday = 6
    const day = getDay(date);
    return day === 0 ? 6 : day - 1;
}

export { isBefore, isAfter, addMonths, subMonths, isSameMonth, format };
