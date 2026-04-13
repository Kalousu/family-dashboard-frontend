import { motion } from "framer-motion"
interface SideBarNavProps {
    isDarkMode: boolean
    onToggleDarkMode: () => void
    onWidgetsClick: () => void
}

function SideBarNav({ isDarkMode, onToggleDarkMode, onWidgetsClick }: SideBarNavProps) {
    const navItems = ["Widgets verwalten", "Family verwalten", "Profil bearbeiten"]

    const btnClass = isDarkMode
        ? "bg-linear-to-b from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700 border-2 border-cyan-950/5"
        : "bg-linear-to-b from-gray-500/50 via-gray-600/20 to-blue-400/20 text-gray-200 border-white/10"
    const glossClass = isDarkMode ? "bg-white/30" : "bg-white/5"

    return (
        <div className="m-2 flex flex-col items-stretch">
            {navItems.map((item) => (
                <button key={item} className={`relative mt-1 mb-1 p-3 w-full text-left font-semibold rounded-xl border-2 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200 ${btnClass}`} onClick={item === "Widgets verwalten" ? onWidgetsClick : undefined}>
                    <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${glossClass}`} />
                    {item}
                </button>
            ))}
            <button onClick={onToggleDarkMode} className={`relative mt-1 mb-1 p-3 w-full text-left font-semibold rounded-xl border-2 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200 ${btnClass}`}>
                <div className="flex justify-between items-center w-full">
                    <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${glossClass}`} />
                    <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                    <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${isDarkMode ? "bg-cyan-950/20" : "bg-slate-500/50"}`} onClick={onToggleDarkMode}>
                        <motion.div
                            className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-white" : "bg-gray-300"}`}
                            animate={{ x: isDarkMode ? 0 : 20 }}
                            transition={{ duration: 0.2 }}>
                        </motion.div>
                    </div>
                </div>
            </button>
        </div>
    )
}
export default SideBarNav