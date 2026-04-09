import { useState } from "react"
import type { KeyboardEvent } from "react"

function PasswortInput({ onLogin, disabled = false }: { onLogin: (password: string) => void; disabled?: boolean }) {
    const [password, setPassword] = useState("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !disabled) {
            onLogin(password)
        }
    }
    
    return (
        <div className="flex flex-row items-center gap-2">
            <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-4 py-2 rounded-xl border-2 border-gray-400 focus:outline-none bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                type="password" 
                placeholder="Passwort"
                disabled={disabled}
            />
            <button 
                className="w-10 h-10 rounded-xl bg-gray-300 hover:bg-gray-400 transition-colors border-2 border-gray-400 text-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={() => onLogin(password)}
                disabled={disabled}
            >
                →
            </button>
        </div>
    )
}

export default PasswortInput
