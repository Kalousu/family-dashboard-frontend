import axiosInstance from "./axiosInstance"
import type { GeoLocation, WeatherResponse } from "../widgets/weather/weatherTypes"

export const searchCities = async (city: string): Promise<GeoLocation[]> => {
    const response = await axiosInstance.get("/api/weather/search", {
        params: { city }
    })
    return response.data
}

export const getWeather = async (latitude: number, longitude: number, timezone: string): Promise<WeatherResponse> => {
    const response = await axiosInstance.get("/api/weather", {
        params: { latitude, longitude, timezone }
    })
    return response.data
}