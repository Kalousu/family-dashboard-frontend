import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Wind, Search } from "lucide-react"
import { useContainerSize } from "../../hooks/useContainerSize"
import { getWeatherGradient, getWeatherIcon } from "./WeatherMappings"
import { getWeather, searchCities } from "../../api/weatherApi"
import { updateWidgetConfig } from "../../api/widgetApi"
import type { GeoLocation, Daily } from "./weatherTypes"
import type { ChangeEvent } from "react"
import type { WidgetConfig } from "../../api/familyApi"

interface WeatherWidgetProps {
    widgetId: string
    config?: WidgetConfig
}

function WeatherWidget({ widgetId, config }: WeatherWidgetProps) {

    const { ref, height } = useContainerSize()
    const isCompact = height < 220
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    // Initialize from config if available
    const settings = config?.settings as Record<string, any> | undefined
    const initialCity = settings?.city as string || "Mannheim"
    const initialLat = settings?.latitude as number || 49.4891
    const initialLon = settings?.longitude as number || 8.46694
    const initialTimezone = settings?.timezone as string || "Europe/Berlin"
    
    const [inputCity, setInputCity] = useState(initialCity)
    const [searchResults, setSearchResults] = useState<GeoLocation[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [geoLocation, setGeoLocation] = useState<GeoLocation>({
        name: initialCity,
        latitude: initialLat,
        longitude: initialLon,
        country: "Deutschland",
        timezone: initialTimezone,
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setInputCity(e.target.value)
        const results = await searchCities(e.target.value)
        setSearchResults(results)
        setShowDropdown(true)
    }

    const handleLocationSelect = async (geo: GeoLocation) => {
        setGeoLocation(geo)
        setInputCity(geo.name)
        setShowDropdown(false)
        
        // Save config to backend
        try {
            const numericId = Number(widgetId)
            if (!isNaN(numericId)) {
                await updateWidgetConfig(numericId, {
                    title: config?.title || "Wetter App",
                    color: config?.color || "blue",
                    settings: {
                        city: geo.name,
                        latitude: geo.latitude,
                        longitude: geo.longitude,
                        timezone: geo.timezone
                    }
                })
            }
        } catch (error) {
            console.error("Failed to save widget config:", error)
        }
    }

    const isNight = new Date().getHours() >= 20 || new Date().getHours() < 6

    return (
        <div ref={ref} className={`relative w-full h-full flex flex-col overflow-hidden bg-linear-to-b ${getWeatherGradient(weatherData.weatherCode, isNight)} backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4`}>
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
                <div className="flex flex-col h-full min-h-0 flex-1">
                    <div className="relative flex flex-row items-center gap-2 mb-4 shrink-0">
                        <MapPin color="white" size={32} />
                        <div className="justify-between border-4 border-white/20 focus:outline-none focus:border-white/60 rounded-xl flex flex-row items-center gap-2 transition-all flex-1">
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
                        {showDropdown && searchResults.length > 0 && (
                            <div ref={dropdownRef} className="absolute left-10 right-0 top-full mt-1 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden z-50">
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
                    </div>
                    
                    <motion.div
                        className="flex flex-col flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2"
                        animate={{
                            opacity: showDropdown && searchResults.length > 0 ? 0 : 1,
                            y: showDropdown && searchResults.length > 0 ? 10 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center my-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center my-8">
                                <p className="text-white/80 text-center text-xl font-semibold">{error}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 gap-4 w-full">
                                <div className="flex flex-row items-center justify-center gap-2 shrink-0">
                                    <p className="text-white text-center text-6xl font-semibold leading-none">{weatherData.temperature}°C</p>
                                    <div className="shrink-0">
                                        {getWeatherIcon(weatherData.weatherCode, 70, isNight)}
                                    </div>
                                </div>
                                <div className="flex flex-row items-center justify-center gap-2 shrink-0">
                                    <Wind color="white" size={24} />
                                    <p className="text-white text-center text-lg font-bold">Wind: {weatherData.windSpeed} km/h</p>
                                </div>
                                {daily && (
                                    <div className="flex flex-col gap-2 w-full flex-grow">
                                        {daily.time.slice(0, 5).map((time, i) => {
                                            const date = new Date(time + "T12:00:00")
                                            const dayLabel = i === 0
                                                ? "Heute"
                                                : date.toLocaleDateString("de-DE", { weekday: "short" })
                                            return (
                                                <div key={time} className="flex flex-row items-center bg-white/10 rounded-xl px-4 py-2 flex-1 min-h-[40px]">
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
