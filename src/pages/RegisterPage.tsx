import { useState, useRef, useEffect } from "react";
import GlassButton from "../components/ui/GlassButton";
import { HslStringColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imageIcons from "../constants/imageIcons";
import dashboardBgLight from "../assets/dashboardbglight.png";
import dashboardBgDark from "../assets/dashboardbgdark.png";

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
    const [isDarkMode, setIsDarkMode] = useState(false)
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
    const inputBg = isDarkMode ? "bg-gray-800 text-gray-200 border-white/10" : "bg-white text-gray-700 border-cyan-950/5"
    const inputWrapper = isDarkMode
        ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50"
        : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30"

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-8 bg-cover bg-center bg-no-repeat transition-all duration-300" style={isDarkMode ? { backgroundImage: `url(${dashboardBgDark})` } : { backgroundImage: `url(${dashboardBgLight})` }}>
            {/* Dark Mode Toggle */}
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
                <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="flex flex-col items-center gap-4 justify-center">
                    <div className="m-28 flex flex-row items-center gap-8">
                        <div className="p-16 flex flex-col gap-4 items-center">
                            <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                <input
                                    className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                    type="text"
                                    placeholder="Name" value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
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
                                <div className="relative" ref={colorPickerRef}>
                                    <div
                                        className={`w-9 h-9 rounded-xl cursor-pointer border-2 ${isDarkMode ? "border-gray-600" : "border-gray-400"}`}
                                        style={{ backgroundColor: formData.color }}
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                    />
                                    {showColorPicker && (
                                        <motion.div key="colorpicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -10}}
                                                    className={`absolute top-12 left-0 z-50 rounded-xl p-2 bg-linear-to-b ${isDarkMode ? "from-gray-700 to-gray-800" : "from-sky-200/60 to-blue-300/40"}`}>
                                            <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${glossClass}`} />
                                            <HslStringColorPicker
                                                color={formData.color}
                                                onChange={(newColor) => setFormData({...formData, color: newColor})}
                                                className="border-2 rounded-xl border-white/40"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                <input
                                    className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                    type="password"
                                    placeholder="Passwort" value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                <input
                                    className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                    type="password"
                                    placeholder="Passwort bestätigen" value={formData.passwordConfirm}
                                    onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(imageIcons).map(([key, Icon]) => (
                                <div key={key} className={`border rounded-2xl transition-all ease-in-out duration-200 hover:scale-105 hover:brightness-103 ${isDarkMode ? "border-slate-700/20" : "border-slate-700/20"}`}>
                                    <div className={`relative border border-white/10 p-1 font-semibold rounded-2xl overflow-hidden bg-linear-to-b ${isDarkMode ? "from-gray-500/50 via-gray-600/20 to-blue-400/20 text-gray-300" : "from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700"}`}>
                                        <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                                        <div
                                            className={`relative border w-24 h-24 rounded-xl flex items-center justify-center cursor-pointer transition-all ease-in-out duration-200
                                            ${formData.icon === key
                                                ? isDarkMode ? "bg-indigo-500/25 border-white/10 hover:bg-indigo-400/35" : "bg-sky-300/50 border-sky-400/20 hover:bg-sky-300/70"
                                                : isDarkMode ? "bg-slate-700/40 border-white/5 hover:bg-slate-600/55" : "bg-white/50 border-cyan-950/5 hover:bg-sky-100/70"
                                            }`}
                                            onClick={() => setFormData({...formData, icon: key})}>
                                            <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/40"}`} />
                                            <Icon size={48} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
            </AnimatePresence>
        </div>
    )
}

export default RegisterPage
