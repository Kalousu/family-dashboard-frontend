import { useState } from "react"
import { Trash2 } from "lucide-react"
import GlassButton from "../../../ui/GlassButton"
import { handleToggle } from "./handleToggle"
import imageIcons from "../../../../constants/imageIcons"
import ConfirmModal from "./ConfirmModal"
import type { Member } from "./AdminDrawer"

interface DeleteSectionProps {
    isDarkMode: boolean
    members: Member[]
    onDelete: (updatedMembers: Member[]) => void
}

function DeleteSection({ isDarkMode, members, onDelete }: DeleteSectionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)

    function handleDelete() {
        if (memberToDelete) {
            onDelete(members.filter(m => m.id !== memberToDelete.id))
            setMemberToDelete(null)
        }
    }

    return (
        <>
            <GlassButton isDarkMode={isDarkMode} onClick={() => handleToggle(setIsOpen)} className="mt-1 mb-1 p-3 w-full text-left">
                Mitglied löschen
            </GlassButton>

            {isOpen && (
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

            {memberToDelete && (
                <ConfirmModal
                    isDarkMode={isDarkMode}
                    message={<>Wollen Sie <span className="font-bold">{memberToDelete.name}</span> wirklich löschen?</>}
                    subMessage="Unwiderruflich."
                    onConfirm={handleDelete}
                    onCancel={() => setMemberToDelete(null)}
                />
            )}
        </>
    )
}

export default DeleteSection
