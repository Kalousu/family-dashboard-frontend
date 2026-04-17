import { createContext, useState } from "react"
import type { ReactNode } from "react"
import type { Profile } from "../widgets/timetable/timetableTypes"

interface UserContextType {
    currentUser: Profile | null
    setCurrentUser: (user: Profile | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUserState] = useState<Profile | null>(
        () => JSON.parse(localStorage.getItem("currentUser") ?? "null")
    )

    function setCurrentUser(user: Profile | null) {
        setCurrentUserState(user)
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user))
        } else {
            localStorage.removeItem("currentUser")
        }
    }

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext }
export type { UserContextType }
