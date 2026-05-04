import type { ComponentType } from "react"
import type { WidgetConfig } from "../api/familyApi"
import WeatherWidget from "./weather/WeatherWidget";
import CalendarWidget from "./calendar/CalendarWidget";
import TimetableWidget from "./timetable/TimetableWidget";
import ToDoWidget from "./toDo/TodoWidget";
import MemeWidget from "./meme/MemeWidget";
import PictureWidget from "./picture/PictureWidget";

interface WidgetSize {
    colSpan: number
    rowSpan: number
}

export interface BaseWidgetProps {
    widgetId: string
    config?: WidgetConfig
}

interface WidgetEntry {
    component: ComponentType<BaseWidgetProps>
    sizes: WidgetSize[]
}

const registry: Record<string, WidgetEntry> = {}

const registerWidget = (name: string, component: ComponentType<BaseWidgetProps>, sizes: WidgetSize[]) => {
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
    { colSpan: 2, rowSpan: 3 },
    { colSpan: 3, rowSpan: 4 },
    { colSpan: 4, rowSpan: 3 },
    { colSpan: 4, rowSpan: 4 },
    { colSpan: 5, rowSpan: 4 },
]);

registerWidget("todo", ToDoWidget, [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 3, rowSpan: 3 },
    { colSpan: 3, rowSpan: 4 },
]);

registerWidget("meme", MemeWidget, [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 3, rowSpan: 3 },
])

registerWidget("picture", PictureWidget, [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 2, rowSpan: 3 },
    { colSpan: 3, rowSpan: 3 },
])

export const getWidget = (name: string) => {
    return registry[name]?.component
}

export const getWidgetSizes = (name: string) => {
    return registry[name]?.sizes || []
}

export default registry