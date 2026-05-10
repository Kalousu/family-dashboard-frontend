import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, User, Trash2 } from "lucide-react"
import GlassButton from "../../components/ui/GlassButton"
import AdminSelect from "../../components/ui/AdminSelect"
import ConfirmModal from "../../components/mainpage/sidebar/AdminDrawer/ConfirmModal"
import { fadeSlideUp } from "../../constants/animations"
import imageIcons from "../../constants/imageIcons"
import type { Family, FamilyMember, MemberRole } from "./systemAdminTypes"
import useAdminTheme from "../../hooks/useAdminTheme"
import { changeUserRole } from "../../api/userApi"

interface MemberManagementProps {
    isDarkMode: boolean
    family: Family
    onBack: () => void
    onFamilyChange: (updated: Family) => void
}

function MemberManagement({ isDarkMode, family, onBack, onFamilyChange }: MemberManagementProps) {
    const [pendingDelete, setPendingDelete] = useState<FamilyMember | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    const { glassCard, shine, textPrimary, textSecondary } = useAdminTheme(isDarkMode)

    function updateMembers(members: FamilyMember[]) {
        onFamilyChange({ ...family, members })
    }

    async function handleRoleChange(memberId: number, role: MemberRole) {
        setActionError(null)
        try {
            const backendRole = role === 'Familienadministrator' ? 'FAMILY_ADMIN' : 'USER'
            await changeUserRole(memberId, { userRole: backendRole })
            updateMembers(
                family.members.map((m) => (m.id === memberId ? { ...m, role } : m))
            )
        } catch {
            setActionError("Rolle konnte nicht geändert werden.")
        }
    }

    function confirmDelete() {
        if (!pendingDelete) return
        updateMembers(family.members.filter((m) => m.id !== pendingDelete.id))
        setPendingDelete(null)
    }

    return (
        <motion.div {...fadeSlideUp} className="flex flex-col gap-4 w-full will-change-transform">
            {actionError && <p className="text-red-400 text-sm text-center">{actionError}</p>}
            <div className="flex items-center gap-3">
                <GlassButton isDarkMode={!isDarkMode} onClick={onBack} className="p-2 shrink-0">
                    <ArrowLeft size={16} />
                </GlassButton>
                <div className="flex-1 min-w-0">
                    <h2 className={`font-bold text-lg truncate ${textPrimary}`}>{family.name}</h2>
                    <p className={`text-xs truncate ${textSecondary}`}>{family.email}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${family.status === "aktiv" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {family.status}
                </span>
            </div>

            <div className="flex gap-3">
                {[
                    { label: "Mitglieder", value: family.members.length },
                    { label: "Admins", value: family.members.filter((m) => m.role === "Familienadministrator").length },
                    { label: "Gesperrt", value: family.members.filter((m) => m.isLocked).length },
                ].map((stat) => (
                    <div key={stat.label} className={`relative flex-1 rounded-xl border p-3 text-center ${glassCard}`}>
                        <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${shine}`} />
                        <p className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</p>
                        <p className={`text-xs ${textSecondary}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2">
                {family.members.length === 0 && (
                    <p className={`text-center py-8 text-sm ${textSecondary}`}>Keine Mitglieder vorhanden.</p>
                )}
                {family.members.map((member) => {
                    const IconComponent = imageIcons[member.icon as keyof typeof imageIcons] ?? User
                    return (
                        <div key={member.id} className={`relative rounded-xl border px-4 py-3 flex items-center gap-3 ${glassCard} ${member.isLocked ? "opacity-60" : ""}`}>
                            <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${shine}`} />

                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 overflow-hidden"
                                style={{ backgroundColor: member.color + "33" }}
                            >
                                {member.icon.startsWith('http') ? (
                                    <img
                                        src={member.icon}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                            target.nextElementSibling?.classList.remove('hidden')
                                        }}
                                    />
                                ) : (
                                    <IconComponent size={20} style={{ color: member.color }} />
                                )}
                                <User size={20} style={{ color: member.color }} className="hidden" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className={`font-semibold truncate ${textPrimary}`}>{member.name}</p>
                                </div>

                                <AdminSelect
                                    value={member.role}
                                    onChange={(val) => handleRoleChange(member.id, val as MemberRole)}
                                    options={[
                                        { value: "Mitglied", label: "Mitglied" },
                                        { value: "Familienadministrator", label: "Familienadmin" },
                                    ]}
                                    isDarkMode={isDarkMode}
                                    className="mt-1"
                                />
                            </div>

                            {member.role === "Familienadministrator" && (
                                <Shield size={14} className="text-blue-400 shrink-0" />
                            )}

                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => setPendingDelete(member)}
                                    title="Entfernen"
                                    className="min-w-11 min-h-11 flex items-center justify-center rounded-lg border touch-manipulation transition-all hover:brightness-110 active:scale-95 border-red-500/30 text-red-400 hover:text-red-300"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

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
