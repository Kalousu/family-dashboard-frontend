import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Lock, Unlock, Trash2, UserPlus } from "lucide-react"
import GlassButton from "../../components/ui/GlassButton"
import FormInput from "../../components/ui/FormInput"
import ConfirmModal from "../../components/mainpage/sidebar/AdminDrawer/ConfirmModal"
import { fadeSlideUp } from "../../constants/animations"
import type { Family, FamilyStatus } from "./systemAdminTypes"

interface FamilyOverviewProps {
    isDarkMode: boolean
    families: Family[]
    onFamiliesChange: (families: Family[]) => void
    onSelectFamily: (family: Family) => void
}

function FamilyOverview({ isDarkMode, families, onFamiliesChange, onSelectFamily }: FamilyOverviewProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<FamilyStatus | "alle">("alle")
    const [expandedFamilyId, setExpandedFamilyId] = useState<number | null>(null)
    const [pendingDelete, setPendingDelete] = useState<Family | null>(null)
    const [pendingStatusToggle, setPendingStatusToggle] = useState<Family | null>(null)

    const glassCard = isDarkMode
        ? "bg-white/5 border-white/10"
        : "bg-sky-100/40 border-cyan-950/20"

    const textPrimary = isDarkMode ? "text-gray-200" : "text-gray-700"
    const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500"

    const filteredFamilies = families.filter((family) => {
        const matchesSearch =
            family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            family.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "alle" || family.status === statusFilter
        return matchesSearch && matchesStatus
    })

    function toggleExpand(id: number) {
        setExpandedFamilyId((prev) => (prev === id ? null : id))
    }

    function confirmToggleStatus() {
        if (!pendingStatusToggle) return
        const updated = families.map((f) =>
            f.id === pendingStatusToggle.id
                ? { ...f, status: f.status === "aktiv" ? "gesperrt" : "aktiv" as FamilyStatus }
                : f
        )
        onFamiliesChange(updated)
        setPendingStatusToggle(null)
    }

    function confirmDelete() {
        if (!pendingDelete) return
        onFamiliesChange(families.filter((f) => f.id !== pendingDelete.id))
        setPendingDelete(null)
    }

    return (
        <motion.div {...fadeSlideUp} className="flex flex-col gap-4 w-full">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <FormInput
                        isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Familie oder E-Mail suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm"
                    />
                </div>
                <div className={`rounded-xl p-0.5 ${isDarkMode ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50" : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30"}`}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as FamilyStatus | "alle")}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold focus:outline-none border ${isDarkMode ? "bg-gray-800 text-gray-200 border-white/10" : "bg-white text-gray-700 border-cyan-950/5"}`}
                    >
                        <option value="alle">Alle</option>
                        <option value="aktiv">Aktiv</option>
                        <option value="gesperrt">Gesperrt</option>
                    </select>
                </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-3">
                {[
                    { label: "Gesamt", value: families.length },
                    { label: "Aktiv", value: families.filter((f) => f.status === "aktiv").length },
                    { label: "Gesperrt", value: families.filter((f) => f.status === "gesperrt").length },
                ].map((stat) => (
                    <div key={stat.label} className={`relative flex-1 rounded-xl border p-3 text-center ${glassCard}`}>
                        <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                        <p className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</p>
                        <p className={`text-xs ${textSecondary}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Family list */}
            <div className="flex flex-col gap-2">
                {filteredFamilies.length === 0 && (
                    <p className={`text-center py-8 text-sm ${textSecondary}`}>Keine Familien gefunden.</p>
                )}
                {filteredFamilies.map((family) => (
                    <div key={family.id} className={`relative rounded-xl border overflow-hidden ${glassCard}`}>
                        <div className={`absolute inset-x-0 top-0 h-6 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />

                        {/* Header row */}
                        <div className="flex items-center gap-3 px-4 py-3">
                            <button
                                onClick={() => toggleExpand(family.id)}
                                className={`flex-1 flex items-center gap-3 text-left ${textPrimary}`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{family.name}</p>
                                    <p className={`text-xs truncate ${textSecondary}`}>{family.email}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${family.status === "aktiv" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                        {family.status}
                                    </span>
                                    <span className={`text-xs ${textSecondary}`}>{family.members.length} Mitglieder</span>
                                    {expandedFamilyId === family.id
                                        ? <ChevronUp size={16} className={textSecondary} />
                                        : <ChevronDown size={16} className={textSecondary} />
                                    }
                                </div>
                            </button>

                            {/* Actions */}
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setPendingStatusToggle(family)}
                                    title={family.status === "aktiv" ? "Sperren" : "Entsperren"}
                                    className={`p-1.5 rounded-lg border transition-all hover:brightness-110 ${isDarkMode ? "border-white/10 text-gray-400 hover:text-gray-200" : "border-cyan-950/10 text-gray-500 hover:text-gray-700"}`}
                                >
                                    {family.status === "aktiv" ? <Lock size={15} /> : <Unlock size={15} />}
                                </button>
                                <button
                                    onClick={() => onSelectFamily(family)}
                                    title="Mitglieder verwalten"
                                    className={`p-1.5 rounded-lg border transition-all hover:brightness-110 ${isDarkMode ? "border-white/10 text-gray-400 hover:text-gray-200" : "border-cyan-950/10 text-gray-500 hover:text-gray-700"}`}
                                >
                                    <UserPlus size={15} />
                                </button>
                                <button
                                    onClick={() => setPendingDelete(family)}
                                    title="Löschen"
                                    className="p-1.5 rounded-lg border transition-all hover:brightness-110 border-red-500/30 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Expanded detail */}
                        <AnimatePresence>
                            {expandedFamilyId === family.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className={`px-4 pb-3 pt-1 border-t flex flex-wrap gap-2 ${isDarkMode ? "border-white/10" : "border-cyan-950/10"}`}>
                                        <div className={`text-xs ${textSecondary}`}>
                                            Registriert: <span className={`font-semibold ${textPrimary}`}>{family.registeredAt}</span>
                                        </div>
                                        <span className={`text-xs ${textSecondary}`}>·</span>
                                        <div className={`text-xs ${textSecondary}`}>
                                            ID: <span className={`font-semibold ${textPrimary}`}>{family.id}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Neue Familie anlegen */}
            <div className="flex justify-end">
                <GlassButton isDarkMode={!isDarkMode} className="px-4 py-2 text-sm flex items-center gap-2">
                    <UserPlus size={15} />
                    Neue Familie anlegen
                </GlassButton>
            </div>

            {/* Modals */}
            {pendingStatusToggle && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Familie <strong>{pendingStatusToggle.name}</strong> {pendingStatusToggle.status === "aktiv" ? "sperren" : "entsperren"}?</>}
                    subMessage={pendingStatusToggle.status === "aktiv" ? "Die Familie kann sich nicht mehr einloggen." : "Der Zugang wird wiederhergestellt."}
                    onConfirm={confirmToggleStatus}
                    onCancel={() => setPendingStatusToggle(null)}
                />
            )}
            {pendingDelete && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Familie <strong>{pendingDelete.name}</strong> endgültig löschen?</>}
                    subMessage="Alle Mitglieder und Daten gehen verloren."
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
        </motion.div>
    )
}

export default FamilyOverview
