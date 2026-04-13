import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect } from "react"
import dashboardBgDark from "../assets/dashboardbgdark.png"
import dashboardbgLight from "../assets/dashboardbglight.png"

function WidgetPage() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const [placedWidgets, setPlacedWidgets] = useState<{ id: string, type: string, col: number, row: number, colSpan: number, rowSpan: number }[]>([])

    useEffect(() => {
        const img1 = new Image()
        const img2 = new Image()
        img1.src = dashboardBgDark
        img2.src = dashboardbgLight
    }, [])

    return (
        <div className="relative flex flex-col w-screen h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${dashboardBgDark})` }}
            />
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-out"
                style={{
                    backgroundImage: `url(${dashboardbgLight})`,
                    opacity: isDarkMode ? 1 : 0                }}
            />
            <div className="relative flex flex-col w-full h-full">
                <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)} isDarkMode={isDarkMode}/>
                <WidgetGrid placedWidgets={placedWidgets} pendingWidget={pendingWidget} onCellClick={(col, row) => {
                    if (pendingWidget) {
                        setPlacedWidgets([...placedWidgets, { id: Date.now().toString(), type: pendingWidget.type, col, row, colSpan: pendingWidget.colSpan, rowSpan: pendingWidget.rowSpan }])
                        setPendingWidget(null)
                    }
                }} onRemoveWidget={(id) => setPlacedWidgets(placedWidgets.filter((w) => w.id !== id))}
                />
                <SideBar isOpen={sideBarOpen} onClose={() => setSideBarOpen(false)} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} setPendingWidget={setPendingWidget}/>
            </div>
        </div>
    )
}

export default WidgetPage