import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import imageIcons from "../../../../constants/imageIcons"
import InviteSection from "./InviteSection"
import DeleteSection from "./DeleteSection"
import RoleSection from "./RoleSection"

export interface Member {
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

interface AdminDrawerProps {
    onBack: () => void
    isDarkMode: boolean
}

function AdminDrawer({ onBack, isDarkMode }: AdminDrawerProps) {
    const [members, setMembers] = useState<Member[]>(mockMembers) //durch API ersetzen

    return (
        <div className="flex flex-col h-full">
            <ChevronLeft
                className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-sky-900 hover:text-cyan-600" : "text-gray-400 hover:text-white"}`}
                size={30}
                onClick={onBack}
            />

            <div className="mt-2 flex flex-col">

                <InviteSection isDarkMode={isDarkMode} />

                <DeleteSection
                    isDarkMode={isDarkMode}
                    members={members}
                    onDelete={setMembers}
                />

                <RoleSection
                    isDarkMode={isDarkMode}
                    members={members}
                />

            </div>
        </div>
    )
}

export default AdminDrawer
