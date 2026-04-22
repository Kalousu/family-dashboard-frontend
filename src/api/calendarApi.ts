import axiosInstance from "./axiosInstance";
import type { CalendarEvent } from "../widgets/calendar/calendarTypes";

function parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export const getCalendarEvents = async (widgetId: number): Promise<CalendarEvent[]> => {
    const response = await axiosInstance.get(`/api/widgets/calendar/${widgetId}`);
    return response.data.map((e: any) => ({ ...e, date: parseDate(e.date) }));
};

export const createCalendarEvent = async (widgetId: number, event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> => {
    const body = {
        title: event.title,
        date: formatDate(event.date),
        color: event.color,
        allDay: event.allDay,
        startTime: event.startTime ?? null,
    };
    const response = await axiosInstance.post(`/api/widgets/calendar/${widgetId}`, body);
    return { ...response.data, date: parseDate(response.data.date) };
};

export const updateCalendarEvent = async (eventId: number, event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> => {
    const body = {
        title: event.title,
        date: formatDate(event.date),
        color: event.color,
        allDay: event.allDay,
        startTime: event.startTime ?? null,
    };
    const response = await axiosInstance.put(`/api/widgets/calendar/${eventId}`, body);
    return { ...response.data, date: parseDate(response.data.date) };
};

export const deleteCalendarEvent = async (eventId: number): Promise<void> => {
    await axiosInstance.delete(`/api/widgets/calendar/${eventId}`);
};
