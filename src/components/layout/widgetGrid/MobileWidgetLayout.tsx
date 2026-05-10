import { getDisplaySize, type LayoutProps } from "./widgetGridUtils"
import WidgetContent from "./WidgetContent"
import PendingWidgetContent from "./PendingWidgetContent"

function MobileWidgetLayout({ containerRef, widgetsSortedByPosition, pendingWidget, availablePos, widgetFits, isDarkMode, canDelete, onCellClick, onRemoveWidget, containerWidth, COLS }: LayoutProps) {
    return (
        <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto px-4 pt-2 pb-28 mt-14">
            <div className="flex flex-col gap-4">
                {widgetsSortedByPosition.map((widget) => {
                    const displaySize = getDisplaySize(widget, COLS)
                    return (
                        <div
                            key={widget.id}
                            className={`relative w-full rounded-2xl border ${isDarkMode ? "bg-gray-700/40 border-white/10" : "bg-white/40 border-white/30"}`}
                            style={{ height: `${Math.round(containerWidth * displaySize.rowSpan / displaySize.colSpan)}px` }}
                        >
                            <WidgetContent widget={widget} canDelete={canDelete} pendingWidget={pendingWidget} onRemoveWidget={onRemoveWidget} />
                        </div>
                    )
                })}

                {pendingWidget && (
                    <div
                        className={`relative w-full rounded-2xl border-2 border-dashed ${availablePos ? (isDarkMode ? "border-white/30" : "border-gray-400/40") : "border-red-400/40"}`}
                        style={{ height: `${Math.round(containerWidth * pendingWidget.rowSpan / pendingWidget.colSpan)}px` }}
                    >
                        <PendingWidgetContent
                            availablePos={availablePos}
                            widgetFits={widgetFits}
                            onPlace={() => availablePos && onCellClick(availablePos.col, availablePos.row)}
                            isDarkMode={isDarkMode}
                            tooLargeMessage="Dieses Widget ist zu groß für die mobile Ansicht"
                        />
                    </div>
                )}

                {widgetsSortedByPosition.length === 0 && !pendingWidget && (
                    <p className={`text-center text-sm mt-16 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Keine Widgets vorhanden
                    </p>
                )}
            </div>
        </div>
    )
}

export default MobileWidgetLayout
