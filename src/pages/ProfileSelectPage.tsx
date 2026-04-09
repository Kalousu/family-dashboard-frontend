import PasswortInput from "../components/PasswordInput"
import ProfileCard from "../components/ProfileCard"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { fetchApi } from "../services/api"

interface Profile {
    id: number
    name: string
    userPfp: string
    pfpColour: string
}

function ProfileSelectPage() {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingProfiles, setLoadingProfiles] = useState(true)
    const navigate = useNavigate()
    const { login } = useAuth()

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const users = await fetchApi<Profile[]>('/api/users', 'GET')
                setProfiles(users)
            } catch (err) {
                console.error('Failed to load profiles:', err)
                setError('Fehler beim Laden der Profile')
            } finally {
                setLoadingProfiles(false)
            }
        }
        loadProfiles()
    }, [])

    async function handleLogin(password: string) {
        if (!selectedProfile) return
        
        if (password === "") {
            setError("Bitte Passwort eingeben.")
            return
        }
        
        setError(null)
        setIsLoading(true)
        
        try {
            await login(selectedProfile.name, password)
            navigate("/dashboard")
        } catch (err) {
            setError("Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.")
            console.error("Login error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-linear-to-b from-gray-400 to-gray-200 p-4">
            <AnimatePresence mode="popLayout">
                {selectedProfile ? (
                    <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="p-4 flex flex-col items-center gap-6">
                        <p className="text-gray-900 text-center text-3xl font-bold">Willkommen zurück, {selectedProfile.name}!</p>
                        <ProfileCard 
                            name={selectedProfile.name} 
                            color={selectedProfile.pfpColour} 
                            icon={selectedProfile.userPfp} 
                            onSelect={() => setSelectedProfile(null)} 
                        />
                        <PasswortInput onLogin={handleLogin} disabled={isLoading} />
                        <p className={`text-sm font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                            {error || "Platzhalter"}
                        </p>
                        <button 
                            className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors border-2 border-gray-400 disabled:opacity-50"
                            onClick={() => {
                                setSelectedProfile(null)
                                setError(null)
                            }}
                            disabled={isLoading}
                        >
                            Benutzer wechseln
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key="profiles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}}>
                        <div className="p-2 flex flex-col items-center gap-8">
                            <p className="text-gray-900 text-center text-3xl font-bold">Wer bist du?</p>
                        </div>
                        {loadingProfiles ? (
                            <div className="p-8 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                            </div>
                        ) : profiles.length > 0 ? (
                            <div className="p-8 flex flex-row flex-wrap items-center justify-center gap-8 max-w-4xl">
                                {profiles.map(profile => (
                                    <ProfileCard 
                                        key={profile.id} 
                                        name={profile.name} 
                                        color={profile.pfpColour} 
                                        icon={profile.userPfp} 
                                        onSelect={() => setSelectedProfile(profile)} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 flex flex-col items-center gap-4">
                                <p className="text-gray-700 text-center">Keine Profile gefunden</p>
                                <button 
                                    className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors"
                                    onClick={() => navigate("/register")}
                                >
                                    Jetzt registrieren
                                </button>
                            </div>
                        )}
                        {!loadingProfiles && (
                            <div className="flex justify-center mt-4">
                                <button 
                                    className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors text-sm"
                                    onClick={() => navigate("/register")}
                                >
                                    Noch kein Konto? Registrieren
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProfileSelectPage
