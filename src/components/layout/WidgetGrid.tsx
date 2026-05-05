import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { getWidget } from "../../widgets/WidgetRegistry"
import useDarkMode from "../../hooks/useDarkMode"
import { useContainerSize } from "../../hooks/useContainerSize"
import { isTempWidget } from "../../utils/tempId"
import type { PlacedWidget } from "../../hooks/useDashboardLayout"
import type { PendingWidget } from "../../types/widgetTypes"
import { BREAKPOINT_SM, BREAKPOINT_LG } from "../../constants/config"
import {
    DOTS_PER_SLOT,
    GRID_DOT_WIDTH_PX,
    GRID_DOT_HEIGHT_PX,
    getGridDimensions,
    toGridSpan,
    type LayoutProps,
} from "./widgetGrid/widgetGridUtils"
import TempWidgetOverlay from "./widgetGrid/TempWidgetOverlay"
import MobileWidgetLayout from "./widgetGrid/MobileWidgetLayout"
import TabletWidgetLayout from "./widgetGrid/TabletWidgetLayout"

interface WidgetGridProps {
    placedWidgets: PlacedWidget[]
    pendingWidget: PendingWidget | null
    onCellClick: (col: number, row: number) => void
    onRemoveWidget: (id: string) => void
    canDelete?: boolean
}

function WidgetGrid({ placedWidgets, pendingWidget, onCellClick, onRemoveWidget, canDelete = false }: WidgetGridProps) {
    const [hoveredCell, setHoveredCell] = useState<{ col: number, row: number } | null>(null)
    const [hoveredWidget, setHoveredWidget] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()
    const { ref: containerRef, width: containerWidth, height: containerHeight } = useContainerSize()

    const { COLS, ROWS: gridRows } = getGridDimensions(containerWidth, containerHeight, BREAKPOINT_SM, BREAKPOINT_LG)
    const isMobile = containerWidth > 0 && containerWidth < BREAKPOINT_SM
    const isTabletPortrait = containerWidth >= BREAKPOINT_SM && containerWidth < BREAKPOINT_LG && containerHeight > 0 && containerHeight > containerWidth

    const ROWS = (isMobile || isTabletPortrait)
        ? Math.max(gridRows, placedWidgets.reduce((max, w) => Math.max(max, w.row + w.rowSpan), gridRows))
        : gridRows

    function canPlace(col: number, row: number): boolean {
        if (!pendingWidget) return false
        if (col + pendingWidget.colSpan > COLS || row + pendingWidget.rowSpan > ROWS) return false
        // Check for overlap with any existing widget using axis-aligned rectangle intersection
        return !placedWidgets.some((w) =>
            col < w.col + w.colSpan &&
            col + pendingWidget.colSpan > w.col &&
            row < w.row + w.rowSpan &&
            row + pendingWidget.rowSpan > w.row
        )
    }

    function findAvailablePosition() {
        if (!pendingWidget) return null
        for (let row = 0; row <= ROWS - pendingWidget.rowSpan; row++) {
            for (let col = 0; col <= COLS - pendingWidget.colSpan; col++) {
                if (canPlace(col, row)) return { col, row }
            }
        }
        return null
    }

    const widgetsSortedByPosition = [...placedWidgets].sort((a, b) =>
        a.row !== b.row ? a.row - b.row : a.col - b.col
    )
    const availablePos = findAvailablePosition()
    const widgetFits = pendingWidget
        ? pendingWidget.colSpan <= COLS && pendingWidget.rowSpan <= ROWS
        : false

    const sharedLayoutProps: LayoutProps = {
        containerRef,
        widgetsSortedByPosition,
        pendingWidget,
        availablePos,
        widgetFits,
        isDarkMode,
        canDelete,
        onCellClick,
        onRemoveWidget,
        containerWidth,
        COLS,
    }

    if (isMobile) return <MobileWidgetLayout {...sharedLayoutProps} />
    if (isTabletPortrait) return <TabletWidgetLayout {...sharedLayoutProps} />

    const dotCols = (COLS * DOTS_PER_SLOT) + 1
    const dotRows = (ROWS * DOTS_PER_SLOT) + 1
    const dots = Array.from({ length: dotCols * dotRows })
    const gridStyle = { gridTemplateColumns: `repeat(${dotCols}, 1fr)`, gridTemplateRows: `repeat(${dotRows}, 1fr)` }
    const visibleWidgets = placedWidgets.filter(w => w.col < COLS && w.row < ROWS)
    const disableMobileDrag = COLS <= 4

    return (
        <div ref={containerRef} className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 lg:p-8 mt-14 sm:mt-13">
            <div className="relative h-full" style={{ minWidth: `${dotCols * GRID_DOT_WIDTH_PX}px`, minHeight: `${dotRows * GRID_DOT_HEIGHT_PX}px` }}>
                <div className="absolute inset-0 grid place-items-center" style={gridStyle}>
                    {dots.map((_, index) => (
                        <div key={index} className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-700/50" : "bg-blue-300/70"}`} />
                    ))}
                </div>
                <div className="absolute inset-0 grid" style={gridStyle}>
                    {visibleWidgets.map((widget) => {
                        const colSpan = Math.min(widget.colSpan, COLS - widget.col)
                        const rowSpan = Math.min(widget.rowSpan, ROWS - widget.row)
                        const WidgetComponent = getWidget(widget.type)
                        return (
                            <div
                                key={widget.id}
                                className="relative bg-gray-700/40 rounded-2xl border border-white/10"
                                draggable={!disableMobileDrag}
                                onDragStart={(e) => disableMobileDrag && e.preventDefault()}
                                style={{
                                    gridColumn: toGridSpan(widget.col, colSpan),
                                    gridRow: toGridSpan(widget.row, rowSpan),
                                    touchAction: disableMobileDrag ? "none" : "auto"
                                }}
                                onMouseEnter={() => setHoveredWidget(widget.id)}
                                onMouseLeave={() => setHoveredWidget(null)}
                            >
                                {WidgetComponent
                                    ? <WidgetComponent widgetId={widget.id} config={widget.config} />
                                    : <p className="text-white p-2">{widget.type}</p>
                                }
                                {isTempWidget(widget.id) && <TempWidgetOverlay />}
                                <AnimatePresence>
                                    {canDelete && (COLS <= 8 || hoveredWidget === widget.id) && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute top-3 right-3 bg-white/20 text-white rounded-full cursor-pointer p-1.5 touch-manipulation"
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
                                style={{
                                    gridColumn: toGridSpan(hoveredCell.col, pendingWidget.colSpan),
                                    gridRow: toGridSpan(hoveredCell.row, pendingWidget.rowSpan)
                                }}
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
                                <div
                                    key={index}
                                    className="cursor-pointer rounded-xl"
                                    style={{
                                        gridColumn: toGridSpan(col, 1),
                                        gridRow: toGridSpan(row, 1)
                                    }}
                                    onMouseEnter={() => setHoveredCell({ col, row })}
                                    onMouseLeave={() => setHoveredCell(null)}
                                    onClick={() => canPlace(col, row) && onCellClick(col, row)}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WidgetGrid
