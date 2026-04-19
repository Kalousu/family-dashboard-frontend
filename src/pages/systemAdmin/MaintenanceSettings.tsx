import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, LayoutGrid, Settings2, ChevronDown, ChevronUp } from "lucide-react"
import GlassButton from "../../components/ui/GlassButton"
import FormInput from "../../components/ui/FormInput"
import ConfirmModal from "../../components/mainpage/sidebar/AdminDrawer/ConfirmModal"
import { fadeSlideUp } from "../../constants/animations"
import type { MaintenanceSettings as MaintenanceSettingsType, FeatureFlag } from "./systemAdminTypes"

interface MaintenanceSettingsProps {
    isDarkMode: boolean
    settings: MaintenanceSettingsType
    onSettingsChange: (settings: MaintenanceSettingsType) => void
}

type CategorySection = { id: "widget" | "system"; label: string; icon: typeof LayoutGrid }

const CATEGORY_SECTIONS: CategorySection[] = [
    { id: "widget", label: "Widget-Flags", icon: LayoutGrid },
    { id: "system", label: "System-Flags", icon: Settings2 },
]

function ToggleSwitch({ enabled, isDarkMode, onChange }: { enabled: boolean; isDarkMode: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full border-2 transition-all duration-300 shrink-0
                ${enabled
                    ? "bg-green-500/30 border-green-500/50"
                    : isDarkMode ? "bg-white/10 border-white/20" : "bg-gray-200/80 border-cyan-950/10"
                }`}
        >
            <motion.div
                animate={{ x: enabled ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-0.5 w-4 h-4 rounded-full ${enabled ? "bg-green-400" : isDarkMode ? "bg-gray-400" : "bg-gray-500"}`}
            />
        </button>
    )
}

function MaintenanceSettings({ isDarkMode, settings, onSettingsChange }: MaintenanceSettingsProps) {
    const [expandedCategory, setExpandedCategory] = useState<"widget" | "system" | null>("widget")
    const [pendingMaintenanceToggle, setPendingMaintenanceToggle] = useState(false)

    const glassCard = isDarkMode
        ? "bg-white/5 border-white/10"
        : "bg-sky-100/40 border-cyan-950/20"

    const textPrimary = isDarkMode ? "text-gray-200" : "text-gray-700"
    const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500"

    function toggleFlag(flagId: string) {
        onSettingsChange({
            ...settings,
            flags: settings.flags.map((f) =>
                f.id === flagId ? { ...f, enabled: !f.enabled } : f
            ),
        })
    }

    function confirmMaintenanceToggle() {
        onSettingsChange({ ...settings, maintenanceMode: !settings.maintenanceMode })
        setPendingMaintenanceToggle(false)
    }

    function handleMessageChange(message: string) {
        onSettingsChange({ ...settings, maintenanceMessage: message })
    }

    function toggleCategory(category: "widget" | "system") {
        setExpandedCategory((prev) => (prev === category ? null : category))
    }

    function flagsForCategory(category: FeatureFlag["category"]) {
        return settings.flags.filter((f) => f.category === category)
    }

    return (
        <motion.div {...fadeSlideUp} className="flex flex-col gap-4 w-full">

            {/* Maintenance mode banner */}
            <AnimatePresence>
                {settings.maintenanceMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10"
                    >
                        <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                        <p className="text-sm font-semibold text-amber-400">Wartungsmodus ist aktiv — Benutzer sehen die Wartungsseite.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Maintenance mode card */}
            <div className={`relative rounded-xl border overflow-hidden ${glassCard}`}>
                <div className={`absolute inset-x-0 top-0 h-8 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />

                <div className="flex items-center gap-4 px-4 py-4">
                    <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${textPrimary}`}>Wartungsmodus</p>
                        <p className={`text-xs mt-0.5 ${textSecondary}`}>
                            Sperrt alle Familien-Logins und zeigt die Wartungsmeldung.
                        </p>
                    </div>
                    <ToggleSwitch
                        enabled={settings.maintenanceMode}
                        isDarkMode={isDarkMode}
                        onChange={() => setPendingMaintenanceToggle(true)}
                    />
                </div>

                {/* Maintenance message input */}
                <div className={`px-4 pb-4 border-t ${isDarkMode ? "border-white/10" : "border-cyan-950/10"}`}>
                    <p className={`text-xs font-semibold mt-3 mb-2 ${textSecondary}`}>Wartungsmeldung</p>
                    <FormInput
                        isDarkMode={isDarkMode}
                        type="text"
                        value={settings.maintenanceMessage}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        placeholder="Wartungsmeldung für Benutzer..."
                        className="w-full text-sm"
                    />
                </div>
            </div>

            {/* Feature flags by category */}
            {CATEGORY_SECTIONS.map(({ id, label, icon: Icon }) => {
                const flags = flagsForCategory(id)
                const activeCount = flags.filter((f) => f.enabled).length
                const isExpanded = expandedCategory === id

                return (
                    <div key={id} className={`relative rounded-xl border overflow-hidden ${glassCard}`}>
                        <div className={`absolute inset-x-0 top-0 h-8 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />

                        {/* Section header */}
                        <button
                            onClick={() => toggleCategory(id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:brightness-110`}
                        >
                            <Icon size={16} className={textSecondary} />
                            <span className={`flex-1 font-semibold text-sm ${textPrimary}`}>{label}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isDarkMode ? "bg-white/10 text-gray-300" : "bg-sky-200/60 text-gray-600"}`}>
                                {activeCount}/{flags.length} aktiv
                            </span>
                            {isExpanded
                                ? <ChevronUp size={15} className={textSecondary} />
                                : <ChevronDown size={15} className={textSecondary} />
                            }
                        </button>

                        {/* Flag list */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className={`border-t ${isDarkMode ? "border-white/10" : "border-cyan-950/10"}`}>
                                        {flags.map((flag, index) => (
                                            <div
                                                key={flag.id}
                                                className={`flex items-center gap-4 px-4 py-3 ${index < flags.length - 1 ? `border-b ${isDarkMode ? "border-white/5" : "border-cyan-950/5"}` : ""}`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-semibold ${textPrimary}`}>{flag.label}</p>
                                                    <p className={`text-xs mt-0.5 ${textSecondary}`}>{flag.description}</p>
                                                </div>
                                                <ToggleSwitch
                                                    enabled={flag.enabled}
                                                    isDarkMode={isDarkMode}
                                                    onChange={() => toggleFlag(flag.id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )
            })}

            {/* Save button */}
            <div className="flex justify-end">
                <GlassButton isDarkMode={!isDarkMode} className="px-6 py-2 text-sm">
                    Einstellungen speichern
                </GlassButton>
            </div>

            {/* Confirm maintenance toggle modal */}
            {pendingMaintenanceToggle && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={settings.maintenanceMode
                        ? <>Wartungsmodus <strong>deaktivieren</strong>?</>
                        : <>Wartungsmodus <strong>aktivieren</strong>?</>
                    }
                    subMessage={settings.maintenanceMode
                        ? "Alle Familien erhalten wieder Zugang."
                        : "Alle Familien-Logins werden gesperrt."
                    }
                    onConfirm={confirmMaintenanceToggle}
                    onCancel={() => setPendingMaintenanceToggle(false)}
                />
            )}
        </motion.div>
    )
}

export default MaintenanceSettings
