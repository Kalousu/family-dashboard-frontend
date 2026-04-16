import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import GlassButton from "../../ui/GlassButton"

interface AdminDrawerProps {
    onBack: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
    isDarkMode: boolean
}

function AdminDrawer({ onBack, isDarkMode }: AdminDrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-sky-900 hover:text-cyan-600" : "text-gray-400 hover:text-white"}`} size={30} onClick={selectedType !== null ? () => setSelectedType(null) : onBack}/>
            <div>
                {selectedType === null ? (
                    <div className="mt-2 flex flex-col">
                        <GlassButton isDarkMode={isDarkMode} onClick={() => setSelectedType("invite")} className="mt-1 mb-1 p-3 w-full text-left">
                            neues Mitglied einladen
                        </GlassButton>
                        <GlassButton isDarkMode={isDarkMode} onClick={() => setSelectedType("manage")} className="mt-1 mb-1 p-3 w-full text-left">
                            Familienmitglieder verwalten
                        </GlassButton>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default AdminDrawer