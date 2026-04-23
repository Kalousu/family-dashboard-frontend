import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Trash2, RefreshCw, User } from "lucide-react"
import FormInput from "../../components/ui/FormInput"
import ConfirmModal from "../../components/mainpage/sidebar/AdminDrawer/ConfirmModal"
import { fadeSlideUp } from "../../constants/animations"
import type { Family, MemberRole, SystemUser } from "./systemAdminTypes"
import useAdminTheme from "../../hooks/useAdminTheme"
import imageIcons from "../../constants/imageIcons"

// =============================================================================
// API-ANBINDUNG — UserManagement
//
// INITIALDATEN (beim Mounten laden):
//   GET /users
//   Response: Array von { id, name, icon, color, role, isLocked, familyId, familyName }
//   → aktuell werden alle User aus dem families-Prop per flatMap abgeleitet.
//     Sobald das Backend einen eigenen /users-Endpunkt liefert, kann dieser
//     State unabhängig vom families-State befüllt werden.
//
// BENUTZER SPERREN / ENTSPERREN (confirmLockToggle):
//   PATCH /users/:id/status
//   Body: { isLocked: true | false }
//   → nach erfolgreichem Call den lokalen State aktualisieren.
//
// BENUTZER LÖSCHEN (confirmDelete):
//   DELETE /users/:id
//   → nach erfolgreichem Call den User aus dem lokalen State entfernen.
//     Achtung: auch den families-State in SystemAdminPage.tsx aktualisieren,
//     damit MemberManagement konsistent bleibt (onFamiliesChange aufrufen).
//
// PASSWORT-RESET AUSLÖSEN (confirmReset):
//   POST /users/:id/password-reset
//   Body: {} (leer — das Backend verschickt die E-Mail selbst)
//   → aktuell nur alert(). Den alert() durch den API-Call ersetzen.
//     Erfolgsmeldung danach als Toast/Hinweis im UI anzeigen.
// =============================================================================

interface UserManagementProps {
    isDarkMode: boolean
    families: Family[]
    onFamiliesChange: (families: Family[]) => void
}

