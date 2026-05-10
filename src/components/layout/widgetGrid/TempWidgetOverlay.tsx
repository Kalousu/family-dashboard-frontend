import { Lock } from "lucide-react"

function TempWidgetOverlay() {
    return (
        <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
            <Lock size={20} className="text-white/80" />
            <p className="text-white/90 text-xs text-center px-4 leading-snug">
                Layout speichern, um dieses Widget zu aktivieren
            </p>
        </div>
    )
}

export default TempWidgetOverlay
