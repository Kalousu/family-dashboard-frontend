import AppHeader from "../components/mainpage/AppHeader"
import SideBar from "../components/mainpage/sidebar/SideBar"
import { useState } from "react"

function WidgetPage() {

    const [sideBarOpen, setSideBarOpen] = useState(false)

    return (
        <div className="flex flex-col w-screen h-screen bg-linear-to-b from-gray-400 to-gray-200">
            <AppHeader onUserClick={() => setSideBarOpen(!sideBarOpen)}/>
            <SideBar isOpen={sideBarOpen} onClose={() => setSideBarOpen(false)}/>
        </div>
    )
}

export default WidgetPage