import { useState } from "react";
import type { CalendarEvent } from "./calendarTypes";
import { COLOR_OPTIONS } from "./calendarUtils";

interface UseEventFormOptions {
    events: CalendarEvent[];
    addEvent: (event: CalendarEvent) => void;
    updateEvent: (event: CalendarEvent) => void;
    selectedDay: Date | null;
}

export function useEventForm({ events, addEvent, updateEvent, selectedDay }: UseEventFormOptions) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [formAllDay, setFormAllDay] = useState(false);
    const [formTime, setFormTime] = useState("12:00");
    const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [localPickerColor, setLocalPickerColor] = useState("hsl(252, 91%, 55%)");
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    function openAddForm() {
        setShowAddForm(true);
    }

    function openEditForm(event: CalendarEvent) {
        setFormTitle(event.title);
        setFormAllDay(event.allDay);
        setFormTime(event.startTime ?? "12:00");
        setFormColor(event.color);
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
        setFormTitle("");
        setFormAllDay(false);
        setFormTime("12:00");
        setFormColor(COLOR_OPTIONS[0]);
        setEditingEventId(null);
        setShowAddForm(false);
    }

    function cancelForm() {
        setShowAddForm(false);
        setEditingEventId(null);
        setFormTitle("");
        setFormAllDay(false);
        setFormTime("12:00");
        setFormColor(COLOR_OPTIONS[0]);
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
