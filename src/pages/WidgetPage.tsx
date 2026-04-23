import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect, useRef } from "react"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import useAuth from "../hooks/useAuth"
import { getDashboardByFamilyId, type WidgetConfig, type Permissions } from "../api/familyApi"
import { createWidget, updateWidgetPosition, deleteWidget } from "../api/widgetApi"
import GlassButton from "../components/ui/GlassButton"
import useDarkMode from "../hooks/useDarkMode"
import { motion, AnimatePresence } from "framer-motion"
import { useContainerSize } from "../hooks/useContainerSize"

export interface PlacedWidget {
    id: string
    type: string
    col: number
    row: number
    colSpan: number
    rowSpan: number
    config?: WidgetConfig
}

// Helper to generate temporary negative IDs for new widgets
let tempIdCounter = -1;
function generateTempId(): string {
    return String(tempIdCounter--);
}

function getGridDimensions(width: number): { COLS: number; ROWS: number } {
    if (width > 0 && width < 640) return { COLS: 4, ROWS: 8 }
    if (width >= 640 && width <= 1024) return { COLS: 6, ROWS: 6 }
    return { COLS: 10, ROWS: 5 }
}

function WidgetPage() {
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
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
    const { currentUser, familyId, setCurrentUser, setUserId } = useAuth()
    const { isDarkMode } = useDarkMode()
    const { ref: containerRef, width: containerWidth } = useContainerSize()

    const { COLS, ROWS } = getGridDimensions(containerWidth)

    const hasChanges = JSON.stringify(placedWidgets) !== savedLayout

    const validWidgets = placedWidgets.filter(w => w.col < COLS && w.col + w.colSpan <= COLS && w.row < ROWS && w.row + w.rowSpan <= ROWS)
    const invalidWidgets = placedWidgets.filter(w => !(w.col < COLS && w.col + w.colSpan <= COLS && w.row < ROWS && w.row + w.rowSpan <= ROWS))

    const handleSaveLayout = async () => {
        if (!dashboardId || isSavingRef.current) return
        isSavingRef.current = true
        setIsSaving(true)
        setSaveError(null)
        try {
            // Get the original widgets from backend to compare
            const dashboardData = await getDashboardByFamilyId(familyId!)
            const originalWidgets = new Map(dashboardData.widgets.map(w => [String(w.id), w]))
            
            // Track which widgets need to be updated or deleted
            const currentWidgetIds = new Set(placedWidgets.map(w => w.id))
            
            // Delete widgets that were removed
            for (const [id, widget] of originalWidgets) {
                if (!currentWidgetIds.has(id)) {
                    await deleteWidget(widget.id)
                }
            }
            
            // Update positions for existing widgets or create new ones
            for (const widget of placedWidgets) {
                const originalWidget = originalWidgets.get(widget.id)
                
                if (originalWidget) {
                    // Update position if changed
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
                    // Create new widget
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
            
            // Reload dashboard to get updated IDs for new widgets
            const updatedDashboard = await getDashboardByFamilyId(familyId!)
            const widgets = updatedDashboard.widgets.map(widget => ({
                id: String(widget.id),
                type: widget.type,
                col: Number(widget.position.col),
                row: Number(widget.position.row),
                colSpan: Number(widget.position.colSpan),
                rowSpan: Number(widget.position.rowSpan),
                config: widget.widgetConfig
            }))
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
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPendingWidget(null)
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

    // Removed authentication check - ProtectedRoute already handles this

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!familyId) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const dashboardData = await getDashboardByFamilyId(familyId)
                
                // Store dashboard ID and permissions
                setDashboardId(dashboardData.id)
                console.log('Dashboard permissions for user:', currentUser?.name, dashboardData.permissions)
                setPermissions(dashboardData.permissions)
                
                // Load current user data if not already loaded
                console.log('Dashboard currentUser from backend:', dashboardData.currentUser)
                console.log('Frontend currentUser before:', currentUser)
                if (!currentUser && dashboardData.currentUser) {
                    console.log('Setting currentUser:', dashboardData.currentUser)
                    setCurrentUser(dashboardData.currentUser)
                    setUserId(dashboardData.currentUser.id)
                }
                
                // Load widgets from backend
                const widgets = dashboardData.widgets.map(widget => ({
                    id: String(widget.id),
                    type: widget.type,
                    col: Number(widget.position.col),
                    row: Number(widget.position.row),
                    colSpan: Number(widget.position.colSpan),
                    rowSpan: Number(widget.position.rowSpan),
                    config: widget.widgetConfig
                }))
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
    }, [familyId])

    if (isLoading) {
        return (
            <div className="relative flex flex-col w-screen h-screen overflow-hidden">
                <DarkModeBackground />
                <div className="relative flex items-center justify-center w-full h-full">
                    <div className="text-xl">Loading dashboard...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex flex-col min-h-screen min-w-full overflow-hidden">
            <DarkModeBackground />
            <div className="relative flex flex-col min-h-screen w-full">
                <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)} user={currentUser}/>
                <div className="w-full max-w-full px-4 lg:px-8 flex flex-col min-h-screen relative" ref={containerRef}>
                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 z-50 pointer-events-none">
                    <AnimatePresence>
                        {saveError && (
                            <motion.div
                                key="save-error"
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 80, opacity: 0 }}
                                className="pointer-events-auto px-4 py-2 bg-red-500/40 backdrop-blur-sm rounded-xl text-white text-sm text-center"
                            >
                                {saveError}
                            </motion.div>
                        )}
                        {pendingWidget && (
                            <motion.div
                                key="cancel-button"
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 80, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="pointer-events-auto"
                            >
                                <GlassButton
                                    isDarkMode={!isDarkMode}
                                    onClick={() => setPendingWidget(null)}
                                    className="px-6 py-2.5 text-sm backdrop-blur-sm text-red-400"
                                >
                                    Abbrechen
                                </GlassButton>
                            </motion.div>
                        )}
                        {hasChanges && permissions?.canEditLayout && (
                            <motion.div
                                key="save-button"
                                initial={{ y: 80, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 80, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="pointer-events-auto"
                            >
                                <GlassButton
                                    isDarkMode={!isDarkMode}
                                    onClick={isSaving ? undefined : handleSaveLayout}
                                    className={`px-6 py-2.5 text-sm backdrop-blur-sm ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSaving ? "Wird gespeichert..." : "Layout speichern"}
                                </GlassButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <WidgetGrid 
                    placedWidgets={validWidgets} 
                    pendingWidget={permissions?.canAddWidgets ? pendingWidget : null} 
                    onCellClick={(col, row) => {
                        if (pendingWidget && permissions?.canAddWidgets) {
                            setPlacedWidgets([...placedWidgets, { id: generateTempId(), type: pendingWidget.type, col, row, colSpan: pendingWidget.colSpan, rowSpan: pendingWidget.rowSpan }])
                            setPendingWidget(null)
                        }
                    }} 
                    canDelete={permissions?.canDeleteWidgets}
                    onRemoveWidget={(id) => setPlacedWidgets(placedWidgets.filter((w) => w.id !== id))}
                />
                {invalidWidgets.length > 0 && (
                    <div className="mt-4 p-4 bg-red-500/20 rounded-xl backdrop-blur-sm">
                        <p className="text-white">Folgende Widgets sind auf diesem Breakpoint nicht kompatibel und wurden ausgeblendet:</p>
                        <ul className="list-disc list-inside text-white/80">
                            {invalidWidgets.map(w => <li key={w.id}>{w.type} (Position: col {w.col}, span {w.colSpan})</li>)}
                        </ul>
                    </div>
                )}
                <SideBar 
                    isOpen={sideBarOpen} 
                    onClose={() => setSideBarOpen(false)} 
                    pendingWidget={pendingWidget} 
                    setPendingWidget={permissions?.canAddWidgets ? (widget) => {
                        setPendingWidget(widget)
                        if (widget !== null) setSideBarOpen(false)
                    } : () => {}}
                    permissions={permissions}
                />
                </div>
            </div>
        </div>
    )
}

export default WidgetPage
