import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle, CloudSun } from "lucide-react"

export function getWeatherIcon(code: number, size: number = 48) {
    const props = { color: "white", size }
    if (code === 0) return <Sun {...props} />
    if (code <= 2) return <CloudSun {...props} />
    if (code === 3) return <Cloud {...props} />
    if (code === 45 || code === 48) return <CloudFog {...props} />
    if (code >= 51 && code <= 55) return <CloudDrizzle {...props} />
    if (code >= 61 && code <= 65) return <CloudRain {...props} />
    if (code >= 71 && code <= 77) return <CloudSnow {...props} />
    if (code >= 80 && code <= 82) return <CloudRain {...props} />
    if (code >= 95 && code <= 99) return <CloudLightning {...props} />
    return <Cloud {...props} />
}

export function getWeatherGradient(code: number): string {
    if (code === 0) return "from-blue-400/30 to-yellow-200/30"
    if (code <= 2) return "from-sky-500/30 to-sky-200/30"
    if (code === 3) return "from-slate-500/40 to-slate-300/30"
    if (code === 45 || code === 48) return "from-gray-500/30 to-gray-300/30"
    if (code >= 51 && code <= 55) return "from-gray-500/30 to-blue-300/30"
    if (code >= 61 && code <= 65) return "from-slate-700/30 to-slate-400/30"
    if (code >= 71 && code <= 77) return "from-slate-300/30 to-blue-100/30"
    if (code >= 80 && code <= 82) return "from-slate-700/40 to-blue-800/30"
    if (code >= 95 && code <= 99) return "from-purple-900/30 to-gray-700/30"
    return "from-sky-500/30 to-sky-200/30"
}