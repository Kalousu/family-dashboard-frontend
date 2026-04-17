import PasswortInput from "../components/PasswordInput"
import ProfileCard from "../components/ProfileCard"
import GlassButton from "../components/ui/GlassButton"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import DarkModeToggle from "../components/ui/DarkModeToggle"
import useDarkMode from "../hooks/useDarkMode"

const profiles = [
    { id: 1, name: "Kevin", color: "blue", icon: "gamepad" },
    { id: 2, name: "Jonas", color: "red", icon: "dog" },
    { id: 3, name: "Daniel", color: "lightgreen", icon: "sun" },
    { id: 4, name: "Lea", color: "pink", icon: "flower" },
    { id: 5, name: "Katrin", color: "lightblue", icon: "cat" },
]
interface Profile {
  id: number
  name: string
  color: string
  icon: string
}

function ProfileSelectPage() {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()

    function handleLogin(password: string) {
        if (password === "") {
            setError("Bitte Passwort eingeben.")
        } else {
            setError(null)
            alert(`Logging in with username: ${selectedProfile?.name} and password: ${password}`)
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-8 overflow-hidden">
            <DarkModeBackground />
            <div className="relative flex flex-col items-center justify-center w-full h-full gap-8">
                <DarkModeToggle />
                <AnimatePresence mode="popLayout">
                    {selectedProfile ? (
                        <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="p-4 flex flex-col items-center gap-8">
                            <p className={`text-center text-3xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Willkommen zurück, {selectedProfile.name}!</p>
                            <ProfileCard name={selectedProfile.name} color={selectedProfile.color} icon={selectedProfile.icon} onSelect={() => setSelectedProfile(null)} isDarkMode={isDarkMode} />
                            <PasswortInput onLogin={handleLogin} isDarkMode={isDarkMode} />
                            <p className={`text-sm font-semibold mt-2 ${error ? "text-red-500" : "text-transparent"}`}>
                                {error || "Platzhalter"}
                            </p>
                            <GlassButton isDarkMode={!isDarkMode} onClick={() => setSelectedProfile(null)} className="px-4 py-2 backdrop-blur-sm">
                                Benutzer wechseln
                            </GlassButton>
                        </motion.div>
                    ) : (
                        <motion.div key="profiles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}}>
                            <div className="p-2 flex flex-col items-center gap-8">
                                <p className={`text-center text-3xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>Wer bist du?</p>
                            </div>
                            <div className="p-8 flex flex-row items-center justify-center gap-8">
                                {profiles.map(profile => (
                                    <ProfileCard key={profile.id} name={profile.name} color={profile.color} icon={profile.icon} onSelect={() => setSelectedProfile(profile)} isDarkMode={isDarkMode} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ProfileSelectPage
