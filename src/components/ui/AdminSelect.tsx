import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import useAdminTheme from "../../hooks/useAdminTheme"

interface AdminSelectOption {
    value: string
    label: string
}

interface AdminSelectProps {
    value: string
    onChange: (value: string) => void
    options: AdminSelectOption[]
    isDarkMode: boolean
    className?: string
}

function AdminSelect({ value, onChange, options, isDarkMode, className = "" }: AdminSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const { inputField, inputWrapper, textSecondary } = useAdminTheme(isDarkMode)

    useEffect(() => {
        if (!isOpen) return
        function handleOutsideClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", handleOutsideClick)
        return () => document.removeEventListener("mousedown", handleOutsideClick)
    }, [isOpen])

    const selected = options.find(o => o.value === value)

    return (
        <div ref={ref} className={`relative ${className}`}>
            <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-3 rounded-xl text-sm font-semibold border touch-manipulation focus:outline-none ${inputField}`}
                >
                    <span>{selected?.label ?? value}</span>
                    <ChevronDown
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${textSecondary}`}
                    />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.13, ease: "easeOut" }}
                        className={`absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border overflow-hidden shadow-xl ${
                            isDarkMode
                                ? "bg-gray-800/95 border-white/10 backdrop-blur-sm"
                                : "bg-white/95 border-cyan-950/10 backdrop-blur-sm"
                        }`}
                    >
                        {options.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => { onChange(option.value); setIsOpen(false) }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-left transition-colors touch-manipulation
                                    ${option.value === value
                                        ? isDarkMode ? "bg-white/10 text-gray-200" : "bg-sky-100/80 text-gray-700"
                                        : isDarkMode ? "text-gray-400 hover:bg-white/5 hover:text-gray-200" : "text-gray-500 hover:bg-sky-50 hover:text-gray-700"
                                    }`}
                            >
                                <span className="w-4 flex items-center justify-center shrink-0">
                                    {option.value === value && <Check size={14} className="text-blue-400" />}
                                </span>
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminSelect
