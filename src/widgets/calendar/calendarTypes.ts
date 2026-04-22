export type CalendarEvent = {
    id: number;
    title: string;
    date: Date;
    color: string;
    allDay: boolean;
    startTime?: string;
};
