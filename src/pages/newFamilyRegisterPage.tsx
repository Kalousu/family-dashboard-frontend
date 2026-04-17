import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import GlassButton from "../components/ui/GlassButton"
import FormInput from "../components/ui/FormInput"
import AuthPageLayout from "../components/layout/AuthPageLayout"
import useDarkMode from "../hooks/useDarkMode"
import { fadeSlideUp } from "../constants/animations"

function NewFamilyRegisterPage() {
    const [formData, setFormData] = useState({
        familienname: "",
        email: "",
        passwort: "",
        passwortWiederholen: "",
    })
    const [error, setError] = useState<string | null>(null)
    const { isDarkMode } = useDarkMode()
    const navigate = useNavigate()

    const text = isDarkMode ? "text-white" : "text-gray-900"
    const muted = isDarkMode ? "text-gray-400" : "text-gray-500"

    function handleRegister() {
        if (!formData.familienname || !formData.email || !formData.passwort || !formData.passwortWiederholen) {
            setError("Bitte alle Felder ausfüllen.")
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Bitte eine gültige E-Mail-Adresse eingeben.")
            return
        }
        if (formData.passwort !== formData.passwortWiederholen) {
            setError("Passwörter stimmen nicht überein.")
            return
        }
        setError(null)
        alert(`Registrierung für: ${formData.familienname}`)
    }

    return (
        <AuthPageLayout>
            <motion.div key="register" {...fadeSlideUp} className="flex flex-col items-center gap-4 justify-center">

                <h1 className={`text-2xl font-bold tracking-tight ${text}`}>Account erstellen</h1>

                <div className="flex flex-col gap-4 items-stretch p-10 w-full">

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>Familienname</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="text"
                            placeholder="Euer Familienname"
                            value={formData.familienname}
                            onChange={(e) => setFormData({ ...formData, familienname: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>E-Mail</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="email"
                            placeholder="beispiel@mail.de"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>Passwort</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="password"
                            placeholder="Passwort"
                            value={formData.passwort}
                            onChange={(e) => setFormData({ ...formData, passwort: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>Passwort wiederholen</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="password"
                            placeholder="Passwort wiederholen"
                            value={formData.passwortWiederholen}
                            onChange={(e) => setFormData({ ...formData, passwortWiederholen: e.target.value })}
                        />
                    </div>

                </div>

                <p className={`text-sm font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                    {error || "Platzhalter"}
                </p>

                <GlassButton isDarkMode={!isDarkMode} onClick={handleRegister} className="px-4 py-2 backdrop-blur-sm">
                    Registrieren
                </GlassButton>

                <div className="flex flex-col items-center gap-2 mt-2">
                    <span className={`text-xs ${muted}`}>Du kennst dich hier schon aus?</span>
                    <GlassButton isDarkMode={!isDarkMode} onClick={() => navigate("/login")} className="px-4 py-1.5 text-sm backdrop-blur-sm">
                        Zum Login
                    </GlassButton>
                </div>

            </motion.div>
        </AuthPageLayout>
    )
}

export default NewFamilyRegisterPage
