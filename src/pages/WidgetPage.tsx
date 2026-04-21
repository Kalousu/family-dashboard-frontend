import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import useAuth from "../hooks/useAuth"
import { getDashboardByFamilyId, type WidgetConfig } from "../api/familyApi"
import { createWidget, updateWidgetPosition, deleteWidget } from "../api/widgetApi"
import GlassButton from "../components/ui/GlassButton"
import useDarkMode from "../hooks/useDarkMode"
import { motion, AnimatePresence } from "framer-motion"

export interface PlacedWidget {
    id: string
    type: string
    col: number
    row: number
    colSpan: number
    rowSpan: number
    config?: WidgetConfig
}

function WidgetPage() {
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const [placedWidgets, setPlacedWidgets] = useState<PlacedWidget[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [savedLayout, setSavedLayout] = useState("")
    const [dashboardId, setDashboardId] = useState<number | null>(null)
    const { currentUser, isAuthenticated, familyId } = useAuth()
    const { isDarkMode } = useDarkMode()
    const navigate = useNavigate()

    const hasChanges = JSON.stringify(placedWidgets) !== savedLayout

    const handleSaveLayout = async () => {
        if (!dashboardId || isSaving) return
        
        setIsSaving(true)
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
                        originalWidget.position.col !== widget.col ||
                        originalWidget.position.row !== widget.row ||
                        originalWidget.position.colSpan !== widget.colSpan ||
                        originalWidget.position.rowSpan !== widget.rowSpan
                    
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
        } finally {
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

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate])

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!familyId) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const dashboardData = await getDashboardByFamilyId(familyId)
                
                // Store dashboard ID
                setDashboardId(dashboardData.id)
                
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
        <div className="relative flex flex-col w-screen h-screen overflow-hidden">
            <DarkModeBackground />
            <div className="relative flex flex-col w-full h-full">
                <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)} user={currentUser}/>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                    <AnimatePresence>
                        {hasChanges && (
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
                <WidgetGrid placedWidgets={placedWidgets} pendingWidget={pendingWidget} onCellClick={(col, row) => {
                    if (pendingWidget) {
                        setPlacedWidgets([...placedWidgets, { id: crypto.randomUUID(), type: pendingWidget.type, col, row, colSpan: pendingWidget.colSpan, rowSpan: pendingWidget.rowSpan }])
                        setPendingWidget(null)
                    }
                }} onRemoveWidget={(id) => setPlacedWidgets(placedWidgets.filter((w) => w.id !== id))}
                />
                <SideBar isOpen={sideBarOpen} onClose={() => setSideBarOpen(false)} pendingWidget={pendingWidget} setPendingWidget={setPendingWidget}/>
            </div>
        </div>
    )
}

export default WidgetPage
