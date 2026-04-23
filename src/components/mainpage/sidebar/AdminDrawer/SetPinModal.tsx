import { useState } from "react"
import { createPortal } from "react-dom"
import GlassButton from "../../../ui/GlassButton"
import FormInput from "../../../ui/FormInput"

interface SetPinModalProps {
    userName: string
    isDarkMode: boolean
    onConfirm: (pin: string) => void
    onCancel: () => void
}

function SetPinModal({ userName, isDarkMode, onConfirm, onCancel }: SetPinModalProps) {
    const [pin, setPin] = useState("")
    const [pinRepeat, setPinRepeat] = useState("")
    const [error, setError] = useState<string | null>(null)

    function handleConfirm() {
        const pinRegex = /^[0-9]{4,6}$/
        if (!pinRegex.test(pin)) {
            setError("PIN muss 4–6 Ziffern enthalten (nur Zahlen).")
            return
        }
        if (pin !== pinRepeat) {
            setError("PINs stimmen nicht überein.")
            return
        }
        onConfirm(pin)
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 border flex flex-col gap-3 w-72 ${!isDarkMode ? "bg-sky-100 border-cyan-950/20" : "bg-gray-900 border-white/10"}`}>
                <p className={`text-center text-sm font-semibold ${!isDarkMode ? "text-gray-700" : "text-gray-200"}`}>
                    PIN für {userName} festlegen
                </p>
                <p className={`text-center text-xs ${!isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    Als Admin benötigt {userName} eine PIN zum Anmelden.
                </p>
                <FormInput
                    isDarkMode={isDarkMode}
                    type="password"
                    placeholder="PIN"
                    value={pin}
                    onChange={e => { setPin(e.target.value); setError(null) }}
                />
                <FormInput
                    isDarkMode={isDarkMode}
                    type="password"
                    placeholder="PIN wiederholen"
                    value={pinRepeat}
                    onChange={e => { setPinRepeat(e.target.value); setError(null) }}
                />
                <p className={`text-xs text-center font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                    {error || "Platzhalter"}
                </p>
                <div className="flex gap-3 justify-center">
                    <GlassButton isDarkMode={!isDarkMode} onClick={handleConfirm} className="px-5 py-2">
                        Speichern
                    </GlassButton>
                    <GlassButton isDarkMode={!isDarkMode} onClick={onCancel} className="px-5 py-2">
                        Abbrechen
                    </GlassButton>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default SetPinModal
