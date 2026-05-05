import { User } from "lucide-react"
import imageIcons from "../../constants/imageIcons"
import type { UserProfile } from "../../types/authTypes"

interface AvatarDisplayProps {
    user: UserProfile
    size: "sm" | "md" | "lg"
    className?: string
}

const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24 p-1",
}

const roundedClasses = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-xl",
}

const iconSizes = {
    sm: 28,
    md: 32,
    lg: 48,
}

function AvatarDisplay({ user, size, className = "" }: AvatarDisplayProps) {
    const borderColor = user.color || "#ffffff50"
    const baseClass = `${sizeClasses[size]} ${roundedClasses[size]} border-2 ${className}`

    if (user.avatarType === "URL") {
        return (
            <img
                src={user.avatar}
                alt={user.name}
                className={`${baseClass} object-cover`}
                style={{ borderColor }}
            />
        )
    }

    if (user.avatarType === "ICON") {
        const Icon = imageIcons[user.avatar as keyof typeof imageIcons] || User
        return (
            <Icon
                className={baseClass}
                style={{ backgroundColor: user.color, borderColor }}
                size={iconSizes[size]}
            />
        )
    }

    return (
        <User
            className={baseClass}
            style={{ borderColor }}
            size={iconSizes[size]}
        />
    )
}

export default AvatarDisplay
