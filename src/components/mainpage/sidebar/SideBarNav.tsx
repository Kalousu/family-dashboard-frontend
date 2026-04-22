import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import GlassButton from "../../ui/GlassButton"
import useDarkMode from "../../../hooks/useDarkMode"

interface SideBarNavProps {
    onWidgetsClick: () => void
    onAdminClick: () => void
    permissions?: { canAddWidgets?: boolean; canManageFamily?: boolean }
}

function SideBarNav({ onWidgetsClick, onAdminClick, permissions }: SideBarNavProps) {
    const { isDarkMode, toggleDarkMode } = useDarkMode()
    const navigate = useNavigate()
    
    // Filter nav items based on permissions
    const allNavItems = ["Widgets verwalten", "Familie verwalten", "Profil bearbeiten"]
    const navItems = allNavItems.filter(item => {
        if (item === "Widgets verwalten") {
            return permissions?.canAddWidgets === true
        }
        if (item === "Familie verwalten") {
            return permissions?.canManageFamily === true
        }
        return true // Show all other items
    })

    const handleNavClick = (item: string) => {
        if (item === "Widgets verwalten") return onWidgetsClick()
        if (item === "Familie verwalten") return onAdminClick()
        if (item === "Profil bearbeiten") return navigate("/profile/edit")
    }

    return (
        <div className="m-2 flex flex-col items-stretch">
            {navItems.map((item) => (
                <GlassButton key={item} isDarkMode={!isDarkMode} onClick={() => handleNavClick(item)} className="mt-1 mb-1 p-3 w-full text-left">
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
