import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import WidgetGrid from "../components/layout/WidgetGrid"
import { useState, useEffect } from "react"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import useAuth from "../hooks/useAuth"
import GlassButton from "../components/ui/GlassButton"
import useDarkMode from "../hooks/useDarkMode"
import { motion, AnimatePresence } from "framer-motion"
import { useDashboardLayout } from "../hooks/useDashboardLayout"

let tempIdCounter = -1;
function generateTempId(): string {
    return String(tempIdCounter--);
}

function WidgetPage() {
    const [sideBarOpen, setSideBarOpen] = useState(false)
    const [pendingWidget, setPendingWidget] = useState<{ type: string, colSpan: number, rowSpan: number } | null>(null)
    const { currentUser } = useAuth()
    const { isDarkMode } = useDarkMode()
    const {
        placedWidgets,
        setPlacedWidgets,
        permissions,
        isLoading,
        isSaving,
        saveError,
        hasChanges,
        handleSaveLayout,
    } = useDashboardLayout()

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPendingWidget(null)
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [])

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
        <div className="relative flex flex-col h-screen min-w-full overflow-auto">
            <DarkModeBackground />
            <div className="relative flex flex-col h-full w-full">
                <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)} user={currentUser}/>
                <div className="w-full max-w-full px-4 md:px-6 lg:px-8 flex flex-col flex-1 min-h-0 relative">
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
                    placedWidgets={placedWidgets}
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
