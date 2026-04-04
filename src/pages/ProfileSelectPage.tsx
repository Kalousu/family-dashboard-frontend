import PasswortInput from "../components/PasswordInput"
import ProfileCard from "../components/ProfileCard"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const profiles = [
    { id: 1, name: "Kevin", color: "blue", image: "https://cdn.discordapp.com/attachments/887358855372242975/1489658243469938729/image.png?ex=69d137d9&is=69cfe659&hm=967d1f4fcbd31d3c6c357d93754d1ddf2416b11b38a21339e3a6b6c1a810c343" },
    { id: 2, name: "Jonas", color: "red", image: "https://cdn.discordapp.com/attachments/887358855372242975/1489705850498060471/image.png?ex=69d16430&is=69d012b0&hm=5633d49ea3fdc907d1d6c33c10be52005c3d2b2088ad685a139fb48594f720f7&"},
    { id: 3, name: "Daniel", color: "orange", image: "https://cdn.discordapp.com/attachments/887358855372242975/1489706083889975526/image.png?ex=69d16467&is=69d012e7&hm=3d2aac903ca06c67c9eb1f7acddb7ecd0d13264cdb8075071d0094857c139437&" },
    { id: 4, name: "Lea", color: "pink", image: "https://cdn.discordapp.com/attachments/887358855372242975/1489705940352634920/image.png?ex=69d16445&is=69d012c5&hm=a5fc54f1c876494e365ea35c895d53d70f92c2a73aecae68ffc7245b2b9ecee4&" },
    { id: 5, name: "Katrin", color: "lightblue", image: "https://cdn.discordapp.com/attachments/887358855372242975/1489706154996138085/image.png?ex=69d16478&is=69d012f8&hm=5094990a6d8b2e3fbfa11a216da05d12987e0c6c5ca12c965e848f73ca4f56e6&" },
]
interface Profile {
  id: number
  name: string
  color: string
  image: string
}

function ProfileSelectPage() {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
    const [error, setError] = useState<string | null>(null)

    function handleLogin(password: string) {
        if (password === "") {
            setError("Bitte Passwort eingeben")
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
                        <ProfileCard name={selectedProfile.name} color={selectedProfile.color} image={selectedProfile.image} onSelect={() => setSelectedProfile(null)} />
                        <PasswortInput onLogin={handleLogin} />
                            <p className={`text-sm font-semibold mt-2 ${error ? "text-red-500" : "text-transparent"}`}>
                                {error || "Platzhalter"}
                            </p>
                        <button className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors border-2 border-gray-400" onClick={() => setSelectedProfile(null)}>Benutzer wechseln</button>
                    </motion.div>
                ) : (
                    <motion.div key="profiles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}}>
                        <div className="p-2 flex flex-col items-center gap-8">
                            <p className="text-gray-900 text-center text-3xl font-bold">Wer bist du?</p>
                        </div>
                        <div className="p-8 flex flex-row items-center justify-center gap-8">
                            {profiles.map(profile => (
                                <ProfileCard key={profile.id} name={profile.name} color={profile.color} image={profile.image} onSelect={() => setSelectedProfile(profile)} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProfileSelectPage