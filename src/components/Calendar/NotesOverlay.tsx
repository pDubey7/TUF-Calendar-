import { AnimatePresence } from "framer-motion";
import { useCalendarStore } from "@/store/calendarStore";
import { StickyNote } from "./StickyNote";
import { format } from "date-fns";

export function NotesOverlay() {
    const floatingNotes = useCalendarStore((s) => s.floatingNotes);
    const currentMonth = useCalendarStore((s) => s.currentMonth);

    // Filter notes to only show those belonging to the current month view
    const currentMonthKey = format(currentMonth, "yyyy-MM");
    const visibleNotes = floatingNotes.filter((note) =>
        note.date.startsWith(currentMonthKey)
    );

    return (
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden calendar-container">
            <AnimatePresence>
                {visibleNotes.map((note) => (
                    <div key={note.id} className="pointer-events-auto">
                        <StickyNote note={note} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
