import { ChevronLeft } from "lucide-react"
import registry, { getWidgetSizes } from "../../../widgets/WidgetRegistry"
import { useState } from "react"
import GlassButton from "../../ui/GlassButton"
import useDarkMode from "../../../hooks/useDarkMode"
import { WeatherPreview, CalendarPreview, TimetablePreview, TodoPreview, MemePreview, PicturePreview } from "./WidgetPreviews"

const widgetPreviews: Record<string, React.ComponentType<{ onClick: () => void; className?: string }>> = {
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
}

function WidgetDrawer({ onBack, pendingWidget, setPendingWidget }: WidgetDrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()
    const widgets = Object.keys(registry)

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-sky-900 hover:text-cyan-600"}`} size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack}/>
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
                            {getWidgetSizes(selectedType).map((size) => (
                                <GlassButton key={`${size.colSpan}x${size.rowSpan}`} isDarkMode={!isDarkMode} onClick={() => setPendingWidget({ type: selectedType, colSpan: size.colSpan, rowSpan: size.rowSpan })} className="mt-1 mb-1 p-3 w-full text-center">
                                    {size.colSpan}x{size.rowSpan}
                                </GlassButton>
                            ))}
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
    )
}

export default WidgetDrawer
