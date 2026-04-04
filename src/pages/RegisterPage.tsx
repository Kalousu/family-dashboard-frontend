import { useState, useRef, useEffect } from "react";
import { HslStringColorPicker } from "react-colorful";
import { motion, AnimatePresence } from "framer-motion";
import imageIcons from "../constants/imageIcons";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        role: "Mitglied",
        password: "",
        passwordConfirm: "",
        image: "",
        color: "hsl(0, 0%, 50%)"
    })
    const [showColorPicker, setShowColorPicker] = useState(false)
    const colorPickerRef = useRef<HTMLDivElement>(null)

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
                    <div className="m-32 flex flex-row items-center gap-8">
                        <div className="p-16 flex flex-col gap-4 items-center">
                            <input 
                                className="px-4 py-2 rounded-xl border-2 border-gray-400 focus:outline-none bg-gray-200 text-lg"
                                type="text" 
                                placeholder="Name" value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <div className="flex flex-row items-center gap-2">
                                <select 
                                    className="px-3 py-1.5 rounded-xl border border-gray-400 focus:outline-none bg-gray-400"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="Mitglied">Mitglied</option>
                                    <option value="Familienadministrator">Familienadministrator</option>
                                    <option value="Systemadministrator">Systemadministrator</option>
                                </select>
                                <div className="relative" ref={colorPickerRef}>
                                    <div 
                                        className="w-9 h-9 rounded-xl cursor-pointer border-2 border-gray-400"
                                        style={{ backgroundColor: formData.color }}
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                    />
                                    {showColorPicker && (
                                        <motion.div key="colorpicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -10}} className="absolute top-12 left-0 z-50 rounded-xl p-2 bg-linear-to-b from-gray-300 to-gray-400">
                                            <HslStringColorPicker 
                                                color={formData.color} 
                                                onChange={(newColor) => setFormData({...formData, color: newColor})} 
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            <input
                                className="px-4 py-2 rounded-xl border-2 border-gray-400 focus:outline-none bg-gray-200 text-lg"
                                type="password" 
                                placeholder="Passwort" value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <input 
                                className="px-4 py-2 rounded-xl border-2 border-gray-400 focus:outline-none bg-gray-200 text-lg"
                                type="password" 
                                placeholder="Passwort bestätigen" value={formData.passwordConfirm}
                                onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(imageIcons).map(([key, Icon]) => (
                                <div 
                                    key={key} 
                                    className={`w-24 h-24 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 ease-in-out transition-all hover:bg-gray-300 
                                    ${formData.image === key ? "bg-gray-400" : "bg-gray-200"}`} 
                                    onClick={() => setFormData({...formData, image: key})}>
                                    <Icon size={48} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors border-3 border-gray-400 text-lg"
                        onClick={() => {
                            if (formData.password !== formData.passwordConfirm) {
                                alert("Passwörter stimmen nicht überein.")
                            }
                            else if (formData.name === "" || formData.password === "") {
                                alert("Bitte alle Felder ausfüllen.")
                            }
                            else {
                                alert(`Registrieren mit Name: ${formData.name} und Passwort: ${formData.password} als ${formData.role} mit dem Icon ${formData.image} und der Farbe ${formData.color}`)
                            }
                    }}>Registrieren</button>
                    <button className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors ">
                        Zurück zur Nutzerauswahl
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default RegisterPage