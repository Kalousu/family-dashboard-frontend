import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import GlassButton from "../../../ui/GlassButton"
import { handleToggle } from "./handleToggle"
import imageIcons from "../../../../constants/imageIcons"
import { changeUserRole, setUserPin, type ChangeUserRoleRequest } from "../../../../api/userApi"
import useAuth from "../../../../hooks/useAuth"
import type { Member } from "./AdminDrawer"
import SetPinModal from "./SetPinModal"

interface RoleSectionProps {
    isDarkMode: boolean
    members: Member[]
    onMembersUpdate?: () => void
}

function RoleSection({ isDarkMode, members, onMembersUpdate }: RoleSectionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
    const [pinModalFor, setPinModalFor] = useState<Member | null>(null)
    const { currentUser } = useAuth()

    // Calculate roles directly from members data
    const memberRoles = Object.fromEntries(
        members.map(m => [m.id, m.role === 'FAMILY_ADMIN' ? 'Admin' : 'Mitglied'])
    )

    const handleRoleChange = async (userId: number, newRole: string) => {
        if (newRole === 'Admin') {
            const member = members.find(m => m.id === userId)
            if (member) {
                setOpenDropdownId(null)
                setPinModalFor(member)
            }
            return
        }
        try {
            await changeUserRole(userId, { userRole: 'USER' })
            setOpenDropdownId(null)
            if (onMembersUpdate) onMembersUpdate()
        } catch (error) {
            console.error('Failed to change user role:', error)
        }
    }

    const handlePinConfirm = async (pin: string) => {
        if (!pinModalFor) return
        try {
            await changeUserRole(pinModalFor.id, { userRole: 'FAMILY_ADMIN' })
            await setUserPin(pinModalFor.id, pin)
            setPinModalFor(null)
            if (onMembersUpdate) onMembersUpdate()
        } catch (error) {
            console.error('Failed to promote user to admin:', error)
        }
    }

    useEffect(() => {
        if (openDropdownId === null) return
        const handleClick = () => setOpenDropdownId(null)
        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [openDropdownId])

    return (
        <>
            {pinModalFor && (
                <SetPinModal
                    userName={pinModalFor.name}
                    isDarkMode={isDarkMode}
                    onConfirm={handlePinConfirm}
                    onCancel={() => setPinModalFor(null)}
                />
            )}
            <GlassButton isDarkMode={!isDarkMode} onClick={() => handleToggle(setIsOpen)} className="mt-1 mb-1 p-3 w-full text-left">
                Rollen verwalten
            </GlassButton>

            {isOpen && (
                <div className={`mx-1 mb-2 p-3 rounded-xl border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-sky-100/40 border-cyan-950/20"}`}>
                    <div className="flex-col flex-wrap gap-3">
                        {members.map(member => {
                            const Icon = imageIcons[member.icon]
                            const isCurrentUser = currentUser?.id === member.id
                            return (
                                <div key={member.id} className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                                        style={{ backgroundColor: member.color + "33" }}
                                    >
                                        <Icon size={24} style={{ color: member.color }} />
                                    </div>
                                    <span className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        {member.name}
                                    </span>
                                    <div
                                        className="relative ml-auto"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {isCurrentUser ? (
                                            <div className={`px-2 py-1 rounded-md border text-sm ${isDarkMode ? "bg-white/5 border-white/10 text-gray-500" : "bg-white/60 border-cyan-950/20 text-gray-500"}`}>
                                                {memberRoles[member.id]}
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                                                    className={`flex items-center gap-1 px-2 py-1 rounded-md border text-sm ${isDarkMode ? "bg-white/5 border-white/10 text-gray-300 hover:text-white" : "bg-white/60 border-cyan-950/20 text-gray-600 hover:text-cyan-600"}`}
                                                >
                                                    {memberRoles[member.id]}
                                                    <ChevronDown size={14} />
                                                </button>
                                                {openDropdownId === member.id && (
                                                    <div className={`absolute right-0 top-full mt-1 z-10 rounded-md shadow-lg border ${isDarkMode ? "bg-gray-800 border-white/10" : "bg-white border-cyan-950/20"}`}>
                                                        {["Admin", "Mitglied"].map(role => (
                                                            <button
                                                                key={role}
                                                                onClick={() => handleRoleChange(member.id, role)}
                                                                className={`block w-full text-left px-3 py-1.5 text-sm ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}
                                                            >
                                                                {role}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}

export default RoleSection
