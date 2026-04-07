import { X } from "lucide-react"
import imageIcons from "../../constants/imageIcons"
import type { Profile } from "./timetableTypes"

export function UserIcon({ profile, size = 14 }: { profile: Profile; size?: number }) {
    const Icon = imageIcons[profile.icon as keyof typeof imageIcons]
    return (
        <div
            className="rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: profile.color, width: size + 6, height: size + 6 }}
        >
            <Icon size={size} color="white" />
        </div>
    )
}

export function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`relative px-4 text-sm font-semibold rounded-t-lg border-t border-l border-r select-none transition-all ${
                active
                    ? "pt-1.5 pb-[9px] -mb-px z-10 bg-gradient-to-b from-white/40 to-white/10 border-white/35 text-white"
                    : "py-1 bg-white/5 border-white/15 text-white/50 hover:bg-white/10 hover:text-white/70"
            }`}
        >
            {active && (
                <span className="absolute inset-x-1 top-0.5 h-[40%] rounded-t bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
            )}
            <span className="relative">{children}</span>
        </button>
    )
}

export function EventCard({ title, profiles, merged, editMode, onRemove }: {
    title: string
    profiles: Profile[]
    merged: boolean
    editMode: boolean
    onRemove: () => void
}) {
    return (
        <div className={`relative w-full flex flex-col px-2 py-1.5 rounded-lg bg-white/15 border transition-all ${
            merged ? "border-white/40" : "border-white/20"
        }`}>
            {editMode && (
                <button onClick={onRemove} className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 rounded-full p-0.5 text-white z-10">
                    <X size={10} />
                </button>
            )}
            <span className="text-white text-xs font-semibold break-words">{title}</span>
            <div className="flex justify-end gap-0.5 mt-0.5">
                {profiles.map((p) => <UserIcon key={p.id} profile={p} size={10} />)}
            </div>
        </div>
    )
}
