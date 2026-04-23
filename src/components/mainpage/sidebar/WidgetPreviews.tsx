import { Sun, Wind, ChevronLeft, ChevronRight, Image, Dot, Laugh } from "lucide-react"

interface PreviewCardProps {
    onClick: () => void
    gradient: string
    border?: string
    className?: string
    children: React.ReactNode
}

function PreviewCard({ onClick, gradient, border = "border-white/20", className = "", children }: PreviewCardProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col rounded-xl overflow-hidden ${border} border hover:scale-104 active:scale-98 transition-all cursor-pointer w-full shadow-md aspect-square ${className}`}
        >
            <div className={`${gradient} backdrop-blur-sm p-1.5 flex flex-col flex-1 w-full overflow-hidden`}>
                {children}
            </div>
        </button>
    )
}

export function WeatherPreview({ onClick, className }: { onClick: () => void; className?: string }) {
    return (
        <PreviewCard onClick={onClick} className={className} gradient="bg-linear-to-b from-blue-400/70 to-yellow-200/60">
            <div className="border border-white/30 rounded-md px-1 py-0.5 mb-1 shrink-0">
                <span className="text-white text-[8px] font-bold">Mannheim</span>
            </div>
            <div className="flex-1 flex flex-row items-center justify-center gap-1.5">
                <span className="text-white text-xl font-semibold leading-none">14°C</span>
                <Sun className="text-white w-5 h-5 shrink-0" />
            </div>
            <div className="flex items-center gap-0.5 justify-center shrink-0">
                <Wind className="text-white/60 w-2.5 h-2.5" />
                <span className="text-white/60 text-[7px]">12 km/h</span>
            </div>
        </PreviewCard>
    )
}

export function CalendarPreview({ onClick, className }: { onClick: () => void; className?: string }) {
    const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
    const rows = [
        [null, 1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12, 13],
        [14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27],
    ]
    const eventDays = new Set([3, 10, 17, 23])
    const today = 23
    return (
        <PreviewCard onClick={onClick} className={className} gradient="bg-linear-to-br from-teal-600/70 to-cyan-400/50">
            <div className="flex items-center justify-between mb-0.5 shrink-0">
                <span className="text-white text-[8px] font-bold">April 2026</span>
                <div className="flex gap-0.5">
                    <ChevronLeft className="text-white/70 w-2.5 h-2.5" />
                    <ChevronRight className="text-white/70 w-2.5 h-2.5" />
                </div>
            </div>
            <div className="grid grid-cols-7 mb-px">
                {weekdays.map(d => (
                    <span key={d} className="text-white/60 text-[6px] text-center font-semibold">{d}</span>
                ))}
            </div>
            {rows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7 flex-1">
                    {row.map((day, di) => (
                        <div key={di} className={`flex flex-col items-center leading-none rounded-sm ${day === today ? "bg-white/25" : ""}`}>
                            {day && (
                                <>
                                    <span className={`text-[6px] font-semibold ${day === today ? "text-white" : "text-white/80"}`}>{day}</span>
                                    {eventDays.has(day) && <Dot size={5} className="-mt-px text-pink-300" strokeWidth={6} />}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </PreviewCard>
    )
}

export function TimetablePreview({ onClick, className }: { onClick: () => void; className?: string }) {
    const days = ["Mo", "Di", "Mi", "Do", "Fr"]
    const grid = [
        ["bg-blue-300/70", null, "bg-pink-300/70", "bg-blue-300/70", null],
        ["bg-blue-300/70", "bg-yellow-300/70", null, null, "bg-purple-300/70"],
        [null, "bg-yellow-300/70", "bg-green-300/70", "bg-orange-300/70", "bg-purple-300/70"],
        ["bg-red-300/70", null, "bg-green-300/70", "bg-orange-300/70", null],
    ]
    return (
        <PreviewCard onClick={onClick} className={className} gradient="bg-linear-to-b from-purple-900/80 to-indigo-400/60">
            <div className="flex items-end gap-px border-b border-white/20 mb-0.5 shrink-0">
                <div className="bg-linear-to-b from-purple-900/50 to-indigo-400/30 border-t border-l border-r border-white/25 rounded-t-sm px-1 py-px">
                    <span className="text-white text-[6px] font-semibold">Alle</span>
                </div>
                <div className="border-t border-l border-r border-white/10 rounded-t-sm px-1 py-px">
                    <span className="text-white/50 text-[6px]">Anna</span>
                </div>
            </div>
            <div className="flex-1 grid min-h-0" style={{ gridTemplateColumns: "0.7rem 1px repeat(5, minmax(0,1fr))" }}>
                <div />
                <div className="bg-white/15" />
                {days.map(d => (
                    <div key={d} className="text-center text-[5px] text-white/70 font-semibold border-b border-white/15">{d}</div>
                ))}
                {grid.map((row, si) => (
                    <>
                        <div key={`s${si}`} className="flex items-center justify-center text-white/40 text-[5px] font-bold border-b border-white/10">{si + 1}</div>
                        <div key={`div${si}`} className="bg-white/15 border-b border-white/10" />
                        {row.map((cell, di) => (
                            <div key={di} className="px-px py-px border-b border-r border-white/10 last:border-r-0">
                                {cell && <div className={`${cell} rounded-sm h-full w-full`} />}
                            </div>
                        ))}
                    </>
                ))}
            </div>
        </PreviewCard>
    )
}

export function TodoPreview({ onClick, className }: { onClick: () => void; className?: string }) {
    const items = [
        { done: true, label: "Einkaufen" },
        { done: false, label: "Aufräumen" },
        { done: false, label: "Sport" },
    ]
    return (
        <PreviewCard onClick={onClick} className={className} gradient="bg-linear-to-b from-orange-400/60 to-yellow-200/50">
            <p className="text-white text-[8px] font-bold text-center mb-1.5 shrink-0">To-Do Liste</p>
            <div className="flex flex-col gap-1.5 flex-1">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded border border-white/60 shrink-0 flex items-center justify-center ${item.done ? "bg-white/70" : "bg-white/10"}`}>
                            {item.done && <div className="w-1.5 h-1.5 bg-orange-500 rounded-sm" />}
                        </div>
                        <span className={`text-[8px] leading-none ${item.done ? "text-white/40 line-through" : "text-white/90"}`}>{item.label}</span>
                    </div>
                ))}
            </div>
        </PreviewCard>
    )
}

export function MemePreview({ onClick, className }: { onClick: () => void; className?: string }) {
    return (
        <PreviewCard onClick={onClick} className={className} gradient="bg-linear-to-b from-gray-500/80 via-gray-600/60 to-blue-400/50" border="border-white/25">
            <div className="flex-1 flex items-center justify-center">
                <Laugh className="text-white/50 w-10 h-10" strokeWidth={1.5} />
            </div>
        </PreviewCard>
    )
}

export function PicturePreview({ onClick, className }: { onClick: () => void; className?: string }) {
    return (
        <PreviewCard onClick={onClick} className={className} gradient="bg-linear-to-b from-gray-500/80 via-gray-600/60 to-blue-400/50" border="border-white/25">
            <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
                <Image className="text-white/50 w-8 h-8" strokeWidth={1.5} />
                <span className="text-white/50 text-[8px]">Foto hinzufügen</span>
            </div>
        </PreviewCard>
    )
}
