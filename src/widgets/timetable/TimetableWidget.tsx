import { useState, Fragment } from "react"
import { Pencil, Plus, X, Check } from "lucide-react"
import imageIcons from "../../constants/imageIcons"
import type { Profile, TimetableEvent, Reminder } from "./timetableTypes"
import TimetableEdit from "./TimetableEdit"

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

    if (activeTab !== "all") {
        return filtered.map((e) => ({
            title: e.title,
            ids: [e.id],
            profiles: ALL_PROFILES.filter((p) => p.id === e.userId),
        }))
    }

    // In "Alle"-Ansicht: gleichnamige Events zusammenführen
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

function EventCard({ title, profiles, merged, editMode, onRemove }: {
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

// ─── Widget ───────────────────────────────────────────────────────────────────

function TimetableWidget() {
    const [events, setEvents]         = useState<TimetableEvent[]>(INITIAL_EVENTS)
    const [reminders, setReminders]   = useState<Reminder[]>(INITIAL_REMINDERS)
    const [watchedIds, setWatchedIds] = useState<number[]>([1, 2])
    const [activeTab, setActiveTab]   = useState<"all" | number>("all")
    const [editMode, setEditMode]     = useState(false)

    const [editingDay, setEditingDay]     = useState<number | null>(null)
    const [reminderText, setReminderText] = useState("")

    const watchedProfiles = ALL_PROFILES.filter((p) => watchedIds.includes(p.id))

    function addUser(userId: number) {
        if (watchedIds.includes(userId)) return
        setWatchedIds((prev) => [...prev, userId])
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
        setEditingDay(null)
    }

    return (
        <div className="w-full h-full bg-linear-to-b from-indigo-500/30 to-violet-900/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 flex flex-col gap-3 overflow-hidden">

            {/* Tab-Leiste im Browser-Tab-Stil */}
            <div className="flex items-end shrink-0 border-b border-white/20">
                <div className="flex items-end gap-0.5">
                    <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>Alle</TabButton>
                    {watchedProfiles.map((p) => (
                        <TabButton key={p.id} active={activeTab === p.id} onClick={() => setActiveTab(p.id)}>
                            {p.name}
                        </TabButton>
                    ))}
                </div>
                <div className="flex-1" />
                <button
                    onClick={toggleEdit}
                    className={`flex items-center gap-1.5 px-3 py-1 mb-px rounded-t-lg border-t border-l border-r text-xs font-semibold transition-all ${
                        editMode
                            ? "bg-indigo-400/50 border-indigo-400/50 text-white"
                            : "bg-white/5 border-white/15 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                >
                    <Pencil size={12} />
                    {editMode ? "Fertig" : "Bearbeiten"}
                </button>
            </div>

            {/* Edit-Panel (ausgelagert) */}
            {editMode && (
                <TimetableEdit
                    watchedIds={watchedIds}
                    onAddEvent={(e) => setEvents((prev) => [...prev, e])}
                    onAddUser={addUser}
                    onRemoveUser={removeUser}
                />
            )}

            {/* Grid — CSS Grid sorgt dafür, dass alle Zellen einer Zeile dieselbe Höhe haben */}
            <div className="flex-1 overflow-auto min-h-0">
                <div
                    className="grid"
                    style={{ gridTemplateColumns: "1.5rem 1px repeat(5, minmax(0, 1fr))" }}
                >
                    {/* ── Header-Zeile ── */}
                    <div className="border-b border-white/15" /> {/* Slot-Nummer-Platzhalter */}
                    <div className="bg-white/15 border-b border-white/15" /> {/* Trennlinie */}
                    {DAYS.map((day, dayIndex) => {
                        const reminder = reminders.find((r) => r.day === dayIndex)
                        return (
                            <div key={dayIndex} className="flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 border-b border-white/15 border-r border-white/10 last:border-r-0">
                                <span className="text-white/70 text-xs font-bold tracking-wide text-center">{day}</span>
                                {reminder ? (
                                    <div className="flex items-center gap-0.5 bg-red-500/70 border border-red-400/40 rounded-md px-1.5 py-0.5 w-full">
                                        <span className="text-white text-[10px] font-semibold break-words min-w-0">! {reminder.text}</span>
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
                        )
                    })}

                    {/* ── Slot-Zeilen ── */}
                    {SLOTS.map((slot) => (
                        <Fragment key={slot}>
                            {/* Slot-Nummer */}
                            <div className="flex items-center justify-center text-white/40 text-sm font-bold border-b border-white/10 last:border-b-0 py-1">
                                {slot}
                            </div>
                            {/* Vertikale Trennlinie */}
                            <div className="bg-white/15 border-b border-white/10" />
                            {/* Tages-Zellen */}
                            {DAYS.map((_, dayIndex) => {
                                const cellEvents = getEventsForCell(events, slot, dayIndex, activeTab, watchedIds)
                                return (
                                    <div key={dayIndex} className="min-h-12 px-1 py-1 flex flex-col gap-0.5 border-b border-white/10 border-r border-white/10 last:border-r-0">
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
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TimetableWidget
