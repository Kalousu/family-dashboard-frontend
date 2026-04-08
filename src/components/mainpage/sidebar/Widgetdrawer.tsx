import { ChevronLeft } from "lucide-react"
import registry, { getWidgetSizes } from "../../../widgets/WidgetRegistry"
import { useState } from "react"
interface WidgetdrawerProps {
    onBack: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
}

function Widgetdrawer({ onBack, setPendingWidget }: WidgetdrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const widgets = Object.keys(registry)

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft className="w-7 h-7 text-gray-400 hover:scale-105 hover:text-white transition-all" size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack}/>
            <div>
                {selectedType === null ? (
                    <div className="mt-2 flex flex-col">
                        {widgets.map((item) => (<button className="mt-1 mb-1 p-3 w-full bg-linear-to-b from-gray-500/70 to-gray-600 text-gray-200 text-left font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200"
                        key={item} onClick={() => setSelectedType(item)}>{item}</button>))}
                        {/*hier noch einmal das design rauswerfen/überarbeiten, damit */}
                    </div>
                ) : (
                    <div>
                        <div className="mt-2 flex flex-col">
                            <p className="flex flex-col items-center text-gray-300 font-semibold mb-2">{selectedType}</p>
                            {/* <p> bitte wieder rauswerfen, widgetart ist sichtbar nach design*/}
                            {getWidgetSizes(selectedType).map((size) => (
                                <button key={`${size.colSpan}x${size.rowSpan}`} className="mt-1 mb-1 p-3 w-full bg-linear-to-b from-gray-500/70 to-gray-600 text-gray-200 text-left font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200" onClick={() => setPendingWidget({ type: selectedType, colSpan: size.colSpan, rowSpan: size.rowSpan })}>
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