import { ChevronRight, User } from "lucide-react"
import SideBarNav from "./SideBarNav"
import WidgetDrawer from "./WidgetDrawer"
import AdminDrawer from "./AdminDrawer/AdminDrawer"
import GlassButton from "../../ui/GlassButton"
import imageIcons from "../../../constants/imageIcons"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useDarkMode from "../../../hooks/useDarkMode"
import useAuth from "../../../hooks/useAuth"
import { logout as logoutApi } from "../../../api/authApi"

interface SideBarProps {
    isOpen: boolean
    onClose: () => void
    pendingWidget: { type: string, colSpan: number, rowSpan: number } | null
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
    permissions?: { canAddWidgets?: boolean; canManageFamily?: boolean }
}

function SideBar({ isOpen, onClose, pendingWidget, setPendingWidget, permissions }: SideBarProps) {
    const [sideBarView, setSideBarView] = useState<"nav" | "widgets" | "admin">("nav")
    const { isDarkMode } = useDarkMode()
    const { currentUser, logoutUser } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        try {
            // First navigate away from the page
            navigate("/home", { replace: true })
            // Then call logout API and clear state
            await logoutApi()
            logoutUser()
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return(
        <>
        {isOpen && (
            <div className="fixed inset-0 bg-black/40 z-10 lg:hidden" onClick={onClose} />
        )}
        <div className={`fixed z-20 right-0 top-0 h-full w-[280px] rounded-l-2xl p-4 transition-all duration-300 will-change-transform flex flex-col justify-between backdrop-blur-md ${isOpen ? "translate-x-0" : "translate-x-full"} ${isDarkMode ? "bg-linear-to-b from-gray-950/90 via-gray-900/85 to-slate-900/80 border-2 border-white/5" : "bg-linear-to-b to-sky-100 from-blue-200 border-2 border-gray-400/20"}`}>
            {sideBarView === "nav" ? (
                <div className="flex flex-col h-full overflow-y-auto">
                    <div>
                        <ChevronRight className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-sky-900 hover:text-cyan-600"}`} size={30} onClick={onClose}/>
                        <div className="m-3 flex flex-col items-center">
                            {/*profile card wurde für design copy pasted, vllt bessere lösung später?*/}
                            <div className={`relative rounded-2xl p-2 bg-linear-to-b transition-all hover:scale-103 hover:brightness-105 ${isDarkMode ? "from-gray-500/50 via-gray-600/20 to-blue-400/20 border-2 border-white/10" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 border-2 border-cyan-950/5"}`}>
                                <div className={`absolute rounded-2xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                                {currentUser && currentUser.avatarType === "URL" ? (
                                    <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 p-1 rounded-xl border-2 object-cover" style={{ borderColor: currentUser.color || '#ffffff50' }} />
                                ) : currentUser && currentUser.avatarType === "ICON" ? (
                                    (() => {
                                        const Icon = imageIcons[currentUser.avatar as keyof typeof imageIcons]
                                        return Icon ? (
                                            <Icon className="w-24 h-24 p-1 rounded-xl border-2" style={{ backgroundColor: currentUser.color, borderColor: currentUser.color || '#ffffff50' }} size={48} />
                                        ) : (
                                            <User className="w-24 h-24 p-1 rounded-xl border-2" style={{ borderColor: currentUser.color || '#ffffff50' }} size={48} />
                                        )
                                    })()
                                ) : (
                                    <User className="w-24 h-24 p-1 rounded-xl border-2" style={{ borderColor: currentUser?.color || '#ffffff50' }} size={48} />
                                )}
                            </div>
                            <p className={`m-2 text-center text-lg font-bold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Willkommen zurück, {currentUser?.name || "User"}!
                            </p>
                        </div>
                        <SideBarNav onWidgetsClick={() => setSideBarView("widgets")} onAdminClick={() => setSideBarView("admin")} permissions={permissions}/>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                        <GlassButton isDarkMode={!isDarkMode} onClick={handleLogout} className="self-center mb-4 p-3 w-30">
                            Abmelden
                        </GlassButton>
                    </div>
                </div>
            ) : sideBarView === "admin" ? (
                <div className="h-full overflow-y-auto">
                    <AdminDrawer onBack={() => setSideBarView("nav")} isDarkMode={isDarkMode} />
                </div>
            ) : (
                <div className="h-full overflow-y-auto">
                    <WidgetDrawer onBack={() => setSideBarView("nav")} pendingWidget={pendingWidget} setPendingWidget={setPendingWidget} />
                </div>
            )}
        </div>
        </>
    )
}

export default SideBar
