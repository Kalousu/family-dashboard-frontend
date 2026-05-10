import { useState, Fragment, useRef, useEffect, useContext, useCallback } from "react"
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
    const currentUserId = auth?.currentUser?.id
    const numId = widgetId !== undefined ? Number(widgetId) : undefined

    const [allProfiles, setAllProfiles] = useState<Profile[]>([])
    const [events, setEvents]           = useState<TimetableEvent[]>([])
    const [reminders, setReminders]     = useState<Reminder[]>([])
    const [watchedIds, setWatchedIds]   = useState<number[]>([])
    const [loading, setLoading]         = useState(true)
    const [error, setError]             = useState<string | null>(null)
    const [activeTab, setActiveTab]     = useState<"all" | number>("all")
    const [editMode, setEditMode]       = useState(false)

    const scrollRef = useRef<HTMLDivElement>(null)
    const roRef = useRef<ResizeObserver | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const isCompact = containerWidth > 0 && containerWidth < 400

    const containerRef = useCallback((node: HTMLDivElement | null) => {
        roRef.current?.disconnect()
        roRef.current = null
        if (!node) return
        const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
        ro.observe(node)
        roRef.current = ro
    }, [])

    const todayIdx = (() => { const d = (new Date().getDay() + 6) % 7; return d < 5 ? d : -1 })()

    const daysToRender: Array<{ dayIndex: number; label: string }> = isCompact
        ? todayIdx === -1
            ? [{ dayIndex: 0, label: "Mo" },    { dayIndex: 1, label: "Di" }]
            : todayIdx === 4
            ? [{ dayIndex: 4, label: "Heute" }, { dayIndex: 0, label: "Mo" }]
            : [{ dayIndex: todayIdx, label: "Heute" }, { dayIndex: todayIdx + 1, label: "Morgen" }]
        : DAYS.map((name, i) => ({ dayIndex: i, label: name }))

    useEffect(() => {
        if (numId === undefined || !familyId) return
        Promise.all([
            getUsersForFamily(familyId),
            getTimetable(numId),
        ]).then(([users, data]) => {
            setAllProfiles(users.map((u) => ({ id: u.id, name: u.name, color: u.color, icon: u.avatar, avatarType: u.avatarType })))
            setEvents(data.events)
            setReminders(data.reminders)

            if (data.watchedUserIds.length === 0 && currentUserId && users.some(u => u.id === currentUserId)) {
                const newWatchedIds = [currentUserId]
                setWatchedIds(newWatchedIds)
                updateWatchedUsers(numId, newWatchedIds).catch(console.error)
            } else {
                setWatchedIds(data.watchedUserIds)
            }
        }).catch(() => setError("Stundenplan konnte nicht geladen werden."))
          .finally(() => setLoading(false))
    }, [numId, familyId, currentUserId])

    async function addUser(userId: number) {
        if (watchedIds.includes(userId) || numId === undefined) return
        const newIds = [...watchedIds, userId]
        setWatchedIds(newIds)
        try {
            await updateWatchedUsers(numId, newIds)
        } catch {
            setWatchedIds(watchedIds)
            setError("Benutzer konnte nicht hinzugefügt werden.")
        }
    }

    async function removeUser(userId: number) {
        if (numId === undefined) return
        const newIds = watchedIds.filter((id) => id !== userId)
        setWatchedIds(newIds)
        if (activeTab === userId) setActiveTab("all")
        try {
            await updateWatchedUsers(numId, newIds)
        } catch {
            setWatchedIds(watchedIds)
            setError("Benutzer konnte nicht entfernt werden.")
        }
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
        } catch {
            setError("Eintrag konnte nicht gespeichert werden.")
        }
    }

    async function handleRemoveReminder(reminderId: number) {
        if (numId === undefined) return
        try {
            await deleteTimetableReminder(numId, reminderId)
            setReminders((prev) => prev.filter((r) => r.id !== reminderId))
        } catch {
            setError("Erinnerung konnte nicht gelöscht werden.")
        }
    }

    return (
        <div ref={containerRef} className="relative w-full h-full bg-linear-to-b from-purple-900/50 to-indigo-400/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-4 flex flex-col gap-3 overflow-hidden">
        {error && <p className="text-red-300 text-xs text-center">{error}</p>}
        {loading ? (
            <div className="flex-1 flex items-center justify-center">
                <span className="text-white/50 text-sm">Lädt…</span>
            </div>
        ) : (<>

            {isCompact && (
                <button
                    onClick={() => setEditMode((v) => !v)}
                    className={`absolute top-2 right-10 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all touch-manipulation ${
                        editMode
                            ? "bg-indigo-400/50 text-white"
                            : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/70"
                    }`}
                >
                    <Pencil size={14} />
                </button>
            )}

            <div className="flex items-end shrink-0 border-b border-white/20">
                <div className="flex items-end gap-0.5">
                    <TabButton active={true} onClick={() => setActiveTab("all")}>Alle</TabButton>
                </div>
                <div className="flex-1" />
                {!isCompact && (
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
                )}
            </div>

            {editMode && (
                <TimetableEdit
                    profiles={allProfiles}
                    watchedIds={watchedIds}
                    onAddEvent={handleAddEvent}
                    onAddUser={addUser}
                    onRemoveUser={removeUser}
                    isCompact={isCompact}
                />
            )}

            <div ref={scrollRef} className="flex-1 overflow-auto min-h-0" style={{ overflowAnchor: "none" }}>
                <div
                    className="grid"
                    style={{ gridTemplateColumns: `${isCompact ? "1rem" : "1.5rem"} 1px repeat(${daysToRender.length}, minmax(0, 1fr))` }}
                >
                    <div className="border-b border-white/15" />
                    <div className="bg-white/15 border-b border-white/15" />
                    {daysToRender.map(({ dayIndex, label }) => (
                        <DayHeader
                            key={dayIndex}
                            label={label}
                            compact={isCompact}
                            isToday={dayIndex === todayIdx}
                            reminder={reminders.find((r) => r.day === dayIndex)}
                            editMode={editMode}
                            onRemove={() => handleRemoveReminder(reminders.find((r) => r.day === dayIndex)!.id)}
                        />
                    ))}

                    {SLOTS.map((slot) => (
                        <Fragment key={slot}>
                            <div className={`flex items-center justify-center text-white/40 font-bold border-b border-white/10 last:border-b-0 py-1 ${isCompact ? "text-[10px]" : "text-sm"}`}>
                                {slot}
                            </div>
                            <div className="bg-white/15 border-b border-white/10" />
                            {daysToRender.map(({ dayIndex }) => {
                                const cellEvents = getEventsForCell(events, slot, dayIndex, activeTab, watchedIds, allProfiles)
                                const allViewCount = getEventsForCell(events, slot, dayIndex, "all", watchedIds, allProfiles).length
                                const minHeight = `${Math.max(1, allViewCount) * (isCompact ? 2 : 3)}rem`
                                return (
                                    <div key={dayIndex} className={`flex flex-col gap-0.5 border-b border-r border-white/10 last:border-r-0 ${isCompact ? "px-0.5 py-0.5" : "px-1 py-1"} ${dayIndex === todayIdx ? "bg-indigo-500/8" : ""}`} style={{ minHeight }}>
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
        </>)}
        </div>
    )
}

export default TimetableWidget
