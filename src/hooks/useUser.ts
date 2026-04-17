import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import type { UserContextType } from "../context/UserContext"

function useUser(): UserContextType {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error("useUser must be used inside UserProvider")
    return ctx
}

export default useUser
