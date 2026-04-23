import { useState, Fragment, useRef, useEffect, useContext } from "react"
import { Pencil } from "lucide-react"
import type { Profile, TimetableEvent, Reminder } from "./timetableTypes"
import { DAYS, SLOTS } from "./timetableTypes"
import TimetableEdit from "./TimetableEdit"
import { TabButton, EventCard, DayHeader } from "./TimetableComponents"
import { AuthContext } from "../../context/AuthContext"
import { getUsersForFamily } from "../../api/familyApi"
import {
    getTimetable,
    createTimetableEvent,
    deleteTimetableEvent,
    createTimetableReminder,
    deleteTimetableReminder,
    updateWatchedUsers,
} from "../../api/timetableApi"

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

    const eventGroups: Record<string, { ids: number[]; profiles: Profile[] }> = {}
    for (const e of filtered) {
        const profile = profiles.find((p) => p.id === e.userId)
        if (!profile) continue
        if (!eventGroups[e.title]) eventGroups[e.title] = { ids: [], profiles: [] }
        eventGroups[e.title].ids.push(e.id)
        eventGroups[e.title].profiles.push(profile)
    }

    return Object.entries(eventGroups).map(([title, { ids, profiles }]) => ({ title, ids, profiles }))
}

function TimetableWidget({ widgetId }: { widgetId?: string | number }) {
    const auth = useContext(AuthContext)
    const familyId = auth?.familyId ?? null
    const numId = widgetId !== undefined ? Number(widgetId) : undefined

    const [allProfiles, setAllProfiles] = useState<Profile[]>([])
    const [events, setEvents]           = useState<TimetableEvent[]>([])
    const [reminders, setReminders]     = useState<Reminder[]>([])
    const [watchedIds, setWatchedIds]   = useState<number[]>([])
    const [loading, setLoading]         = useState(true)
    const [activeTab, setActiveTab]     = useState<"all" | number>("all")
    const [editMode, setEditMode]       = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (numId === undefined || !familyId) return
        Promise.all([
            getUsersForFamily(familyId),
            getTimetable(numId),
        ]).then(([users, data]) => {
            setAllProfiles(users.map((u) => ({ id: u.id, name: u.name, color: u.color, icon: u.avatar, avatarType: u.avatarType })))
            setEvents(data.events)
            setReminders(data.reminders)
            setWatchedIds(data.watchedUserIds)
        }).catch(console.error)
          .finally(() => setLoading(false))
    }, [numId, familyId])

    const watchedProfiles = allProfiles.filter((p) => watchedIds.includes(p.id))

    async function addUser(userId: number) {
        if (watchedIds.includes(userId) || numId === undefined) return
        const newIds = [...watchedIds, userId]
        setWatchedIds(newIds)
        await updateWatchedUsers(numId, newIds).catch(console.error)
    }

    async function removeUser(userId: number) {
        if (numId === undefined) return
        const newIds = watchedIds.filter((id) => id !== userId)
        setWatchedIds(newIds)
        if (activeTab === userId) setActiveTab("all")
        await updateWatchedUsers(numId, newIds).catch(console.error)
    }

    async function handleAddEvent(body: { title: string; slot: number; day: number; userId: number }) {
        if (numId === undefined) return
        const alreadyExists = events.some(
            (e) => e.slot === body.slot && e.day === body.day && e.userId === body.userId
        )
        if (alreadyExists) return
        try {
            const created = await createTimetableEvent(numId, body)
            setEvents((prev) => [...prev, created])
        } catch (err) {
            console.error("Event save error:", err)
        }
    }

    async function handleAddReminder(body: { day: number; text: string }) {
        if (numId === undefined) return
        try {
            const existing = reminders.find((r) => r.day === body.day)
            if (existing) await deleteTimetableReminder(numId, existing.id)
            const created = await createTimetableReminder(numId, body)
            setReminders((prev) => [...prev.filter((r) => r.day !== body.day), created])
        } catch (err) {
            console.error("Reminder save error:", err)
        }
    }

    async function handleRemoveReminder(reminderId: number) {
        if (numId === undefined) return
        await deleteTimetableReminder(numId, reminderId).catch(console.error)
        setReminders((prev) => prev.filter((r) => r.id !== reminderId))
    }

    if (loading) {
        return (
            <div className="w-full h-full bg-linear-to-b from-purple-900/50 to-indigo-400/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-white/50 text-sm">Lädt…</span>
            </div>
        )
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
                    onClick={() => setEditMode((v) => !v)}
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
                    profiles={allProfiles}
                    watchedIds={watchedIds}
                    reminders={reminders}
                    onAddEvent={handleAddEvent}
                    onAddReminder={handleAddReminder}
                    onRemoveReminder={handleRemoveReminder}
                    onAddUser={addUser}
                    onRemoveUser={removeUser}
                />
            )}

            {/* Grid */}
            <div ref={scrollRef} className="flex-1 overflow-auto min-h-0" style={{ overflowAnchor: "none" }}>
                <div
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
                            onRemove={() => handleRemoveReminder(reminders.find((r) => r.day === dayIndex)!.id)}
                        />
                    ))}

                    {SLOTS.map((slot) => (
                        <Fragment key={slot}>
                            <div className="flex items-center justify-center text-white/40 text-sm font-bold border-b border-white/10 last:border-b-0 py-1">
                                {slot}
                            </div>
                            <div className="bg-white/15 border-b border-white/10" />
                            {DAYS.map((_, dayIndex) => {
                                const cellEvents = getEventsForCell(events, slot, dayIndex, activeTab, watchedIds, allProfiles)
                                const allViewCount = getEventsForCell(events, slot, dayIndex, "all", watchedIds, allProfiles).length
                                const minHeight = `${Math.max(1, allViewCount) * 3}rem`
                                return (
                                    <div key={dayIndex} className="px-1 py-1 flex flex-col gap-0.5 border-b border-r border-white/10 last:border-r-0" style={{ minHeight }}>
                                        {cellEvents.length === 0 ? (
                                            <div className="flex-1 rounded-lg border border-dashed border-white/10" />
                                        ) : cellEvents.map((ev) => (
                                            <EventCard
                                                key={ev.ids.join("-")}
                                                title={ev.title}
                                                profiles={ev.profiles}
                                                merged={ev.profiles.length > 1}
                                                editMode={editMode}
                                                onRemove={() => {
                                                    if (numId === undefined) return
                                                    Promise.all(ev.ids.map((id) => deleteTimetableEvent(numId, id)))
                                                        .then(() => setEvents((prev) => prev.filter((e) => !ev.ids.includes(e.id))))
                                                        .catch(console.error)
                                                }}
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
