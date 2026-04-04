import { getWidget } from './widgets/WidgetRegistry'
import ProfileSelectPage from './pages/ProfileSelectPage'
import RegisterPage from './pages/RegisterPage';
const ComponentWeather = getWidget("weather");
const ComponentCalendar = getWidget("calendar");

function App() {
  if (!ComponentWeather) {
    return <div>Widget not found</div>;
  }

  if(!ComponentCalendar){
    return <div>Scheiße nicht gefunden</div>;
  }

  if(!ProfileSelectPage){
    return <div>ProfileSelectPage nicht gefunden</div>;
  }

  if(!RegisterPage){
    return <div>RegisterPage nicht gefunden</div>
  }

  return (
    <>
      <RegisterPage />
    </>
  )
}

export default App