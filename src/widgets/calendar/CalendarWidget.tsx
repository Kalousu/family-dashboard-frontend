import { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { motion } from "framer-motion";
import GlassButton from "../../components/ui/GlassButton";
import { DarkModeContext } from "../../context/DarkModeContext";
import { WEEKDAYS, MONTH_NAMES, getCalendarDays, isSameDay, getScrollableClass } from "./calendarUtils";
import type { CalendarDay } from "./calendarUtils";
import type { CalendarEvent } from "./calendarTypes";
import { DUMMY_EVENTS } from "./calendarMocks";
import DayDetailView from "./DayDetailView";

function CalendarDayCell({ day, today, events, onSelect }: {
    day: CalendarDay;
    today: Date;
    events: CalendarEvent[];
    onSelect: (date: Date) => void;
}) {
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
            onClick={() => onSelect(day.date)}
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
            <span className="relative">{day.date.getDate()}</span>
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

    function addEvent(event: CalendarEvent) {
        const eventsOnDay = events.filter(e => isSameDay(e.date, event.date));
        if (eventsOnDay.length >= 100) return;
        setEvents(prev => [...prev, event]);
    }

    function updateEvent(updated: CalendarEvent) {
        setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    }

    function removeEvent(id: string) {
        setEvents(prev => prev.filter(e => e.id !== id));
    }

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    }

    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    }

    function goToToday() {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
    }

    const days = getCalendarDays(viewYear, viewMonth);
    const isCurrentView = viewYear === today.getFullYear() && viewMonth === today.getMonth();
    const scrollableClass = getScrollableClass(isDarkMode);

    return (
        <div className="h-full w-full">
            {selectedDay ? (
                <DayDetailView
                    isDarkMode={isDarkMode}
                    selectedDay={selectedDay}
                    onBack={() => setSelectedDay(null)}
                    events={events}
                    addEvent={addEvent}
                    updateEvent={updateEvent}
                    removeEvent={removeEvent}
                />
            ) : (
                <div className="rounded-2xl h-full w-full overflow-hidden backdrop-blur-sm bg-linear-to-br from-teal-600/40 to-cyan-400/30">
                    <div className={scrollableClass}>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">
                                {MONTH_NAMES[viewMonth]} {viewYear}
                            </span>
                            <div className="flex items-center gap-2">
                                {!isCurrentView && (
                                    <GlassButton isDarkMode={!isDarkMode} onClick={goToToday} className="px-3 py-1 text-sm text-white">
                                        Heute
                                    </GlassButton>
                                )}
                                <GlassButton isDarkMode={!isDarkMode} onClick={prevMonth} className="p-1 text-white">
                                    <ChevronLeft size={18} />
                                </GlassButton>
                                <GlassButton isDarkMode={!isDarkMode} onClick={nextMonth} className="p-1 text-white">
                                    <ChevronRight size={18} />
                                </GlassButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 text-center">
                            {WEEKDAYS.map(day => (
                                <div key={day} className="text-xs font-semibold py-1 text-white/70">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 flex-1 min-h-0">
                            {days.map((day, i) => (
                                <CalendarDayCell key={i} day={day} today={today} events={events} onSelect={setSelectedDay} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarWidget;
