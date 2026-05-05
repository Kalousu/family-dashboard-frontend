import { X } from "lucide-react"
import { getWidget } from "../../../widgets/WidgetRegistry"
import { isTempWidget } from "../../../utils/tempId"
import type { PlacedWidget } from "../../../hooks/useDashboardLayout"
import type { PendingWidget } from "../../../types/widgetTypes"
import TempWidgetOverlay from "./TempWidgetOverlay"

interface WidgetContentProps {
    widget: PlacedWidget
    canDelete: boolean
    pendingWidget: PendingWidget | null
    onRemoveWidget: (id: string) => void
}

function WidgetContent({ widget, canDelete, pendingWidget, onRemoveWidget }: WidgetContentProps) {
    const WidgetComponent = getWidget(widget.type)
    return (
        <>
            {WidgetComponent
                ? <WidgetComponent widgetId={widget.id} config={widget.config} />
                : <p className="text-white p-2">{widget.type}</p>
            }
            {isTempWidget(widget.id) && <TempWidgetOverlay />}
            {canDelete && !pendingWidget && (
                <button
                    className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-2 touch-manipulation"
                    onClick={() => onRemoveWidget(widget.id)}
                >
                    <X size={14} />
                </button>
            )}
        </>
    )
}

export default WidgetContent
