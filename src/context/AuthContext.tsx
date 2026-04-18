import { createContext, useState } from "react"
import type { ReactNode } from "react"

interface AuthContextType {
    familyId: number | null
    setFamilyId: (id: number | null) => void
    userId: number | null
    setUserId: (id: number | null) => void
    isAuthenticated: boolean
    logout: () => void
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

    function logout() {
        setFamilyIdState(null)
        setUserIdState(null)
        localStorage.removeItem("familyId")
        localStorage.removeItem("userId")
    }

    const isAuthenticated = familyId !== null && userId !== null

    return (
        <AuthContext.Provider value={{ 
            familyId, 
            setFamilyId, 
            userId, 
            setUserId,
            isAuthenticated,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }
export type { AuthContextType }
