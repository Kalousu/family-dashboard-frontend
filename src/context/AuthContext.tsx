import { createContext, useState } from "react"
import type { ReactNode } from "react"
import type { UserProfile, UserRole } from "../types/authTypes"
import { getCurrentUser } from "../api/userApi"
import { createStorageManager } from "../utils/storage"

const familyStorage = createStorageManager<number>("familyId")
const userStorage = createStorageManager<number>("userId")
const currentUserStorage = createStorageManager<UserProfile>("currentUser")

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
    const [familyId, setFamilyIdState] = useState<number | null>(familyStorage.get)
    const [userId, setUserIdState] = useState<number | null>(userStorage.get)
    const [currentUser, setCurrentUserState] = useState<UserProfile | null>(currentUserStorage.get)

    function setFamilyId(id: number | null) {
        setFamilyIdState(id)
        familyStorage.set(id)
    }

    function setUserId(id: number | null) {
        setUserIdState(id)
        userStorage.set(id)
    }

    function setCurrentUser(user: UserProfile | null) {
        setCurrentUserState(user)
        currentUserStorage.set(user)
    }

    function logout() {
        setFamilyIdState(null)
        setUserIdState(null)
        setCurrentUserState(null)
        familyStorage.clear()
        userStorage.clear()
        currentUserStorage.clear()
    }

    function logoutUser() {
        setUserIdState(null)
        setCurrentUserState(null)
        userStorage.clear()
        currentUserStorage.clear()
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
