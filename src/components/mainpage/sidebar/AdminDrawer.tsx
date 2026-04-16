import { ChevronLeft, Copy, Check } from "lucide-react"
import { useState } from "react"
import GlassButton from "../../ui/GlassButton"
import { handleInviteToggle } from "./handleInviteToggle"

interface AdminDrawerProps {
    onBack: () => void
    isDarkMode: boolean
}

function AdminDrawer({ onBack, isDarkMode }: AdminDrawerProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const inviteLink = `${window.location.origin}/invite/abc123`

    function handleCopy() {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-sky-900 hover:text-cyan-600" : "text-gray-400 hover:text-white"}`} size={30} onClick={onBack}/>
            <div className="mt-2 flex flex-col">
                <GlassButton isDarkMode={isDarkMode} onClick={() => handleInviteToggle(selectedType, setSelectedType)} className="mt-1 mb-1 p-3 w-full text-left">
                    neues Mitglied einladen
                </GlassButton>

                {selectedType === "invite" && (
                    <div className={`mx-1 mb-2 p-3 rounded-xl border ${isDarkMode ? "bg-sky-100/40 border-cyan-950/20" : "bg-white/5 border-white/10"}`}>
                        <p className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>Einladungslink</p>
                        <div className="flex items-center gap-2">
                            <input
                                readOnly
                                value={inviteLink}
                                className={`flex-1 text-xs px-3 py-2 rounded-xl border outline-none truncate ${isDarkMode ? "bg-white/60 border-cyan-950/20 text-gray-600" : "bg-white/5 border-white/10 text-gray-300"}`}
                            />
                            <button
                                onClick={handleCopy}
                                className={`p-2 rounded-xl border transition-all hover:scale-105 ${isDarkMode ? "bg-white/60 border-cyan-950/20 text-gray-600 hover:text-cyan-600" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        {copied && (
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-cyan-600" : "text-green-400"}`}>Link kopiert!</p>
                        )}
                    </div>
                )}

                <GlassButton isDarkMode={isDarkMode} onClick={() => setSelectedType("manage")} className="mt-1 mb-1 p-3 w-full text-left">
                    Mitglied löschen
                </GlassButton>
                <GlassButton isDarkMode={isDarkMode} onClick={() => setSelectedType("manage")} className="mt-1 mb-1 p-3 w-full text-left">
                    Rollen verwalten
                </GlassButton>
            </div>
        </div>
    )
}

export default AdminDrawer