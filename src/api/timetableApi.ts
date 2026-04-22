import axiosInstance from "./axiosInstance";
import type { TimetableEvent, Reminder, TimetableData } from "../widgets/timetable/timetableTypes";

export const getTimetable = async (widgetId: number): Promise<TimetableData> => {
    const response = await axiosInstance.get(`/api/widgets/timetable/${widgetId}`);
    return response.data;
};

export const createTimetableEvent = async (
    widgetId: number,
    body: { title: string; slot: number; day: number; userId: number }
): Promise<TimetableEvent> => {
    const response = await axiosInstance.post(`/api/widgets/timetable/${widgetId}/events`, body);
    return response.data;
};

export const deleteTimetableEvent = async (widgetId: number, eventId: number): Promise<void> => {
    await axiosInstance.delete(`/api/widgets/timetable/${widgetId}/events/${eventId}`);
};

export const createTimetableReminder = async (
    widgetId: number,
    body: { day: number; text: string }
): Promise<Reminder> => {
    const response = await axiosInstance.post(`/api/widgets/timetable/${widgetId}/reminders`, body);
    return response.data;
};

export const deleteTimetableReminder = async (widgetId: number, reminderId: number): Promise<void> => {
    await axiosInstance.delete(`/api/widgets/timetable/${widgetId}/reminders/${reminderId}`);
};

export const updateWatchedUsers = async (widgetId: number, userIds: number[]): Promise<void> => {
    await axiosInstance.put(`/api/widgets/timetable/${widgetId}/watched-users`, { userIds });
};
