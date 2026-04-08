import { User } from "lucide-react"

interface AppHeaderProps {
    onUserClick: () => void
}

function AppHeader({ onUserClick }:AppHeaderProps) {
    return (
        <div className="fixed top-0 w-full h-13 bg-linear-90 from-gray-600 to-gray-700 flex flex-row items-center justify-between p-4">
            <p className="text-white text-center text-2xl font-semibold">Family-Dashboard</p>
            <User className="w-8 h-8 rounded-full bg-gray-600 text-gray-400 hover:scale-105 hover:bg-gray-500 hover:text-white transition-all border-2 border-gray-800/50" size={20} onClick={onUserClick}/>   
        </div>
    )
}

export default AppHeader