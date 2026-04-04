import imageIcons from "../constants/imageIcons";

interface ProfileCardProps {
  name: string
  color: string
  icon?: string
  onSelect: () => void
}

function ProfileCard({ name, color, icon, onSelect }: ProfileCardProps) {
    const Icon = icon ? imageIcons[icon as keyof typeof imageIcons] : null

    return (
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform ease-in-out"onClick={onSelect}>
            {Icon ? (
                <Icon className="w-24 h-24 p-2 rounded-xl" style={{ backgroundColor: color }} size={48} />
            ) : (
                <div className="w-24 h-24 rounded-xl" style={{ backgroundColor: color }} />
            )}
            <p className="text-lg font-semibold text-gray-800">{name}</p>
        </div>
    )
}

export default ProfileCard