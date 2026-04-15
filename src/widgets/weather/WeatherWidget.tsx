import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Wind, Search } from "lucide-react"
import { useContainerSize } from "../../hooks/useContainerSize"
import { getWeatherGradient, getWeatherIcon } from "./weatherMappings"
import { getWeather, searchCities } from "../../api/weatherApi"
import type { GeoLocation, Daily } from "./weatherTypes"
import type { ChangeEvent } from "react"

function WeatherWidget() {

    const { ref, height } = useContainerSize()
    const isCompact = height < 220
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [inputCity, setInputCity] = useState("Mannheim")
    const [searchResults, setSearchResults] = useState<GeoLocation[]>([])
    const [showDropdown, setShowDropdown] = useState(false)

    const [geoLocation, setGeoLocation] = useState<GeoLocation>({
        name: "Mannheim",
        latitude: 49.4891,
        longitude: 8.46694,
        country: "Deutschland",
        timezone: "Europe/Berlin",
        admin1: "Baden-Württemberg"
    })

    const [weatherData, setWeatherData] = useState({
        temperature: 0,
        windSpeed: 0,
        weatherCode: 0,
    })

    const [daily, setDaily] = useState<Daily | null>(null)

    useEffect(() => {
        const fetchWeatherData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const data = await getWeather(geoLocation.latitude, geoLocation.longitude, geoLocation.timezone)
                setWeatherData({
                    temperature: data.current.temperature_2m,
                    windSpeed: data.current.wind_speed_10m,
                    weatherCode: data.current.weather_code,
                })
                setDaily(data.daily)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unbekannter Fehler")
            } finally {
                setIsLoading(false)
            }
        }
        fetchWeatherData()
    }, [geoLocation])

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setInputCity(e.target.value)
        const results = await searchCities(e.target.value)
        setSearchResults(results)
        setShowDropdown(true)
    }

    const handleLocationSelect = (geo: GeoLocation) => {
        setGeoLocation(geo)
        setInputCity(geo.name)
        setShowDropdown(false)
    }

    const isNight = new Date().getHours() >= 20 || new Date().getHours() < 6

    return (
        <div ref={ref} className={`relative w-full h-full bg-linear-to-b ${getWeatherGradient(weatherData.weatherCode, isNight)} backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4`}>
            {isCompact ? (
                <div className="h-full flex flex-col justify-between">
                    <div className="relative w-full">
                        <div className="border-2 border-white/20 focus-within:border-white/60 rounded-xl flex flex-row items-center transition-all">
                            <input
                                value={inputCity}
                                onChange={handleInputChange}
                                className="bg-transparent text-white placeholder:text-white/50 transition-all px-2 py-1.5 text-sm font-bold w-full focus:outline-none rounded-xl"
                                placeholder="Stadt..."
                            />
                        </div>
                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden z-50 mt-1">
                                {searchResults.map((geo) =>
                                    <div
                                        key={geo.latitude + "-" + geo.longitude}
                                        onClick={() => handleLocationSelect(geo)}
                                        className="px-3 py-1.5 text-white text-xs cursor-pointer hover:bg-white/30"
                                    >
                                        {geo.name}, {geo.admin1}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-white/80 text-center text-xs font-semibold">{error}</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-row items-center justify-center gap-2">
                            <p className="text-white text-4xl font-semibold leading-none">{weatherData.temperature}°C</p>
                            {getWeatherIcon(weatherData.weatherCode, 40, isNight)}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="flex flex-row items-center gap-2 mb-4">
                        <MapPin color="white" size={32} />
                        <div className="border-4 border-white/20 focus:outline-none focus:border-white/60 rounded-xl flex flex-row items-center gap-2 transition-all">
                            <input
                                value={inputCity}
                                onChange={handleInputChange}
                                className="bg-transparent text-white placeholder:text-white/50 transition-all p-3 text-3xl font-bold w-full max-w-xs focus:outline-none rounded-xl"
                                placeholder="Stadt eingeben..."
                            />
                            <button
                                onClick={() => setShowDropdown(true)}
                                className="p-3 rounded-xl transition-all cursor-pointer focus:outline-none"
                            >
                                <Search color="white" size={32} />
                            </button>
                        </div>
                    </div>
                    {showDropdown && searchResults.length > 0 && (
                        <div className="absolute left-4 right-4 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden z-50">
                            {searchResults.map((geo) =>
                                <div
                                    key={geo.latitude + "-" + geo.longitude}
                                    onClick={() => handleLocationSelect(geo)}
                                    className="px-4 py-2 text-white cursor-pointer hover:bg-white/30"
                                >
                                    {geo.name}, {geo.admin1}, {geo.country}
                                </div>
                            )}
                        </div>
                    )}
                    <motion.div
                        className="flex flex-col items-center justify-center m-6"
                        animate={{
                            opacity: showDropdown && searchResults.length > 0 ? 0 : 1,
                            y: showDropdown && searchResults.length > 0 ? 10 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
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
                                        {getWeatherIcon(weatherData.weatherCode, 80, isNight)}
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-2 mb-4">
                                    <Wind color="white" size={32} />
                                    <p className="text-white text-center text-xl font-bold">Wind: {weatherData.windSpeed} km/h</p>
                                </div>
                                {daily && (
                                    <div className="flex flex-col gap-2 w-full mt-2">
                                        {daily.time.slice(0, 5).map((time, i) => {
                                            const date = new Date(time + "T12:00:00")
                                            const dayLabel = i === 0
                                                ? "Heute"
                                                : date.toLocaleDateString("de-DE", { weekday: "short" })
                                            return (
                                                <div key={time} className="flex flex-row items-center bg-white/10 rounded-xl px-4 py-2">
                                                    <p className="text-white/80 text-sm font-semibold w-12">{dayLabel}</p>
                                                    {getWeatherIcon(daily.weathercode[i], 24, isNight)}
                                                    <p className="text-white text-sm font-bold ml-auto">{daily.temperature_2m_max[i]}°C</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default WeatherWidget
