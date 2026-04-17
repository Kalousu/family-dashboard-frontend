import { AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"
import DarkModeBackground from "../ui/DarkModeBackground"
import DarkModeToggle from "../ui/DarkModeToggle"

function AuthPageLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-8 overflow-hidden">
            <DarkModeBackground />
            <div className="relative flex flex-col items-center justify-center w-full h-full gap-8">
                <DarkModeToggle />
                <AnimatePresence mode="popLayout">
                    {children}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AuthPageLayout
