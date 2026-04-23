import { createContext, useState } from "react"
import type { ReactNode } from "react"
import type { UserProfile, UserRole } from "../types/authTypes"
import { getCurrentUser } from "../api/userApi"

interface AuthContextType {
    familyId: number | null
    setFamilyId: (id: number | null) => void
    userId: number | null
    setUserId: (id: number | null) => void
    currentUser: UserProfile | null
    setCurrentUser: (user: UserProfile | null) => void
    refreshCurrentUser: () => Promise<void>
    isAuthenticated: boolean
    logout: () => void
    logoutUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: { children: ReactNode }) {
    const [familyId, setFamilyIdState] = useState<number | null>(
        () => {
            const stored = localStorage.getItem("familyId")
            return stored ? Number(stored) : null
        }
    )
    
    const [userId, setUserIdState] = useState<number | null>(
        () => {
            const stored = localStorage.getItem("userId")
            return stored ? Number(stored) : null
        }
    )

    const [currentUser, setCurrentUserState] = useState<UserProfile | null>(
        () => {
            const stored = localStorage.getItem("currentUser")
            return stored ? JSON.parse(stored) : null
        }
    )

    function setFamilyId(id: number | null) {
        setFamilyIdState(id)
        if (id !== null) {
            localStorage.setItem("familyId", String(id))
        } else {
            localStorage.removeItem("familyId")
        }
    }

    function setUserId(id: number | null) {
        setUserIdState(id)
        if (id !== null) {
            localStorage.setItem("userId", String(id))
        } else {
            localStorage.removeItem("userId")
        }
    }

    function setCurrentUser(user: UserProfile | null) {
        setCurrentUserState(user)
        if (user !== null) {
            localStorage.setItem("currentUser", JSON.stringify(user))
        } else {
            localStorage.removeItem("currentUser")
        }
    }

    function logout() {
        setFamilyIdState(null)
        setUserIdState(null)
        setCurrentUserState(null)
        localStorage.removeItem("familyId")
        localStorage.removeItem("userId")
        localStorage.removeItem("currentUser")
    }

    function logoutUser() {
        setUserIdState(null)
        setCurrentUserState(null)
        localStorage.removeItem("userId")
        localStorage.removeItem("currentUser")
    }

    async function refreshCurrentUser() {
        try {
            const userData = await getCurrentUser()
            const userProfile = {
                id: userData.id,
                name: userData.name,
                avatar: userData.avatar,
                avatarType: userData.avatarType,
                color: userData.color,
                role: userData.role as UserRole,
                hasPin: userData.hasPin
            }
            setCurrentUser(userProfile)
        } catch (error) {
            console.error("Failed to refresh current user:", error)
        }
    }

    const isAuthenticated = familyId !== null && userId !== null

    return (
        <AuthContext.Provider value={{ 
            familyId, 
            setFamilyId, 
            userId, 
            setUserId,
            currentUser,
            setCurrentUser,
            refreshCurrentUser,
            isAuthenticated,
            logout,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }
export type { AuthContextType }
