import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { motion } from "framer-motion";
import GlassButton from "../../components/ui/GlassButton";
import { DarkModeContext } from "../../context/DarkModeContext";
import { CalendarContext } from "../../context/CalendarContext";
import type { CalendarEvent } from "./calendarTypes";
import { WEEKDAYS, MONTH_NAMES, EMPTY_DAY_MESSAGES, COLOR_OPTIONS, getCalendarDays, isSameDay } from "./calendarUtils";
import DayDetailView from "./DayDetailView";

function CalendarWidget() {
    const darkModeCtx = useContext(DarkModeContext);
    const isDarkMode = darkModeCtx?.isDarkMode ?? false;
    const calendarCtx = useContext(CalendarContext)!;
    const { events, addEvent, updateEvent, removeEvent } = calendarCtx;

    const [today, setToday] = useState(() => new Date());
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formAllDay, setFormAllDay] = useState(false);
    const [formTime, setFormTime] = useState("12:00");
    const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [localPickerColor, setLocalPickerColor] = useState("hsl(252, 91%, 55%)");
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    const savedAddForm = useRef({ title: "", allDay: false, time: "12:00", color: COLOR_OPTIONS[0] });
    const savedEditForms = useRef<Map<string, { title: string; allDay: boolean; time: string; color: string }>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [widgetRect, setWidgetRect] = useState<DOMRect | null>(null);

    // TODO: dimensions werden später genutzt um die Kalenderansicht abhängig von der Widget-Größe zu rendern
    useEffect(() => {
        console.log("CalendarWidget dimensions:", dimensions);
    }, [dimensions]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setDimensions({ width, height });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!showColorPicker) return;
        function handleClose() { setShowColorPicker(false); }
        document.addEventListener("mousedown", handleClose);
        return () => document.removeEventListener("mousedown", handleClose);
    }, [showColorPicker]);

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

    const emptyDayMessage = useMemo(
        () => EMPTY_DAY_MESSAGES[Math.floor(Math.random() * EMPTY_DAY_MESSAGES.length)],
        [selectedDay]
    );

    function openEditForm(event: CalendarEvent) {
        setWidgetRect(containerRef.current?.getBoundingClientRect() ?? null);
        savedAddForm.current = { title: formTitle, allDay: formAllDay, time: formTime, color: formColor };
        const saved = savedEditForms.current.get(event.id);
        setFormTitle(saved?.title ?? event.title);
        setFormAllDay(saved?.allDay ?? event.allDay);
        setFormTime(saved?.time ?? event.startTime ?? "12:00");
        setFormColor(saved?.color ?? event.color);
        setEditingEventId(event.id);
        setShowAddForm(true);
    }

    function submitForm() {
        if (!formTitle.trim()) return;
        if (editingEventId) {
            const existing = events.find(e => e.id === editingEventId);
            updateEvent({
                id: editingEventId,
                title: formTitle.trim(),
                date: selectedDay!,
                color: formColor,
                allDay: formAllDay,
                startTime: formAllDay ? undefined : formTime,
                userId: existing?.userId ?? "",
            });
        } else {
            addEvent({
                id: crypto.randomUUID(),
                title: formTitle.trim(),
                date: selectedDay!,
                color: formColor,
                allDay: formAllDay,
                startTime: formAllDay ? undefined : formTime,
                userId: "",
            });
        }
        if (editingEventId) savedEditForms.current.delete(editingEventId);
        setFormTitle("");
        setFormAllDay(false);
        setFormTime("12:00");
        setFormColor(COLOR_OPTIONS[0]);
        setEditingEventId(null);
        setShowAddForm(false);
    }

    function cancelForm() {
        setShowAddForm(false);
        if (editingEventId) {
            savedEditForms.current.set(editingEventId, { title: formTitle, allDay: formAllDay, time: formTime, color: formColor });
            setEditingEventId(null);
            setFormTitle(savedAddForm.current.title);
            setFormAllDay(savedAddForm.current.allDay);
            setFormTime(savedAddForm.current.time);
            setFormColor(savedAddForm.current.color);
        }
    }

    function prevMonth() {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else { setViewMonth(m => m - 1); }
    }

    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else { setViewMonth(m => m + 1); }
    }

    function goToToday() {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
    }

    const days = getCalendarDays(viewYear, viewMonth);
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

    return (
    <div ref={containerRef} className="h-full w-full">
        {selectedDay ? (
            <DayDetailView
                isDarkMode={isDarkMode}
                selectedDay={selectedDay}
                onBack={() => setSelectedDay(null)}
                events={events}
                emptyDayMessage={emptyDayMessage}
                onRemoveEvent={removeEvent}
                showAddForm={showAddForm}
                onOpenAddForm={() => { setWidgetRect(containerRef.current?.getBoundingClientRect() ?? null); setShowAddForm(true); }}
                onEditEvent={openEditForm}
                scrollableClass={scrollableClass}
                formProps={{
                    editingEventId,
                    formTitle,
                    onTitleChange: setFormTitle,
                    formAllDay,
                    onAllDayToggle: () => setFormAllDay(v => !v),
                    formTime,
                    onTimeChange: setFormTime,
                    formColor,
                    onColorChange: setFormColor,
                    showColorPicker,
                    onPickerButtonClick: () => { setShowColorPicker(v => !v); setFormColor(localPickerColor); },
                    onColorPickerClose: () => setShowColorPicker(false),
                    localPickerColor,
                    onPickerColorChange: (c) => { setLocalPickerColor(c); setFormColor(c); },
                    onSubmit: submitForm,
                    onCancel: cancelForm,
                    anchorRect: widgetRect,
                }}
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

                <div className="grid grid-cols-7 text-center">
                    {WEEKDAYS.map(day => (
                        <div key={day} className="text-xs font-semibold py-1 text-white/70">{day}</div>
                    ))}
                </div>

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
                    })}
                </div>
            </div>
        </div>
        )}
    </div>
    );
}

export default CalendarWidget;
