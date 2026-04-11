import { motion } from "framer-motion"
interface SideBarNavProps {
    isDarkMode: boolean
    onToggleDarkMode: () => void
    onWidgetsClick: () => void
}

function SideBarNav({ isDarkMode, onToggleDarkMode, onWidgetsClick }: SideBarNavProps) {
    const navItems = ["Widgets verwalten", "Family verwalten", "Profil bearbeiten"]

    return (
        <div className="m-2 flex flex-col items-stretch">
            {navItems.map((item) => (
                <button key={item} className="relative mt-1 mb-1 p-3 w-full bg-linear-to-b from-gray-500/70 via-gray-600 to-slate-500/50 text-gray-200 text-left font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200" onClick={item === "Widgets verwalten" ? onWidgetsClick : undefined}>
                    <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none" />
                    {item}
                </button>
            ))}
            <button onClick={onToggleDarkMode} className="relative mt-1 mb-1 p-3 w-full bg-linear-to-b from-gray-500/70 via-gray-600 to-slate-500/50 text-gray-200 text-left font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200">
                <div className="flex justify-between items-center w-full">
                    <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none" />
                    <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                    <div className="w-12 h-6 rounded-full bg-gray-700 flex items-center p-1 cursor-pointer" onClick={onToggleDarkMode}>
                        <motion.div
                            className="w-5 h-5 rounded-full bg-gray-300"
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