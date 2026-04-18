import { useState, useContext, useEffect } from "react";
import { ChevronLeft, ChevronRight, Dot, CirclePlus, CircleMinus, Pencil } from "lucide-react";
import { motion } from "framer-motion";
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
];

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const MONTH_NAMES = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

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
            <div className="rounded-2xl h-full w-full overflow-hidden backdrop-blur-sm bg-linear-to-br from-teal-600/40 to-cyan-400/30">
            <div className={scrollableClass}>
                {/* Day detail header */}
                <div className="flex items-center gap-2">
                    <GlassButton isDarkMode={isDarkMode} onClick={() => setSelectedDay(null)} className="p-1 text-white">
                        <ChevronLeft size={18} />
                    </GlassButton>
                    <span className="text-lg font-bold text-white">
                        {DAY_NAMES[selectedDay.getDay()]}, {selectedDay.getDate()}. {MONTH_NAMES[selectedDay.getMonth()]} {selectedDay.getFullYear()}
                    </span>
                </div>

                {/* Events will go here */}
                <div className="flex-1 flex items-center justify-center">
                    <span className="text-white/50 text-sm">Keine Events</span>
                </div>
            </div>
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
                    const dayEvents = events.filter(e => isSameDay(e.date, day.date));
                    const MAX_DOTS = 3;
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
                                        <Dot key={e.id} size={12} style={{ color: e.color }} strokeWidth={6} className="-mx-1" />
                                    ))}
                                    {overflow > 0 && (
                                        <span className="text-[8px] text-white/70 leading-none ml-0.5">+{overflow}</span>
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
