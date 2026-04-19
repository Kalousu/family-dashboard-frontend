import type { CalendarUser, CalendarEvent } from "./calendarTypes";

export const DUMMY_USERS: CalendarUser[] = [
    { id: "11111111-1111-1111-1111-111111111111", username: "Kevin" },
    { id: "22222222-2222-2222-2222-222222222222", username: "Daniel" },
];

const today = new Date();
const month = today.getMonth();

export const DUMMY_EVENTS: CalendarEvent[] = [
    { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", title: "Arzttermin", date: new Date(today.getFullYear(), month, 5), color: "hsl(0, 84%, 60%)", allDay: false, startTime: "10:00", userId: "11111111-1111-1111-1111-111111111111" },
    { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", title: "Geburtstag Papa", date: new Date(today.getFullYear(), month, 5), color: "hsl(38, 92%, 50%)", allDay: true, userId: "22222222-2222-2222-2222-222222222222" },
    { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", title: "Elternabend", date: new Date(today.getFullYear(), month, 12), color: "hsl(217, 91%, 60%)", allDay: false, startTime: "19:30", userId: "11111111-1111-1111-1111-111111111111" },
    { id: "d4e5f6a7-b8c9-0123-defa-234567890123", title: "Urlaub", date: new Date(today.getFullYear(), month, 20), color: "hsl(160, 84%, 39%)", allDay: true, userId: "22222222-2222-2222-2222-222222222222" },
    { id: "e5f6a7b8-c9d0-1234-efab-345678901234", title: "Zahnarzt", date: new Date(today.getFullYear(), month, 20), color: "hsl(0, 84%, 60%)", allDay: false, startTime: "14:00", userId: "11111111-1111-1111-1111-111111111111" },
    { id: "f6a7b8c9-d0e1-2345-fabc-456789012345", title: "Sport", date: new Date(today.getFullYear(), month, 20), color: "hsl(258, 90%, 66%)", allDay: false, startTime: "18:00", userId: "22222222-2222-2222-2222-222222222222" },
    { id: "b8c9d0e1-f2a3-4567-bcde-678901234567", title: "Programmieren", date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), color: "hsl(10, 100%, 62%)", allDay: false, startTime: "11:00", userId: "11111111-1111-1111-1111-111111111111" },
];
