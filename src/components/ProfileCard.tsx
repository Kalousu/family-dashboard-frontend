interface ProfileCardProps {
  name: string
  color: string
  image?: string
  onSelect: () => void
}

function ProfileCard({ name, color, image, onSelect }: ProfileCardProps) {
    return (
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform ease-in-out"onClick={onSelect}>
            {image ? (
                <img src={image} className="w-24 h-24 rounded-3xl object-cover overflow-hidden" />
            ) : (
                <div className="w-24 h-24 rounded-xl" style={{ backgroundColor: color }} />
            )}
            <p className="text-lg font-semibold text-gray-800">{name}</p>
        </div>
    )
}

export default ProfileCard