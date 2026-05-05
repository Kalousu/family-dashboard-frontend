import useDarkMode from "../../hooks/useDarkMode"
import AvatarDisplay from "../ui/AvatarDisplay"
import type { UserProfile } from "../../types/authTypes"

interface AppHeaderProps {
    onUserClick: () => void
    user: UserProfile | null
}

function AppHeader({ onUserClick, user }: AppHeaderProps) {
    const { isDarkMode } = useDarkMode()

    return (
        <div className={`fixed z-10 top-0 w-full h-14 sm:h-13 flex flex-row items-center justify-between px-4 transition-colors duration-300 ${isDarkMode ? "bg-linear-90 from-gray-950 via-gray-900 to-slate-900 border border-white/10" : "bg-linear-90 from-sky-100 to-blue-200 border border-gray-400/20"}`}>
            <p className={`text-center text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-white/80" : "text-gray-700"}`}>Family-Dashboard</p>
            <div
                className={`relative rounded-xl min-w-11 min-h-11 flex items-center justify-center bg-linear-to-b transition-all cursor-pointer hover:brightness-110 touch-manipulation ${isDarkMode ? "from-gray-500/50 via-gray-600/20 to-blue-400/20 border-2 border-white/10" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 border-2 border-cyan-950/5"}`}
                onClick={onUserClick}
            >
                <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                {user && <AvatarDisplay user={user} size="sm" />}
            </div>
        </div>
    )
}

export default AppHeader
