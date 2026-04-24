import { useContext, useEffect, useState } from "react"
import { getDailyMeme } from "../../api/memeApi"
import type { MemeResponse } from "./memeTypes"
import { DarkModeContext } from "../../context/DarkModeContext"

function MemeWidget() {

    const { isDarkMode } = useContext(DarkModeContext)!
    const [meme, setMeme] = useState<MemeResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMeme = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await getDailyMeme()
                setMeme(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch :(")
            } finally {
                setLoading(false)
            }
        }
        fetchMeme()
    }, [])

    return (
        <div className={`relative w-full h-full backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col
            ${!isDarkMode
                ? "bg-linear-to-b from-sky-100/10 via-blue-400/20 to-blue-300/20 border border-cyan-950/5"
                : "bg-linear-to-b from-gray-500/50 via-gray-600/20 to-blue-400/20 border border-white/25"
            }`}>
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-white/80 text-center text-sm font-semibold">{error}</p>
                </div>
            ) : meme && (
                <div className="flex-1 flex flex-col p-3 gap-2 overflow-hidden">
                    <p className="text-sm font-semibold text-center shrink-0
                        text-gray-800 dark:text-white/90">{meme.title}</p>
                    <div className="flex-1 flex items-center justify-center min-h-0">
                        {meme.isVideo ? (
                            <video src={meme.imageUrl} autoPlay loop muted playsInline
                                className="max-w-full max-h-full object-contain rounded-lg" />
                        ) : (
                            <img src={meme.imageUrl} alt={meme.title}
                                className="max-w-full max-h-full object-contain rounded-lg" />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MemeWidget