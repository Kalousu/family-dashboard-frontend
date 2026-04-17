import { motion } from "framer-motion"
import GlassButton from "../../ui/GlassButton"
import useDarkMode from "../../../hooks/useDarkMode"

interface SideBarNavProps {
    onWidgetsClick: () => void
}

function SideBarNav({ onWidgetsClick }: SideBarNavProps) {
    const { isDarkMode, toggleDarkMode } = useDarkMode()
    const navItems = ["Widgets verwalten", "Family verwalten", "Profil bearbeiten"]

    return (
        <div className="m-2 flex flex-col items-stretch">
            {navItems.map((item) => (
                <GlassButton key={item} isDarkMode={!isDarkMode} onClick={item === "Widgets verwalten" ? onWidgetsClick : undefined} className="mt-1 mb-1 p-3 w-full text-left">
                    {item}
                </GlassButton>
            ))}
            <GlassButton isDarkMode={!isDarkMode} onClick={toggleDarkMode} className="mt-1 mb-1 p-3 w-full text-left">
                <div className="flex justify-between items-center w-full">
                    <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                    <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${isDarkMode ? "bg-slate-500/50" : "bg-cyan-950/20"}`}>
                        <motion.div
                            className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-gray-300" : "bg-white"}`}
                            animate={{ x: isDarkMode ? 20 : 0 }}
                            transition={{ duration: 0.2 }}>
                        </motion.div>
                    </div>
                </div>
            </GlassButton>
        </div>
    )
}
export default SideBarNav
