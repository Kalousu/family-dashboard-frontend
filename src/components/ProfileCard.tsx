import imageIcons from "../constants/imageIcons";

interface ProfileCardProps {
  name: string
  color: string
  icon: string
  onSelect: () => void
  isDarkMode?: boolean
}

function ProfileCard({ name, color, icon, onSelect, isDarkMode = false }: ProfileCardProps) {
    const Icon = imageIcons[icon as keyof typeof imageIcons]

    return (
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all ease-in-out hover:brightness-105 duration-300" onClick={onSelect}>
            <div className={`relative rounded-2xl p-2 bg-linear-to-b border-2 ${isDarkMode ? "from-gray-500/50 via-gray-600/20 to-blue-400/20 border-white/10" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 border-cyan-950/5"}`}>
                <div className={`absolute rounded-2xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/20" : "bg-white/30"}`} />
                <Icon className="w-24 h-24 p-2 rounded-xl border border-white/30" style={{ backgroundColor: color }} size={48} />
            </div>
            <p className={`mt-2 text-lg font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{name}</p>
        </div>
    )
}

export default ProfileCard