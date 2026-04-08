import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState } from "react"

function WidgetPage() {
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const [placedWidgets, setPlacedWidgets] = useState<{ id: string, type: string, col: number, row: number, colSpan: number, rowSpan: number }[]>([])

    return (
        <div className={`flex flex-col w-screen h-screen bg-linear-to-b ${isDarkMode ? "from-gray-400 to-gray-200" : "from-gray-900 to-gray-800"}`}>
            <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)}/>
            <WidgetGrid placedWidgets={placedWidgets} pendingWidget={pendingWidget} onCellClick={(col, row) => {
                if (pendingWidget) {
                    setPlacedWidgets([...placedWidgets, { id: Date.now().toString(), type: pendingWidget.type, col, row, colSpan: pendingWidget.colSpan, rowSpan: pendingWidget.rowSpan }])
                    setPendingWidget(null)
                }
            }} />
            <SideBar isOpen={sideBarOpen} onClose={() => setSideBarOpen(false)} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} setPendingWidget={setPendingWidget}/>
        </div>
    )
}

export default WidgetPage