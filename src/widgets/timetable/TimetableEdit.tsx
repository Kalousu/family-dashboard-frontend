import { useState } from "react"
import { Plus, X, Check } from "lucide-react"
import type { Profile, TimetableEvent } from "./timetableTypes"
import { DAYS, SLOTS } from "./timetableTypes"
import { UserIcon } from "./TimetableComponents"

interface TimetableEditProps {
    profiles: Profile[]
    watchedIds: number[]
    onAddEvent: (event: TimetableEvent) => void
    onAddUser: (userId: number) => void
    onRemoveUser: (userId: number) => void
}

function TimetableEdit({ profiles, watchedIds, onAddEvent, onAddUser, onRemoveUser }: TimetableEditProps) {
    const watchedProfiles = profiles.filter((p) => watchedIds.includes(p.id))
    const availableUsers  = profiles.filter((p) => !watchedIds.includes(p.id))

    const [showForm, setShowForm] = useState(false)
    const [newTitle,  setNewTitle]  = useState("")
    const [newSlot,   setNewSlot]   = useState(1)
    const [newDay,    setNewDay]    = useState(0)
    const [newUserId, setNewUserId] = useState(watchedIds[0])
    const [addUserId, setAddUserId] = useState(
        availableUsers[0]?.id ?? profiles[0].id
    )

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
        </div>
    )
}

export default TimetableEdit
