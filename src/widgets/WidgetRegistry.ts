import WeatherWidget from "./weather/WeatherWidget";
import CalendarWidget from "./calendar/CalendarWidget";

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
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 1 },
    { colSpan: 2, rowSpan: 2 },
]);

registerWidget("calendar", CalendarWidget, [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 3, rowSpan: 2 },
]);

export const getWidget = (name: string) => {
    return registry[name]?.component
}

export const getWidgetSizes = (name: string) => {
    return registry[name]?.sizes || []
}

export default registry