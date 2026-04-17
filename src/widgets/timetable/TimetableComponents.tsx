import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
            className={`relative px-4 pt-1.5 pb-2.25 text-sm font-semibold rounded-t-lg border-t border-l border-r select-none transition-all overflow-hidden ${
                active
                    ? "-mb-px z-10 bg-linear-to-b from-purple-900/50 to-indigo-400/30 border-white/25 text-white"
                    : "bg-linear-to-b from-purple-900/20 to-indigo-400/10 border-white/10 text-white/50 hover:from-purple-900/35 hover:to-indigo-400/20 hover:text-white/70"
            }`}
        >
            <span className="absolute inset-x-0 top-0 h-1/2 bg-white/7 pointer-events-none rounded-b-xl" />
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
    const [hovered, setHovered] = useState(false)

    return (
        <div
            className={`relative w-full flex flex-col px-2 py-1.5 rounded-lg bg-linear-to-b from-purple-900/25 to-indigo-400/15 border transition-all overflow-hidden ${
                merged ? "border-white/25" : "border-white/20"
            }`}
            onMouseEnter={() => editMode && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/7 rounded-b-xl pointer-events-none" />
            <AnimatePresence>
                {editMode && hovered && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.1 }}
                        onClick={onRemove}
                        className="absolute top-1 right-1 bg-white/20 hover:bg-red-500 text-white rounded-full p-0.5 z-10 cursor-pointer"
                    >
                        <X size={10} />
                    </motion.button>
                )}
            </AnimatePresence>
            <span className="relative text-white text-xs font-semibold wrap-break-word">{title}</span>
            <div className="relative flex justify-end gap-0.5 mt-0.5">
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
