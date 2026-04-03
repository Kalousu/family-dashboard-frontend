import { getWidget } from './widgets/WidgetRegistry'

const ComponentWeather = getWidget("weather");
const ComponentCalendar = getWidget("calendar");

function App() {
  if (!ComponentWeather) {
    return <div>Widget not found</div>;
  }

  if(!ComponentCalendar){
    return <div>Scheiße nicht gefunden</div>;
  }

  return (
    <>
    <ComponentWeather />
    <ComponentWeather />
    <ComponentWeather />
    <ComponentCalendar />
    </>
  )
}

export default App