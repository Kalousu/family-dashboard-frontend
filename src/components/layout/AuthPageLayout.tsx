import { AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"
import { DarkModeContext } from "../../context/DarkModeContext"
import DarkModeBackground from "../ui/DarkModeBackground"

const forcedDarkMode = { isDarkMode: true, toggleDarkMode: () => {} }

function AuthPageLayout({ children }: { children: ReactNode }) {
    return (
        <DarkModeContext.Provider value={forcedDarkMode}>
            <div className="relative flex flex-col items-center justify-center min-h-screen py-8 overflow-y-auto">
                <DarkModeBackground />
                <div className="relative flex flex-col items-center w-full gap-8">
                    <AnimatePresence mode="popLayout">
                        {children}
                    </AnimatePresence>
                </div>
            </div>
        </DarkModeContext.Provider>
    )
}

export default AuthPageLayout
