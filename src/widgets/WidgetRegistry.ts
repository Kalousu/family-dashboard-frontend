import WeatherWidget from "./weather/WeatherWidget";
import CalendarWidget from "./calendar/CalendarWidget";
import TimetableWidget from "./timetable/TimetableWidget";
import ToDoWidget from "./toDo/toDoWidget";

const registry: Record<string, React.ComponentType<any>> = {}

const registerWidget = (name: string, component: React.ComponentType) => {
    registry[name] = component
}

registerWidget("weather", WeatherWidget);
registerWidget("calendar", CalendarWidget);
registerWidget("timetable", TimetableWidget);
registerWidget("todo", ToDoWidget);

export const getWidget = (name: string) => {
    return registry[name]
}