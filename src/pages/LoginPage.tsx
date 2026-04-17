import { useState } from "react"
import { motion } from "framer-motion"
import GlassButton from "../components/ui/GlassButton"
import FormInput from "../components/ui/FormInput"
import AuthPageLayout from "../components/layout/AuthPageLayout"
import useDarkMode from "../hooks/useDarkMode"
import { fadeSlideUp } from "../constants/animations"

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
        <AuthPageLayout>
            <motion.div key="login" {...fadeSlideUp} className="flex flex-col items-center gap-4 justify-center">
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
        </AuthPageLayout>
    )
}

export default LoginPage
