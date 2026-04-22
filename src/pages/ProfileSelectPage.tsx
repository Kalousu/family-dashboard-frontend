import PasswortInput from "../components/PasswordInput"
import ProfileCard from "../components/ProfileCard"
import GlassButton from "../components/ui/GlassButton"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AuthPageLayout from "../components/layout/AuthPageLayout"
import useDarkMode from "../hooks/useDarkMode"
import useAuth from "../hooks/useAuth"
import { fadeSlideUp } from "../constants/animations"
import { getUsersForFamily } from "../api/familyApi"
import { selectUser, logoutFamily } from "../api/authApi"
import type { UserProfile } from "../types/authTypes"

function ProfileSelectPage() {
    const [profiles, setProfiles] = useState<UserProfile[]>([])
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()
    const { familyId, setUserId, setCurrentUser, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchProfiles() {
            if (!familyId) {
                navigate("/login")
                return
            }
            try {
                setLoading(true)
                const users = await getUsersForFamily(familyId)
                setProfiles(users)
            } catch (err) {
                setError("Fehler beim Laden der Profile")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfiles()
    }, [familyId, navigate])

    async function handleLogin(pin?: string) {
        if (!selectedProfile) return
        setError(null)
        try {
            await selectUser({ userId: selectedProfile.id, pin: pin })
            setUserId(selectedProfile.id)
            setCurrentUser(selectedProfile)  // Save user in context
            navigate("/dashboard")
        } catch (err) {
            setError("Login fehlgeschlagen")
            console.error(err)
        }
    }

    async function handleFamilyLogout() {
        try {
            await logoutFamily()  // Call backend to clear family_token cookie
            logout()  // Clear local storage
            navigate("/login")
        } catch (err) {
            console.error("Fehler beim Abmelden:", err)
            // Even if API call fails, clear local data and navigate
            logout()
            navigate("/login")
        }
    }

    if (loading) {
        return (
            <AuthPageLayout>
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
                </div>
            </AuthPageLayout>
        )
    }

    return (
        <AuthPageLayout>
            {selectedProfile ? (
                <motion.div key="login" {...fadeSlideUp} className="p-4 flex flex-col items-center gap-4">
                    <p className={`text-center text-3xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Willkommen zurück, {selectedProfile.name}!</p>
                    <ProfileCard 
                        name={selectedProfile.name} 
                        color="blue" 
                        icon={selectedProfile.avatar} 
                        avatarType={selectedProfile.avatarType}
                        onSelect={() => setSelectedProfile(null)} 
                        isDarkMode={isDarkMode} 
                    />
                    {selectedProfile.hasPin ? (
                        <PasswortInput onLogin={handleLogin} isDarkMode={isDarkMode} />
                    ) : (
                        <GlassButton isDarkMode={!isDarkMode} onClick={() => handleLogin()} className="px-4 py-2 backdrop-blur-sm">
                            Anmelden
                        </GlassButton>
                    )}
                    <p className={`text-sm font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                        {error || "Platzhalter"}
                    </p>
                    <GlassButton isDarkMode={!isDarkMode} onClick={() => setSelectedProfile(null)} className="px-4 py-2 backdrop-blur-sm">
                        Benutzer wechseln
                    </GlassButton>
                </motion.div>
            ) : (
                <motion.div key="profiles" {...fadeSlideUp} className="relative w-full h-full flex flex-col items-center justify-center">
                    <div className="p-2 flex flex-col items-center gap-4">
                        <p className={`text-center text-3xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Wer bist du?</p>
                    </div>
                    <div className="p-4 flex flex-row items-center justify-center gap-4 flex-wrap">
                        {profiles && profiles.length > 0 ? (
                            profiles.map(profile => (
                                <ProfileCard
                                    key={profile.id}
                                    name={profile.name}
                                    color="blue"
                                    icon={profile.avatar}
                                    avatarType={profile.avatarType}
                                    onSelect={() => setSelectedProfile(profile)}
                                    isDarkMode={isDarkMode}
                                />
                            ))
                        ) : (
                            <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                Keine Profile gefunden
                            </p>
                        )}
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                        <GlassButton isDarkMode={!isDarkMode} onClick={handleFamilyLogout} className="px-4 py-2 backdrop-blur-sm">
                            Familie abmelden
                        </GlassButton>
                    </div>
                </motion.div>
            )}
        </AuthPageLayout>
    )
}

export default ProfileSelectPage
