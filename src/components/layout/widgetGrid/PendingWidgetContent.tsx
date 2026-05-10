import GlassButton from "../../ui/GlassButton"

interface PendingWidgetContentProps {
    availablePos: { col: number; row: number } | null
    widgetFits: boolean
    onPlace: () => void
    isDarkMode: boolean
    tooLargeMessage: string
}

function PendingWidgetContent({ availablePos, widgetFits, onPlace, isDarkMode, tooLargeMessage }: PendingWidgetContentProps) {
    return (
        <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-3 ${isDarkMode ? "bg-gray-700/20" : "bg-white/20"}`}>
            {!widgetFits ? (
                <p className={`text-sm font-semibold text-center px-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {tooLargeMessage}
                </p>
            ) : availablePos ? (
                <>
                    <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Widget hinzufügen?
                    </p>
                    <GlassButton isDarkMode={!isDarkMode} onClick={onPlace} className="px-6 py-2 text-sm backdrop-blur-sm">
                        Hinzufügen
                    </GlassButton>
                </>
            ) : (
                <p className="text-red-400 text-sm font-semibold px-6 text-center">
                    Kein Platz verfügbar. Entferne zuerst ein Widget.
                </p>
            )}
        </div>
    )
}

export default PendingWidgetContent
