import { useEffect, useRef, useState } from "react"
import { Image } from "lucide-react"
import { getPicture, uploadPicture } from "../../api/pictureApi"
import useAuth from "../../hooks/useAuth"
import useDarkMode from "../../hooks/useDarkMode"
import type { WidgetConfig } from "../../api/familyApi"

interface PictureWidgetProps {
    widgetId: string
    config?: WidgetConfig
}

function PictureWidget({ widgetId }: PictureWidgetProps) {
    const { familyId } = useAuth()
    const { isDarkMode } = useDarkMode()
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [imgBroken, setImgBroken] = useState(false)
    const [hovered, setHovered] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const numericId = Number(widgetId)
    const isSaved = numericId > 0

    useEffect(() => {
        if (!isSaved) {
            setLoading(false)
            return
        }
        setLoading(true)
        getPicture(numericId)
            .then(data => {
                setImageUrl(data?.imageUrl ?? null)
                setImgBroken(false)
            })
            .catch(() => setImageUrl(null))
            .finally(() => setLoading(false))
    }, [numericId, isSaved])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !familyId) return
        if (file.type !== "image/jpeg") {
            setUploadError("Bitte nur JPG-Dateien hochladen")
            e.target.value = ""
            return
        }
        setUploading(true)
        setUploadError(null)
        setImgBroken(false)
        try {
            const result = await uploadPicture(numericId, familyId, file)
            setImageUrl(result.imageUrl)
        } catch {
            setUploadError("Upload fehlgeschlagen")
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    const triggerUpload = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isSaved && !uploading) fileInputRef.current?.click()
    }

    const containerClass = `relative w-full h-full rounded-2xl overflow-hidden shadow-lg
        ${!isDarkMode
            ? "bg-linear-to-b from-sky-100/10 via-blue-400/20 to-blue-300/20 border border-cyan-950/5"
            : "bg-linear-to-b from-gray-500/50 via-gray-600/20 to-blue-400/20 border border-white/25"
        }`

    if (loading) {
        return (
            <div className={containerClass}>
                <div className="flex items-center justify-center w-full h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white/60" />
                </div>
            </div>
        )
    }

    return (
        <div
            className={containerClass}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg"
                className="hidden"
                onChange={handleFileChange}
            />

            {imageUrl && !imgBroken ? (
                <>
                    <img
                        src={imageUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setImgBroken(true)}
                    />
                    <div
                        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${hovered || uploading ? "opacity-100" : "opacity-0"}`}
                    >
                        {uploading ? (
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
                        ) : (
                            <button
                                onClick={triggerUpload}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                                Foto ändern
                            </button>
                        )}
                        {uploadError && (
                            <span className="text-red-300 text-xs">{uploadError}</span>
                        )}
                    </div>
                </>
            ) : (
                <div
                    className={`flex flex-col items-center justify-center w-full h-full gap-3 ${isSaved ? "cursor-pointer" : "cursor-default"}`}
                    onClick={isSaved ? triggerUpload : undefined}
                >
                    {uploading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white/60" />
                    ) : (
                        <>
                            <Image className="w-12 h-12 text-white/50" strokeWidth={1.5} />
                            <span className="text-white/50 text-sm font-medium text-center px-4">
                                {imgBroken ? "Bild nicht erreichbar – neues Foto hochladen" : isSaved ? "Foto hinzufügen" : "Layout erst speichern"}
                            </span>
                            {uploadError && <span className="text-red-400 text-xs">{uploadError}</span>}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default PictureWidget
