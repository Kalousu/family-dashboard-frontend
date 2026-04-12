import { useState, useRef, useEffect } from "react";
import { HslStringColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imageIcons from "../constants/imageIcons";

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

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-8 bg-linear-to-b from-gray-400 to-gray-200">
            <AnimatePresence mode="popLayout">
                <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="flex flex-col items-center gap-4 justify-center">
                    <div className="m-28 flex flex-row items-center gap-8">
                        <div className="p-16 flex flex-col gap-4 items-center">
                            <div className="rounded-xl p-0.5 bg-linear-to-b to-gray-400 via-gray-600/50 from-gray-400/50">
                                <input 
                                    className="px-4 py-2 rounded-xl focus:outline-none bg-gray-200 text-lg border border-white/70"
                                    type="text" 
                                    placeholder="Name" value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />                                
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <div className="relative  hover:brightness-103 transition-all rounded-xl p-0.5 bg-linear-to-b to-gray-400/50 via-gray-600/50 from-gray-400/50">
                                    <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/10 rounded-t-xl pointer-events-none" />
                                    <select 
                                        className="px-2 py-2 border border-white/5 text-gray-600 bg-linear-to-b from-gray-200/60 via-gray-400/70 to-slate-300/40 font-semibold rounded-xl overflow-hidden"
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
                                        className="w-9 h-9 rounded-xl cursor-pointer border-2 border-gray-400"
                                        style={{ backgroundColor: formData.color }}
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                    />
                                    {showColorPicker && (
                                        <motion.div key="colorpicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -10}} 
                                                    className="absolute top-12 left-0 z-50 rounded-xl p-2 bg-linear-to-b from-gray-300 to-gray-400">
                                            <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/15 rounded-t-xl pointer-events-none" />
                                            <HslStringColorPicker 
                                                color={formData.color} 
                                                onChange={(newColor) => setFormData({...formData, color: newColor})} 
                                                className="border-2 rounded-xl border-white/40"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            <div className="rounded-xl p-0.5 bg-linear-to-b to-gray-400 via-gray-600/50 from-gray-400/50">
                                <input
                                    className="px-4 py-2 rounded-xl focus:outline-none bg-gray-200 text-lg border border-white/70"
                                    type="password" 
                                    placeholder="Passwort" value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />                                
                            </div>
                            <div className="rounded-xl p-0.5 bg-linear-to-b to-gray-400 via-gray-600/50 from-gray-400/50">
                                <input 
                                    className="px-4 py-2 rounded-xl focus:outline-none bg-gray-200 text-lg border border-white/70"
                                    type="password" 
                                    placeholder="Passwort bestätigen" value={formData.passwordConfirm}
                                    onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                                />                                
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(imageIcons).map(([key, Icon]) => (
                                <div className="border border-slate-700/20 rounded-2xl hover:scale-105 hover:brightness-103 ease-in-out transition-all">
                                    <div className="relative border border-white/10 p-1 text-gray-600 bg-linear-to-b from-gray-400/60 via-gray-500/70 to-slate-400/40 font-semibold rounded-2xl overflow-hidden" >
                                        <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-xl pointer-events-none" />
                                        <div 
                                            key={key} 
                                            className={`relative border border-slate-700/20 w-24 h-24 rounded-xl flex items-center justify-center cursor-pointer bg-linear-to-b to-slate-300/50 via-gray-100/50 from-gray-300/40 
                                            ${formData.icon === key ? "bg-gray-400/50" : "bg-gray-200/70"}`} 
                                            onClick={() => setFormData({...formData, icon: key})}>
                                            <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/7 pointer-events-none" />
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
                    <div className="rounded-xl p-0.5 bg-linear-to-b to-slate-400/50 via-gray-500/50 from-gray-400/40 hover:brightness-103 transition-all">
                        <button className="relative border border-white/10 px-4 py-2 text-gray-600 bg-linear-to-b from-gray-200/60 via-gray-400/70 to-slate-300/40 font-semibold rounded-xl overflow-hidden" 
                            onClick={() => {handleRegister()}}>
                            <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/15 rounded-t-xl pointer-events-none" />
                            Registrieren
                        </button>
                    </div>
                    <div className="rounded-xl p-0.5 bg-linear-to-b to-slate-400/50 via-gray-500/50 from-gray-400/40 hover:brightness-103 transition-all">
                        <button className="relative border border-white/10 px-4 py-2 text-gray-600 bg-linear-to-b from-gray-200/60 via-gray-400/70 to-slate-300/40 font-semibold rounded-xl overflow-hidden" 
                            onClick={() => navigate("/")}>
                            <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/15 rounded-t-xl pointer-events-none" />
                            Zurück zur Nutzerauswahl
                        </button>                        
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}   

export default RegisterPage