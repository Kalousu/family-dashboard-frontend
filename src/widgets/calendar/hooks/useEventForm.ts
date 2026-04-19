import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { CalendarEvent } from "../calendarTypes";
import { COLOR_OPTIONS } from "../calendarUtils";

interface UseEventFormOptions {
    events: CalendarEvent[];
    addEvent: (event: CalendarEvent) => void;
    updateEvent: (event: CalendarEvent) => void;
    selectedDay: Date | null;
    containerRef: RefObject<HTMLDivElement | null>;
}

export function useEventForm({ events, addEvent, updateEvent, selectedDay, containerRef }: UseEventFormOptions) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formAllDay, setFormAllDay] = useState(false);
    const [formTime, setFormTime] = useState("12:00");
    const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [localPickerColor, setLocalPickerColor] = useState("hsl(252, 91%, 55%)");
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
    const [widgetRect, setWidgetRect] = useState<DOMRect | null>(null);

    const savedAddForm = useRef({ title: "", allDay: false, time: "12:00", color: COLOR_OPTIONS[0] });
    const savedEditForms = useRef<Map<string, { title: string; allDay: boolean; time: string; color: string }>>(new Map());

    useEffect(() => {
        if (!showColorPicker) return;
        function handleClose() { setShowColorPicker(false); }
        document.addEventListener("mousedown", handleClose);
        return () => document.removeEventListener("mousedown", handleClose);
    }, [showColorPicker]);

    function openAddForm() {
        setWidgetRect(containerRef.current?.getBoundingClientRect() ?? null);
        setShowAddForm(true);
    }

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

    function toggleAllDay() { setFormAllDay(v => !v); }
    function toggleColorPicker() { setShowColorPicker(v => !v); setFormColor(localPickerColor); }
    function closeColorPicker() { setShowColorPicker(false); }
    function changePickerColor(c: string) { setLocalPickerColor(c); setFormColor(c); }

    return {
        showAddForm,
        formTitle, setFormTitle,
        formAllDay,
        formTime, setFormTime,
        formColor, setFormColor,
        showColorPicker,
        localPickerColor,
        editingEventId,
        widgetRect,
        openAddForm,
        openEditForm,
        submitForm,
        cancelForm,
        toggleAllDay,
        toggleColorPicker,
        closeColorPicker,
        changePickerColor,
    };
}
