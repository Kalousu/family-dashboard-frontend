import { ChevronRight, User } from "lucide-react"
import SideBarNav from "./SideBarNav"
import Widgetdrawer from "./Widgetdrawer"
import AdminDrawer from "./AdminDrawer"
import GlassButton from "../../ui/GlassButton"
import { useState } from "react"

interface SideBarProps {
    isOpen: boolean
    onClose: () => void
    isDarkMode: boolean
    onToggleDarkMode: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
}

function SideBar({ isOpen, onClose, isDarkMode, onToggleDarkMode, setPendingWidget }: SideBarProps) {
    const [sideBarView, setSideBarView] = useState<"nav" | "widgets" | "admin">("nav")

    return(
        <div className={`fixed z-20 right-0 top-0 h-full w-70 rounded-l-2xl p-4 transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${isOpen ? "translate-x-0" : "translate-x-full"} ${isDarkMode ? "bg-linear-to-b to-sky-100 from-blue-200 border-2 border-gray-400/20" : "bg-linear-to-b from-gray-950/90 via-gray-900/85 to-slate-900/80 border-2 border-white/5"}`}>
            {sideBarView === "nav" ? (
                <div className="flex flex-col h-full">
                    <div>
                        <ChevronRight className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-sky-900 hover:text-cyan-600" : "text-gray-400 hover:text-white"}`} size={30} onClick={onClose}/>
                        <div className="m-3 flex flex-col items-center">
                            {/*profile card wurde für design copy pasted, vllt bessere lösung später?*/}
                            <div className={`relative rounded-2xl p-2 bg-linear-to-b transition-all hover:scale-103 hover:brightness-105 ${isDarkMode ? "from-sky-200/30 via-slate-400/15 to-blue-400/20 border-2 border-cyan-950/5" : "from-gray-500/50 via-gray-600/20 to-blue-400/20 border-2 border-white/10"}`}>
                                <div className={`absolute rounded-2xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/30" : "bg-white/5"}`} />
                                <User className="w-24 h-24 p-2 rounded-xl border bg-blue-500 border-white/30" size={48} />
                            </div>
                            <p className={`m-2 text-center text-lg font-bold ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>Willkommen zurück, User!</p>
                            {/*<div className="relative mt-6 w-36 h-36 rounded-full overflow-hidden border border-white">
                                <User className="w-36 h-36 rounded-full bg-gray-500 text-gray-300 hover:scale-102 hover:bg-gray-400 hover:text-white transition-all border-2 border-white/20" size={20} />
                                <div className="absolute inset-x-0 top-0 h-2/3 rounded-full bg-white/10 pointer-events-none" />
                            </div>
                            <p className="m-2 text-gray-300 text-center text-lg font-bold">Willkommen zurück, User!</p>*/}
                        </div>
                        <SideBarNav isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} onWidgetsClick={() => setSideBarView("widgets")} onAdminClick={() => setSideBarView("admin")}/>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                        <GlassButton isDarkMode={isDarkMode} className="self-center mb-4 p-3 w-30">
                            Abmelden
                        </GlassButton>
                    </div>
                </div>
            ) : sideBarView === "admin" ? (
                <div>
                    <AdminDrawer onBack={() => setSideBarView("nav")} isDarkMode={isDarkMode} />
                </div>
            ) : (
                <div>
                    <Widgetdrawer onBack={() => setSideBarView("nav")} setPendingWidget={setPendingWidget} isDarkMode={isDarkMode} />
                </div>
            )}
        </div>
    )
}

export default SideBar