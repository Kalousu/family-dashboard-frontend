import WeatherWidget from "./weather/WeatherWidget";
import CalendarWidget from "./calendar/CalendarWidget";

const registry: Record<string, React.ComponentType<any>> = {}

const registerWidget = (name: string, component: React.ComponentType) => {
    registry[name] = component
}

registerWidget("weather", WeatherWidget);
registerWidget("calendar", CalendarWidget);

export const getWidget = (name: string) => {
    return registry[name]
}