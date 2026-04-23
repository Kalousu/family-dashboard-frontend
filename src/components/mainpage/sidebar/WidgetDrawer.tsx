import { ChevronLeft } from "lucide-react"
import registry, { getWidgetSizes } from "../../../widgets/WidgetRegistry"
import { useState } from "react"
import GlassButton from "../../ui/GlassButton"
import useDarkMode from "../../../hooks/useDarkMode"
import { WeatherPreview, CalendarPreview, TimetablePreview, TodoPreview, MemePreview, PicturePreview } from "./WidgetPreviews"
import { useContainerSize } from "../../../hooks/useContainerSize"

const widgetPreviews: Record<string, React.ComponentType<{ onClick: () => void; className?: string; colSpan?: number; rowSpan?: number }>> = {
    weather: WeatherPreview,
    calendar: CalendarPreview,
    timetable: TimetablePreview,
    todo: TodoPreview,
    meme: MemePreview,
    picture: PicturePreview,
}

const widgetLabels: Record<string, string> = {
    weather: "Wetter",
    calendar: "Kalender",
    timetable: "Stundenplan",
    todo: "To-Do",
    meme: "Meme",
    picture: "Bild",
}

const reducedOpacityWidgets = new Set(["weather", "calendar", "timetable", "todo"])

interface WidgetDrawerProps {
    onBack: () => void
    pendingWidget: { type: string, colSpan: number, rowSpan: number } | null
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
    onAddWidget?: (widget: { type: string, colSpan: number, rowSpan: number }) => void
}

function WidgetDrawer({ onBack, pendingWidget, setPendingWidget, onAddWidget }: WidgetDrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()
    const { ref, width } = useContainerSize()
    const widgets = Object.keys(registry)

    const handleSizeSelect = (type: string, colSpan: number, rowSpan: number) => {
        if (window.innerWidth < 1024 && onAddWidget) {
            onAddWidget({ type, colSpan, rowSpan })
            setSelectedType(null)
            onBack()
        } else {
            setPendingWidget({ type, colSpan, rowSpan })
        }
    }

    const chevronClass = `w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-sky-900 hover:text-cyan-600"}`

    return (
        <>
            {/* Desktop: unchanged layout */}
            <div className="hidden lg:flex flex-col h-full">
                <ChevronLeft className={chevronClass} size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack} />
                <div>
                    {selectedType === null ? (
                        <div className="mt-2 flex flex-col gap-3 overflow-y-auto items-center">
                            {widgets.map((item) => {
                                const Preview = widgetPreviews[item]
                                return Preview ? (
                                    <div key={item} className="flex flex-col gap-1 w-24">
                                        <Preview
                                            onClick={() => setSelectedType(item)}
                                            className={reducedOpacityWidgets.has(item) ? "opacity-60" : ""}
                                        />
                                        <span className={`text-center text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            {widgetLabels[item] ?? item}
                                        </span>
                                    </div>
                                ) : (
                                    <GlassButton key={item} isDarkMode={!isDarkMode} onClick={() => setSelectedType(item)} className="p-3 w-full text-left">
                                        {widgetLabels[item] ?? item}
                                    </GlassButton>
                                )
                            })}
                        </div>
                    ) : (
                        <div>
                            <div className="mt-2 flex flex-col">
                                <p className={`flex flex-col items-center font-semibold mb-2 capitalize ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{widgetLabels[selectedType] ?? selectedType}</p>
                                <div className="flex flex-col gap-3 overflow-y-auto items-center">
                                    {(() => {
                                        const sizes = getWidgetSizes(selectedType)
                                        const maxCols = Math.max(...sizes.map(s => s.colSpan))
                                        const baseUnit = Math.floor(140 / maxCols)
                                        const Preview = widgetPreviews[selectedType]
                                        return sizes.map((size) => Preview ? (
                                            <div key={`${size.colSpan}x${size.rowSpan}`} className="flex flex-col gap-1" style={{ width: size.colSpan * baseUnit }}>
                                                <Preview
                                                    onClick={() => handleSizeSelect(selectedType, size.colSpan, size.rowSpan)}
                                                    className={reducedOpacityWidgets.has(selectedType) ? "opacity-60" : ""}
                                                    colSpan={size.colSpan}
                                                    rowSpan={size.rowSpan}
                                                />
                                                <span className={`text-center text-xs font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                    {size.colSpan}×{size.rowSpan}
                                                </span>
                                            </div>
                                        ) : null)
                                    })()}
                                </div>
                                {pendingWidget && (
                                    <GlassButton isDarkMode={!isDarkMode} onClick={() => { setPendingWidget(null); setSelectedType(null) }} className="mt-3 mb-1 p-3 w-full text-left text-red-400">
                                        Abbrechen
                                    </GlassButton>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile: fill sidebar */}
            <div ref={ref} className="lg:hidden flex flex-col h-full">
                <div className="flex items-center gap-2 py-2">
                    <ChevronLeft className={chevronClass} size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack} />
                    <span className={`font-semibold text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                        {selectedType ? (widgetLabels[selectedType] ?? selectedType) : "Widget hinzufügen"}
                    </span>
                </div>
                <div className="overflow-y-auto flex-1">
                    {selectedType === null ? (
                        <div className="mt-2 flex flex-col gap-3 items-center">
                            {widgets.map((item) => {
                                const Preview = widgetPreviews[item]
                                return Preview ? (
                                    <div key={item} className="flex flex-col gap-1 items-center">
                                        <Preview
                                            onClick={() => setSelectedType(item)}
                                            className={reducedOpacityWidgets.has(item) ? "opacity-60" : ""}
                                        />
                                        <span className={`text-center text-xs font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            {widgetLabels[item] ?? item}
                                        </span>
                                    </div>
                                ) : (
                                    <GlassButton key={item} isDarkMode={!isDarkMode} onClick={() => setSelectedType(item)} className="p-3 text-left">
                                        {widgetLabels[item] ?? item}
                                    </GlassButton>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2 items-center">
                            {(() => {
                                const sizes = getWidgetSizes(selectedType)
                                const maxCols = Math.max(...sizes.map(s => s.colSpan))
                                const baseUnit = Math.floor(140 / maxCols)
                                const Preview = widgetPreviews[selectedType]
                                const isMobile = width < 640
                                return sizes.map((size) => {
                                    const isAvailable = !isMobile || (size.colSpan <= 2 && size.rowSpan <= 2)
                                    return Preview ? (
                                        <div key={`${size.colSpan}x${size.rowSpan}`} className={`flex flex-col gap-1 shrink-0 ${!isAvailable ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`} style={{ width: size.colSpan * baseUnit }}>
                                            <Preview
                                                onClick={() => isAvailable && handleSizeSelect(selectedType, size.colSpan, size.rowSpan)}
                                                className={reducedOpacityWidgets.has(selectedType) ? "opacity-60" : ""}
                                                colSpan={size.colSpan}
                                                rowSpan={size.rowSpan}
                                            />
                                            <span className={`text-center text-xs font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                                {size.colSpan}×{size.rowSpan}
                                            </span>
                                        </div>
                                    ) : null
                                })
                            })()}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default WidgetDrawer
