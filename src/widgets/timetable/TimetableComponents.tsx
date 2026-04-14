import { X, Check, Plus } from "lucide-react"
import imageIcons from "../../constants/imageIcons"
import type { Profile, Reminder } from "./timetableTypes"

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

export function DayHeader({ day, reminder, editMode, isEditing, reminderText, onReminderTextChange, onSave, onCancelEdit, onStartEdit, onRemove }: {
    day: string
    reminder?: Reminder
    editMode: boolean
    isEditing: boolean
    reminderText: string
    onReminderTextChange: (text: string) => void
    onSave: () => void
    onCancelEdit: () => void
    onStartEdit: () => void
    onRemove: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 border-b border-white/15 border-r border-white/10 last:border-r-0">
            <span className="text-white/70 text-xs font-bold tracking-wide text-center">{day}</span>

            {reminder ? (
                <div className="flex items-center gap-0.5 bg-red-500/70 border border-red-400/40 rounded-md px-1.5 py-0.5 w-full">
                    <span className="text-white text-[10px] font-semibold break-words min-w-0">! {reminder.text}</span>
                    {editMode && (
                        <button onClick={onRemove} className="text-white/70 hover:text-white shrink-0">
                            <X size={9} />
                        </button>
                    )}
                </div>
            ) : editMode && (
                isEditing ? (
                    <div className="flex items-center gap-0.5 w-full px-1">
                        <input
                            value={reminderText}
                            onChange={(e) => onReminderTextChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSave()}
                            placeholder="Erinnerung…"
                            autoFocus
                            className="bg-white/10 text-white placeholder:text-white/30 text-[10px] rounded px-1 py-0.5 border border-white/20 focus:outline-none w-full"
                        />
                        <button onClick={onSave} className="text-green-400 hover:text-green-300 shrink-0"><Check size={10} /></button>
                        <button onClick={onCancelEdit} className="text-white/50 hover:text-white shrink-0"><X size={10} /></button>
                    </div>
                ) : (
                    <button onClick={onStartEdit} className="text-white/25 hover:text-red-400">
                        <Plus size={11} />
                    </button>
                )
            )}
        </div>
    )
}
