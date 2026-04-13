import { ChevronLeft } from "lucide-react"
import registry, { getWidgetSizes } from "../../../widgets/WidgetRegistry"
import { useState } from "react"
interface WidgetdrawerProps {
    onBack: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
    isDarkMode: boolean
}

function Widgetdrawer({ onBack, setPendingWidget, isDarkMode }: WidgetdrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const widgets = Object.keys(registry)

    const btnClass = isDarkMode
        ? "bg-linear-to-b from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700 border-2 border-cyan-950/5"
        : "bg-linear-to-b from-gray-500/50 via-gray-600/20 to-blue-400/20 text-gray-200 border-white/10"
    const glossClass = isDarkMode ? "bg-white/30" : "bg-white/5"

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-sky-900 hover:text-cyan-600" : "text-gray-400 hover:text-white"}`} size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack}/>
            <div>
                {selectedType === null ? (
                    <div className="mt-2 flex flex-col">
                        {widgets.map((item) => (
                            <button className={`relative mt-1 mb-1 p-3 w-full text-left font-semibold rounded-xl border-2 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200 ${btnClass}`}
                            key={item} onClick={() => setSelectedType(item)}>
                                <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${glossClass}`} />
                                {item}
                            </button>
                        ))}
                        {/*hier noch einmal das design rauswerfen/überarbeiten, damit */}
                    </div>
                ) : (
                    <div>
                        <div className="mt-2 flex flex-col">
                            <p className={`flex flex-col items-center font-semibold mb-2 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>{selectedType}</p>
                            {/* <p> bitte wieder rauswerfen, widgetart ist sichtbar nach design*/}
                            {getWidgetSizes(selectedType).map((size) => (
                                <button key={`${size.colSpan}x${size.rowSpan}`} className={`relative mt-1 mb-1 p-3 w-full text-left font-semibold rounded-xl border-2 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200 ${btnClass}`} onClick={() => setPendingWidget({ type: selectedType, colSpan: size.colSpan, rowSpan: size.rowSpan })}>
                                    <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${glossClass}`} />
                                    {size.colSpan}x{size.rowSpan}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Widgetdrawer