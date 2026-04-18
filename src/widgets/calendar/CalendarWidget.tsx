import { useState, useContext, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Dot, CirclePlus, CircleMinus, Pencil, Coffee, TvMinimalPlay, Sprout, SportShoe, CalendarFold } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassButton from "../../components/ui/GlassButton";
import { DarkModeContext } from "../../context/DarkModeContext";

type CalendarDay = {
    date: Date;
    isCurrentMonth: boolean;
};

type CalendarEvent = {
    id: string;
    title: string;
    date: Date;
    color: string;
    allDay: boolean;
    startTime?: string; // "HH:MM", nur relevant wenn allDay = false
};

const today = new Date();
const month = today.getMonth();

const DUMMY_EVENTS: CalendarEvent[] = [
    { id: "1", title: "Arzttermin", date: new Date((today.getFullYear()), month, 5), color: "#ef4444", allDay: false, startTime: "10:00" },
    { id: "2", title: "Geburtstag Papa", date: new Date((today.getFullYear()), month, 5), color: "#f59e0b", allDay: true },
    { id: "3", title: "Elternabend", date: new Date((today.getFullYear()), month, 12), color: "#3b82f6", allDay: false, startTime: "19:30" },
    { id: "4", title: "Urlaub", date: new Date((today.getFullYear()), month, 20), color: "#10b981", allDay: true },
    { id: "5", title: "Zahnarzt", date: new Date((today.getFullYear()), month, 20), color: "#ef4444", allDay: false, startTime: "14:00" },
    { id: "6", title: "Sport", date: new Date((today.getFullYear()), month, 20), color: "#8b5cf6", allDay: false, startTime: "18:00" },
    { id: "7", title: "Einkaufen", date: new Date((today.getFullYear()), month, 20), color: "#06b6d4", allDay: false, startTime: "11:00" },
    { id: "8", title: "Programmieren", date: new Date(today.getFullYear(), today.getMonth(),  today.getDate()), color: "#ff5a3d", allDay: false, startTime: "11:00" },
    { id: "9", title: "Tanken", date: new Date((today.getFullYear()), month, 20), color: "#06b6d4", allDay: false, startTime: "11:00" },
    { id: "10", title: "Joggen", date: new Date((today.getFullYear()), month, 21), color: "#ff5a3d", allDay: false, startTime: "11:00" },
    { id: "11", title: "Tanken", date: new Date((today.getFullYear()), month, 21), color: "#ff5a3d", allDay: false, startTime: "11:00" },
    { id: "12", title: "Tanken", date: new Date((today.getFullYear()), month, 21), color: "#ff5a3d", allDay: false, startTime: "11:00" },
    { id: "13", title: "Tanken", date: new Date((today.getFullYear()), month, 21), color: "#ff5a3d", allDay: false, startTime: "11:00" },
    { id: "14", title: "Tanken", date: new Date((today.getFullYear()), month, 23), color: "#a111cc", allDay: true},
    { id: "15", title: "Tanken", date: new Date((today.getFullYear()), month, 23), color: "#10ffaa", allDay: false, startTime: "15:00" },
    { id: "16", title: "Tanken", date: new Date((today.getFullYear()), month, 23), color: "#408030", allDay: false, startTime: "13:00" },
    { id: "17", title: "Joggen", date: new Date((today.getFullYear()), month, 23), color: "#ff5a3d", allDay: true},

    ...Array.from({ length: 10 }, (_, i) => ({
        id: `gen-${i}`,
        title: `Event ${i + 1}`,
        date: new Date(today.getFullYear(), 3, 20),
        color: "#06b6d4",
        allDay: false,
        startTime: "10:00",
    })),
    ...Array.from({ length: 1000 }, (_, i) => ({
        id: `gen22-${i}`,
        title: `Event ${i + 1}`,
        date: new Date(today.getFullYear(), 3, 22),
        color: "#8b5cf6",
        allDay: false,
        startTime: "10:00",
    })),
];

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const MONTH_NAMES = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

const EMPTY_DAY_MESSAGES = [
    { text: "Keine Termine\nZeit für eine Pause", Icon: Coffee },
    { text: "Nichts geplant\nVerdächtig ruhig", Icon: TvMinimalPlay },
    { text: "Heute nichts geplant", Icon: Sprout },
    { text: "Freier Tag\nWas willst du heute machen?", Icon: SportShoe },
    { text: "Keine Termine für heute", Icon: CalendarFold },
];

