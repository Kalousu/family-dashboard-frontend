import { useState, Fragment, useRef } from "react"
import { Pencil } from "lucide-react"
import type { Profile, TimetableEvent, Reminder } from "./timetableTypes"
import { DAYS, SLOTS } from "./timetableTypes"
import TimetableEdit from "./TimetableEdit"
import { TabButton, EventCard, DayHeader } from "./TimetableComponents"

// Mock-Daten

const ALL_PROFILES: Profile[] = [
    { id: 1, name: "Kevin",  color: "blue",       icon: "gamepad" }, //Kind
    { id: 2, name: "Jonas",  color: "red",         icon: "dog"     }, //Kind2
    { id: 3, name: "Daniel", color: "lightgreen",  icon: "sun"     },
    { id: 4, name: "Lea",    color: "pink",        icon: "flower"  }, //AuPair
    { id: 5, name: "Katrin", color: "lightblue",   icon: "cat"     },
]

const INITIAL_EVENTS: TimetableEvent[] = [
    { id: "1", title: "Mathe",    slot: 1, day: 0, userId: 1 },
    { id: "2", title: "Mathe",    slot: 2, day: 0, userId: 1 },
    { id: "3", title: "Kunst",    slot: 3, day: 0, userId: 1 },
    { id: "4", title: "ESL @Sprachschule",    slot: 3, day: 0, userId: 4 },
    { id: "5", title: "Deutsch",    slot: 4, day: 0, userId: 1 },
    { id: "6", title: "Sport", slot: 5, day: 0, userId: 1 },
    { id: "7", title: "MITTAGSPAUSE", slot: 6, day: 0, userId: 1 },
    { id: "8", title: "MITTAGSPAUSE", slot: 6, day: 1, userId: 1 },
    { id: "9", title: "MITTAGSPAUSE", slot: 6, day: 2, userId: 1 },
    { id: "10", title: "MITTAGSPAUSE", slot: 6, day:3, userId: 1 },
    { id: "11", title: "MITTAGSPAUSE", slot: 6, day: 4, userId: 1 },
    { id: "12", title: "Chemie",    slot: 7, day: 0, userId: 1 },
    { id: "13", title: "Klavier @Musikschule",    slot: 7, day: 0, userId: 2 },
]

const INITIAL_REMINDERS: Reminder[] = [
    { id: "r1", day: 0, text: "Sportsachen" },
]

// ────────────────────────────────────────────────────────────────

function getEventsForCell(
    events: TimetableEvent[],
    slot: number,
    day: number,
    activeTab: "all" | number,
    watchedUserIds: number[],
    profiles: Profile[]
) {
    const filtered = events.filter((e) => {
        if (e.slot !== slot || e.day !== day) return false
        return activeTab === "all" ? watchedUserIds.includes(e.userId) : e.userId === activeTab
    })

    if (activeTab !== "all") {
        return filtered.map((e) => ({
            title: e.title,
            ids: [e.id],
            profiles: profiles.filter((p) => p.id === e.userId),
        }))
    }

    // gleichnamige Events zusammenführen
    const eventGroups: Record<string, { ids: string[]; profiles: Profile[] }> = {}
    for (const e of filtered) {
        const profile = profiles.find((p) => p.id === e.userId)
        if (!profile) continue
        if (!eventGroups[e.title]) eventGroups[e.title] = { ids: [], profiles: [] }
        eventGroups[e.title].ids.push(e.id)
        eventGroups[e.title].profiles.push(profile)
    }

    return Object.entries(eventGroups).map(([title, { ids, profiles }]) => ({ title, ids, profiles }))
}

function TimetableWidget() {
    const [events, setEvents]         = useState<TimetableEvent[]>(INITIAL_EVENTS)
    const [reminders, setReminders]   = useState<Reminder[]>(INITIAL_REMINDERS)
    // Später: nur die IDs der Kinder & AuPair, nicht der Eltern
    const [watchedIds, setWatchedIds] = useState<number[]>(
        ALL_PROFILES
            .filter((p) => INITIAL_EVENTS.some((e) => e.userId === p.id))
            .map((p) => p.id)
    )
    const [activeTab, setActiveTab]   = useState<"all" | number>("all")
    const [editMode, setEditMode]     = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

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
        <div className="w-full h-full bg-linear-to-b from-purple-900/50 to-indigo-400/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 flex flex-col gap-3 overflow-hidden">

            {/* Tab-Leiste */}
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
                            : "bg-white/7 border-white/15 text-white/50 hover:bg-white/10 hover:text-white/70"
                    }`}
                >
                    <Pencil size={12} />
                    {editMode ? "Fertig" : "Bearbeiten"}
                </button>
            </div>

            {/* Edit-Panel */}
            {editMode && (
                <TimetableEdit
                    profiles={ALL_PROFILES}
                    watchedIds={watchedIds}
                    onAddEvent={(e) => setEvents((prev) => [...prev, e])}
                    onAddUser={addUser}
                    onRemoveUser={removeUser}
                />
            )}

            {/* Grid */}
            <div ref={scrollRef} className="flex-1 overflow-auto min-h-0" style={{ overflowAnchor: "none" }}>                <div
                    className="grid"
                    style={{ gridTemplateColumns: "1.5rem 1px repeat(5, minmax(0, 1fr))" }}
                >
                    <div className="border-b border-white/15" />
                    <div className="bg-white/15 border-b border-white/15" />
                    {DAYS.map((day, dayIndex) => (
                        <DayHeader
                            key={day}
                            day={day}
                            reminder={reminders.find((r) => r.day === dayIndex)}
                            editMode={editMode}
                            isEditing={editingDay === dayIndex}
                            reminderText={reminderText}
                            onReminderTextChange={setReminderText}
                            onSave={() => saveReminder(dayIndex)}
                            onCancelEdit={() => setEditingDay(null)}
                            onStartEdit={() => { setEditingDay(dayIndex); setReminderText("") }}
                            onRemove={() => setReminders((prev) => prev.filter((r) => r.day !== dayIndex))}
                        />
                    ))}

                    {SLOTS.map((slot) => (
                        <Fragment key={slot}>
                            <div className="flex items-center justify-center text-white/40 text-sm font-bold border-b border-white/10 last:border-b-0 py-1">
                                {slot}
                            </div>
                            <div className="bg-white/15 border-b border-white/10" />
                            {DAYS.map((_, dayIndex) => {
                                const cellEvents = getEventsForCell(events, slot, dayIndex, activeTab, watchedIds, ALL_PROFILES)
                                const allViewCount = getEventsForCell(events, slot, dayIndex, "all", watchedIds, ALL_PROFILES).length
                                const minHeight = `${Math.max(1, allViewCount) * 3}rem`
                                return (
                                    <div key={dayIndex} className="px-1 py-1 flex flex-col gap-0.5 border-b border-white/10 border-r border-white/10 last:border-r-0" style={{ minHeight }}>
                                        {cellEvents.length === 0 ? (
                                            <div className="flex-1 rounded-lg border border-dashed border-white/10" />
                                        ) : cellEvents.map((ev) => (
                                            <EventCard
                                                key={ev.ids.join("-")}
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
