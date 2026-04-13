import { User } from "lucide-react"

interface AppHeaderProps {
    onUserClick: () => void
}

function AppHeader({ onUserClick }:AppHeaderProps) {
    return (
        <div className="fixed z-10 top-0 w-full h-13 bg-linear-90 from-gray-600 to-gray-700 flex flex-row items-center justify-between p-4 border border-white/10">
            <p className="text-white/80 text-center text-2xl font-semibold">Family-Dashboard</p>
            <div className="rounded-2xl p-0.5 bg-gray-400/50 transition-all scale-35 origin-right hover:scale-36 hover:brightness-105" onClick={onUserClick}>
                <div className="relative rounded-xl p-1 bg-linear-to-b from-gray-300 via-slate-500/50 to-gray-300/20 transition-colors">
                    <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/15 rounded-t-xl pointer-events-none" />
                    <div className="rounded-xl p-0.5 bg-gray-400/50">
                        <User className="w-24 h-24 p-2 rounded-xl border bg-blue-500 border-white/30" size={10} />
                    </div>
                </div>                
            </div> 
        </div>
    )
}

export default AppHeader