import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import useAuth from "../hooks/useAuth"
import { getDashboardByFamilyId } from "../api/familyApi"
import GlassButton from "../components/ui/GlassButton"
import useDarkMode from "../hooks/useDarkMode"
import { motion, AnimatePresence } from "framer-motion"

const LAYOUT_STORAGE_KEY = "widgetLayout"

function WidgetPage() {
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const [placedWidgets, setPlacedWidgets] = useState<{ id: string, type: string, col: number, row: number, colSpan: number, rowSpan: number }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [savedLayout, setSavedLayout] = useState("")
    const { currentUser, isAuthenticated, familyId } = useAuth()
    const { isDarkMode } = useDarkMode()
    const navigate = useNavigate()

    const hasChanges = JSON.stringify(placedWidgets) !== savedLayout

    const handleSaveLayout = () => {
        const json = JSON.stringify(placedWidgets)
        localStorage.setItem(LAYOUT_STORAGE_KEY, json)
        setSavedLayout(json)
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

                const localSaved = localStorage.getItem(LAYOUT_STORAGE_KEY)
                if (localSaved) {
                    setPlacedWidgets(JSON.parse(localSaved))
                    setSavedLayout(localSaved)
                } else {
                    const widgets = dashboardData.widgets.map(widget => ({
                        id: String(widget.id),
                        type: widget.type,
                        col: widget.position.col,
                        row: widget.position.row,
                        colSpan: widget.position.colSpan,
                        rowSpan: widget.position.rowSpan
                    }))
                    const json = JSON.stringify(widgets)
                    setPlacedWidgets(widgets)
                    setSavedLayout(json)
                }
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
                                    onClick={handleSaveLayout}
                                    className="px-6 py-2.5 text-sm backdrop-blur-sm"
                                >
                                    Layout speichern
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
