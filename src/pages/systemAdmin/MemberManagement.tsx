import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, User, Lock, Unlock, Trash2 } from "lucide-react"
import GlassButton from "../../components/ui/GlassButton"
import ConfirmModal from "../../components/mainpage/sidebar/AdminDrawer/ConfirmModal"
import { fadeSlideUp } from "../../constants/animations"
import imageIcons from "../../constants/imageIcons"
import type { Family, FamilyMember, MemberRole } from "./systemAdminTypes"

// =============================================================================
// API-ANBINDUNG — MemberManagement
//
// INITIALDATEN (beim Mounten oder wenn sich family.id ändert):
//   GET /families/:id/members
//   Response: FamilyMember[]
//   → aktuell werden die Members direkt aus dem family-Prop gelesen (kein eigener
//     Fetch nötig, solange GET /families bereits alle Members mitliefert).
//     Falls das Backend Members separat lädt: useEffect auf family.id.
//
// ROLLE ÄNDERN (handleRoleChange — beim Ändern des Dropdowns):
//   PATCH /members/:id/role
//   Body: { role: "Mitglied" | "Familienadministrator" }
//   → nach erfolgreichem Call onFamilyChange mit aktualisiertem Member aufrufen.
//
// MITGLIED SPERREN / ENTSPERREN (confirmLockToggle):
//   PATCH /members/:id/status
//   Body: { isLocked: true | false }
//   → nach erfolgreichem Call onFamilyChange mit aktualisiertem Member aufrufen.
//
// MITGLIED ENTFERNEN (confirmDelete):
//   DELETE /members/:id
//   → nach erfolgreichem Call onFamilyChange ohne das gelöschte Member aufrufen.
// =============================================================================

interface MemberManagementProps {
    isDarkMode: boolean
    family: Family
    onBack: () => void
    onFamilyChange: (updated: Family) => void
}

function MemberManagement({ isDarkMode, family, onBack, onFamilyChange }: MemberManagementProps) {
    const [pendingDelete, setPendingDelete] = useState<FamilyMember | null>(null)
    const [pendingLockToggle, setPendingLockToggle] = useState<FamilyMember | null>(null)

    const glassCard = isDarkMode
        ? "bg-white/5 border-white/10"
        : "bg-sky-100/40 border-cyan-950/20"

    const textPrimary = isDarkMode ? "text-gray-200" : "text-gray-700"
    const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500"

    function updateMembers(members: FamilyMember[]) {
        onFamilyChange({ ...family, members })
    }

    function handleRoleChange(memberId: number, role: MemberRole) {
        updateMembers(
            family.members.map((m) => (m.id === memberId ? { ...m, role } : m))
        )
    }

    function confirmLockToggle() {
        if (!pendingLockToggle) return
        updateMembers(
            family.members.map((m) =>
                m.id === pendingLockToggle.id ? { ...m, isLocked: !m.isLocked } : m
            )
        )
        setPendingLockToggle(null)
    }

    function confirmDelete() {
        if (!pendingDelete) return
        updateMembers(family.members.filter((m) => m.id !== pendingDelete.id))
        setPendingDelete(null)
    }

    return (
        <motion.div {...fadeSlideUp} className="flex flex-col gap-4 w-full">
            {/* Header with back navigation */}
            <div className="flex items-center gap-3">
                <GlassButton isDarkMode={!isDarkMode} onClick={onBack} className="p-2">
                    <ArrowLeft size={16} />
                </GlassButton>
                <div>
                    <h2 className={`font-bold text-lg ${textPrimary}`}>{family.name}</h2>
                    <p className={`text-xs ${textSecondary}`}>{family.email}</p>
                </div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${family.status === "aktiv" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {family.status}
                </span>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
                {[
                    { label: "Mitglieder", value: family.members.length },
                    { label: "Admins", value: family.members.filter((m) => m.role === "Familienadministrator").length },
                    { label: "Gesperrt", value: family.members.filter((m) => m.isLocked).length },
                ].map((stat) => (
                    <div key={stat.label} className={`relative flex-1 rounded-xl border p-3 text-center ${glassCard}`}>
                        <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                        <p className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</p>
                        <p className={`text-xs ${textSecondary}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Member list */}
            <div className="flex flex-col gap-2">
                {family.members.length === 0 && (
                    <p className={`text-center py-8 text-sm ${textSecondary}`}>Keine Mitglieder vorhanden.</p>
                )}
                {family.members.map((member) => {
                    const IconComponent = imageIcons[member.icon as keyof typeof imageIcons] ?? User
                    return (
                        <div key={member.id} className={`relative rounded-xl border px-4 py-3 flex items-center gap-3 ${glassCard} ${member.isLocked ? "opacity-60" : ""}`}>
                            <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />

                            {/* Avatar */}
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                                style={{ backgroundColor: member.color + "33" }}
                            >
                                <IconComponent size={20} style={{ color: member.color }} />
                            </div>

                            {/* Name & role */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`font-semibold truncate ${textPrimary}`}>{member.name}</p>
                                    {member.isLocked && <Lock size={12} className="text-red-400 shrink-0" />}
                                </div>

                                {/* Role select */}
                                <div className={`inline-flex mt-1 rounded-lg p-0.5 ${isDarkMode ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50" : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30"}`}>
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value as MemberRole)}
                                        className={`text-xs px-2 py-1 rounded-md font-semibold focus:outline-none border ${isDarkMode ? "bg-gray-800 text-gray-200 border-white/10" : "bg-white text-gray-700 border-cyan-950/5"}`}
                                    >
                                        <option value="Mitglied">Mitglied</option>
                                        <option value="Familienadministrator">Familienadmin</option>
                                    </select>
                                </div>
                            </div>

                            {/* Admin badge */}
                            {member.role === "Familienadministrator" && (
                                <Shield size={14} className="text-blue-400 shrink-0" />
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setPendingLockToggle(member)}
                                    title={member.isLocked ? "Entsperren" : "Sperren"}
                                    className={`p-1.5 rounded-lg border transition-all hover:brightness-110 ${isDarkMode ? "border-white/10 text-gray-400 hover:text-gray-200" : "border-cyan-950/10 text-gray-500 hover:text-gray-700"}`}
                                >
                                    {member.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                                </button>
                                <button
                                    onClick={() => setPendingDelete(member)}
                                    title="Entfernen"
                                    className="p-1.5 rounded-lg border transition-all hover:brightness-110 border-red-500/30 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modals */}
            {pendingLockToggle && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Mitglied <strong>{pendingLockToggle.name}</strong> {pendingLockToggle.isLocked ? "entsperren" : "sperren"}?</>}
                    onConfirm={confirmLockToggle}
                    onCancel={() => setPendingLockToggle(null)}
                />
            )}
            {pendingDelete && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Mitglied <strong>{pendingDelete.name}</strong> aus der Familie entfernen?</>}
                    subMessage="Diese Aktion kann nicht rückgängig gemacht werden."
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
        </motion.div>
    )
}

export default MemberManagement
