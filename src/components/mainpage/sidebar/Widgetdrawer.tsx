import { ChevronLeft } from "lucide-react"
import registry, { getWidgetSizes } from "../../../widgets/WidgetRegistry"
import { useState } from "react"
import GlassButton from "../../ui/GlassButton"

interface WidgetdrawerProps {
    onBack: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
    isDarkMode: boolean
}

function Widgetdrawer({ onBack, setPendingWidget, isDarkMode }: WidgetdrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const widgets = Object.keys(registry)

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-sky-900 hover:text-cyan-600" : "text-gray-400 hover:text-white"}`} size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack}/>
            <div>
                {selectedType === null ? (
                    <div className="mt-2 flex flex-col">
                        {widgets.map((item) => (
                            <GlassButton key={item} isDarkMode={isDarkMode} onClick={() => setSelectedType(item)} className="mt-1 mb-1 p-3 w-full text-left">
                                {item}
                            </GlassButton>
                        ))}
                        {/*hier noch einmal das design rauswerfen/überarbeiten, damit */}
                    </div>
                ) : (
                    <div>
                        <div className="mt-2 flex flex-col">
                            <p className={`flex flex-col items-center font-semibold mb-2 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>{selectedType}</p>
                            {/* <p> bitte wieder rauswerfen, widgetart ist sichtbar nach design*/}
                            {getWidgetSizes(selectedType).map((size) => (
                                <GlassButton key={`${size.colSpan}x${size.rowSpan}`} isDarkMode={isDarkMode} onClick={() => setPendingWidget({ type: selectedType, colSpan: size.colSpan, rowSpan: size.rowSpan })} className="mt-1 mb-1 p-3 w-full text-left">
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

export default Widgetdrawer
