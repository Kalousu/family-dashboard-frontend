import { ChevronLeft } from "lucide-react"
import { useState, useEffect } from "react"
import imageIcons from "../../../../constants/imageIcons"
import InviteSection from "./InviteSection"
import RoleSection from "./RoleSection"
import AddDeleteSection from "./AddDeleteSection"
import { getUsersForFamily } from "../../../../api/familyApi"
import useAuth from "../../../../hooks/useAuth"
import type { UserProfile } from "../../../../types/authTypes"

export interface Member {
    id: number
    name: string
    icon: keyof typeof imageIcons
    color: string
    role: string
}

interface AdminDrawerProps {
    onBack: () => void
    isDarkMode: boolean
}

function AdminDrawer({ onBack, isDarkMode }: AdminDrawerProps) {
    const [members, setMembers] = useState<Member[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { familyId } = useAuth()

    const fetchMembers = async () => {
        if (!familyId) return
        
        try {
            setIsLoading(true)
            const users = await getUsersForFamily(familyId)
            
            // Convert UserProfile to Member format
            const convertedMembers: Member[] = users.map((user: UserProfile) => ({
                id: user.id,
                name: user.name,
                icon: (user.avatarType === 'ICON' ? user.avatar : 'user') as keyof typeof imageIcons,
                color: user.color || '#6b7280',
                role: user.role
            }))
            
            setMembers(convertedMembers)
        } catch (error) {
            console.error('Failed to fetch family members:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [familyId])

    if (isLoading) {
        return (
            <div className="flex flex-col h-full">
                <ChevronLeft
                    className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-sky-900 hover:text-cyan-600"}`}
                    size={30}
                    onClick={onBack}
                />
                <div className="flex items-center justify-center mt-8">
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Lade Mitglieder...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft
                className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-sky-900 hover:text-cyan-600"}`}
                size={30}
                onClick={onBack}
            />

            <div className="mt-2 flex flex-col">

                <InviteSection isDarkMode={isDarkMode} />

                <AddDeleteSection
                    isDarkMode={isDarkMode}
                    members={members}
                    onMembersUpdate={fetchMembers}
                />

                <RoleSection
                    isDarkMode={isDarkMode}
                    members={members}
                    onMembersUpdate={fetchMembers}
                />

            </div>
        </div>
    )
}

export default AdminDrawer
