import { useEffect, useState } from "react"
import { getDailyMeme } from "../../api/memeApi"
import type { MemeResponse } from "./memeTypes"

function MemeWidget() {

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
                setError(err instanceof Error ? err.message : "Unbekannter Fehler")
            } finally {
                setLoading(false)
            }
        }
        fetchMeme()
    }, [])

    return (
        <div className="relative w-full h-full bg-zinc-900 rounded-2xl shadow-lg overflow-hidden flex flex-col">
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-white/80 text-center text-sm font-semibold">{error}</p>
                </div>
            ) : meme && (
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    {meme.isVideo ? (
                        <video src={meme.imageUrl} autoPlay loop muted playsInline className="w-full h-full object-contain"
                        />
                    ) : (
                        <img src={meme.imageUrl} alt={meme.title} className="w-full h-full object-contain"
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default MemeWidget