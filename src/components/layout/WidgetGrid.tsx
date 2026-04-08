interface PlacedWidget {
    id: string
    type: string
    col: number
    row: number
    colSpan: number
    rowSpan: number
}

const COLS = 6
const ROWS = 5
const DOTS_PER_SLOT = 3

const dummyWidgets: PlacedWidget[] = [
    { id: "1", type: "weather", col: 0, row: 0, colSpan: 2, rowSpan: 2 },
    { id: "2", type: "todo", col: 2, row: 0, colSpan: 2, rowSpan: 3 },
    { id: "3", type: "calendar", col: 4, row: 0, colSpan: 2, rowSpan: 2 },
    { id: "4", type: "timetable", col: 0, row: 2, colSpan: 2, rowSpan: 2 },
    { id: "5", type: "weather", col: 4, row: 2, colSpan: 1, rowSpan: 1 },
    { id: "6", type: "todo", col: 0, row: 4, colSpan: 3, rowSpan: 1 },
    { id: "7", type: "calendar", col: 3, row: 3, colSpan: 3, rowSpan: 2 },
]

function WidgetGrid() {
    const dotCols = (COLS * DOTS_PER_SLOT) + 1
    const dotRows = (ROWS * DOTS_PER_SLOT) + 1
    const dots = Array.from({ length: dotCols * dotRows })
    const placedWidgets: PlacedWidget[] = dummyWidgets
    const gridStyle = { gridTemplateColumns: `repeat(${dotCols}, 1fr)`, gridTemplateRows: `repeat(${dotRows}, 1fr)` }

    return (
        <div className="flex-1 p-8 mt-10">
            <div className="relative w-full h-full">
                <div className="absolute inset-0 grid place-items-center" style={gridStyle}>
                    {dots.map((_, index) => (
                        <div key={index} className="w-1 h-1 rounded-full bg-gray-800/30" />
                    ))}
                </div>
                <div className="absolute inset-0 grid" style={gridStyle}>
                    {placedWidgets.map((widget) => (
                        <div key={widget.id} className="bg-gray-700/40 rounded-2xl border border-white/10" style={{ gridColumn: `${(widget.col * DOTS_PER_SLOT) + 2} / span ${(widget.colSpan * DOTS_PER_SLOT) - 1}`, gridRow: `${(widget.row * DOTS_PER_SLOT) + 2} / span ${(widget.rowSpan * DOTS_PER_SLOT) - 1}` }}>
                            <p className="text-white p-2">{widget.type}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WidgetGrid