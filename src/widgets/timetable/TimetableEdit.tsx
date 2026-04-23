import { useState, useMemo } from "react"
import { Plus, X, Check } from "lucide-react"
import type { Profile } from "./timetableTypes"
import { DAYS, SLOTS } from "./timetableTypes"
import { UserIcon } from "./TimetableComponents"

const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr"]

interface TimetableEditProps {
    profiles: Profile[]
    watchedIds: number[]
    onAddEvent: (body: { title: string; slot: number; day: number; userId: number }) => Promise<void>
    onAddUser: (userId: number) => void
    onRemoveUser: (userId: number) => void
    isCompact?: boolean
}

function TimetableEdit({ profiles, watchedIds, onAddEvent, onAddUser, onRemoveUser, isCompact }: TimetableEditProps) {
    const watchedProfiles = profiles.filter((p) => watchedIds.includes(p.id))
    const availableUsers  = profiles.filter((p) => !watchedIds.includes(p.id))

    const [showForm, setShowForm]         = useState(false)
    const [newTitle,  setNewTitle]        = useState("")
    const [newSlot,   setNewSlot]         = useState(1)
    const [newDay,    setNewDay]          = useState(0)
    const [newUserId, setNewUserId]       = useState<number | undefined>(undefined)
    const [addUserId, setAddUserId]       = useState(availableUsers[0]?.id ?? profiles[0]?.id)

    const effectiveUserId = useMemo(() => {
        if (newUserId !== undefined && watchedIds.includes(newUserId)) return newUserId
        return watchedProfiles[0]?.id
    }, [newUserId, watchedIds, watchedProfiles])

    async function handleAddEvent() {
        if (!newTitle.trim() || effectiveUserId === undefined) return
        try {
            await onAddEvent({ title: newTitle.trim(), slot: newSlot, day: newDay, userId: effectiveUserId })
            setNewTitle("")
            setShowForm(false)
        } catch (err) {
            console.error("Save error:", err)
        }
    }

    function handleAddUser() {
        onAddUser(addUserId)
        const next = availableUsers.find((p) => p.id !== addUserId)
        if (next) setAddUserId(next.id)
    }

    return (
        <div className="bg-white/10 border border-white/15 rounded-xl p-3 flex flex-col gap-2.5 shrink-0">

            {/* User-Verwaltung */}
            {isCompact ? (
                // Mobile: alle User als Chips, verfügbare direkt antippbar
                <div className="flex flex-wrap gap-1.5">
                    {watchedProfiles.map((p) => (
                        <div key={p.id} className="flex items-center gap-1 bg-white/15 rounded-lg px-2 py-1.5">
                            <UserIcon profile={p} size={10} />
                            <span className="text-white text-xs">{p.name}</span>
                            <button onClick={() => onRemoveUser(p.id)} className="text-white/50 hover:text-white ml-0.5 p-0.5 touch-manipulation">
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                    {availableUsers.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => onAddUser(p.id)}
                            className="flex items-center gap-1 bg-white/5 border border-dashed border-white/25 hover:bg-white/15 rounded-lg px-2 py-1.5 text-white/50 hover:text-white transition-all touch-manipulation"
                        >
                            <UserIcon profile={p} size={10} />
                            <span className="text-xs">{p.name}</span>
                            <Plus size={9} />
                        </button>
                    ))}
                </div>
            ) : (
                // Desktop: bisheriges Layout
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
            )}

            {/* Event hinzufügen */}
            {showForm ? (
                isCompact ? (
                    // Mobile: vertikales Layout, Button-Gruppen statt Selects
                    <div className="flex flex-col gap-2">
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
                            placeholder="Fach (z.B. Mathe)"
                            autoFocus
                            className="bg-white/10 text-white placeholder:text-white/40 text-xs rounded-lg px-3 py-2.5 border border-white/20 focus:outline-none w-full"
                        />

                        {/* Tag-Buttons */}
                        <div className="flex gap-1">
                            {DAY_LABELS.map((label, i) => (
                                <button
                                    key={i}
                                    onClick={() => setNewDay(i)}
                                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all touch-manipulation border ${
                                        newDay === i
                                            ? "bg-indigo-500/60 border-indigo-400/50 text-white"
                                            : "bg-white/10 border-white/15 text-white/60 hover:bg-white/20"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Stunden-Buttons */}
                        <div className="grid grid-cols-9 gap-1">
                            {SLOTS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setNewSlot(s)}
                                    className={`py-2.5 rounded-lg text-xs font-semibold transition-all touch-manipulation border ${
                                        newSlot === s
                                            ? "bg-indigo-500/60 border-indigo-400/50 text-white"
                                            : "bg-white/10 border-white/15 text-white/60 hover:bg-white/20"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* User-Buttons (nur wenn mehrere) */}
                        {watchedProfiles.length > 1 && (
                            <div className="flex gap-1.5 flex-wrap">
                                {watchedProfiles.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setNewUserId(p.id)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation border ${
                                            effectiveUserId === p.id
                                                ? "bg-indigo-500/40 border-indigo-400/50 text-white"
                                                : "bg-white/10 border-white/15 text-white/60 hover:bg-white/20"
                                        }`}
                                    >
                                        <UserIcon profile={p} size={10} />
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 pt-0.5">
                            <button
                                onClick={handleAddEvent}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-green-500/50 hover:bg-green-500/70 text-white text-xs font-semibold transition-all touch-manipulation min-h-11"
                            >
                                <Check size={13} /> Speichern
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs font-semibold transition-all touch-manipulation min-h-11"
                            >
                                <X size={13} /> Abbrechen
                            </button>
                        </div>
                    </div>
                ) : (
                    // Desktop: bisheriges Layout
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
                        <select value={effectiveUserId ?? ""} onChange={(e) => setNewUserId(Number(e.target.value))} className="bg-white/10 text-white text-xs rounded-lg px-2 py-1 border border-white/20 focus:outline-none">
                            {watchedProfiles.map((p) => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
                        </select>
                        <button onClick={handleAddEvent} className="p-1 rounded-lg bg-green-500/60 hover:bg-green-500/80 text-white">
                            <Check size={13} />
                        </button>
                        <button onClick={() => setShowForm(false)} className="p-1 rounded-lg bg-red-500/50 hover:bg-red-500/70 text-white">
                            <X size={13} />
                        </button>
                    </div>
                )
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className={`flex items-center gap-1 text-white/60 hover:text-white text-xs font-semibold transition-all touch-manipulation ${
                        isCompact
                            ? "justify-center w-full py-3 rounded-lg border border-dashed border-white/20 hover:border-white/40 min-h-11"
                            : "w-fit"
                    }`}
                >
                    <Plus size={13} /> Event hinzufügen
                </button>
            )}

        </div>
    )
}

export default TimetableEdit
