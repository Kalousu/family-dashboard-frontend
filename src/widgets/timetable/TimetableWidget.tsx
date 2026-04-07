import { useState } from "react"
import { Pencil, Plus, X, Check } from "lucide-react"
import imageIcons from "../../constants/imageIcons"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
    id: number
    name: string
    color: string
    icon: string
}

interface TimetableEvent {
    id: string
    title: string
    slot: number
    day: number // 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr
    userId: number
}

interface Reminder {
    id: string
    day: number
    text: string
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ALL_PROFILES: Profile[] = [
    { id: 1, name: "Kevin",  color: "blue",       icon: "gamepad" },
    { id: 2, name: "Jonas",  color: "red",         icon: "dog"     },
    { id: 3, name: "Daniel", color: "lightgreen",  icon: "sun"     },
    { id: 4, name: "Lea",    color: "pink",        icon: "flower"  },
    { id: 5, name: "Katrin", color: "lightblue",   icon: "cat"     },
]

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]
const SLOTS = Array.from({ length: 9 }, (_, i) => i + 1)

const INITIAL_EVENTS: TimetableEvent[] = [
    { id: "1", title: "Mathe",    slot: 1, day: 0, userId: 1 },
    { id: "2", title: "Mathe",    slot: 1, day: 0, userId: 2 },
    { id: "3", title: "Deutsch",  slot: 2, day: 0, userId: 1 },
    { id: "4", title: "Sport",    slot: 3, day: 1, userId: 2 },
    { id: "5", title: "Englisch", slot: 2, day: 2, userId: 1 },
    { id: "6", title: "Englisch", slot: 2, day: 2, userId: 2 },
    { id: "7", title: "Physik",   slot: 5, day: 3, userId: 1 },
    { id: "8", title: "Musik",    slot: 4, day: 4, userId: 2 },
]

const INITIAL_REMINDERS: Reminder[] = [
    { id: "r1", day: 0, text: "Sportsachen" },
]

// ─── Helper ───────────────────────────────────────────────────────────────────

function getEventsForCell(
    events: TimetableEvent[],
    slot: number,
    day: number,
    activeTab: "all" | number,
    watchedUserIds: number[]
) {
    const filtered = events.filter((e) => {
        if (e.slot !== slot || e.day !== day) return false
        return activeTab === "all" ? watchedUserIds.includes(e.userId) : e.userId === activeTab
    })

    // In "Alle"-Ansicht: gleichnamige Events zusammenführen
    if (activeTab !== "all") {
        return filtered.map((e) => ({
            title: e.title,
            ids: [e.id],
            profiles: ALL_PROFILES.filter((p) => p.id === e.userId),
        }))
    }

    const groups: Record<string, { ids: string[]; profiles: Profile[] }> = {}
    for (const e of filtered) {
        const profile = ALL_PROFILES.find((p) => p.id === e.userId)
        if (!profile) continue
        if (!groups[e.title]) groups[e.title] = { ids: [], profiles: [] }
        groups[e.title].ids.push(e.id)
        groups[e.title].profiles.push(profile)
    }

    return Object.entries(groups).map(([title, { ids, profiles }]) => ({ title, ids, profiles }))
}

// ─── Small Components ─────────────────────────────────────────────────────────

