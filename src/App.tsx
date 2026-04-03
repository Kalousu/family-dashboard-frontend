import { getWidget } from './widgets/WidgetRegistry'
import ProfileSelectPage from './pages/ProfileSelectPage'
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
      <ProfileSelectPage />
    </>
  )
}

export default App