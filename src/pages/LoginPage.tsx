import { useState } from "react"
import GlassButton from "../components/ui/GlassButton"
import { motion, AnimatePresence } from "framer-motion"
import dashboardBgLight from "../assets/dashboardbglight.png"
import dashboardBgDark from "../assets/dashboardbgdark.png"

function LoginPage() {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [isDarkMode, setIsDarkMode] = useState(false)

    function handleLogin() {
        if (formData.name === "" || formData.password === "") {
            setError("Bitte alle Felder ausfüllen.")
        } else {
            setError(null)
            alert(`Login mit Name: ${formData.name} und Passwort: ${formData.password}`)
        }
    }

    const inputBg = isDarkMode ? "bg-gray-800 text-gray-200 border-white/10" : "bg-white text-gray-700 border-cyan-950/5"
    const inputWrapper = isDarkMode
        ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50"
        : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30"

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
                    <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="flex flex-col items-center gap-4 justify-center">
                        <div className="flex flex-col gap-4 items-center p-16">
                            <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                <input
                                    className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                    type="text"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                <input
                                    className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                    type="password"
                                    placeholder="Passwort"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>
                        <p className={`text-sm font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                            {error || "Platzhalter"}
                        </p>
                        <GlassButton isDarkMode={!isDarkMode} onClick={handleLogin} className="px-4 py-2 backdrop-blur-sm">
                            Anmelden
                        </GlassButton>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default LoginPage
