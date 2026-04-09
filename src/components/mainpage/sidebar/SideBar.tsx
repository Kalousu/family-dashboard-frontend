import { ChevronRight, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
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
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return(
        <div className={`fixed z-20 right-0 top-0 h-full w-70 bg-linear-to-b from-gray-700 to-gray-600 rounded-l-2xl p-4 border-2 border-white/5 transition-transform duration-300 flex flex-col justify-between ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            {sideBarView === "nav" ? (
                <div className="flex flex-col h-full">
                    <div>
                        <ChevronRight className="w-7 h-7 text-gray-400 hover:scale-105 hover:text-white transition-all" size={30} onClick={onClose}/>
                        <div className="flex flex-col items-center m-1">
                            <User className="mt-6 w-36 h-36 rounded-full bg-gray-500 text-gray-300 hover:scale-102 hover:bg-gray-400 hover:text-white transition-all border-2 border-white/20" size={20}/>
                            <p className="m-2 text-gray-300 text-center text-lg font-bold">
                                Willkommen zurück, {user?.name || 'User'}!
                            </p>
                        </div>
                        <SideBarNav isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} onWidgetsClick={() => setSideBarView("widgets")}/>
                    </div>
                    <div className="flex flex-col items-center mt-auto">
                        <button 
                            onClick={handleLogout}
                            className="self-center mb-4 p-3 w-30 bg-linear-to-b from-gray-500/70 to-gray-600 text-gray-200 font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200"
                        >
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
