export type CalendarUser = {
    id: string;
    username: string;
};

export type CalendarEvent = {
    id: string;
    title: string;
    date: Date;
    color: string;
    allDay: boolean;
    startTime?: string;
    userId: string;
};
