import { getWidget } from './widgets/WidgetRegistry'
import ProfileCard from './components/ProfileCard'

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
    <ProfileCard name="Kevin" color="blue" image="https://cdn.discordapp.com/attachments/887358855372242975/1489658243469938729/image.png?ex=69d137d9&is=69cfe659&hm=967d1f4fcbd31d3c6c357d93754d1ddf2416b11b38a21339e3a6b6c1a810c343&" onSelect={() => alert("Profile selected")} />
    </>
  )
}

export default App