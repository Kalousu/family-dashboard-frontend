import PasswortInput from "../components/PasswordInput"
import ProfileCard from "../components/ProfileCard"
import GlassButton from "../components/ui/GlassButton"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import dashboardBgDark from "../assets/dashboardbgdark.png"
import dashboardBgLight from "../assets/dashboardbglight.png"

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
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const img1 = new Image()
        const img2 = new Image()
        img1.src = dashboardBgDark
        img2.src = dashboardBgLight
    }, [])

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
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${dashboardBgDark})` }}
            />
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-out"
                style={{
                    backgroundImage: `url(${dashboardBgLight})`,
                    opacity: isDarkMode ? 0 : 1,
                }}
            />
            <div className="relative flex flex-col items-center justify-center w-full h-full gap-8">
                <div className="fixed top-4 right-4 flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {isDarkMode ? "Dark Mode" : "Light Mode"}
                    </span>
                    <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${isDarkMode ? "bg-slate-500/50" : "bg-cyan-950/20"}`} onClick={() => setIsDarkMode(!isDarkMode)}>
                        <motion.div
                            className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-gray-300" : "bg-white"}`}
                            animate={{ x: isDarkMode ? 20 : 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </div>
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