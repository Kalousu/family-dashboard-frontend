import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { dashboardService } from "../services/dashboardService"
import type { Widget } from "../services/dashboardService"

function WidgetPage() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const [placedWidgets, setPlacedWidgets] = useState<{ id: string, type: string, col: number, row: number, colSpan: number, rowSpan: number }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()

    // Load dashboard from backend
    useEffect(() => {
        const loadDashboard = async () => {
            if (!user?.familyId) return
            
            try {
                const dashboard = await dashboardService.getDashboard(user.familyId)
                
                // Convert backend widgets to frontend format
                const widgets = dashboard.widgets.map((widget: Widget) => ({
                    id: widget.id.toString(),
                    type: widget.type,
                    col: parseInt(widget.position.col),
                    row: parseInt(widget.position.row),
                    colSpan: parseInt(widget.position.colSpan),
                    rowSpan: parseInt(widget.position.rowSpan)
                }))
                
                setPlacedWidgets(widgets)
            } catch (error) {
                console.error('Failed to load dashboard:', error)
            } finally {
                setIsLoading(false)
            }
        }
        
        loadDashboard()
    }, [user?.familyId])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Dashboard wird geladen...</div>
            </div>
        )
    }

    return (
        <div className={`flex flex-col w-screen h-screen bg-linear-to-b ${isDarkMode ? "from-gray-400 to-gray-200" : "from-gray-900 to-gray-800"}`}>
            <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)}/>
            <WidgetGrid placedWidgets={placedWidgets} pendingWidget={pendingWidget} onCellClick={(col, row) => {
                if (pendingWidget) {
                    setPlacedWidgets([...placedWidgets, { id: Date.now().toString(), type: pendingWidget.type, col, row, colSpan: pendingWidget.colSpan, rowSpan: pendingWidget.rowSpan }])
                    setPendingWidget(null)
                }
            }} onRemoveWidget={(id) => setPlacedWidgets(placedWidgets.filter((w) => w.id !== id))} 
            />
            <SideBar isOpen={sideBarOpen} onClose={() => setSideBarOpen(false)} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} setPendingWidget={setPendingWidget}/>
        </div>
    )
}

export default WidgetPage
