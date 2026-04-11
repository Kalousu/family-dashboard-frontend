import { useState } from "react"
import type { KeyboardEvent } from "react"
import {  ChevronRight } from "lucide-react"

function PasswortInput({ onLogin }: { onLogin: (password: string) => void }) {
    const [password, setPassword] = useState("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onLogin(password)
        }
    }
    
    return (
        <div className="flex flex-row items-center gap-2">
            <div className="rounded-xl p-0.5 bg-linear-to-b to-gray-400 via-gray-600/50 from-gray-400/50  duration-200">
                <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="px-4 py-2 rounded-xl focus:outline-none bg-gray-200 text-sm" 
                    type="password" 
                    placeholder="Passwort" />                
            </div>
            <div className="rounded-full p-0.25 bg-gray-500/80 transition-all  hover:scale-104 hover:brightness-110  ease-in-out">
                <div className="relative rounded-full p-0.5 bg-linear-to-b from-gray-400 via-gray-600/50 to-gray-400/20  duration-200">
                    <button className="w-8 h-8 flex flex-col items-center justify-center bg-linear-to-b from-gray-500/70 to-gray-600 text-gray-200 text-left font-semibold rounded-full transition-all" onClick={() => onLogin(password)}>
                        <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none" />
                        <ChevronRight />
                    </button>
                </div>  
            </div>
        </div>
    )
}

export default PasswortInput