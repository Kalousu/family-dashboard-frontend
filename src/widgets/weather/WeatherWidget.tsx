import { useEffect, useState } from "react"
import { MapPin, Wind, Search } from "lucide-react"
import { useContainerSize } from "../../hooks/useContainerSize"
import { getWeatherGradient, getWeatherIcon } from "./weatherMappings"
import type { KeyboardEvent } from "react"

function WeatherWidget() {

    const { ref, width } = useContainerSize()
    const isCompact = width < 220
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [city, setCity] = useState("Mannheim")
    const [inputCity, setInputCity] = useState("Mannheim")

    const [weatherData, setWeatherData] = useState({
        temperature: 0,
        windSpeed: 0,
        weatherCode: 0,
    })

    useEffect(() => {
        const fetchWeatherData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch(`http://localhost:8080/api/weather?city=${city}`)
                if (!response.ok) {
                    throw new Error("Wetterdaten konnten nicht geladen werden.")
                }

                const data = await response.json()
                setWeatherData({
                    temperature: data.current.temperature_2m,
                    windSpeed: data.current.wind_speed_10m,
                    weatherCode: data.current.weather_code,
                })
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unbekannter Fehler")
            } finally {
                setIsLoading(false)
            }
        }
        fetchWeatherData()
    }, [city])

    const handleSearch = () => {
        setCity(inputCity)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch()
        }
    }

    return(
        <div ref={ref} className={`w-full h-full bg-linear-to-b ${getWeatherGradient(weatherData.weatherCode)} backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4`}>
            { isCompact ? (
                <div className="flex flex-col items-center justify-center m-4">
                    <div className="border-4 border-white/20 focus:outline-none focus:border-white/60 rounded-xl flex flex-row items-center gap-2 transition-all">
                        <input 
                            value={inputCity} 
                            onChange={(e) => setInputCity(e.target.value)} 
                            onKeyDown={handleKeyDown}
                            className="bg-transparent text-white placeholder:text-white/50 transition-all p-3 text-xl font-bold w-full max-w-xs focus:outline-none rounded-xl "
                            placeholder="Stadt eingeben..."
                        />
                    </div>
                    <p className="text-white text-center text-7xl font-semibold m-3">{weatherData.temperature}°C</p>   
                    <p className="text-white text-center text-xl font-bold">Wind: {weatherData.windSpeed} km/h</p>      
                </div> 
            ) : (
                <div>
                    <div className="flex flex-row items-center gap-2 mb-4">
                        <MapPin color="white" size={32} />
                        <div className="border-4 border-white/20 focus:outline-none focus:border-white/60 rounded-xl flex flex-row items-center gap-2 transition-all">
                            <input 
                                value={inputCity} 
                                onChange={(e) => setInputCity(e.target.value)} 
                                onKeyDown={handleKeyDown}
                                className="bg-transparent text-white placeholder:text-white/50 transition-all p-3 text-3xl font-bold w-full max-w-xs focus:outline-none rounded-xl "
                                placeholder="Stadt eingeben..."
                            />
                            <button onClick={handleSearch} className="p-3 rounded-xl transition-all cursor-pointer focus:outline-none">
                                <Search color="white" size={32} />
                            </button>
                        </div>
                    </div> 
                    <div className="flex flex-col items-center justify-center m-6 transition-all">
                        {isLoading ? (
                            <div className="flex items-center justify-center m-8 mb-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center m-8 mb-12">
                                <p className="text-white/80 text-center text-xl font-semibold">{error}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="flex flex-row items-center justify-center gap-2 m-6">
                                    <p className="text-white text-center text-7xl font-semibold mr-4 leading-none transition-transform">{weatherData.temperature}°C</p>
                                    <div className="mt-2">
                                        {getWeatherIcon(weatherData.weatherCode, 80)}
                                    </div>
                                </div>   
                                <div className="flex flex-row items-center gap-2 mb-4">
                                    <Wind color="white" size={32} />
                                    <p className="text-white text-center text-xl font-bold">Wind: {weatherData.windSpeed} km/h</p>
                                </div>
                                <div>
                                    {/* Platzhalter für Tagesvorhersage I guess */}
                                </div>   
                            </div>                     
                        )}
                    </div>
                </div>
             ) }
        </div>
    )
}
export default WeatherWidget;