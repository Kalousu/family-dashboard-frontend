export interface Profile {
    id: number
    name: string
    color: string
    icon: string
}

export interface TimetableEvent {
    id: string
    title: string
    slot: number
    day: number
    userId: number
}

export interface Reminder {
    id: string
    day: number
    text: string
}
