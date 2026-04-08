import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import { useState } from "react"

function WidgetPage() {

    const [isDarkMode, setIsDarkMode] = useState(true)
    const [sideBarOpen, setSideBarOpen] = useState(false)

    return (
        <div className={`flex flex-col w-screen h-screen bg-linear-to-b ${isDarkMode ? "from-gray-400 to-gray-200" : "from-gray-900 to-gray-800"}`}>
            <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)}/>
            <SideBar isOpen={sideBarOpen} onClose={() => setSideBarOpen(false)} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}/>
        </div>
    )
}

export default WidgetPage