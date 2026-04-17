import { createContext, useState } from "react"
import type { ReactNode } from "react"

interface DarkModeContextType {
    isDarkMode: boolean
    toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | null>(null)

function DarkModeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    function toggleDarkMode() {
        setIsDarkMode(prev => !prev)
    }

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}

export { DarkModeProvider, DarkModeContext }
export type { DarkModeContextType }
