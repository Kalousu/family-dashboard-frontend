import { useState } from "react"
import type { KeyboardEvent } from "react"
import { ChevronRight } from "lucide-react"
import FormInput from "./ui/FormInput"

function PasswortInput({ onLogin, isDarkMode = false }: { onLogin: (password: string) => void, isDarkMode?: boolean }) {
    const [password, setPassword] = useState("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onLogin(password)
        }
    }

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
            <FormInput
                isDarkMode={isDarkMode}
                className="text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                type="password"
                placeholder="Passwort" />
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