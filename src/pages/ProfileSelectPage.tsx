import PasswortInput from "../components/PasswordInput"
import ProfileCard from "../components/ProfileCard"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

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

    function handleLogin(password: string) {
        if (password === "") {
            setError("Bitte Passwort eingeben.")
        } else {
            setError(null)
            alert(`Logging in with username: ${selectedProfile?.name} and password: ${password}`)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-8 bg-linear-to-b from-gray-400 to-gray-200">
            <AnimatePresence mode="popLayout">
                {selectedProfile ? (
                    <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="p-4 flex flex-col items-center gap-8">
                        <p className="text-gray-900 text-center text-3xl font-bold">Willkommen zurück, {selectedProfile.name}!</p>
                        <ProfileCard name={selectedProfile.name} color={selectedProfile.color} icon={selectedProfile.icon} onSelect={() => setSelectedProfile(null)} />
                        <PasswortInput onLogin={handleLogin} />
                            <p className={`text-sm font-semibold mt-2 ${error ? "text-red-500" : "text-transparent"}`}>
                                {error || "Platzhalter"}
                            </p>
                            <div className="rounded-xl p-0.5 bg-linear-to-b to-gray-400/50 via-gray-500/50 from-gray-400/40 hover:brightness-103 transition-all">
                                <button className="relative border border-white/10 px-4 py-2 text-gray-600 bg-linear-to-b from-gray-200/60 via-gray-400/70 to-slate-300/40 font-semibold rounded-xl overflow-hidden" onClick={() => setSelectedProfile(null)}>
                                    Benutzer wechseln
                                    <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/15 rounded-t-xl pointer-events-none" />
                                </button>
                            </div>
                    </motion.div>
                ) : (
                    <motion.div key="profiles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}}>
                        <div className="p-2 flex flex-col items-center gap-8">
                            <p className="text-gray-900 text-center text-3xl font-bold">Wer bist du?</p>
                        </div>
                        <div className="p-8 flex flex-row items-center justify-center gap-8">
                            {profiles.map(profile => (
                                <ProfileCard key={profile.id} name={profile.name} color={profile.color} icon={profile.icon} onSelect={() => setSelectedProfile(profile)} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProfileSelectPage