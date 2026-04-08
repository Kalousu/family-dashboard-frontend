import WeatherWidget from "./weather/WeatherWidget";
import CalendarWidget from "./calendar/CalendarWidget";
import ToDoWidget from "./toDo/toDoWidget";

const registry: Record<string, React.ComponentType<any>> = {}

const registerWidget = (name: string, component: React.ComponentType) => {
    registry[name] = component
}

registerWidget("weather", WeatherWidget);
registerWidget("calendar", CalendarWidget);
registerWidget("todo", ToDoWidget);

export const getWidget = (name: string) => {
    return registry[name]
}