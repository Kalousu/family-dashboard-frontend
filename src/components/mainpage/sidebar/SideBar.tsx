import { ChevronRight, User } from "lucide-react"

interface SideBarProps {
    isOpen: boolean
    onClose: () => void
}

function SideBar({ isOpen, onClose }: SideBarProps) {
    return(
        <div className={`fixed right-0 top-0 h-full w-70 bg-linear-to-b from-gray-700 to-gray-600 rounded-l-2xl p-4 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <ChevronRight className="w-7 h-7 text-gray-400 hover:scale-105  hover:text-white transition-all" size={30} onClick={onClose}/>
            <div className="flex flex-col items-center m-1">
                <User className="mt-6 w-36 h-36 rounded-full bg-gray-500 text-gray-300 hover:scale-102 hover:bg-gray-400 hover:text-white transition-all border-4 border-gray-800/50" size={20}/>
                <p className="m-2 text-gray-300 text-center text-lg font-bold">Willkommen zurück, User!</p>
            </div>
        </div>
    )
}

export default SideBar