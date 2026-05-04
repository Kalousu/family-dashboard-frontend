import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Wind } from "lucide-react"
import { useContainerSize } from "../../hooks/useContainerSize"
import { getWeatherGradient, getWeatherIcon } from "./WeatherMappings"
import { getWeather, searchCities } from "../../api/weatherApi"
import { updateWidgetConfig } from "../../api/widgetApi"
import type { GeoLocation, Daily } from "./weatherTypes"
import type { ChangeEvent } from "react"
import type { WidgetConfig } from "../../api/familyApi"
import { DEFAULT_WEATHER, NIGHT_START_HOUR, NIGHT_END_HOUR } from "../../constants/config"
import { LocationSearch } from "./LocationSearch"

interface WeatherSettings {
    city?: string
    latitude?: number
    longitude?: number
    timezone?: string
}

interface WeatherWidgetProps {
    widgetId: string
    config?: WidgetConfig
}

function WeatherWidget({ widgetId, config }: WeatherWidgetProps) {

    const { ref, height, width } = useContainerSize()
    const isCompact = height < 220 || width < 200
    const isMediumCompact = isCompact && height >= 220 && width < 200
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const settings = config?.settings as WeatherSettings | undefined
    const initialCity = settings?.city ?? DEFAULT_WEATHER.city
    const initialLat = settings?.latitude ?? DEFAULT_WEATHER.latitude
    const initialLon = settings?.longitude ?? DEFAULT_WEATHER.longitude
    const initialTimezone = settings?.timezone ?? DEFAULT_WEATHER.timezone
    
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

    const currentHour = new Date().getHours()
    const isNight = currentHour >= NIGHT_START_HOUR || currentHour < NIGHT_END_HOUR

    return (
        <div ref={ref} className={`relative w-full h-full flex flex-col overflow-hidden bg-linear-to-b ${getWeatherGradient(weatherData.weatherCode, isNight)} backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4`}>
            {isMediumCompact ? (
                <div className="h-full flex flex-col gap-2">
                    <LocationSearch
                        inputCity={inputCity}
                        searchResults={searchResults}
                        showDropdown={showDropdown}
                        compact
                        onInputChange={handleInputChange}
                        onLocationSelect={handleLocationSelect}
                    />
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white" />
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-white/80 text-center text-xs font-semibold">{error}</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 min-h-0">
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-white text-3xl font-semibold leading-none">{weatherData.temperature}°C</p>
                                {getWeatherIcon(weatherData.weatherCode, 32, isNight)}
                            </div>
                            <div className="flex items-center gap-1">
                                <Wind color="white" size={14} />
                                <p className="text-white text-xs font-bold">{weatherData.windSpeed} km/h</p>
                            </div>
                            {height >= 380 && daily && (
                                <div className="flex flex-col gap-1 w-full mt-1">
                                    {daily.time.slice(0, 3).map((time, i) => {
                                        const date = new Date(time + "T12:00:00")
                                        const dayLabel = i === 0 ? "Heute" : date.toLocaleDateString("de-DE", { weekday: "short" })
                                        return (
                                            <div key={time} className="flex flex-row items-center bg-white/10 rounded-lg px-2 py-1.5">
                                                <p className="text-white/80 text-xs font-semibold w-10">{dayLabel}</p>
                                                {getWeatherIcon(daily.weathercode[i], 16, isNight)}
                                                <p className="text-white text-xs font-bold ml-auto">{daily.temperature_2m_max[i]}°C</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : isCompact ? (
                <div className="h-full flex flex-col justify-between">
                    <LocationSearch
                        inputCity={inputCity}
                        searchResults={searchResults}
                        showDropdown={showDropdown}
                        compact
                        onInputChange={handleInputChange}
                        onLocationSelect={handleLocationSelect}
                    />
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white" />
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-white/80 text-center text-xs font-semibold">{error}</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-row items-center justify-center gap-2">
                            <p className="text-white text-3xl font-semibold leading-none">{weatherData.temperature}°C</p>
                            {getWeatherIcon(weatherData.weatherCode, 32, isNight)}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col h-full min-h-0 flex-1">
                    <div className="relative flex flex-row items-center gap-2">
                        <MapPin color="white" size={32} />
                        <LocationSearch
                            inputCity={inputCity}
                            searchResults={searchResults}
                            showDropdown={showDropdown}
                            dropdownRef={dropdownRef}
                            onInputChange={handleInputChange}
                            onLocationSelect={handleLocationSelect}
                        />
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
            <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-1 right-2 text-white/30 hover:text-white/60 transition-colors"
                style={{ fontSize: "9px", lineHeight: 1 }}
            >
                open-meteo.com
            </a>
        </div>
    )
}

export default WeatherWidget
