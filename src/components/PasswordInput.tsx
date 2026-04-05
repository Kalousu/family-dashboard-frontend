import { useState } from "react"
import type { KeyboardEvent } from "react"

function PasswortInput({ onLogin }: { onLogin: (password: string) => void }) {
    const [password, setPassword] = useState("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onLogin(password)
        }
    }
    
    return (
        <div className="flex flex-row items-center gap-2">
            <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-4 py-2 rounded-xl border-2 border-gray-400 focus:outline-none bg-gray-200 text-sm" 
                type="password" 
                placeholder="Passwort" />
            <button className="w-10 h-10 rounded-xl bg-gray-300 hover:bg-gray-400 transition-colors border-2 border-gray-400 text-lg" onClick={() => onLogin(password)}>→</button>
        </div>
    )
}

export default PasswortInput