import { useState, useEffect, useRef } from "react"
import { getDashboardByFamilyId, type WidgetConfig, type WidgetResponse, type Permissions } from "../api/familyApi"
import { createWidget, updateWidgetPosition, deleteWidget } from "../api/widgetApi"
import useAuth from "./useAuth"

export interface PlacedWidget {
    id: string
    type: string
    col: number
    row: number
    colSpan: number
    rowSpan: number
    config?: WidgetConfig
}

function mapWidgets(rawWidgets: WidgetResponse[]): PlacedWidget[] {
    return rawWidgets.map(widget => ({
        id: String(widget.id),
        type: widget.type,
        col: Number(widget.position.col),
        row: Number(widget.position.row),
        colSpan: Number(widget.position.colSpan),
        rowSpan: Number(widget.position.rowSpan),
        config: widget.widgetConfig
    }))
}

export function useDashboardLayout() {
    const { familyId, currentUser, setCurrentUser, setUserId } = useAuth()

    const [placedWidgets, setPlacedWidgets] = useState<PlacedWidget[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const isSavingRef = useRef(false)
    const [savedLayout, setSavedLayout] = useState("")
    const [dashboardId, setDashboardId] = useState<number | null>(null)
    const [permissions, setPermissions] = useState<Permissions>({
        canEditLayout: false,
        canAddWidgets: false,
        canDeleteWidgets: false,
        canEditWidgetData: false,
        canManageFamily: false
    })

    const hasChanges = JSON.stringify(placedWidgets) !== savedLayout

    const handleSaveLayout = async () => {
        if (!dashboardId || !familyId || isSavingRef.current) return
        isSavingRef.current = true
        setIsSaving(true)
        setSaveError(null)
        try {
            const dashboardData = await getDashboardByFamilyId(familyId)
            const originalWidgets = new Map(dashboardData.widgets.map(w => [String(w.id), w]))
            const currentWidgetIds = new Set(placedWidgets.map(w => w.id))

            for (const [id, widget] of originalWidgets) {
                if (!currentWidgetIds.has(id)) {
                    await deleteWidget(widget.id)
                }
            }

            for (const widget of placedWidgets) {
                const originalWidget = originalWidgets.get(widget.id)

                if (originalWidget) {
                    const posChanged =
                        Number(originalWidget.position.col) !== widget.col ||
                        Number(originalWidget.position.row) !== widget.row ||
                        Number(originalWidget.position.colSpan) !== widget.colSpan ||
                        Number(originalWidget.position.rowSpan) !== widget.rowSpan

                    if (posChanged) {
                        await updateWidgetPosition(originalWidget.id, {
                            col: widget.col,
                            row: widget.row,
                            colSpan: widget.colSpan,
                            rowSpan: widget.rowSpan
                        })
                    }
                } else {
                    await createWidget({
                        dashboardId,
                        type: widget.type,
                        widgetConfig: { title: widget.type },
                        widgetPosition: {
                            col: widget.col,
                            row: widget.row,
                            colSpan: widget.colSpan,
                            rowSpan: widget.rowSpan
                        }
                    })
                }
            }

            const updatedDashboard = await getDashboardByFamilyId(familyId)
            const widgets = mapWidgets(updatedDashboard.widgets)
            const updatedJson = JSON.stringify(widgets)
            setPlacedWidgets(widgets)
            setSavedLayout(updatedJson)
        } catch (error) {
            console.error("Failed to save layout:", error)
            setSaveError("Layout konnte nicht gespeichert werden. Bitte versuche es erneut.")
        } finally {
            isSavingRef.current = false
            setIsSaving(false)
        }
    }

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!familyId) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const dashboardData = await getDashboardByFamilyId(familyId)

                setDashboardId(dashboardData.id)
                setPermissions(dashboardData.permissions)

                if (!currentUser && dashboardData.currentUser) {
                    setCurrentUser(dashboardData.currentUser)
                    setUserId(dashboardData.currentUser.id)
                }

                const widgets = mapWidgets(dashboardData.widgets)
                const json = JSON.stringify(widgets)
                setPlacedWidgets(widgets)
                setSavedLayout(json)
            } catch (error) {
                console.error("Failed to fetch dashboard:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboard()
    }, [familyId]) // eslint-disable-line react-hooks/exhaustive-deps

    return {
        placedWidgets,
        setPlacedWidgets,
        dashboardId,
        permissions,
        isLoading,
        isSaving,
        saveError,
        hasChanges,
        handleSaveLayout,
    }
}
