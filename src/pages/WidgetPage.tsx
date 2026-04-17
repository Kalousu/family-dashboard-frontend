import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect } from "react"
import DarkModeBackground from "../components/ui/DarkModeBackground"

function WidgetPage() {
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const [placedWidgets, setPlacedWidgets] = useState<{ id: string, type: string, col: number, row: number, colSpan: number, rowSpan: number }[]>([])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPendingWidget(null)
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

    return (
        <div className="relative flex flex-col w-screen h-screen overflow-hidden">
            <DarkModeBackground />
            <div className="relative flex flex-col w-full h-full">
                <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)}/>
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