function UserIcon({ profile, size = 14 }: { profile: Profile; size?: number }) {
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

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                active ? "bg-white/30 text-white shadow-sm" : "text-white/50 hover:text-white/80"
            }`}
        >
            {children}
        </button>
    )
}

function EventCard({ title, profiles, merged, editMode, onRemove }: {
    title: string
    profiles: Profile[]
    merged: boolean
    editMode: boolean
    onRemove: () => void
}) {
    return (
        <div className={`relative w-full flex items-end justify-between gap-1 px-2 py-1.5 rounded-lg bg-white/15 border transition-all ${
            merged ? "border-white/40" : "border-white/20"
        }`}>
            {editMode && (
                <button onClick={onRemove} className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 rounded-full p-0.5 text-white z-10">
                    <X size={10} />
                </button>
            )}
            <span className="text-white text-xs font-semibold truncate">{title}</span>
            <div className="flex gap-0.5 shrink-0">
                {profiles.map((p) => <UserIcon key={p.id} profile={p} size={10} />)}
            </div>
        </div>
    )
}

// ─── Widget ───────────────────────────────────────────────────────────────────

function TimetableWidget() {
    const [events, setEvents]       = useState<TimetableEvent[]>(INITIAL_EVENTS)
    const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS)
    const [watchedIds, setWatchedIds] = useState<number[]>([1, 2])
    const [activeTab, setActiveTab] = useState<"all" | number>("all")
    const [editMode, setEditMode]   = useState(false)
    const [showForm, setShowForm]   = useState(false)

    // Formular-State für neues Event
    const [newTitle,  setNewTitle]  = useState("")
    const [newSlot,   setNewSlot]   = useState(1)
    const [newDay,    setNewDay]    = useState(0)
    const [newUserId, setNewUserId] = useState(watchedIds[0])

    // Dropdown für neuen User
    const [addUserId, setAddUserId] = useState(
        ALL_PROFILES.find((p) => !watchedIds.includes(p.id))?.id ?? ALL_PROFILES[0].id
    )

    // Inline-Erinnerungsformular pro Tag
    const [editingDay, setEditingDay]       = useState<number | null>(null)
    const [reminderText, setReminderText]   = useState("")

    const watchedProfiles = ALL_PROFILES.filter((p) => watchedIds.includes(p.id))
    const availableUsers  = ALL_PROFILES.filter((p) => !watchedIds.includes(p.id))

    function addEvent() {
        if (!newTitle.trim()) return
        setEvents((prev) => [...prev, {
            id: Date.now().toString(),
            title: newTitle.trim(),
            slot: newSlot,
            day: newDay,
            userId: newUserId,
        }])
        setNewTitle("")
        setShowForm(false)
    }

    function addUser() {
        if (watchedIds.includes(addUserId)) return
        setWatchedIds((prev) => [...prev, addUserId])
        const next = ALL_PROFILES.find((p) => !watchedIds.includes(p.id) && p.id !== addUserId)
        if (next) setAddUserId(next.id)
    }

    function removeUser(userId: number) {
        setWatchedIds((prev) => prev.filter((id) => id !== userId))
        if (activeTab === userId) setActiveTab("all")
    }

    function saveReminder(day: number) {
        if (!reminderText.trim()) return
        setReminders((prev) => [
            ...prev.filter((r) => r.day !== day),
            { id: Date.now().toString(), day, text: reminderText.trim() },
        ])
        setEditingDay(null)
        setReminderText("")
    }

    function toggleEdit() {
        setEditMode((v) => !v)
        setShowForm(false)
        setEditingDay(null)
    }

    return (
        <div className="w-full h-full bg-linear-to-b from-indigo-500/30 to-violet-900/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 flex flex-col gap-3 overflow-hidden">

            {/* Tabs + Edit-Button */}
            <div className="flex items-center justify-between gap-2 shrink-0">
                <div className="flex gap-1 bg-white/10 rounded-xl p-1">
                    <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>Alle</TabButton>
                    {watchedProfiles.map((p) => (
                        <TabButton key={p.id} active={activeTab === p.id} onClick={() => setActiveTab(p.id)}>
                            {p.name}
                        </TabButton>
                    ))}
                </div>
                <button
                    onClick={toggleEdit}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        editMode ? "bg-indigo-400/60 text-white" : "bg-white/15 text-white/60 hover:bg-white/25 hover:text-white"
                    }`}
                >
                    <Pencil size={13} />
                    {editMode ? "Fertig" : "Bearbeiten"}
                </button>
            </div>

            {/* Edit-Panel */}
            {editMode && (
                <div className="bg-white/10 border border-white/15 rounded-xl p-3 flex flex-col gap-2.5 shrink-0">

                    {/* User-Verwaltung */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-white/60 text-xs font-semibold shrink-0">User:</span>
                        {watchedProfiles.map((p) => (
                            <div key={p.id} className="flex items-center gap-1 bg-white/15 rounded-lg px-2 py-0.5">
                                <UserIcon profile={p} size={10} />
                                <span className="text-white text-xs">{p.name}</span>
                                <button onClick={() => removeUser(p.id)} className="text-white/50 hover:text-white ml-0.5">
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
                                <button onClick={addUser} className="p-1 rounded-lg bg-white/20 hover:bg-white/30 text-white">
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
                                onKeyDown={(e) => e.key === "Enter" && addEvent()}
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
                            <button onClick={addEvent} className="p-1 rounded-lg bg-green-500/60 hover:bg-green-500/80 text-white">
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
            )}

            {/* Grid */}
            <div className="flex-1 overflow-auto min-h-0">
                <div className="flex h-full">

                    {/* Slot-Nummern links */}
                    <div className="flex flex-col shrink-0">
                        <div className="h-12" /> {/* Platzhalter für Spalten-Header */}
                        {SLOTS.map((slot) => (
                            <div key={slot} className="h-12 w-6 flex items-center justify-center text-white/40 text-sm font-bold">
                                {slot}
                            </div>
                        ))}
                    </div>

                    <div className="w-px bg-white/15 shrink-0 mx-1.5 self-stretch" />

                    {/* Tages-Spalten */}
                    {DAYS.map((day, dayIndex) => {
                        const reminder = reminders.find((r) => r.day === dayIndex)
                        return (
                            <div key={dayIndex} className="flex-1 flex flex-col min-w-0 border-r border-white/10 last:border-r-0">

                                {/* Spalten-Header */}
                                <div className="h-12 flex flex-col items-center justify-center gap-0.5 px-1 shrink-0">
                                    <span className="text-white/70 text-xs font-bold tracking-wide truncate">{day}</span>

                                    {reminder ? (
                                        <div className="flex items-center gap-0.5 bg-red-500/70 border border-red-400/40 rounded-md px-1.5 py-0.5 max-w-full">
                                            <span className="text-white text-[10px] font-semibold truncate">! {reminder.text}</span>
                                            {editMode && (
                                                <button onClick={() => setReminders((prev) => prev.filter((r) => r.day !== dayIndex))} className="text-white/70 hover:text-white shrink-0">
                                                    <X size={9} />
                                                </button>
                                            )}
                                        </div>
                                    ) : editMode && (
                                        editingDay === dayIndex ? (
                                            <div className="flex items-center gap-0.5 w-full px-1">
                                                <input
                                                    value={reminderText}
                                                    onChange={(e) => setReminderText(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && saveReminder(dayIndex)}
                                                    placeholder="Erinnerung…"
                                                    autoFocus
                                                    className="bg-white/10 text-white placeholder:text-white/30 text-[10px] rounded px-1 py-0.5 border border-white/20 focus:outline-none w-full"
                                                />
                                                <button onClick={() => saveReminder(dayIndex)} className="text-green-400 hover:text-green-300 shrink-0"><Check size={10} /></button>
                                                <button onClick={() => setEditingDay(null)} className="text-white/50 hover:text-white shrink-0"><X size={10} /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => { setEditingDay(dayIndex); setReminderText("") }} className="text-white/25 hover:text-red-400">
                                                <Plus size={11} />
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="h-px bg-white/15 mx-1 shrink-0" />

                                {/* Zeilen pro Slot */}
                                {SLOTS.map((slot) => {
                                    const cellEvents = getEventsForCell(events, slot, dayIndex, activeTab, watchedIds)
                                    return (
                                        <div key={slot} className="h-12 px-1 py-1 flex flex-col gap-0.5 border-b border-white/10 last:border-b-0">
                                            {cellEvents.length === 0 ? (
                                                <div className="flex-1 rounded-lg border border-dashed border-white/10" />
                                            ) : cellEvents.map((ev, i) => (
                                                <EventCard
                                                    key={i}
                                                    title={ev.title}
                                                    profiles={ev.profiles}
                                                    merged={ev.profiles.length > 1}
                                                    editMode={editMode}
                                                    onRemove={() => setEvents((prev) => prev.filter((e) => !ev.ids.includes(e.id)))}
                                                />
                                            ))}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default TimetableWidget
