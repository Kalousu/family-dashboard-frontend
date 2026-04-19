import { Coffee, TvMinimalPlay, Sprout, SportShoe, CalendarFold } from "lucide-react";
import type { CalendarUser } from "./calendarTypes";

export type CalendarDay = {
    date: Date;
    isCurrentMonth: boolean;
};

export const DUMMY_USERS: CalendarUser[] = [
    { id: "11111111-1111-1111-1111-111111111111", username: "Kevin" },
    { id: "22222222-2222-2222-2222-222222222222", username: "Daniel" },
];

export const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export const MONTH_NAMES = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
];

export const DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

export const EMPTY_DAY_MESSAGES = [
    { text: "Keine Termine\nZeit für eine Pause", Icon: Coffee },
    { text: "Nichts geplant\nVerdächtig ruhig", Icon: TvMinimalPlay },
    { text: "Heute nichts geplant", Icon: Sprout },
    { text: "Freier Tag\nWas willst du heute machen?", Icon: SportShoe },
    { text: "Keine Termine für heute", Icon: CalendarFold },
];

export const COLOR_OPTIONS = [
    "hsl(0, 84%, 60%)",
    "hsl(38, 92%, 50%)",
    "hsl(160, 84%, 39%)",
    "hsl(217, 91%, 60%)",
    "hsl(258, 90%, 66%)",
    "hsl(289, 84%, 43%)",
];

export function getCalendarDays(year: number, month: number): CalendarDay[] {
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

export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}
