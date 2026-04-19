import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { CalendarEvent } from "../widgets/calendar/calendarTypes";
import { isSameDay } from "../widgets/calendar/calendarUtils";
import { DUMMY_EVENTS } from "../widgets/calendar/calendarMocks";

interface CalendarContextType {
    events: CalendarEvent[];
    addEvent: (event: CalendarEvent) => void;
    updateEvent: (updated: CalendarEvent) => void;
    removeEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

const MAX_EVENTS_PER_DAY = 100;

function CalendarProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<CalendarEvent[]>(DUMMY_EVENTS);

    function addEvent(event: CalendarEvent) {
        const eventsOnDay = events.filter(e => isSameDay(e.date, event.date));
        if (eventsOnDay.length >= MAX_EVENTS_PER_DAY) return;
        setEvents(prev => [...prev, event]);
    }

    function updateEvent(updated: CalendarEvent) {
        setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    }

    function removeEvent(id: string) {
        setEvents(prev => prev.filter(e => e.id !== id));
    }

    return (
        <CalendarContext.Provider value={{ events, addEvent, updateEvent, removeEvent }}>
            {children}
        </CalendarContext.Provider>
    );
}

export { CalendarProvider, CalendarContext };
export type { CalendarContextType };
