import { ChevronRight, User } from "lucide-react"
import SideBarNav from "./SideBarNav"
import Widgetdrawer from "./Widgetdrawer"
import { useState } from "react"

interface SideBarProps {
    isOpen: boolean
    onClose: () => void
    isDarkMode: boolean
    onToggleDarkMode: () => void
    setPendingWidget: (widget: { type: string, colSpan: number, rowSpan: number } | null) => void
}

function SideBar({ isOpen, onClose, isDarkMode, onToggleDarkMode, setPendingWidget }: SideBarProps) {
    const [sideBarView, setSideBarView] = useState<"nav" | "widgets">("nav")

    return(
        <div className={`fixed z-20 right-0 top-0 h-full w-70 bg-linear-to-b from-gray-700 to-gray-600 rounded-l-2xl p-4 border-2 border-white/5 transition-transform duration-300 flex flex-col justify-between ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            {sideBarView === "nav" ? (
                <div className="flex flex-col h-full">
                    <div>
                        <ChevronRight className="w-7 h-7 text-gray-400 hover:scale-105 hover:text-white transition-all" size={30} onClick={onClose}/>
                        <div className="flex flex-col items-center m-1">
                            <div className="relative mt-6 w-36 h-36 rounded-full overflow-hidden">
                                <User className="w-36 h-36 rounded-full bg-gray-500 text-gray-300 hover:scale-102 hover:bg-gray-400 hover:text-white transition-all border-2 border-white/20" size={20} />
                                <div className="absolute inset-x-0 top-0 h-2/3 rounded-full bg-white/10 pointer-events-none" />
                            </div>
                            <p className="m-2 text-gray-300 text-center text-lg font-bold">Willkommen zurück, User!</p>
                        </div>
                        <SideBarNav isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} onWidgetsClick={() => setSideBarView("widgets")}/>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                        <button className="relative self-center mb-4 p-3 w-30 bg-linear-to-b from-gray-500/70 via-gray-600 to-slate-500/50 text-gray-200 font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200">
                            <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none" />
                            Abmelden
                        </button>                
                    </div>
                </div>
            ) : (
                <div>
                    <Widgetdrawer onBack={() => setSideBarView("nav")} setPendingWidget={setPendingWidget} />
                </div>
            )}
        </div>
    )
}

export default SideBar