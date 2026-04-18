import { useState, useContext, useEffect } from "react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import GlassButton from "../../components/ui/GlassButton";
import { DarkModeContext } from "../../context/DarkModeContext";

type CalendarDay = {
    date: Date;
    isCurrentMonth: boolean;
};

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const MONTH_NAMES = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
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

    return (
        <div className="rounded-2xl h-full w-full overflow-hidden backdrop-blur-sm bg-linear-to-br from-teal-600/40 to-cyan-400/30">
        <div className={`
            p-4 h-full w-full overflow-y-auto [scrollbar-gutter:stable] flex flex-col gap-3
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            ${isDarkMode
                ? "[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb:hover]:bg-white/35 text-gray-200"
                : "[&::-webkit-scrollbar-thumb]:bg-black/15 [&::-webkit-scrollbar-thumb:hover]:bg-black/30 text-gray-800"
            }
        `}>
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
                    <div
                        key={day}
                        className="text-xs font-semibold py-1 text-white/70"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 flex-1 min-h-0">
                {days.map((day, i) => {
                    const isToday = isSameDay(day.date, today);
                    return (
                        <div
                            key={i}
                            className={`
                                flex items-start justify-center pt-1 text-sm rounded-lg min-h-8
                                ${!day.isCurrentMonth
                                    ? "text-white/30 font-semibold"
                                    : "text-white font-semibold"
                                }
                                ${isToday
                                    ? "bg-blue-500 text-whitefont-bold rounded-full"
                                    : "hover:bg-white/10 cursor-pointer"
                                }
                            `}
                        >
                            <span className={isToday ? "flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white" : ""}>
                                {day.date.getDate()}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
        </div>
    );
}

export default CalendarWidget;
