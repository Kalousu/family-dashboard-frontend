import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Trash2, UserPlus } from "lucide-react"
import FormInput from "../../components/ui/FormInput"
import ConfirmModal from "../../components/mainpage/sidebar/AdminDrawer/ConfirmModal"
import { fadeSlideUp } from "../../constants/animations"
import type { Family } from "./systemAdminTypes"
import useAdminTheme from "../../hooks/useAdminTheme"
import { deleteFamily } from "../../api/familyApi"

// =============================================================================
// API-ANBINDUNG — FamilyOverview
//
// INITIALDATEN (beim Mounten der Komponente laden):
//   GET /families
//   Response: Family[]
//   → ersetzt den families-State, der aktuell als Prop mit MOCK_FAMILIES befüllt wird.
//   In SystemAdminPage.tsx: useEffect(() => { api.get('/families').then(...) }, [])
//
// FAMILIE SPERREN / ENTSPERREN (confirmToggleStatus):
//   PATCH /families/:id/status
//   Body: { status: "aktiv" | "gesperrt" }
//   → nach erfolgreichem Call den lokalen State aktualisieren (oder neu laden).
//
// FAMILIE LÖSCHEN (confirmDelete):
//   DELETE /families/:id
//   → nach erfolgreichem Call die Familie aus dem lokalen State entfernen.
//
// =============================================================================

interface FamilyOverviewProps {
    isDarkMode: boolean
    families: Family[]
    onFamiliesChange: (families: Family[]) => void
    onSelectFamily: (family: Family) => void
}

function FamilyOverview({ isDarkMode, families, onFamiliesChange, onSelectFamily }: FamilyOverviewProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedFamilyId, setExpandedFamilyId] = useState<number | null>(null)
    const [pendingDelete, setPendingDelete] = useState<Family | null>(null)

    const { glassCard, textPrimary, textSecondary, border } = useAdminTheme(isDarkMode)

    const filteredFamilies = families.filter((family) => {
        const matchesSearch =
            family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            family.email.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    function toggleExpand(id: number) {
        setExpandedFamilyId((prev) => (prev === id ? null : id))
    }

    async function confirmDelete() {
        if (!pendingDelete) return
        
        try {
            await deleteFamily(pendingDelete.id)
            // Only update UI if API call was successful
            onFamiliesChange(families.filter((f) => f.id !== pendingDelete.id))
            setPendingDelete(null)
        } catch (error) {
            console.error('Failed to delete family:', error)
            // TODO: Show error message to user
            setPendingDelete(null)
        }
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
                                    onClick={() => onSelectFamily(family)}
                                    title="Mitglieder verwalten"
                                    className="p-1.5 rounded-lg border transition-all hover:brightness-110 border-blue-500/30 text-blue-400 hover:text-blue-300"
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
                                    <div className={`px-4 pb-3 pt-1 border-t flex flex-wrap gap-2 ${border}`}>
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

            {/* Modals */}
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
