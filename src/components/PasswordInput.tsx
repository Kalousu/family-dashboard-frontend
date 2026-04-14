import { useState } from "react"
import type { KeyboardEvent } from "react"
import { ChevronRight } from "lucide-react"

function PasswortInput({ onLogin, isDarkMode = false }: { onLogin: (password: string) => void, isDarkMode?: boolean }) {
    const [password, setPassword] = useState("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onLogin(password)
        }
    }

    const inputWrapper = isDarkMode
        ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50"
        : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30"
    const inputBg = isDarkMode
        ? "bg-gray-800 text-gray-200 border-white/10"
        : "bg-white text-gray-700 border-cyan-950/5"
    const btnOuter = isDarkMode
        ? "bg-gray-500/80"
        : "bg-sky-300/60"
    const btnInner = isDarkMode
        ? "from-gray-400 via-gray-600/50 to-gray-400/20"
        : "from-sky-200/80 via-blue-300/50 to-sky-200/20"
    const btnFace = isDarkMode
        ? "from-gray-500/70 to-gray-600 text-gray-200"
        : "from-sky-100/80 to-blue-300/60 text-sky-900"

    return (
        <div className="flex flex-row items-center gap-2">
            <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`px-4 py-2 rounded-xl focus:outline-none text-sm border ${inputBg}`}
                    type="password"
                    placeholder="Passwort" />
            </div>
            <div className={`overflow-hidden rounded-full p-px transition-all hover:scale-104 hover:brightness-110 ease-in-out ${btnOuter}`}>
                <div className={`relative rounded-full p-0.5 bg-linear-to-b duration-200 ${btnInner}`}>
                    <button className={`w-8 h-8 flex flex-col items-center justify-center bg-linear-to-b text-left font-semibold rounded-full transition-all ${btnFace}`} onClick={() => onLogin(password)}>
                        <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none" />
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswortInput