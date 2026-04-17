import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import GlassButton from "../../../ui/GlassButton"
import { handleToggle } from "./handleToggle"
import imageIcons from "../../../../constants/imageIcons"
import type { Member } from "./AdminDrawer"

interface RoleSectionProps {
    isDarkMode: boolean
    members: Member[]
}

function RoleSection({ isDarkMode, members }: RoleSectionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [memberRoles, setMemberRoles] = useState<Record<number, string>>(
        () => Object.fromEntries(members.map(m => [m.id, "Admin"]))
    )
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

    useEffect(() => {
        if (openDropdownId === null) return
        const handleClick = () => setOpenDropdownId(null)
        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [openDropdownId])

    return (
        <>
            <GlassButton isDarkMode={isDarkMode} onClick={() => handleToggle(setIsOpen)} className="mt-1 mb-1 p-3 w-full text-left">
                Rollen verwalten
            </GlassButton>

            {isOpen && (
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
                                                {["Admin", "Mitglied"].map(role => (
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
        </>
    )
}

export default RoleSection
