"use client";

import { useRef, useEffect} from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { X, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FloatingNote, useCalendarStore } from "@/store/calendarStore";

if (typeof window !== "undefined") {
    gsap.registerPlugin(Draggable);
}

interface StickyNoteProps {
    note: FloatingNote;
}

export function StickyNote({ note }: StickyNoteProps) {
    const updateNote = useCalendarStore((s) => s.updateFloatingNote);
    const deleteNote = useCalendarStore((s) => s.deleteFloatingNote);
    const noteRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!noteRef.current || !handleRef.current) return;

        const ctx = gsap.context(() => {
            // Set initial position immediately
            gsap.set(noteRef.current, { x: note.x, y: note.y });

            Draggable.create(noteRef.current, {
                type: "x,y",
                trigger: handleRef.current,
                onDragEnd: function () {
                    updateNote(note.id, { x: this.x, y: this.y });
                },
                bounds: ".calendar-container",
                inertia: true,
            });
        });

        return () => ctx.revert();
    }, [note.id, updateNote]); // Only re-run if ID or update function changes

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute inset-0 pointer-events-none"
        >
            <div
                ref={noteRef}
                className={cn(
                    "absolute pointer-events-auto",
                    "w-52 p-4 pt-2 shadow-2xl",
                    "border border-black/5 rounded-sm",
                    "flex flex-col transition-all duration-300 hover:scale-[1.02]",
                    "before:absolute before:inset-0 before:bg-white/10 before:pointer-events-none"
                )}
                style={{
                    backgroundColor: note.color,
                    boxShadow: `
                        0 1px 1px rgba(0,0,0,0.05),
                        0 2px 2px rgba(0,0,0,0.05),
                        2px 10px 20px rgba(0,0,0,0.1),
                        10px 20px 40px rgba(0,0,0,0.1)
                    `.replace(/\s+/g, ' '),
                    transform: `rotate(${Math.sin(parseInt(note.id, 36)) * 3}deg)`,
                }}
            >
                {/* Visual Tack/Pin */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-black/10 ring-2 ring-white/20 shadow-inner" />

                {/* Drag Handle Header */}
                <div
                    ref={handleRef}
                    className="flex items-center justify-between cursor-grab active:cursor-grabbing pb-2 mb-2 border-b border-black/5"
                >
                    <span className="text-[10px] font-bold font-mono opacity-40 uppercase tracking-widest select-none">
                        {format(new Date(note.date), "EEE, MMM do")}
                    </span>
                    <div className="flex items-center gap-1.5 pt-1">
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => updateNote(note.id, { isCompleted: !note.isCompleted })}
                            className={cn(
                                "h-6 w-6 flex items-center justify-center rounded-full transition-all duration-200",
                                note.isCompleted
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                    : "bg-black/5 hover:bg-black/10 text-black/40 hover:text-black"
                            )}
                            style={{
                                backgroundColor: note.isCompleted ? 'var(--cal-accent, #10b981)' : undefined
                            }}
                        >
                            <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => deleteNote(note.id)}
                            className="h-6 w-6 flex items-center justify-center rounded-full bg-black/5 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* Note Content - Lined Paper Effect */}
                <textarea
                    onPointerDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className={cn(
                        "w-full bg-transparent resize-none border-none focus:ring-0 p-0",
                        "text-sm leading-[1.5rem] font-medium text-gray-800",
                        "placeholder:text-black/10 focus:outline-none",
                        "transition-all duration-300",
                        note.isCompleted && "line-through opacity-40 grayscale"
                    )}
                    style={{
                        backgroundImage: "linear-gradient(transparent 1.4rem, rgba(0,0,0,0.05) 1.4rem, rgba(0,0,0,0.05) 1.5rem, transparent 1.5rem)",
                        backgroundSize: "100% 1.5rem",
                        minHeight: "6rem"
                    }}
                    value={note.text}
                    onChange={(e) => updateNote(note.id, { text: e.target.value })}
                    placeholder="Write a reminder..."
                    rows={4}
                />

                {/* Bottom decorative dots */}
                <div className="flex justify-end pt-1 opacity-10 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12" className="rotate-45">
                        <path d="M0 0h2v2H0zm5 0h2v2H5zm5 0h2v2h-2zM0 5h2v2H0zm5 0h2v2H5zm5 0h2v2h-2zM0 10h2v2H0zm5 0h2v2H5zm5 0h2v2h-2z" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
}
