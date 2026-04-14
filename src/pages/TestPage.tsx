import { getWeatherGradient, getWeatherIcon } from "../widgets/weather/weatherMappings"

const WEATHER_CODES = [0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 77, 80, 81, 82, 95, 96, 99]

function WeatherCodeCard({ code, isNight }: { code: number; isNight: boolean }) {
    return (
        <div className={`bg-linear-to-b ${getWeatherGradient(code, isNight)} rounded-2xl border border-white/20 p-4 flex flex-col items-center gap-2 w-32 h-32 justify-center`}>
            {getWeatherIcon(code, 36, isNight)}
            <span className="text-white text-sm font-bold">Code {code}</span>
        </div>
    )
}

function TestPage() {
    return (
        <div className="min-h-screen bg-gray-900 p-8 flex flex-col gap-8">
            <div>
                <h2 className="text-white text-xl font-bold mb-4">☀️ Tag</h2>
                <div className="flex flex-wrap gap-4">
                    {WEATHER_CODES.map(code => (
                        <WeatherCodeCard key={code} code={code} isNight={false} />
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-white text-xl font-bold mb-4">🌙 Nacht</h2>
                <div className="flex flex-wrap gap-4">
                    {WEATHER_CODES.map(code => (
                        <WeatherCodeCard key={code} code={code} isNight={true} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TestPage