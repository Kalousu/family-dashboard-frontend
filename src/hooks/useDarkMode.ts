import { useContext } from "react"
import { DarkModeContext } from "../context/DarkModeContext"

function useDarkMode() {
    const ctx = useContext(DarkModeContext)
    if (!ctx) throw new Error("useDarkMode must be used inside DarkModeProvider")
    return ctx
}

export default useDarkMode
