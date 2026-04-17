import { useState, useRef, useEffect } from "react";
import GlassButton from "../components/ui/GlassButton";
import FormInput from "../components/ui/FormInput";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import IconSelect from "../components/IconSelect";
import AuthPageLayout from "../components/layout/AuthPageLayout";
import useDarkMode from "../hooks/useDarkMode";
import { fadeSlideUp } from "../constants/animations";
import ColorPickerButton from "../components/ui/ColorPickerButton";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        role: "Mitglied",
        password: "",
        passwordConfirm: "",
        icon: "user",
        color: "hsl(0, 0%, 50%)"
    })
    const [error, setError] = useState<string | null>(null)
    const [showColorPicker, setShowColorPicker] = useState(false)
    const { isDarkMode } = useDarkMode()
    const colorPickerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    function handleRegister() {
        if (formData.password !== formData.passwordConfirm) {
            setError("Passwörter stimmen nicht überein.")
        }
        else if (formData.name === "" || formData.password === "") {
            setError("Bitte alle Felder ausfüllen.")
        }
        else {
            setError(null)
            alert(`Registrieren mit Name: ${formData.name} und Passwort: ${formData.password} als ${formData.role} mit dem Icon ${formData.icon} und der Farbe ${formData.color}`)
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [showColorPicker])

    const glossClass = isDarkMode ? "bg-white/5" : "bg-white/30"
    const inputWrapper = isDarkMode
        ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50"
        : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30"

    return (
        <AuthPageLayout>
            <motion.div key="register" {...fadeSlideUp} className="flex flex-col items-center gap-4 justify-center">
                <div className="flex flex-row items-center gap-8">
                    <div className="px-8 flex flex-col gap-4 items-center">
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <div className="flex flex-row items-center gap-2">
                            <div className={`relative hover:brightness-103 transition-all rounded-xl p-0.5 ${inputWrapper}`}>
                                <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${glossClass}`} />
                                <select
                                    className={`px-2 py-2 border font-semibold rounded-xl overflow-hidden bg-linear-to-b ${isDarkMode ? "from-gray-700/60 via-gray-800/70 to-slate-700/40 text-gray-300 border-white/10" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700 border-cyan-950/5"}`}
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="Mitglied">Mitglied</option>
                                    <option value="Familienadministrator">Familienadministrator</option>
                                    <option value="Systemadministrator">Systemadministrator</option>
                                </select>
                            </div>
                            <ColorPickerButton
                                color={formData.color}
                                isDarkMode={isDarkMode}
                                onChange={(newColor) => setFormData({...formData, color: newColor})}
                            />
                        </div>
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="password"
                            placeholder="Passwort"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <FormInput
                            isDarkMode={isDarkMode}
                            type="password"
                            placeholder="Passwort bestätigen"
                            value={formData.passwordConfirm}
                            onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                        />
                    </div>
                    <IconSelect
                        selectedIcon={formData.icon}
                        isDarkMode={isDarkMode}
                        onSelect={(key) => setFormData({...formData, icon: key})}
                    />
                </div>
                <p className={`text-sm font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                    {error || "Platzhalter"}
                </p>
                <GlassButton isDarkMode={!isDarkMode} onClick={handleRegister} className="px-4 py-2 backdrop-blur-sm">
                    Registrieren
                </GlassButton>
                <GlassButton isDarkMode={!isDarkMode} onClick={() => navigate("/")} className="px-4 py-2 backdrop-blur-sm">
                    Zurück zur Nutzerauswahl
                </GlassButton>
            </motion.div>
        </AuthPageLayout>
    )
}

export default RegisterPage
