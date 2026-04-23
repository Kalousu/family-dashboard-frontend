import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import GlassButton from "../components/ui/GlassButton"
import FormInput from "../components/ui/FormInput"
import AuthPageLayout from "../components/layout/AuthPageLayout"
import useDarkMode from "../hooks/useDarkMode"
import { fadeSlideUp } from "../constants/animations"
import { createFamily } from "../api/familyApi"

function NewFamilyRegisterPage() {
    const [formData, setFormData] = useState({
        familienname: "",
        email: "",
        passwort: "",
        passwortWiederholen: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { isDarkMode } = useDarkMode()
    const navigate = useNavigate()

    const text = isDarkMode ? "text-white" : "text-gray-900"
    const muted = isDarkMode ? "text-gray-400" : "text-gray-500"

    function validate(): string | null {
        if (!formData.familienname || !formData.email || !formData.passwort || !formData.passwortWiederholen)
            return "Bitte alle Felder ausfüllen."
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            return "Bitte eine gültige E-Mail-Adresse eingeben."
        if (formData.passwort.length < 4)
            return "Passwort muss mindestens 4 Zeichen lang sein."
        if (formData.passwort !== formData.passwortWiederholen)
            return "Passwörter stimmen nicht überein."
        return null
    }

    function handleChange(field: keyof typeof formData) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [field]: e.target.value })
            setError(null)
        }
    }

    async function handleRegister() {
        const err = validate()
        if (err) { 
            setError(err)
            return 
        }
        
        setLoading(true)
        setError(null)
        
        try {
            const response = await createFamily({
                familyName: formData.familienname,
                password: formData.passwort,
                email: formData.email
            })
            // Nach erfolgreicher Familienregistrierung zur Benutzererstellung navigieren
            navigate("/register", { 
                state: { 
                    familyId: response.familyId,
                    familyName: response.familyName 
                }
            })
        } catch (error: unknown) {
            console.error("Fehler bei der Registrierung:", error)
            
            // Try to extract specific error message from backend
            let errorMessage = "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut."
            
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string }, status?: number } }
                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message
                } else if (axiosError.response?.status === 400) {
                    errorMessage = "Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Angaben."
                } else if (axiosError.response?.status === 409) {
                    errorMessage = "Eine Familie mit diesem Namen oder dieser E-Mail existiert bereits."
                }
            } else if (error && typeof error === 'object' && 'message' in error) {
                const errorWithMessage = error as { message: string }
                errorMessage = errorWithMessage.message
            }
            
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthPageLayout>
            <motion.div key="register" {...fadeSlideUp} className="flex flex-col items-center gap-4 justify-center"
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        >

                <h1 className={`text-2xl font-bold tracking-tight ${text}`}>Account erstellen</h1>

                <div className="flex flex-col gap-4 items-stretch p-10 w-full">

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>Familienname</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="text"
                            placeholder="Euer Familienname"
                            value={formData.familienname}
                            onChange={handleChange("familienname")}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>E-Mail</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="email"
                            placeholder="beispiel@mail.de"
                            value={formData.email}
                            onChange={handleChange("email")}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>Passwort</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="password"
                            placeholder="Passwort"
                            value={formData.passwort}
                            onChange={handleChange("passwort")}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className={`w-44 text-sm font-medium text-right ${muted}`}>Passwort wiederholen</span>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="password"
                            placeholder="Passwort wiederholen"
                            value={formData.passwortWiederholen}
                            onChange={handleChange("passwortWiederholen")}
                        />
                    </div>

                </div>

                <p className={`text-sm font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                    {error || "Platzhalter"}
                </p>

                <GlassButton 
                    isDarkMode={!isDarkMode} 
                    onClick={loading ? undefined : handleRegister} 
                    className={`px-4 py-2 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? "Wird erstellt..." : "Registrieren"}
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
