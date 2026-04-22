import { User } from "lucide-react"
import useDarkMode from "../../hooks/useDarkMode"
import imageIcons from "../../constants/imageIcons"
import type { UserProfile } from "../../types/authTypes"

interface AppHeaderProps {
    onUserClick: () => void
    user: UserProfile | null
}

function AppHeader({ onUserClick, user }: AppHeaderProps) {
    const { isDarkMode } = useDarkMode()

    return (
        <div className={`fixed z-10 top-0 w-full h-13 flex flex-row items-center justify-between p-4 transition-colors duration-300 ${isDarkMode ? "bg-linear-90 from-gray-950 via-gray-900 to-slate-900 border border-white/10" : "bg-linear-90 from-sky-100 to-blue-200 border border-gray-400/20"}`}>
            <p className={`text-center text-2xl font-semibold ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Family-Dashboard</p>
            <div className={`relative rounded-2xl p-2 bg-linear-to-b transition-all scale-35 origin-right hover:scale-36 hover:brightness-105 ${isDarkMode ? "from-gray-500/50 via-gray-600/20 to-blue-400/20 border-2 border-white/10" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 border-2 border-cyan-950/5"}`} onClick={onUserClick}>
                <div className={`absolute rounded-2xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                {user && user.avatarType === "URL" ? (
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 p-1 rounded-xl border-2 object-cover" style={{ borderColor: user.color || '#ffffff50' }} />
                ) : user && user.avatarType === "ICON" ? (
                    (() => {
                        const Icon = imageIcons[user.avatar as keyof typeof imageIcons]
                        return Icon ? (
                            <Icon className="w-24 h-24 p-1 rounded-xl border-2" style={{ backgroundColor: user.color, borderColor: user.color || '#ffffff50' }} size={48} />
                        ) : (
                            <User className="w-24 h-24 p-1 rounded-xl border-2" style={{ borderColor: user.color || '#ffffff50' }} size={10} />
                        )
                    })()
                ) : (
                    <User className="w-24 h-24 p-1 rounded-xl border-2" style={{ borderColor: user?.color || '#ffffff50' }} size={10} />
                )}
            </div>
        </div>
    )
}

export default AppHeader
