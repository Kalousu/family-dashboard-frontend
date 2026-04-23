import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Lock } from "lucide-react"
import { getWidget } from "../../widgets/WidgetRegistry"
import useDarkMode from "../../hooks/useDarkMode"
import { useContainerSize } from "../../hooks/useContainerSize"
import GlassButton from "../ui/GlassButton"
import type { PlacedWidget } from "../../pages/WidgetPage"

interface WidgetGridProps {
    placedWidgets: PlacedWidget[]
    pendingWidget: { type: string, colSpan: number, rowSpan: number } | null
    onCellClick: (col: number, row: number) => void
    onRemoveWidget: (id: string) => void
    canDelete?: boolean
}

const DOTS_PER_SLOT = 3

function getGridDimensions(width: number): { COLS: number; ROWS: number } {
    if (width > 0 && width < 640) return { COLS: 2, ROWS: 4 }
    if (width >= 640 && width <= 1024) return { COLS: 6, ROWS: 6 }
    return { COLS: 10, ROWS: 5 }
}

function WidgetGrid({ placedWidgets, pendingWidget, onCellClick, onRemoveWidget, canDelete = false }: WidgetGridProps) {
    const [hoveredCell, setHoveredCell] = useState<{ col: number, row: number } | null>(null)
    const [hoveredWidget, setHoveredWidget] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()
    const { ref: containerRef, width: containerWidth } = useContainerSize()

    const { COLS, ROWS: gridROWS } = getGridDimensions(containerWidth)
    const isMobile = containerWidth > 0 && containerWidth < 640

    // On mobile, extend ROWS to cover all placed widgets so none are filtered out
    const ROWS = isMobile
        ? Math.max(gridROWS, placedWidgets.reduce((max, w) => Math.max(max, w.row + w.rowSpan), gridROWS))
        : gridROWS

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

    function getVisualSpans(widget: PlacedWidget) {
        const colSpan = Math.min(widget.colSpan, COLS - widget.col)
        const rowSpan = Math.min(widget.rowSpan, ROWS - widget.row)
        return { colSpan, rowSpan }
    }

    const visibleWidgets = placedWidgets.filter(
        (w) => w.col < COLS && w.row < ROWS
    )

    const disableMobileDrag = COLS <= 4

    // Mobile card stack — no grid, iOS-style vertical layout
    if (isMobile) {
        const sorted = [...placedWidgets].sort((a, b) =>
            a.row !== b.row ? a.row - b.row : a.col - b.col
        )

        const findFirstAvailablePos = (): { col: number; row: number } | null => {
            if (!pendingWidget) return null
            for (let row = 0; row <= ROWS - pendingWidget.rowSpan; row++) {
                for (let col = 0; col <= COLS - pendingWidget.colSpan; col++) {
                    if (canPlace(col, row)) return { col, row }
                }
            }
            return null
        }

        const availablePos = pendingWidget ? findFirstAvailablePos() : null
        const widgetFits = pendingWidget
            ? pendingWidget.colSpan <= COLS && pendingWidget.rowSpan <= ROWS
            : false

        return (
            <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto px-4 pt-2 pb-28 mt-14">
                <div className="flex flex-col gap-4">
                    {sorted.map((widget) => (
                        <div
                            key={widget.id}
                            className={`relative w-full rounded-2xl border ${isDarkMode ? "bg-gray-700/40 border-white/10" : "bg-white/40 border-white/30"}`}
                            style={{ height: `${Math.round(containerWidth * widget.rowSpan / widget.colSpan)}px` }}
                        >
                            {(() => {
                                const WidgetComponent = getWidget(widget.type)
                                return WidgetComponent
                                    ? <WidgetComponent widgetId={widget.id} config={widget.config} />
                                    : <p className="text-white p-2">{widget.type}</p>
                            })()}
                            {Number(widget.id) < 0 && (
                                <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                                    <Lock size={20} className="text-white/80" />
                                    <p className="text-white/90 text-xs text-center px-4 leading-snug">Layout speichern, um dieses Widget zu aktivieren</p>
                                </div>
                            )}
                            {canDelete && !pendingWidget && (
                                <button
                                    className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1 touch-manipulation"
                                    onClick={() => onRemoveWidget(widget.id)}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Preview card for pending widget */}
                    {pendingWidget && (
                        <div
                            className={`relative w-full rounded-2xl border-2 border-dashed ${availablePos ? (isDarkMode ? "border-white/30" : "border-gray-400/40") : "border-red-400/40"}`}
                            style={{ height: `${Math.round(containerWidth * pendingWidget.rowSpan / pendingWidget.colSpan)}px` }}
                        >
                            <div className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-3 ${isDarkMode ? "bg-gray-700/20" : "bg-white/20"}`}>
                                {!widgetFits ? (
                                    <p className={`text-sm font-semibold text-center px-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        Dieses Widget ist zu groß für die mobile Ansicht
                                    </p>
                                ) : availablePos ? (
                                    <>
                                        <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Widget hinzufügen?
                                        </p>
                                        <GlassButton
                                            isDarkMode={!isDarkMode}
                                            onClick={() => onCellClick(availablePos.col, availablePos.row)}
                                            className="px-6 py-2 text-sm backdrop-blur-sm"
                                        >
                                            Hinzufügen
                                        </GlassButton>
                                    </>
                                ) : (
                                    <p className="text-red-400 text-sm font-semibold px-6 text-center">
                                        Kein Platz verfügbar. Entferne zuerst ein Widget.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {sorted.length === 0 && !pendingWidget && (
                        <p className={`text-center text-sm mt-16 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Keine Widgets vorhanden
                        </p>
                    )}
                </div>
            </div>
        )
    }

    // Desktop (or mobile in placement mode): grid layout
    return (
        <div ref={containerRef} className="flex-1 h-full min-h-0 flex flex-col p-4 sm:p-8 mt-14 sm:mt-10">
            <div className="relative flex-1 h-full">
                <div className="absolute inset-0 grid place-items-center" style={gridStyle}>
                    {dots.map((_, index) => (
                        <div key={index} className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-700/50" : "bg-blue-300/70"}`} />
                    ))}
                </div>
                <div className="absolute inset-0 grid" style={gridStyle}>
                    {visibleWidgets.map((widget) => {
                        const { colSpan, rowSpan } = getVisualSpans(widget)
                        return (
                            <div
                            key={widget.id}
                            className="relative bg-gray-700/40 rounded-2xl border border-white/10"
                            draggable={!disableMobileDrag}
                            onDragStart={(e) => disableMobileDrag && e.preventDefault()}
                            style={{
                                gridColumn: `${(widget.col * DOTS_PER_SLOT) + 2} / span ${(colSpan * DOTS_PER_SLOT) - 1}`,
                                gridRow: `${(widget.row * DOTS_PER_SLOT) + 2} / span ${(rowSpan * DOTS_PER_SLOT) - 1}`,
                                touchAction: disableMobileDrag ? "none" : "auto"
                            }}
                            onMouseEnter={() => setHoveredWidget(widget.id)}
                            onMouseLeave={() => setHoveredWidget(null)}
                        >
                                {(() => {
                                    const WidgetComponent = getWidget(widget.type)
                                    return WidgetComponent ? <WidgetComponent widgetId={widget.id} config={widget.config} /> : <p className="text-white p-2">{widget.type}</p>
                                })()}
                                {Number(widget.id) < 0 && (
                                    <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10" style={{ pointerEvents: "all" }}>
                                        <Lock size={20} className="text-white/80" />
                                        <p className="text-white/90 text-xs text-center px-4 leading-snug">Layout speichern, um dieses Widget zu aktivieren</p>
                                    </div>
                                )}
                                <AnimatePresence>
                                    {canDelete && hoveredWidget === widget.id && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute top-3 right-3 bg-white-500/80 text-white rounded-full cursor-pointer"
                                            onClick={() => onRemoveWidget(widget.id)}
                                        >
                                            <X size={14} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                    <AnimatePresence>
                        {pendingWidget && hoveredCell && (
                            <motion.div
                                key={`${hoveredCell.col}-${hoveredCell.row}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                                className={`${canPlace(hoveredCell.col, hoveredCell.row) ? "bg-white/20" : "bg-red-500/20"} rounded-2xl pointer-events-none`}
                                style={{ gridColumn: `${(hoveredCell.col * DOTS_PER_SLOT) + 2} / span ${(pendingWidget.colSpan * DOTS_PER_SLOT) - 1}`, gridRow: `${(hoveredCell.row * DOTS_PER_SLOT) + 2} / span ${(pendingWidget.rowSpan * DOTS_PER_SLOT) - 1}` }}
                            />
                        )}
                    </AnimatePresence>
                </div>
                {pendingWidget && (
                    <div className="absolute inset-0 grid" style={gridStyle}>
                        {Array.from({ length: COLS * ROWS }).map((_, index) => {
                            const col = index % COLS
                            const row = Math.floor(index / COLS)
                            return (
                                <div key={index} className="cursor-pointer rounded-xl" style={{ gridColumn: `${(col * DOTS_PER_SLOT) + 2} / span ${DOTS_PER_SLOT - 1}`, gridRow: `${(row * DOTS_PER_SLOT) + 2} / span ${DOTS_PER_SLOT - 1}` }} onMouseEnter={() => setHoveredCell({ col, row })} onMouseLeave={() => setHoveredCell(null)} onClick={() => canPlace(col, row) && onCellClick(col, row)} />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
export default WidgetGrid
