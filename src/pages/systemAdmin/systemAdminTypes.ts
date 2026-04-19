export type FamilyStatus = "aktiv" | "gesperrt"
export type MemberRole = "Mitglied" | "Familienadministrator"

export interface FamilyMember {
    id: number
    name: string
    role: MemberRole
    icon: string
    color: string
    isLocked: boolean
}

export interface Family {
    id: number
    name: string
    email: string
    registeredAt: string
    status: FamilyStatus
    members: FamilyMember[]
}

export interface FeatureFlag {
    id: string
    label: string
    description: string
    enabled: boolean
    category: "widget" | "system"
}

export interface MaintenanceSettings {
    maintenanceMode: boolean
    maintenanceMessage: string
    flags: FeatureFlag[]
}

export const DEFAULT_MAINTENANCE_SETTINGS: MaintenanceSettings = {
    maintenanceMode: false,
    maintenanceMessage: "Das System wird gerade gewartet. Bitte versuche es später erneut.",
    flags: [
        { id: "widget_calendar", label: "Kalender-Widget", description: "Kalender für alle Familien sichtbar", enabled: true, category: "widget" },
        { id: "widget_timetable", label: "Stundenplan-Widget", description: "Stundenplan für alle Familien sichtbar", enabled: true, category: "widget" },
        { id: "widget_todo", label: "ToDo-Widget", description: "ToDo-Liste für alle Familien sichtbar", enabled: true, category: "widget" },
        { id: "widget_weather", label: "Wetter-Widget", description: "Wetter für alle Familien sichtbar", enabled: true, category: "widget" },
        { id: "widget_meme", label: "Meme-Widget", description: "Meme-Widget für alle Familien sichtbar", enabled: false, category: "widget" },
        { id: "system_registration", label: "Neue Registrierungen", description: "Neue Familien können sich registrieren", enabled: true, category: "system" },
        { id: "system_invite", label: "Einlade-Links", description: "Familien können Mitglieder per Link einladen", enabled: true, category: "system" },
    ],
}

//Mock-Daten, mit API ersetzen

export const MOCK_FAMILIES: Family[] = [
    {
        id: 1,
        name: "Familie Müller",
        email: "mueller@example.com",
        registeredAt: "2024-01-15",
        status: "aktiv",
        members: [
            { id: 1, name: "Thomas", role: "Familienadministrator", icon: "user", color: "#3b82f6", isLocked: false },
            { id: 2, name: "Sabine", role: "Mitglied", icon: "flower", color: "#ec4899", isLocked: false },
            { id: 3, name: "Leon", role: "Mitglied", icon: "star", color: "#f59e0b", isLocked: false },
        ],
    },
    {
        id: 2,
        name: "Familie Schmidt",
        email: "schmidt@example.com",
        registeredAt: "2024-02-20",
        status: "aktiv",
        members: [
            { id: 4, name: "Klaus", role: "Familienadministrator", icon: "user", color: "#10b981", isLocked: false },
            { id: 5, name: "Anna", role: "Mitglied", icon: "heart", color: "#f43f5e", isLocked: false },
        ],
    },
    {
        id: 3,
        name: "Familie Weber",
        email: "weber@example.com",
        registeredAt: "2024-03-05",
        status: "gesperrt",
        members: [
            { id: 6, name: "Peter", role: "Familienadministrator", icon: "user", color: "#8b5cf6", isLocked: true },
            { id: 7, name: "Maria", role: "Mitglied", icon: "sun", color: "#f59e0b", isLocked: false },
            { id: 8, name: "Sophie", role: "Mitglied", icon: "music", color: "#06b6d4", isLocked: false },
            { id: 9, name: "Max", role: "Mitglied", icon: "gamepad", color: "#84cc16", isLocked: false },
        ],
    },
]
