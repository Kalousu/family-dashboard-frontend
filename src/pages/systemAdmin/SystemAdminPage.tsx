import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Building2, UserCog, Wrench } from "lucide-react"
import AuthPageLayout from "../../components/layout/AuthPageLayout"
import useDarkMode from "../../hooks/useDarkMode"
import { fadeSlideUp } from "../../constants/animations"
import FamilyOverview from "./FamilyOverview"
import MemberManagement from "./MemberManagement"
import UserManagement from "./UserManagement"
import MaintenanceSettings from "./MaintenanceSettings"
import { MOCK_FAMILIES, DEFAULT_MAINTENANCE_SETTINGS } from "./systemAdminTypes"
import type { Family, MaintenanceSettings as MaintenanceSettingsType } from "./systemAdminTypes"

// =============================================================================
// API-ANBINDUNG — SystemAdminPage
//
// Dieser Bereich ist der Einstiegspunkt der Admin-App.
// Hier müssen zwei Dinge ergänzt werden:
//
// 1. ROUTE-GUARD: Vor dem Rendern der Seite prüfen, ob der eingeloggte User
//    die Rolle "Systemadministrator" hat. Falls nicht → Redirect zu /login.
//    Empfohlene Umsetzung: eine ProtectedRoute-Komponente in App.tsx, die
//    den Token aus localStorage liest und die Rolle prüft.
//    Beispiel: GET /auth/me  → { id, name, role }
//
// 2. INITIALDATEN LADEN: Die Mock-Konstanten MOCK_FAMILIES und
//    DEFAULT_MAINTENANCE_SETTINGS müssen durch echte API-Calls ersetzt werden.
//    Beide Calls können parallel beim ersten Laden ausgeführt werden:
//    GET /families               → ersetzt useState(MOCK_FAMILIES)
//    GET /settings/maintenance   → ersetzt useState(DEFAULT_MAINTENANCE_SETTINGS)
// =============================================================================

type Tab = "familien" | "mitglieder" | "benutzer" | "wartung"

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "familien", label: "Kunden", icon: Building2 },
    { id: "mitglieder", label: "Mitglieder", icon: Users },
    { id: "benutzer", label: "Benutzer", icon: UserCog },
    { id: "wartung", label: "Wartung", icon: Wrench },
]

function SystemAdminPage() {
    const { isDarkMode } = useDarkMode()
    const [activeTab, setActiveTab] = useState<Tab>("familien")
    const [families, setFamilies] = useState<Family[]>(MOCK_FAMILIES)
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
    const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettingsType>(DEFAULT_MAINTENANCE_SETTINGS)

    const glassCard = isDarkMode
        ? "bg-white/5 border-white/10"
        : "bg-sky-100/40 border-cyan-950/20"

    const textPrimary = isDarkMode ? "text-gray-200" : "text-gray-700"
    const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500"

    function handleSelectFamily(family: Family) {
        setSelectedFamily(family)
        setActiveTab("mitglieder")
    }

    function handleFamilyChange(updated: Family) {
        setFamilies((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
        if (selectedFamily?.id === updated.id) setSelectedFamily(updated)
    }

    function handleTabChange(tab: Tab) {
        setActiveTab(tab)
        if (tab !== "mitglieder") setSelectedFamily(null)
    }

    return (
        <AuthPageLayout>
            <motion.div
                key="system-admin"
                {...fadeSlideUp}
                className="flex flex-col items-center w-full max-w-2xl px-4 gap-6"
            >
                {/* Page title */}
                <div className="text-center">
                    <h1 className={`text-2xl font-bold ${textPrimary}`}>System Administration</h1>
                    <p className={`text-sm mt-1 ${textSecondary}`}>Verwaltung aller Familien und Benutzer</p>
                </div>

                {/* Tab bar */}
                <div className={`relative flex gap-1 rounded-xl border p-1 w-full ${glassCard}`}>
                    <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                    {TABS.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                    ${isActive
                                        ? isDarkMode
                                            ? "bg-linear-to-b from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700 shadow-sm"
                                            : "bg-linear-to-b from-gray-500/50 via-gray-600/20 to-blue-400/20 text-gray-200 shadow-sm"
                                        : `${textSecondary} hover:brightness-110`
                                    }`}
                            >
                                {isActive && (
                                    <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-lg pointer-events-none ${isDarkMode ? "bg-white/30" : "bg-white/5"}`} />
                                )}
                                <Icon size={15} />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Tab content */}
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        {activeTab === "familien" && (
                            <FamilyOverview
                                key="familien"
                                isDarkMode={isDarkMode}
                                families={families}
                                onFamiliesChange={setFamilies}
                                onSelectFamily={handleSelectFamily}
                            />
                        )}
                        {activeTab === "mitglieder" && selectedFamily && (
                            <MemberManagement
                                key="mitglieder"
                                isDarkMode={isDarkMode}
                                family={selectedFamily}
                                onBack={() => { setSelectedFamily(null); setActiveTab("familien") }}
                                onFamilyChange={handleFamilyChange}
                            />
                        )}
                        {activeTab === "mitglieder" && !selectedFamily && (
                            <motion.div key="mitglieder-empty" {...fadeSlideUp} className={`rounded-xl border p-8 text-center ${glassCard}`}>
                                <p className={`text-sm ${textSecondary}`}>Wähle eine Familie aus der Kunden-Übersicht, um deren Mitglieder zu verwalten.</p>
                            </motion.div>
                        )}
                        {activeTab === "benutzer" && (
                            <UserManagement
                                key="benutzer"
                                isDarkMode={isDarkMode}
                                families={families}
                                onFamiliesChange={setFamilies}
                            />
                        )}
                        {activeTab === "wartung" && (
                            <MaintenanceSettings
                                key="wartung"
                                isDarkMode={isDarkMode}
                                settings={maintenanceSettings}
                                onSettingsChange={setMaintenanceSettings}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AuthPageLayout>
    )
}

export default SystemAdminPage
