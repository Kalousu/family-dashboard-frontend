export interface GeoLocation {
    name: string
    latitude: number
    longitude: number
    country: string
    timezone: string
    admin1: string
}

export interface Current {
    temperature_2m: number
    wind_speed_10m: number
    weather_code: number
}

export interface WeatherResponse {
    current: Current
}