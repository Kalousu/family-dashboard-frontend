import { getDisplaySize, type LayoutProps } from "./widgetGridUtils"
import WidgetContent from "./WidgetContent"
import PendingWidgetContent from "./PendingWidgetContent"

function TabletWidgetLayout({ containerRef, widgetsSortedByPosition, pendingWidget, availablePos, widgetFits, isDarkMode, canDelete, onCellClick, onRemoveWidget, containerWidth, COLS }: LayoutProps) {
    const fullWidth = containerWidth - 32
    const halfWidth = Math.floor((fullWidth - 12) / 2)
    const pendingIsFullWidth = pendingWidget ? pendingWidget.colSpan * 2 > COLS : false
    const pendingDisplayWidth = pendingIsFullWidth ? fullWidth : halfWidth

    return (
        <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pt-2 pb-28 mt-14 sm:mt-13">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {widgetsSortedByPosition.map((widget) => {
                    const isFullWidth = widget.colSpan * 2 > COLS
                    const displaySize = getDisplaySize(widget, COLS)
                    const displayWidth = isFullWidth ? fullWidth : halfWidth

                    return (
                        <div
                            key={widget.id}
                            className={`relative rounded-2xl border ${isFullWidth ? "col-span-2" : ""} ${isDarkMode ? "bg-gray-700/40 border-white/10" : "bg-white/40 border-white/30"}`}
                            style={{ height: `${Math.round(displayWidth * displaySize.rowSpan / displaySize.colSpan)}px` }}
                        >
                            <WidgetContent widget={widget} canDelete={canDelete} pendingWidget={pendingWidget} onRemoveWidget={onRemoveWidget} />
                        </div>
                    )
                })}

                {pendingWidget && (
                    <div
                        className={`relative rounded-2xl border-2 border-dashed ${pendingIsFullWidth ? "col-span-2" : ""} ${availablePos ? (isDarkMode ? "border-white/30" : "border-gray-400/40") : "border-red-400/40"}`}
                        style={{ height: `${Math.round(pendingDisplayWidth * pendingWidget.rowSpan / pendingWidget.colSpan)}px` }}
                    >
                        <PendingWidgetContent
                            availablePos={availablePos}
                            widgetFits={widgetFits}
                            onPlace={() => availablePos && onCellClick(availablePos.col, availablePos.row)}
                            isDarkMode={isDarkMode}
                            tooLargeMessage="Dieses Widget ist zu groß für die Tablet-Ansicht"
                        />
                    </div>
                )}

                {widgetsSortedByPosition.length === 0 && !pendingWidget && (
                    <p className={`col-span-2 text-center text-sm mt-16 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Keine Widgets vorhanden
                    </p>
                )}
            </div>
        </div>
    )
}

export default TabletWidgetLayout
