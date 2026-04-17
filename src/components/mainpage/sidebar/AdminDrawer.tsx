import { ChevronLeft, Copy, Check, Trash2, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import GlassButton from "../../ui/GlassButton"
import { handleToggle } from "./handleToggle"
import imageIcons from "../../../constants/imageIcons"
import ConfirmModal from "./ConfirmModal"


//Mock Daten
interface Member {
    id: number
    name: string
    icon: keyof typeof imageIcons
    color: string
}

const mockMembers: Member[] = [
    { id: 1, name: "Kevin",  color: "#3b82f6", icon: "gamepad" }, //Kind
    { id: 2, name: "Jonas",  color: "#ef4444", icon: "dog"     }, //Kind2
    { id: 3, name: "Daniel", color: "#4ade80", icon: "sun"     },
    { id: 4, name: "Lea",    color: "#f472b6", icon: "flower"  }, //AuPair
    { id: 5, name: "Katrin", color: "#7dd3fc", icon: "cat"     },
]
//------------

interface AdminDrawerProps {
    onBack: () => void
    isDarkMode: boolean
}

function AdminDrawer({ onBack, isDarkMode }: AdminDrawerProps) {
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isRoleOpen, setIsRoleOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [members, setMembers] = useState<Member[]>(mockMembers) //durch API ersetzen
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
    const [memberRoles, setMemberRoles] = useState<Record<number, string>>(
        () => Object.fromEntries(mockMembers.map(m => [m.id, "Systemadmin"])) //Rolle muss durch API kommen, hier Default auf Systemadmin gesetzt
    )
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

    const inviteLink = `${window.location.origin}/invite/abc123`

    function handleCopy() {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
    }

    useEffect(() => {
        if (!copied) return
        const timer = setTimeout(() => setCopied(false), 2000)
        return () => clearTimeout(timer)
    }, [copied])

    useEffect(() => {
        if (openDropdownId === null) return
        const handleClick = () => setOpenDropdownId(null)
        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [openDropdownId])

    function handleDelete() {
        if (memberToDelete) {
            setMembers(prev => prev.filter(m => m.id !== memberToDelete.id))
            setMemberToDelete(null)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft
                className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-sky-900 hover:text-cyan-600" : "text-gray-400 hover:text-white"}`}
                size={30}
                onClick={onBack}
            />

            <div className="mt-2 flex flex-col">

                {/* Neues Mitglied einladen */}
                <GlassButton isDarkMode={isDarkMode} onClick={() => handleToggle(setIsInviteOpen)} className="mt-1 mb-1 p-3 w-full text-left">
                    neues Mitglied einladen
                </GlassButton>

                {isInviteOpen && (
                    <div className={`mx-1 mb-2 p-3 rounded-xl border ${isDarkMode ? "bg-sky-100/40 border-cyan-950/20" : "bg-white/5 border-white/10"}`}>
                        <p className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>Einladungslink</p>
                        <div className="flex items-center gap-2">
                            <input
                                readOnly
                                value={inviteLink}
                                className={`flex-1 text-xs px-3 py-2 rounded-xl border outline-none truncate ${isDarkMode ? "bg-white/60 border-cyan-950/20 text-gray-600" : "bg-white/5 border-white/10 text-gray-300"}`}
                            />
                            <button
                                onClick={handleCopy}
                                className={`p-2 rounded-xl border transition-all hover:scale-105 ${isDarkMode ? "bg-white/60 border-cyan-950/20 text-gray-600 hover:text-cyan-600" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                        {copied && (
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-cyan-600" : "text-green-400"}`}>Link kopiert!</p>
                        )}
                    </div>
                )}

                {/* Mitglied löschen */}
                <GlassButton isDarkMode={isDarkMode} onClick={() => handleToggle(setIsDeleteOpen)} className="mt-1 mb-1 p-3 w-full text-left">
                    Mitglied löschen
                </GlassButton>

                {isDeleteOpen && (
                    <div className={`mx-1 mb-2 p-3 rounded-xl border ${isDarkMode ? "bg-sky-100/40 border-cyan-950/20" : "bg-white/5 border-white/10"}`}>
                        <div className="flex flex-wrap gap-3">
                            {members.map(member => {
                                const Icon = imageIcons[member.icon]
                                return (
                                    <div key={member.id} className="flex flex-col items-center gap-1">
                                        <div className="relative group">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                                                style={{ backgroundColor: member.color + "33" }}
                                            >
                                                <Icon size={24} style={{ color: member.color }} />
                                            </div>
                                            <div
                                                className="absolute inset-0 rounded-xl flex items-center justify-center bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                onClick={() => setMemberToDelete(member)}
                                               >
                                                <Trash2 size={18} className="text-white" />
                                            </div>
                                        </div>
                                        <span className={`text-xs truncate max-w-12 text-center ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>
                                            {member.name}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Rollen verwalten */}
                <GlassButton isDarkMode={isDarkMode} onClick={() => handleToggle(setIsRoleOpen)} className="mt-1 mb-1 p-3 w-full text-left">
                    Rollen verwalten
                </GlassButton>
                {isRoleOpen && (
                    <div className={`mx-1 mb-2 p-3 rounded-xl border ${isDarkMode ? "bg-sky-100/40 border-cyan-950/20" : "bg-white/5 border-white/10"}`}>
                        <div className="flex-col flex-wrap gap-3">
                            {members.map(member => {
                                const Icon = imageIcons[member.icon]
                                return (
                                    <div key={member.id} className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                                            style={{ backgroundColor: member.color + "33" }}
                                        >
                                            <Icon size={24} style={{ color: member.color }} />
                                        </div>
                                        <span className={`text-sm text-center ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>
                                            {member.name}
                                        </span>
                                        {/* Rolle Dropdown */}
                                        <div
                                            className="relative ml-auto"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                                                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-sm ${isDarkMode ? "bg-white/60 border-cyan-950/20 text-gray-600 hover:text-cyan-600" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}
                                            >
                                                {memberRoles[member.id]}
                                                <ChevronDown size={14} />
                                            </button>
                                            {openDropdownId === member.id && (
                                                <div className={`absolute right-0 top-full mt-1 z-10 rounded-md shadow-lg border ${isDarkMode ? "bg-white border-cyan-950/20" : "bg-gray-800 border-white/10"}`}>
                                                    {["Admin", "Mitglied", "Gast"].map(role => (
                                                        <button
                                                            key={role}
                                                            onClick={() => { setMemberRoles(prev => ({ ...prev, [member.id]: role })); setOpenDropdownId(null) }}
                                                            className={`block w-full text-left px-3 py-1.5 text-sm ${isDarkMode ? "text-gray-600 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"}`}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>

            {/* Confirmation Modal */}
            {memberToDelete && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Wollen Sie <span className="font-bold">{memberToDelete.name}</span> wirklich löschen?</>}
                    subMessage="Unwiderruflich."
                    onConfirm={handleDelete}
                    onCancel={() => setMemberToDelete(null)}
                />
            )}
        </div>
    )
}

export default AdminDrawer
