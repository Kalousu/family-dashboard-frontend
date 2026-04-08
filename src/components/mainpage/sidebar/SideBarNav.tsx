import { motion } from "framer-motion"
interface SideBarNavProps {
    isDarkMode: boolean
    onToggleDarkMode: () => void
}

function SideBarNav({ isDarkMode, onToggleDarkMode }: SideBarNavProps) {
    const navItems = ["Widgets verwalten", "Family verwalten", "Profil bearbeiten"]

    return (
        <div className="m-2 flex flex-col items-stretch">
            {navItems.map((item) => (
                <button key={item} className="mt-1 mb-1 p-3 w-full bg-linear-to-b from-gray-500/70 to-gray-600 text-gray-200 text-left font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200">
                    {item}
                </button>
            ))}
            <button onClick={onToggleDarkMode} className="mt-1 mb-1 p-3 w-full bg-linear-to-b from-gray-500/70 to-gray-600 text-gray-200 text-left font-semibold rounded-xl border-2 border-white/10 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200">
                <div className="flex justify-between items-center w-full">
                    <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
                    <div className="w-12 h-6 rounded-full bg-gray-500 flex items-center p-1 cursor-pointer" onClick={onToggleDarkMode}>
                        <motion.div
                            className="w-5 h-5 rounded-full bg-white"
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