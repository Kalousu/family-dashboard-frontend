import WeatherWidget from "./weather/WeatherWidget";
import CalendarWidget from "./calendar/CalendarWidget";
import TimetableWidget from "./timetable/TimetableWidget";
import ToDoWidget from "./toDo/ToDoWidget";
import MemeWidget from "./meme/MemeWidget";

interface WidgetSize {
    colSpan: number
    rowSpan: number
}

interface WidgetEntry {
    component: React.ComponentType<any>
    sizes: WidgetSize[]
}

const registry: Record<string, WidgetEntry> = {}

const registerWidget = (name: string, component: React.ComponentType, sizes: WidgetSize[]) => {
    registry[name] = { component, sizes }
}

registerWidget("weather", WeatherWidget, [
    { colSpan: 2, rowSpan: 1 },
    { colSpan: 2, rowSpan: 3 },
    { colSpan: 3, rowSpan: 4 },
]);

registerWidget("calendar", CalendarWidget, [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 3, rowSpan: 2 },
    {colSpan: 3, rowSpan: 3},
    {colSpan: 3, rowSpan: 4},
]);

registerWidget("timetable", TimetableWidget, [
    { colSpan: 3, rowSpan: 4 },
    { colSpan: 4, rowSpan: 3 },
    { colSpan: 4, rowSpan: 4 },
    { colSpan: 5, rowSpan: 4 },
]);

registerWidget("todo", ToDoWidget, [
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 3, rowSpan: 3 },
]);

registerWidget("meme", MemeWidget, [
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 3, rowSpan: 3 },
])

export const getWidget = (name: string) => {
    return registry[name]?.component
}

export const getWidgetSizes = (name: string) => {
    return registry[name]?.sizes || []
}

export default registry