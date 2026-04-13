import imageIcons from "../constants/imageIcons";

interface ProfileCardProps {
  name: string
  color: string
  icon: string
  onSelect: () => void
}

function ProfileCard({ name, color, icon, onSelect }: ProfileCardProps) {
    const Icon = imageIcons[icon as keyof typeof imageIcons]
    
    return (
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all ease-in-out hover:brightness-105 duration-300" onClick={onSelect}>
            <div className="rounded-2xl p-0.5 bg-gray-400/50">
                <div className="relative rounded-xl p-1 bg-linear-to-b from-gray-300 via-slate-500/50 to-gray-300/20 transition-colors">
                    <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/15 rounded-t-xl pointer-events-none" />
                    <div className="rounded-xl p-0.5 bg-gray-400/50">
                        <Icon className="w-24 h-24 p-2 rounded-xl border border-white/30" style={{ backgroundColor: color }} size={48} />
                    </div>
                </div>                
            </div>
            <p className="text-lg font-semibold text-gray-800">{name}</p>
        </div>
    )
}

export default ProfileCard