import type { RefObject } from "react"
import { getWidgetSizes } from "../../../widgets/WidgetRegistry"
import type { PlacedWidget } from "../../../hooks/useDashboardLayout"
import type { PendingWidget } from "../../../types/widgetTypes"

export interface LayoutProps {
    containerRef: RefObject<HTMLDivElement | null>
    widgetsSortedByPosition: PlacedWidget[]
    pendingWidget: PendingWidget | null
    availablePos: { col: number; row: number } | null
    widgetFits: boolean
    isDarkMode: boolean
    canDelete: boolean
    onCellClick: (col: number, row: number) => void
    onRemoveWidget: (id: string) => void
    containerWidth: number
    COLS: number
}

export const DOTS_PER_SLOT = 3
export const GRID_DOT_WIDTH_PX = 20
export const GRID_DOT_HEIGHT_PX = 24

export function getGridDimensions(width: number, height: number, breakpointSm: number, breakpointLg: number): { COLS: number; ROWS: number } {
    if (width > 0 && width < breakpointSm) return { COLS: 2, ROWS: 4 }
    if (width >= breakpointSm && width < breakpointLg) {
        const isLandscape = height > 0 && width > height
        return isLandscape
            ? { COLS: 8, ROWS: 5 }
            : { COLS: 5, ROWS: 6 }
    }
    return { COLS: 10, ROWS: 5 }
}

function getMobileFallbackSize(type: string, maxCols: number): { colSpan: number; rowSpan: number } | null {
    const mobileSizes = getWidgetSizes(type).filter(s => s.colSpan <= maxCols)
    if (mobileSizes.length === 0) return null
    return mobileSizes.reduce((best, s) => s.rowSpan >= best.rowSpan ? s : best)
}

export function getDisplaySize(widget: PlacedWidget, maxCols: number) {
    if (widget.colSpan <= maxCols) return { colSpan: widget.colSpan, rowSpan: widget.rowSpan }
    return getMobileFallbackSize(widget.type, maxCols) ?? { colSpan: widget.colSpan, rowSpan: widget.rowSpan }
}

export function toGridSpan(pos: number, span: number): string {
    return `${pos * DOTS_PER_SLOT + 2} / span ${span * DOTS_PER_SLOT - 1}`
}
