import imageIcons from "../constants/imageIcons";

interface IconSelectProps {
    selectedIcon: string;
    isDarkMode: boolean;
    onSelect: (key: string) => void;
}

function IconSelect({ selectedIcon, isDarkMode, onSelect }: IconSelectProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {Object.entries(imageIcons).map(([key, Icon]) => (
                <div key={key} className={`border rounded-2xl transition-all ease-in-out duration-200 hover:scale-105 hover:brightness-103 ${isDarkMode ? "border-slate-700/20" : "border-slate-700/20"}`}>
                    <div className={`relative border border-white/10 p-1 font-semibold rounded-2xl overflow-hidden bg-linear-to-b ${isDarkMode ? "from-gray-500/50 via-gray-600/20 to-blue-400/20 text-gray-300" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700"}`}>
                        <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                        <div
                            className={`relative border w-24 h-24 rounded-xl flex items-center justify-center cursor-pointer transition-all ease-in-out duration-200
                            ${selectedIcon === key
                                ? isDarkMode ? "bg-indigo-500/25 border-white/10 hover:bg-indigo-400/35" : "bg-sky-300/50 border-sky-400/20 hover:bg-sky-300/70"
                                : isDarkMode ? "bg-slate-700/40 border-white/5 hover:bg-slate-600/55" : "bg-white/50 border-cyan-950/5 hover:bg-sky-100/70"
                            }`}
                            onClick={() => onSelect(key)}>
                            <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/40"}`} />
                            <Icon size={48} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default IconSelect
