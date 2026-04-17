import { motion } from "framer-motion"
import useDarkMode from "../../hooks/useDarkMode"

function DarkModeToggle() {
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    return (
        <div className="fixed top-4 right-4 flex items-center gap-2">
            <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {isDarkMode ? "Dark Mode" : "Light Mode"}
            </span>
            <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${isDarkMode ? "bg-slate-500/50" : "bg-cyan-950/20"}`} onClick={toggleDarkMode}>
                <motion.div
                    className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-gray-300" : "bg-white"}`}
                    animate={{ x: isDarkMode ? 20 : 0 }}
                    transition={{ duration: 0.2 }}
                />
            </div>
        </div>
    )
}

export default DarkModeToggle
