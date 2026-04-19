import { ChevronLeft, CirclePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ComponentType } from "react";
import GlassButton from "../../components/ui/GlassButton";
import type { CalendarEvent } from "./calendarTypes";
import { DAY_NAMES, MONTH_NAMES } from "./calendarUtils";
import { isSameDay } from "./calendarUtils";
import EventItem from "./EventItem";
import AddEventForm from "./AddEventForm";

type FormProps = {
    editingEventId: string | null;
    formTitle: string;
    onTitleChange: (v: string) => void;
    formAllDay: boolean;
    onAllDayToggle: () => void;
    formTime: string;
    onTimeChange: (newTime: string) => void;
    formColor: string;
    onColorChange: (color: string) => void;
    showColorPicker: boolean;
    onPickerButtonClick: () => void;
    onColorPickerClose: () => void;
    localPickerColor: string;
    onPickerColorChange: (color: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    anchorRect?: DOMRect | null;
};

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

                {dayEvents.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <emptyDayMessage.Icon size={32} className="text-white/40" />
                        <span className="text-white/50 text-sm text-center whitespace-pre-line">
                            {emptyDayMessage.text}
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <AnimatePresence initial={false} mode="popLayout">
                            {allDayEvents.length > 0 && (
                                <motion.div key="allday-section" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }} style={{ overflow: "hidden" }} className="flex flex-col gap-2">
                                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Ganztägige Events</span>
                                    <AnimatePresence initial={false} mode="popLayout">
                                        {allDayEvents.map(event => (
                                            <EventItem key={event.id} event={event} onEdit={onEditEvent} onRemove={onRemoveEvent} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                            {allDayEvents.length > 0 && timedEvents.length > 0 && (
                                <motion.div key="divider" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }} className="border-t border-white/20 my-1" />
                            )}
                            {timedEvents.length > 0 && (
                                <motion.div key="timed-section" layout className="flex flex-col gap-2">
                                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Termine</span>
                                    <AnimatePresence initial={false} mode="popLayout">
                                        {timedEvents.map(event => (
                                            <EventItem key={event.id} event={event} showTime onEdit={onEditEvent} onRemove={onRemoveEvent} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
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
