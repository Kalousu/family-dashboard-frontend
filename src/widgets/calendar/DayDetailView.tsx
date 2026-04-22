import { ChevronLeft, CirclePlus, CircleMinus, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HslStringColorPicker } from "react-colorful";
import GlassButton from "../../components/ui/GlassButton";
import { DAY_NAMES, MONTH_NAMES, EMPTY_DAY_MESSAGES, isSameDay, getScrollableClass, COLOR_OPTIONS } from "./calendarUtils";
import type { CalendarEvent } from "./calendarTypes";
import { useEventForm } from "./useEventForm";

function EventItem({ event, showTime, onEdit, onRemove }: {
    event: CalendarEvent;
    showTime?: boolean;
    onEdit: (event: CalendarEvent) => void;
    onRemove: (id: number) => void;
}) {
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
            <div className="px-3 py-2 flex-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-white text-sm font-semibold">{event.title}</span>
                    {showTime && event.startTime && (
                        <span className="text-white/50 text-xs">{event.startTime}</span>
                    )}
                </div>
            </div>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(event)} className="pr-1 text-white/40 hover:text-white/80 transition-colors">
                <Pencil size={14} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => onRemove(event.id)} className="pr-3 text-white/40 hover:text-white/80 transition-colors">
                <CircleMinus size={16} />
            </motion.button>
        </motion.div>
    );
}

type Props = {
    isDarkMode: boolean;
    selectedDay: Date;
    onBack: () => void;
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, "id">) => void;
    updateEvent: (event: CalendarEvent) => void;
    removeEvent: (id: number) => void;
};

function DayDetailView({ isDarkMode, selectedDay, onBack, events, addEvent, updateEvent, removeEvent }: Props) {
    const {
        showAddForm,
        formTitle, setFormTitle,
        formAllDay,
        formTime, setFormTime,
        formColor, setFormColor,
        showColorPicker,
        localPickerColor,
        editingEventId,
        openAddForm,
        openEditForm,
        submitForm,
        cancelForm,
        toggleAllDay,
        toggleColorPicker,
        closeColorPicker,
        changePickerColor,
    } = useEventForm({ events, addEvent, updateEvent, selectedDay });

    const emptyDayMessage = EMPTY_DAY_MESSAGES[selectedDay.getDate() % EMPTY_DAY_MESSAGES.length];

    const dayEvents = events.filter(e => isSameDay(e.date, selectedDay));
    const allDayEvents = dayEvents.filter(e => e.allDay);
    const timedEvents = dayEvents
        .filter(e => !e.allDay)
        .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

    const scrollableClass = getScrollableClass(isDarkMode);

    return (
        <div className="relative rounded-2xl h-full w-full overflow-hidden backdrop-blur-sm bg-linear-to-br from-teal-600/40 to-cyan-400/30">
            <div className={scrollableClass}>
                <div className="flex items-center gap-2">
                    <GlassButton isDarkMode={!isDarkMode} onClick={onBack} className="p-1 text-white">
                        <ChevronLeft size={18} />
                    </GlassButton>
                    <span className="text-lg font-bold text-white flex-1">
                        {DAY_NAMES[selectedDay.getDay()]}, {selectedDay.getDate()}. {MONTH_NAMES[selectedDay.getMonth()]} {selectedDay.getFullYear()}
                    </span>
                </div>

                <motion.button
                    whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={openAddForm}
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
                                <motion.div key="allday" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }} style={{ overflow: "hidden" }} className="flex flex-col gap-2">
                                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Ganztägige Events</span>
                                    <AnimatePresence initial={false} mode="popLayout">
                                        {allDayEvents.map(event => (
                                            <EventItem key={event.id} event={event} onEdit={openEditForm} onRemove={removeEvent} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                            {allDayEvents.length > 0 && timedEvents.length > 0 && (
                                <motion.div key="divider" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }} className="border-t border-white/20 my-1" />
                            )}
                            {timedEvents.length > 0 && (
                                <motion.div key="timed" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }} style={{ overflow: "hidden" }} className="flex flex-col gap-2">
                                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Termine</span>
                                    <AnimatePresence initial={false} mode="popLayout">
                                        {timedEvents.map(event => (
                                            <EventItem key={event.id} event={event} showTime onEdit={openEditForm} onRemove={removeEvent} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute inset-3 rounded-xl backdrop-blur-md bg-linear-to-b from-teal-700/90 to-cyan-700/80 border border-white/20 flex flex-col p-4 gap-4"
                        onKeyDown={e => { if (e.key === "Enter") submitForm(); }}
                    >
                        <div className="flex items-center gap-2">
                            <GlassButton isDarkMode={isDarkMode} onClick={cancelForm} className="p-1 text-white">
                                <ChevronLeft size={18} />
                            </GlassButton>
                            <span className="text-white font-bold text-base flex-1">
                                {editingEventId ? "Termin bearbeiten" : "Neuer Termin"}
                            </span>
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={submitForm} className="text-white/40 hover:text-white/80 transition-colors">
                                <CirclePlus size={18} />
                            </motion.button>
                        </div>

                        <input
                            type="text"
                            value={formTitle}
                            onChange={e => setFormTitle(e.target.value)}
                            placeholder="Titel hinzufügen"
                            className="w-full bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:ring-1 focus:ring-white/30"
                        />

                        <div className="flex items-center justify-between">
                            <span className="text-white/80 text-sm">Ganztägig</span>
                            <button
                                onClick={toggleAllDay}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${formAllDay ? "bg-cyan-400" : "bg-white/20"}`}
                            >
                                <motion.div
                                    animate={{ x: formAllDay ? 20 : 2 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                                />
                            </button>
                        </div>

                        <AnimatePresence initial={false} mode="popLayout">
                            {!formAllDay && (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scaleY: 0.7 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    exit={{ opacity: 0, scaleY: 0.7 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    style={{ transformOrigin: "top" }}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-white/80 text-sm">Uhrzeit</span>
                                    <input
                                        type="time"
                                        value={formTime}
                                        onChange={e => setFormTime(e.target.value)}
                                        className="bg-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:ring-1 focus:ring-white/30 scheme-dark"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div layout className="flex items-center gap-2">
                            <div className="flex items-center gap-2 flex-wrap flex-1">
                                {COLOR_OPTIONS.map(color => (
                                    <motion.button
                                        key={color}
                                        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => setFormColor(color)}
                                        className="w-6 h-6 rounded-full border-2 transition-all"
                                        style={{ backgroundColor: color, borderColor: formColor === color ? "white" : "transparent" }}
                                    />
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                onClick={toggleColorPicker}
                                className="w-6 h-6 rounded-full border-2 transition-all"
                                style={{ backgroundColor: localPickerColor, borderColor: localPickerColor === formColor ? "white" : "transparent" }}
                            />
                        </motion.div>

                        <AnimatePresence>
                            {showColorPicker && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute inset-0 flex items-center justify-center z-10 rounded-xl bg-black/20 backdrop-blur-xs"
                                    onClick={closeColorPicker}
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="rounded-xl p-2 bg-teal-900/90 border border-white/20"
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <HslStringColorPicker color={localPickerColor} onChange={changePickerColor} />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DayDetailView;
