import { Pencil, CircleMinus } from "lucide-react";
import { motion } from "framer-motion";
import type { CalendarEvent } from "./calendarTypes";
import { DUMMY_USERS } from "./calendarMocks";

type Props = {
    event: CalendarEvent;
    showTime?: boolean;
    onEdit: (event: CalendarEvent) => void;
    onRemove: (id: string) => void;
};

function EventContent({ event, showTime }: { event: CalendarEvent; showTime?: boolean }) {
    return (
        <div className="px-3 py-2 flex-1">
            <div className="flex items-baseline gap-2">
                <span className="text-white text-sm font-semibold">{event.title}</span>
                {showTime && event.startTime && (
                    <span className="text-white/50 text-xs">{event.startTime}</span>
                )}
            </div>
            <p className="text-white/40 text-[10px]">
                Angelegt von: {DUMMY_USERS.find(u => u.id === event.userId)?.username ?? "Unbekannt"}
            </p>
        </div>
    );
}

function EventButtons({ onEdit, onRemove, event }: { onEdit: (e: CalendarEvent) => void; onRemove: (id: string) => void; event: CalendarEvent }) {
    return (
        <>
            <motion.button
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(event)}
                className="pr-1 text-white/40 hover:text-white/80 transition-colors"
            >
                <Pencil size={14} />
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(event.id)}
                className="pr-3 text-white/40 hover:text-white/80 transition-colors"
            >
                <CircleMinus size={16} />
            </motion.button>
        </>
    );
}

function EventItem({ event, showTime, onEdit, onRemove }: Props) {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            layout
            exit={{ opacity: 0, transition: { duration: 0 } }}
            style={{ transformOrigin: "center", overflow: "hidden" }}
            className="flex items-center rounded-lg bg-white/10"
        >
            <div className="w-1 self-stretch shrink-0" style={{ backgroundColor: event.color }} />
            <EventContent event={event} showTime={showTime} />
            <EventButtons event={event} onEdit={onEdit} onRemove={onRemove} />
        </motion.div>
    );
}

export default EventItem;
