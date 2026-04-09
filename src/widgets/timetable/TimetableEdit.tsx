import { useState } from "react"
import { Plus, X, Check, Pencil } from "lucide-react"
import type { Profile, TimetableEvent, Reminder } from "./timetableTypes"
import { UserIcon } from "./TimetableComponents"

const ALL_PROFILES: Profile[] = [
    { id: 1, name: "Kevin",  color: "blue",       icon: "gamepad" },
    { id: 2, name: "Jonas",  color: "red",         icon: "dog"     },
    { id: 3, name: "Daniel", color: "lightgreen",  icon: "sun"     },
    { id: 4, name: "Lea",    color: "pink",        icon: "flower"  },
    { id: 5, name: "Katrin", color: "lightblue",   icon: "cat"     },
]

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]
const SLOTS = Array.from({ length: 9 }, (_, i) => i + 1)

interface TimetableEditProps {
    watchedIds: number[]
    reminders: Reminder[]
    onAddEvent: (event: TimetableEvent) => void
    onAddUser: (userId: number) => void
    onRemoveUser: (userId: number) => void
    onSetReminder: (day: number, text: string) => void
    onRemoveReminder: (day: number) => void
}

function TimetableEdit({ watchedIds, reminders, onAddEvent, onAddUser, onRemoveUser, onSetReminder, onRemoveReminder }: TimetableEditProps) {
    const watchedProfiles = ALL_PROFILES.filter((p) => watchedIds.includes(p.id))
    const availableUsers  = ALL_PROFILES.filter((p) => !watchedIds.includes(p.id))

    const [showForm, setShowForm] = useState(false)
    const [newTitle,  setNewTitle]  = useState("")
    const [newSlot,   setNewSlot]   = useState(1)
    const [newDay,    setNewDay]    = useState(0)
    const [newUserId, setNewUserId] = useState(watchedIds[0])
    const [addUserId, setAddUserId] = useState(
        availableUsers[0]?.id ?? ALL_PROFILES[0].id
    )

    const [editingDay,   setEditingDay]   = useState<number | null>(null)
    const [reminderText, setReminderText] = useState("")

    function handleSaveReminder(day: number) {
        if (!reminderText.trim()) return
        onSetReminder(day, reminderText.trim())
        setEditingDay(null)
        setReminderText("")
    }

    function handleAddEvent() {
        if (!newTitle.trim()) return
        onAddEvent({
            id: Date.now().toString(),
            title: newTitle.trim(),
            slot: newSlot,
            day: newDay,
            userId: newUserId,
        })
        setNewTitle("")
        setShowForm(false)
    }

    function handleAddUser() {
        onAddUser(addUserId)
        const next = availableUsers.find((p) => p.id !== addUserId)
        if (next) setAddUserId(next.id)
    }

    return (
        <div className="bg-white/10 border border-white/15 rounded-xl p-3 flex flex-col gap-2.5 shrink-0">

            {/* User-Verwaltung */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/60 text-xs font-semibold shrink-0">User:</span>
                {watchedProfiles.map((p) => (
                    <div key={p.id} className="flex items-center gap-1 bg-white/15 rounded-lg px-2 py-0.5">
                        <UserIcon profile={p} size={10} />
                        <span className="text-white text-xs">{p.name}</span>
                        <button onClick={() => onRemoveUser(p.id)} className="text-white/50 hover:text-white ml-0.5">
                            <X size={10} />
                        </button>
                    </div>
                ))}
                {availableUsers.length > 0 && (
                    <div className="flex items-center gap-1">
                        <select
                            value={addUserId}
                            onChange={(e) => setAddUserId(Number(e.target.value))}
                            className="bg-white/10 text-white text-xs rounded-lg px-2 py-0.5 border border-white/20 focus:outline-none"
                        >
                            {availableUsers.map((p) => (
                                <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                            ))}
                        </select>
                        <button onClick={handleAddUser} className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white">
                            <Plus size={12} />
                        </button>
                    </div>
                )}
            </div>

            {/* Event hinzufügen */}
            {showForm ? (
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
                        placeholder="Fach (z.B. Mathe)"
                        autoFocus
                        className="bg-white/10 text-white placeholder:text-white/40 text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-none w-28"
                    />
                    <select value={newDay} onChange={(e) => setNewDay(Number(e.target.value))} className="bg-white/10 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-none">
                        {DAYS.map((d, i) => <option key={i} value={i} className="text-black">{d}</option>)}
                    </select>
                    <select value={newSlot} onChange={(e) => setNewSlot(Number(e.target.value))} className="bg-white/10 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-none">
                        {SLOTS.map((s) => <option key={s} value={s} className="text-black">{s}. Stunde</option>)}
                    </select>
                    <select value={newUserId} onChange={(e) => setNewUserId(Number(e.target.value))} className="bg-white/10 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-none">
                        {watchedProfiles.map((p) => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
                    </select>
                    <button onClick={handleAddEvent} className="p-1 rounded-lg bg-green-500/60 hover:bg-green-500/80 text-white">
                        <Check size={13} />
                    </button>
                    <button onClick={() => setShowForm(false)} className="p-1 rounded-lg bg-red-500/50 hover:bg-red-500/70 text-white">
                        <X size={13} />
                    </button>
                </div>
            ) : (
                <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-semibold w-fit">
                    <Plus size={13} /> Event hinzufügen
                </button>
            )}
            {/* Erinnerungen */}
            <div className="flex flex-col gap-1">
                <span className="text-white/60 text-xs font-semibold">Erinnerungen:</span>
                <div className="flex flex-wrap gap-1.5">
                    {DAYS.map((day, dayIndex) => {
                        const reminder = reminders.find((r) => r.day === dayIndex)
                        return (
                            <div key={dayIndex} className="flex flex-col gap-0.5 min-w-[80px]">
                                <span className="text-white/40 text-[10px] font-semibold">{day.slice(0, 2)}</span>
                                {editingDay === dayIndex ? (
                                    <div className="flex items-center gap-0.5">
                                        <input
                                            value={reminderText}
                                            onChange={(e) => setReminderText(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSaveReminder(dayIndex)}
                                            placeholder="Erinnerung…"
                                            autoFocus
                                            className="bg-white/10 text-white placeholder:text-white/30 text-[10px] rounded px-1 py-0.5 border border-white/20 focus:outline-none w-full"
                                        />
                                        <button onClick={() => handleSaveReminder(dayIndex)} className="text-green-400 hover:text-green-300 shrink-0"><Check size={10} /></button>
                                        <button onClick={() => setEditingDay(null)} className="text-white/50 hover:text-white shrink-0"><X size={10} /></button>
                                    </div>
                                ) : reminder ? (
                                    <div className="flex items-center gap-0.5 bg-red-500/70 border border-red-400/40 rounded-md px-1.5 py-0.5">
                                        <span className="text-white text-[10px] font-semibold break-words min-w-0 flex-1">! {reminder.text}</span>
                                        <button onClick={() => { setReminderText(reminder.text); setEditingDay(dayIndex) }} className="text-white/50 hover:text-white shrink-0"><Pencil size={9} /></button>
                                        <button onClick={() => onRemoveReminder(dayIndex)} className="text-white/50 hover:text-white shrink-0"><X size={9} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => { setEditingDay(dayIndex); setReminderText("") }} className="text-white/25 hover:text-white/70 text-[10px] flex items-center gap-0.5">
                                        <Plus size={10} /> hinzufügen
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default TimetableEdit
