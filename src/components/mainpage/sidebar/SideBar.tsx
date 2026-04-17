import { ChevronRight, User } from "lucide-react"
import SideBarNav from "./SideBarNav"
import WidgetDrawer from "./WidgetDrawer"
import GlassButton from "../../ui/GlassButton"
import { useState } from "react"
import useDarkMode from "../../../hooks/useDarkMode"

interface SideBarProps {
    isOpen: boolean
    onClose: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
}

function SideBar({ isOpen, onClose, setPendingWidget }: SideBarProps) {
    const [sideBarView, setSideBarView] = useState<"nav" | "widgets">("nav")
    const { isDarkMode } = useDarkMode()

    return(
        <div className={`fixed z-20 right-0 top-0 h-full w-70 rounded-l-2xl p-4 transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${isOpen ? "translate-x-0" : "translate-x-full"} ${isDarkMode ? "bg-linear-to-b from-gray-950/90 via-gray-900/85 to-slate-900/80 border-2 border-white/5" : "bg-linear-to-b to-sky-100 from-blue-200 border-2 border-gray-400/20"}`}>
            {sideBarView === "nav" ? (
                <div className="flex flex-col h-full">
                    <div>
                        <ChevronRight className={`w-7 h-7 hover:scale-105 transition-all ${isDarkMode ? "text-gray-400 hover:text-white" : "text-sky-900 hover:text-cyan-600"}`} size={30} onClick={onClose}/>
                        <div className="m-3 flex flex-col items-center">
                            {/*profile card wurde für design copy pasted, vllt bessere lösung später?*/}
                            <div className={`relative rounded-2xl p-2 bg-linear-to-b transition-all hover:scale-103 hover:brightness-105 ${isDarkMode ? "from-gray-500/50 via-gray-600/20 to-blue-400/20 border-2 border-white/10" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 border-2 border-cyan-950/5"}`}>
                                <div className={`absolute rounded-2xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                                <User className="w-24 h-24 p-2 rounded-xl border bg-blue-500 border-white/30" size={48} />
                            </div>
                            <p className={`m-2 text-center text-lg font-bold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Willkommen zurück, User!</p>
                        </div>
                        <SideBarNav onWidgetsClick={() => setSideBarView("widgets")}/>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                        <GlassButton isDarkMode={!isDarkMode} className="self-center mb-4 p-3 w-30">
                            Abmelden
                        </GlassButton>
                    </div>
                </div>
            ) : (
                <div>
                    <WidgetDrawer onBack={() => setSideBarView("nav")} setPendingWidget={setPendingWidget} />
                </div>
            )}
        </div>
    )
}

export default SideBar
