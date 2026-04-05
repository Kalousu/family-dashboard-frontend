import { useState } from "react"
import { MapPin, Wind } from "lucide-react"
import { useContainerSize } from "../../hooks/useContainerSize"

function WeatherWidget() {

    const { ref, width } = useContainerSize()
    const isCompact = width < 220

    const [weatherData, setWeatherData] = useState({
        temperature: 17,
        windSpeed: 9,
        weatherCode: 2,
        location: "Mannheim"
    })

    return(
        <div ref={ref} className="w-full h-full bg-linear-to-b from-sky-500/30 to-sky-200/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4">
            { isCompact ? (
                <div className="flex flex-col items-center justify-center m-4">
                    <p className="text-white text-center text-3xl font-bold">{weatherData.location}</p>
                    <p className="text-white text-center text-7xl font-semibold m-3">{weatherData.temperature}°C</p>   
                    <p className="text-white text-center text-xl font-bold">Wind: {weatherData.windSpeed} km/h</p>      
                </div> 
            ) : (
                <div>
                    <div className="flex flex-row items-center gap-2 mb-4">
                        <MapPin color="white" size={32} />
                        <p className="text-white text-center text-4xl font-bold">{weatherData.location}</p>
                    </div> 
                    <div className="flex flex-col items-center justify-center m-6">
                        <p className="text-white text-center text-7xl font-semibold m-8">{weatherData.temperature}°C</p>
                        <div className="flex flex-row items-center gap-2 mb-4">
                            <Wind color="white" size={32} />
                            <p className="text-white text-center text-xl font-bold">Wind: {weatherData.windSpeed} km/h</p>
                        </div>
                    </div>
                </div> 
            ) }
          
        </div>
    )
}

export default WeatherWidget;