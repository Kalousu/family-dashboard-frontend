import { useEffect, useState } from "react"
import { MapPin, Wind, Search } from "lucide-react"
import { useContainerSize } from "../../hooks/useContainerSize"
import { getWeatherGradient, getWeatherIcon } from "./weatherMappings"
import { fetchApi } from "../../services/api"
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
                // 1. Search for city to get coordinates
                const locations = await fetchApi<any[]>(`/api/weather/search?city=${city}`, 'GET')
                
                if (!locations || locations.length === 0) {
                    throw new Error("Stadt nicht gefunden")
                }
                
                const location = locations[0]
                
                // 2. Get weather data with coordinates
                const data = await fetchApi<any>(
                    `/api/weather?latitude=${location.latitude}&longitude=${location.longitude}&timezone=${encodeURIComponent(location.timezone)}`,
                    'GET'
                )
                
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
        <div ref={ref} className={`w-full h-full bg-linear-to-b ${getWeatherGradient(weatherData.weatherCode)} backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 overflow-hidden`}>
            { isCompact ? (
                <div className="flex flex-col items-center justify-center h-full px-2">
                    <div className="border-4 border-white/20 focus:outline-none focus:border-white/60 rounded-xl flex flex-row items-center gap-2 transition-all w-full max-w-[200px] mb-4">
                        <input 
                            value={inputCity} 
                            onChange={(e) => setInputCity(e.target.value)} 
                            onKeyDown={handleKeyDown}
                            className="bg-transparent text-white placeholder:text-white/50 transition-all p-2 text-base font-bold w-full focus:outline-none rounded-xl"
                            placeholder="Stadt..."
                        />
                    </div>
                    <p className="text-white text-center text-5xl font-semibold mb-2 leading-none">{weatherData.temperature}°C</p>   
                    <p className="text-white text-center text-sm font-bold">Wind: {weatherData.windSpeed} km/h</p>      
                </div> 
            ) : (
                <div className="h-full flex flex-col">
                    <div className="flex flex-row items-center gap-2 mb-4">
                        <MapPin color="white" size={24} className="flex-shrink-0" />
                        <div className="border-4 border-white/20 focus:outline-none focus:border-white/60 rounded-xl flex flex-row items-center gap-2 transition-all flex-1 min-w-0">
                            <input 
                                value={inputCity} 
                                onChange={(e) => setInputCity(e.target.value)} 
                                onKeyDown={handleKeyDown}
                                className="bg-transparent text-white placeholder:text-white/50 transition-all p-2 text-xl font-bold w-full focus:outline-none rounded-xl min-w-0"
                                placeholder="Stadt..."
                            />
                            <button onClick={handleSearch} className="p-2 rounded-xl transition-all cursor-pointer focus:outline-none flex-shrink-0">
                                <Search color="white" size={24} />
                            </button>
                        </div>
                    </div> 
                    <div className="flex flex-col items-center justify-center flex-1 transition-all">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center px-4">
                                <p className="text-white/80 text-center text-lg font-semibold">{error}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="flex flex-row items-center justify-center gap-4">
                                    <p className="text-white text-center text-6xl font-semibold leading-none transition-transform">{weatherData.temperature}°C</p>
                                    <div>
                                        {getWeatherIcon(weatherData.weatherCode, 64)}
                                    </div>
                                </div>   
                                <div className="flex flex-row items-center gap-2">
                                    <Wind color="white" size={24} />
                                    <p className="text-white text-center text-lg font-bold">Wind: {weatherData.windSpeed} km/h</p>
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
