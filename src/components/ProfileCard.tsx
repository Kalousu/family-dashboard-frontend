import imageIcons from "../constants/imageIcons";
import { User } from "lucide-react";

interface ProfileCardProps {
  name: string
  color: string
  icon: string
  onSelect: () => void
}

function ProfileCard({ name, color, icon, onSelect }: ProfileCardProps) {
    const Icon = imageIcons[icon as keyof typeof imageIcons] || User
    
    return (
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform ease-in-out" onClick={onSelect}>
            <div className="w-24 h-24 p-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: color || '#gray' }}>
                <Icon className="w-full h-full" />
            </div>
            <p className="text-lg font-semibold text-gray-800">{name}</p>
        </div>
    )
}

export default ProfileCard
