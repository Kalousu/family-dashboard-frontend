import AppHeader from "../components/mainpage/AppHeader"
import { useState } from "react"

function WidgetPage() {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex flex-col h-screen bg-linear-to-b from-gray-400 to-gray-200">
            <div className="h-screen">
                <AppHeader onUserClick={() => setSidebarOpen(!sidebarOpen)}/>
            </div>
        </div>
    )
}

export default WidgetPage