import { ChevronLeft, CirclePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";
import GlassButton from "../../components/ui/GlassButton";
import type { CalendarEvent, FormProps } from "./calendarTypes";
import { DAY_NAMES, MONTH_NAMES, isSameDay } from "./calendarUtils";
import EventItem from "./EventItem";
import AddEventForm from "./AddEventForm";

type Props = {
    isDarkMode: boolean;
    selectedDay: Date;
    onBack: () => void;
    events: CalendarEvent[];
    emptyDayMessage: { text: string; Icon: ComponentType<{ size?: number; className?: string }> };
    onRemoveEvent: (id: string) => void;
    showAddForm: boolean;
    onOpenAddForm: () => void;
    onEditEvent: (event: CalendarEvent) => void;
    scrollableClass: string;
    formProps: FormProps;
};

function DayHeader({ isDarkMode, selectedDay, onBack, onOpenAddForm }: {
    isDarkMode: boolean;
    selectedDay: Date;
    onBack: () => void;
    onOpenAddForm: () => void;
}) {
    return (
        <>
            <div className="flex items-center gap-2">
                <GlassButton isDarkMode={isDarkMode} onClick={onBack} className="p-1 text-white">
                    <ChevronLeft size={18} />
                </GlassButton>
                <span className="text-lg font-bold text-white flex-1">
                    {DAY_NAMES[selectedDay.getDay()]}, {selectedDay.getDate()}. {MONTH_NAMES[selectedDay.getMonth()]} {selectedDay.getFullYear()}
                </span>
            </div>
            <motion.button
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                onClick={onOpenAddForm}
                className="self-start text-white/40 hover:text-white/80 transition-colors"
            >
                <CirclePlus size={18} />
            </motion.button>
        </>
    );
}

function EmptyDayView({ message }: { message: { text: string; Icon: ComponentType<{ size?: number; className?: string }> } }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <message.Icon size={32} className="text-white/40" />
            <span className="text-white/50 text-sm text-center whitespace-pre-line">
                {message.text}
            </span>
        </div>
    );
}

function EventSection({ label, events, showTime, onEdit, onRemove }: {
    label: string;
    events: CalendarEvent[];
    showTime?: boolean;
    onEdit: (event: CalendarEvent) => void;
    onRemove: (id: string) => void;
}) {
    return (
        <motion.div
            layout
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
            style={{ overflow: "hidden" }}
            className="flex flex-col gap-2"
        >
            <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">{label}</span>
            <AnimatePresence initial={false} mode="popLayout">
                {events.map(event => (
                    <EventItem key={event.id} event={event} showTime={showTime} onEdit={onEdit} onRemove={onRemove} />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}

function DayDetailView({
    isDarkMode, selectedDay, onBack,
    events, emptyDayMessage, onRemoveEvent,
    showAddForm, onOpenAddForm, onEditEvent,
    scrollableClass, formProps,
}: Props) {
    const dayEvents = events.filter(e => isSameDay(e.date, selectedDay));
    const allDayEvents = dayEvents.filter(e => e.allDay);
    const timedEvents = dayEvents
        .filter(e => !e.allDay)
        .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

    return (
        <div className="relative rounded-2xl h-full w-full overflow-hidden backdrop-blur-sm bg-linear-to-br from-teal-600/40 to-cyan-400/30">
            <div className={scrollableClass}>
                <DayHeader isDarkMode={isDarkMode} selectedDay={selectedDay} onBack={onBack} onOpenAddForm={onOpenAddForm} />

                {dayEvents.length === 0 ? (
                    <EmptyDayView message={emptyDayMessage} />
                ) : (
                    <div className="flex flex-col gap-2">
                        <AnimatePresence initial={false} mode="popLayout">
                            {allDayEvents.length > 0 && (
                                <EventSection key="allday" label="Ganztägige Events" events={allDayEvents} onEdit={onEditEvent} onRemove={onRemoveEvent} />
                            )}
                            {allDayEvents.length > 0 && timedEvents.length > 0 && (
                                <motion.div key="divider" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }} className="border-t border-white/20 my-1" />
                            )}
                            {timedEvents.length > 0 && (
                                <EventSection key="timed" label="Termine" events={timedEvents} showTime onEdit={onEditEvent} onRemove={onRemoveEvent} />
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showAddForm && <AddEventForm isDarkMode={isDarkMode} {...formProps} />}
            </AnimatePresence>
        </div>
    );
}

export default DayDetailView;