function UserManagement({ isDarkMode, families, onFamiliesChange }: UserManagementProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<MemberRole | "alle">("alle")
    const [pendingDelete, setPendingDelete] = useState<SystemUser | null>(null)
    const [pendingReset, setPendingReset] = useState<SystemUser | null>(null)

    const { glassCard, shine, textPrimary, textSecondary, border, inputWrapper, inputField } = useAdminTheme(isDarkMode)

    const allUsers = useMemo<SystemUser[]>(() =>
        families.flatMap((family) =>
            family.members.map((member) => ({
                ...member,
                familyId: family.id,
                familyName: family.name,
            }))
        ),
        [families]
    )

    const filteredUsers = useMemo(() =>
        allUsers.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.familyName.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesRole = roleFilter === "alle" || user.role === roleFilter
            return matchesSearch && matchesRole
        }),
        [allUsers, searchTerm, roleFilter]
    )

    function removeMemberFromFamily(user: SystemUser) {
        const updatedFamilies = families.map((family) => {
            if (family.id !== user.familyId) return family
            return { ...family, members: family.members.filter((m) => m.id !== user.id) }
        })
        onFamiliesChange(updatedFamilies)
    }

    function confirmDelete() {
        if (!pendingDelete) return
        removeMemberFromFamily(pendingDelete)
        setPendingDelete(null)
    }

    function confirmReset() {
        // evtl, hier API call für Passwort-Reset einbauen, momentan nur Alert
        alert(`Passwort-Reset für ${pendingReset?.name} wurde ausgelöst.`)
        setPendingReset(null)
    }

    return (
        <motion.div {...fadeSlideUp} className="flex flex-col gap-4 w-full">
            {/* Stats */}
            <div className="flex gap-3">
                {[
                    { label: "Gesamt", value: allUsers.length },
                    { label: "Aktiv", value: allUsers.filter((u) => !u.isLocked).length },
                    { label: "Gesperrt", value: allUsers.filter((u) => u.isLocked).length },
                ].map((stat) => (
                    <div key={stat.label} className={`relative flex-1 rounded-xl border p-3 text-center ${glassCard}`}>
                        <div className={`absolute inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${shine}`} />
                        <p className={`text-2xl font-bold ${textPrimary}`}>{stat.value}</p>
                        <p className={`text-xs ${textSecondary}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <FormInput
                        isDarkMode={isDarkMode}
                        type="text"
                        placeholder="Name oder Familie suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm"
                    />
                </div>
                <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as MemberRole | "alle")}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold focus:outline-none border ${inputField}`}
                    >
                        <option value="alle">Alle Rollen</option>
                        <option value="Mitglied">Mitglied</option>
                        <option value="Familienadministrator">Familienadmin</option>
                    </select>
                </div>
            </div>

            {/* User table */}
            <div className={`relative rounded-xl border overflow-hidden ${glassCard}`}>
                <div className={`absolute inset-x-0 top-0 h-10 pointer-events-none ${shine}`} />

                {/* Table header */}
                <div className={`grid grid-cols-[1fr_1fr_auto_auto] gap-2 px-4 py-2 border-b text-xs font-semibold ${textSecondary} ${border}`}>
                    <span>Benutzer</span>
                    <span>Familie · Rolle</span>
                    <span className="text-center">Status</span>
                    <span className="text-center">Aktionen</span>
                </div>

                {filteredUsers.length === 0 && (
                    <p className={`text-center py-8 text-sm ${textSecondary}`}>Keine Benutzer gefunden.</p>
                )}

                {filteredUsers.map((user, index) => (
                    <div
                        key={user.id}
                        className={`grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center px-4 py-3 ${index < filteredUsers.length - 1 ? `border-b ${border}` : ""}`}
                    >
                        {/* Name with profile picture */}
                        <div className="flex items-center gap-2 min-w-0">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-white/10 overflow-hidden"
                                style={{ backgroundColor: user.color + "33" }}
                            >
                                {user.icon.startsWith('http') ? (
                                    // URL-based avatar
                                    <img 
                                        src={user.icon} 
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to User icon if image fails to load
                                            const target = e.target as HTMLImageElement
                                            target.style.display = 'none'
                                            target.nextElementSibling?.classList.remove('hidden')
                                        }}
                                    />
                                ) : (
                                    // Icon-based avatar
                                    (() => {
                                        const IconComponent = imageIcons[user.icon as keyof typeof imageIcons] ?? User
                                        return <IconComponent size={14} style={{ color: user.color }} />
                                    })()
                                )}
                                {/* Fallback icon (hidden by default, shown if image fails) */}
                                <User size={14} style={{ color: user.color }} className="hidden" />
                            </div>
                            <span className={`truncate text-sm font-semibold ${textPrimary} ${user.isLocked ? "opacity-50" : ""}`}>
                                {user.name}
                            </span>
                        </div>

                        {/* Family & role */}
                        <div className="min-w-0">
                            <p className={`text-xs truncate ${textSecondary}`}>{user.familyName}</p>
                            <p className={`text-xs font-medium truncate ${textPrimary}`}>
                                {user.role === "Familienadministrator" ? "Familienadmin" : "Mitglied"}
                            </p>
                        </div>

                        {/* Status badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${user.isLocked ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                            {user.isLocked ? "gesperrt" : "aktiv"}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setPendingReset(user)}
                                title="Passwort-Reset"
                                className="p-1.5 rounded-lg border transition-all hover:brightness-110 border-blue-500/30 text-blue-400 hover:text-blue-300"
                            >
                                <RefreshCw size={13} />
                            </button>
                            <button
                                onClick={() => setPendingDelete(user)}
                                title="Löschen"
                                className="p-1.5 rounded-lg border transition-all hover:brightness-110 border-red-500/30 text-red-400 hover:text-red-300"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {pendingDelete && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Benutzer <strong>{pendingDelete.name}</strong> löschen?</>}
                    subMessage={`Aus der Familie "${pendingDelete.familyName}" entfernen.`}
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
            {pendingReset && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Passwort-Reset für <strong>{pendingReset.name}</strong> auslösen?</>}
                    subMessage="Der Benutzer erhält eine E-Mail mit einem Reset-Link."
                    onConfirm={confirmReset}
                    onCancel={() => setPendingReset(null)}
                />
            )}
        </motion.div>
    )
}

export default UserManagement