function getCalendarDays(year: number, month: number): CalendarDay[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Convert Sunday-based (0=So) to Monday-based (0=Mo)
    const startOffset = (firstDay.getDay() + 6) % 7;

    const days: CalendarDay[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
        days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }

    // Fill only to the next full week
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
        days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
    }

    return days;
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function CalendarWidget() {
    const darkModeCtx = useContext(DarkModeContext);
    const isDarkMode = darkModeCtx?.isDarkMode ?? false;
    const [today, setToday] = useState(() => new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>(DUMMY_EVENTS);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formAllDay, setFormAllDay] = useState(false);
    const [formTime, setFormTime] = useState("12:00");
    const [formColor, setFormColor] = useState("#06b6d4");

    const COLOR_OPTIONS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#06b6d4", "#ff5a3d", "#a111cc"];

    const MAX_EVENTS_PER_DAY = 100;

    const emptyDayMessage = useMemo(
        () => EMPTY_DAY_MESSAGES[Math.floor(Math.random() * EMPTY_DAY_MESSAGES.length)],
        [selectedDay]
    );

    function addEvent(event: CalendarEvent) {
        const eventsOnDay = events.filter(e => isSameDay(e.date, event.date));
        if (eventsOnDay.length >= MAX_EVENTS_PER_DAY) return;
        setEvents(prev => [...prev, event]);
    }

    function removeEvent(id: string) {
        setEvents(prev => prev.filter(e => e.id !== id));
    }

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    useEffect(() => {
        function scheduleNextUpdate() {
            const now = new Date();
            const msUntilMidnight =
                new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
            return setTimeout(() => {
                setToday(new Date());
                scheduleNextUpdate();
            }, msUntilMidnight);
        }
        const timer = scheduleNextUpdate();
        return () => clearTimeout(timer);
    }, []);

    const days = getCalendarDays(viewYear, viewMonth);

    function prevMonth() {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(y => y - 1);
        } else {
            setViewMonth(m => m - 1);
        }
    }

    function nextMonth() {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(y => y + 1);
        } else {
            setViewMonth(m => m + 1);
        }
    }

    function goToToday() {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
    }

    const isCurrentView = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    const scrollableClass = `
        p-4 h-full w-full overflow-y-auto [scrollbar-gutter:stable] flex flex-col gap-3
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        ${isDarkMode
            ? "[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb:hover]:bg-white/35 text-gray-200"
            : "[&::-webkit-scrollbar-thumb]:bg-black/15 [&::-webkit-scrollbar-thumb:hover]:bg-black/30 text-gray-800"
        }
    `;

    if (selectedDay) {
        return (
            <div className="relative rounded-2xl h-full w-full overflow-hidden backdrop-blur-sm bg-linear-to-br from-teal-600/40 to-cyan-400/30">
            <div className={scrollableClass}>
                {/* Day detail header */}
                <div className="flex items-center gap-2">
                    <GlassButton isDarkMode={isDarkMode} onClick={() => setSelectedDay(null)} className="p-1 text-white">
                        <ChevronLeft size={18} />
                    </GlassButton>
                    <span className="text-lg font-bold text-white flex-1">
                        {DAY_NAMES[selectedDay.getDay()]}, {selectedDay.getDate()}. {MONTH_NAMES[selectedDay.getMonth()]} {selectedDay.getFullYear()}
                    </span>
                </div>

                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setShowAddForm(true)} className="self-start text-white/40 hover:text-white/80 transition-colors">
                    <CirclePlus size={18} />
                </motion.button>

                {/* Events */}
                {(() => {
                    const dayEvents = events.filter(e => isSameDay(e.date, selectedDay));
                    const allDay = dayEvents.filter(e => e.allDay);
                    const timed = dayEvents
                        .filter(e => !e.allDay)
                        .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

                    if (dayEvents.length === 0) {
                        return (
                            <div className="flex-1 flex flex-col items-center justify-center gap-2">
                                <emptyDayMessage.Icon size={32} className="text-white/40" />
                                <span className="text-white/50 text-sm text-center whitespace-pre-line">
                                    {emptyDayMessage.text}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div className="flex flex-col gap-2">
                            <AnimatePresence initial={false} mode="popLayout">
                            {allDay.length > 0 && (
                                <motion.div key="allday-section" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } }} style={{ overflow: "hidden" }} className="flex flex-col gap-2">
                                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Ganztägige Events</span>
                                    <AnimatePresence initial={false} mode="popLayout">
                                    {allDay.map(event => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            exit={{ opacity: 0, transition: { duration: 0 } }}
                                            style={{ transformOrigin: "center", overflow: "hidden" }}
                                            className="flex items-center rounded-lg bg-white/10"
                                        >
                                            <div className="w-1 self-stretch shrink-0" style={{ backgroundColor: event.color }} />
                                            <div className="px-3 py-2 flex-1">
                                                <span className="text-white text-sm font-semibold">{event.title}</span>
                                            </div>
                                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => removeEvent(event.id)} className="pr-3 text-white/40 hover:text-white/80 transition-colors">
                                                <CircleMinus size={16} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                            {allDay.length > 0 && timed.length > 0 && (
                                <motion.div key="divider" layout exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }} className="border-t border-white/20 my-1" />
                            )}
                            {timed.length > 0 && (
                                <motion.div key="timed-section" layout className="flex flex-col gap-2">
                                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">Termine</span>
                                    <AnimatePresence initial={false} mode="popLayout">
                                    {timed.map(event => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            exit={{ opacity: 0, transition: { duration: 0 } }}
                                            style={{ transformOrigin: "center", overflow: "hidden" }}
                                            className="flex items-center rounded-lg bg-white/10"
                                        >
                                            <div className="w-1 self-stretch shrink-0" style={{ backgroundColor: event.color }} />
                                            <div className="px-3 py-2 flex-1">
                                                <span className="text-white text-sm font-semibold">{event.title}</span>
                                                {event.startTime && (
                                                    <span className="text-white/50 text-xs ml-2">{event.startTime}</span>
                                                )}
                                            </div>
                                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => removeEvent(event.id)} className="pr-3 text-white/40 hover:text-white/80 transition-colors">
                                                <CircleMinus size={16} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    );
                })()}
            </div>

            {/* Add event popup */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute inset-3 rounded-xl backdrop-blur-md bg-linear-to-b from-teal-800/90 to-cyan-800/80 border border-white/20 flex flex-col p-4 gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <GlassButton isDarkMode={isDarkMode} onClick={() => setShowAddForm(false)} className="p-1 text-white">
                                <ChevronLeft size={18} />
                            </GlassButton>
                            <span className="text-white font-bold text-base">Neuer Termin</span>
                        </div>

                        {/* Titel */}
                        <input
                            type="text"
                            value={formTitle}
                            onChange={e => setFormTitle(e.target.value)}
                            placeholder="Titel hinzufügen"
                            className="w-full bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:ring-1 focus:ring-white/30"
                        />

                        {/* Ganztägig Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-white/80 text-sm">Ganztägig</span>
                            <button
                                onClick={() => setFormAllDay(v => !v)}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${formAllDay ? "bg-cyan-400" : "bg-white/20"}`}
                            >
                                <motion.div
                                    animate={{ x: formAllDay ? 20 : 2 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                                />
                            </button>
                        </div>

                        {/* Uhrzeit */}
                        <AnimatePresence initial={false}>
                        {!formAllDay && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                style={{ overflow: "hidden" }}
                                className="flex items-center justify-between"
                            >
                                <span className="text-white/80 text-sm">Uhrzeit</span>
                                <input
                                    type="time"
                                    value={formTime}
                                    onChange={e => setFormTime(e.target.value)}
                                    className="bg-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:ring-1 focus:ring-white/30 [color-scheme:dark]"
                                />
                            </motion.div>
                        )}
                        </AnimatePresence>

                        {/* Farbe */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {COLOR_OPTIONS.map(color => (
                                <motion.button
                                    key={color}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setFormColor(color)}
                                    className="w-6 h-6 rounded-full border-2 transition-all"
                                    style={{ backgroundColor: color, borderColor: formColor === color ? "white" : "transparent" }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="rounded-2xl h-full w-full overflow-hidden backdrop-blur-sm bg-linear-to-br from-teal-600/40 to-cyan-400/30">
        <div className={scrollableClass}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                </span>
                <div className="flex items-center gap-2">
                    {!isCurrentView && (
                        <GlassButton isDarkMode={isDarkMode} onClick={goToToday} className="px-3 py-1 text-sm text-white">
                            Heute
                        </GlassButton>
                    )}
                    <GlassButton isDarkMode={isDarkMode} onClick={prevMonth} className="p-1 text-white">
                        <ChevronLeft size={18} />
                    </GlassButton>
                    <GlassButton isDarkMode={isDarkMode} onClick={nextMonth} className="p-1 text-white">
                        <ChevronRight size={18} />
                    </GlassButton>
                </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center">
                {WEEKDAYS.map(day => (
                    <div key={day} className="text-xs font-semibold py-1 text-white/70">
                        {day}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 flex-1 min-h-0">
                {days.map((day, i) => {
                    const isToday = isSameDay(day.date, today);
                    const dayEvents = events
                        .filter(e => isSameDay(e.date, day.date))
                        .sort((a, b) => {
                            if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
                            return (a.startTime ?? "").localeCompare(b.startTime ?? "");
                        });
                    const MAX_DOTS = dayEvents.length >= 4 ? 1 : 3;
                    const visibleEvents = dayEvents.slice(0, MAX_DOTS);
                    const overflow = dayEvents.length - MAX_DOTS;
                    return (
                        <motion.div
                            key={i}
                            onClick={() => setSelectedDay(day.date)}
                            initial="rest"
                            whileHover="hover"
                            whileTap="hover"
                            className={`
                                relative flex flex-col items-center pt-1 text-sm rounded-lg min-h-8 cursor-pointer
                                ${!day.isCurrentMonth ? "text-white/30 font-semibold" : "text-white font-semibold"}
                                ${!isToday ? "hover:bg-white/10" : ""}
                            `}
                        >
                            {isToday && (
                                <motion.div
                                    variants={{ rest: { scale: 0.93 }, hover: { scale: 1.00 } }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="absolute inset-0 rounded-lg bg-white/25 pointer-events-none"
                                />
                            )}
                            <span className="relative">
                                {day.date.getDate()}
                            </span>
                            {dayEvents.length > 0 && (
                                <div className="flex items-center -mt-1">
                                    {visibleEvents.map(e => (
                                        <Dot key={e.id} size={13} style={{ color: e.color }} strokeWidth={6} className="-mx-1" />
                                    ))}
                                    {overflow > 0 && (
                                        <span className="text-[10px] text-white/70 leading-none ml-0.5">+{overflow}</span>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
        </div>
    );
}

export default CalendarWidget;
