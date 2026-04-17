import { useState } from "react"
import GlassButton from "../components/ui/GlassButton"
import FormInput from "../components/ui/FormInput"
import { motion, AnimatePresence } from "framer-motion"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import DarkModeToggle from "../components/ui/DarkModeToggle"
import useDarkMode from "../hooks/useDarkMode"

function LoginPage() {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
    })
    const [error, setError] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()

    function handleLogin() {
        if (formData.name === "" || formData.password === "") {
            setError("Bitte alle Felder ausfüllen.")
        } else {
            setError(null)
            alert(`Login mit Name: ${formData.name} und Passwort: ${formData.password}`)
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-8 overflow-hidden">
            <DarkModeBackground />
            <div className="relative flex flex-col items-center justify-center w-full h-full gap-8">
                <DarkModeToggle />
                <AnimatePresence mode="popLayout">
                    <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="flex flex-col items-center gap-4 justify-center">
                        <div className="flex flex-col gap-4 items-center p-16">
                            <FormInput
                                isDarkMode={isDarkMode}
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <FormInput
                                isDarkMode={isDarkMode}
                                type="password"
                                placeholder="Passwort"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
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
