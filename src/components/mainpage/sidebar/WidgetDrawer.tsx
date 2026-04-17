import { ChevronLeft } from "lucide-react"
import registry, { getWidgetSizes } from "../../../widgets/WidgetRegistry"
import { useState } from "react"
import GlassButton from "../../ui/GlassButton"
import useDarkMode from "../../../hooks/useDarkMode"

interface WidgetDrawerProps {
    onBack: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
}

function WidgetDrawer({ onBack, setPendingWidget }: WidgetDrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()
    const widgets = Object.keys(registry)

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-sky-900 hover:text-cyan-600"}`} size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack}/>
            <div>
                {selectedType === null ? (
                    <div className="mt-2 flex flex-col">
                        {widgets.map((item) => (
                            <GlassButton key={item} isDarkMode={!isDarkMode} onClick={() => setSelectedType(item)} className="mt-1 mb-1 p-3 w-full text-left">
                                {item}
                            </GlassButton>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="mt-2 flex flex-col">
                            <p className={`flex flex-col items-center font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{selectedType}</p>
                            {getWidgetSizes(selectedType).map((size) => (
                                <GlassButton key={`${size.colSpan}x${size.rowSpan}`} isDarkMode={!isDarkMode} onClick={() => setPendingWidget({ type: selectedType, colSpan: size.colSpan, rowSpan: size.rowSpan })} className="mt-1 mb-1 p-3 w-full text-left">
                                    {size.colSpan}x{size.rowSpan}
                                </GlassButton>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WidgetDrawer
