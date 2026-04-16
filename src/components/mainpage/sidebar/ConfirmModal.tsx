import { createPortal } from "react-dom"
import { type ReactNode } from "react"
import GlassButton from "../../ui/GlassButton"

interface ConfirmModalProps {
    message: ReactNode
    subMessage?: string
    onConfirm: () => void
    onCancel: () => void
    isDarkMode: boolean
}

function ConfirmModal({ message, subMessage, onConfirm, onCancel, isDarkMode }: ConfirmModalProps) {
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`rounded-2xl p-6 border flex flex-col gap-3 w-64 ${isDarkMode ? "bg-sky-100 border-cyan-950/20" : "bg-gray-900 border-white/10"}`}>
                <p className={`text-center text-sm font-semibold ${isDarkMode ? "text-gray-700" : "text-gray-200"}`}>
                    {message}
                </p>
                {subMessage && (
                    <p className={`text-center text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {subMessage}
                    </p>
                )}
                <div className="flex gap-3 justify-center mt-1">
                    <GlassButton isDarkMode={isDarkMode} onClick={onConfirm} className="px-6 py-2">
                        Ja
                    </GlassButton>
                    <GlassButton isDarkMode={isDarkMode} onClick={onCancel} className="px-6 py-2">
                        Nein
                    </GlassButton>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmModal
