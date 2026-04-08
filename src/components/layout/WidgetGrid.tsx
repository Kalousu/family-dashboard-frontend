interface PlacedWidget {
    id: string
    type: string
    col: number
    row: number
    colSpan: number
    rowSpan: number
}

interface WidgetGridProps {
    placedWidgets: PlacedWidget[]
    pendingWidget: { type: string, colSpan: number, rowSpan: number } | null
    onCellClick: (col: number, row: number) => void
}

const COLS = 10
const ROWS = 5
const DOTS_PER_SLOT = 3

function WidgetGrid({ placedWidgets, pendingWidget, onCellClick }: WidgetGridProps) {
    const dotCols = (COLS * DOTS_PER_SLOT) + 1
    const dotRows = (ROWS * DOTS_PER_SLOT) + 1
    const dots = Array.from({ length: dotCols * dotRows })
    const gridStyle = { gridTemplateColumns: `repeat(${dotCols}, 1fr)`, gridTemplateRows: `repeat(${dotRows}, 1fr)` }

    function canPlace(col: number, row: number): boolean {
    if (!pendingWidget) return false

    if (col + pendingWidget.colSpan > COLS || row + pendingWidget.rowSpan > ROWS) return false

    return !placedWidgets.some((w) =>
        col < w.col + w.colSpan &&
        col + pendingWidget.colSpan > w.col &&
        row < w.row + w.rowSpan &&
        row + pendingWidget.rowSpan > w.row
    )
}

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
                {pendingWidget && (
                    <div className="absolute inset-0 grid" style={gridStyle}>
                        {Array.from({ length: COLS * ROWS }).map((_, index) => {
                            const col = index % COLS
                            const row = Math.floor(index / COLS)
                            return (
                                <div key={index} className={`cursor-pointer ${canPlace(col, row) ? ("hover:bg-white/10") : ("hover:bg-red-500/10")} rounded-xl transition-all`} style={{ gridColumn: `${(col * DOTS_PER_SLOT) + 2} / span ${DOTS_PER_SLOT - 1}`, gridRow: `${(row * DOTS_PER_SLOT) + 2} / span ${DOTS_PER_SLOT - 1}` }} onClick={() => canPlace(col, row) && onCellClick(col, row)} />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WidgetGrid