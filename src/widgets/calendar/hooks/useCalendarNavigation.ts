import { useState } from "react";

export function useCalendarNavigation(today: Date) {
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

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

    return { viewYear, viewMonth, prevMonth, nextMonth, goToToday };
}
