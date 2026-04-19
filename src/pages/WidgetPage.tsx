import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import useAuth from "../hooks/useAuth"
import { getDashboardByFamilyId } from "../api/familyApi"
import type { DashboardResponse } from "../api/familyApi"

function WidgetPage() {
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const [placedWidgets, setPlacedWidgets] = useState<{ id: string, type: string, col: number, row: number, colSpan: number, rowSpan: number }[]>([])
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { currentUser, isAuthenticated, familyId } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPendingWidget(null)
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate])

    // Fetch dashboard data based on familyId
    useEffect(() => {
        const fetchDashboard = async () => {
            if (!familyId) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const dashboardData = await getDashboardByFamilyId(familyId)
                setDashboard(dashboardData)
                
                // Convert backend widgets to frontend format
                const widgets = dashboardData.widgets.map(widget => ({
                    id: String(widget.id),
                    type: widget.type,
                    col: widget.position.col,
                    row: widget.position.row,
                    colSpan: widget.position.colSpan,
                    rowSpan: widget.position.rowSpan
                }))
                
                setPlacedWidgets(widgets)
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
