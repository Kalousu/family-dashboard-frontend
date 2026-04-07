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
    day: number // 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr
    userId: number
}

export interface Reminder {
    id: string
    day: number
    text: string
}
