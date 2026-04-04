import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import imageIcons from "../constants/imageIcons";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        role: "Mitglied",
        password: "",
        passwordConfirm: "",
        image: ""
    })

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-8 bg-linear-to-b from-gray-400 to-gray-200">
            <AnimatePresence mode="popLayout">
                <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{opacity: 0, y: -20}} className="flex flex-col items-center gap-4 justify-center">
                    <div className="m-32 flex flex-row items-center gap-8">
                        <div className="p-16 flex flex-col gap-4 items-center">
                            <input 
                                className="px-4 py-2 rounded-xl border-2 border-gray-400 focus:outline-none bg-gray-200 text-lg"
                                type="text" 
                                placeholder="Name" value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <select 
                                className="px-3 py-1.5 rounded-xl border border-gray-400 focus:outline-none bg-gray-400"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="Mitglied">Mitglied</option>
                                <option value="Familienadministrator">Familienadministrator</option>
                                <option value="Systemadministrator">Systemadministrator</option>
                            </select>
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
                            <button className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors border-2 border-gray-400"
                                onClick={() => {
                                    if (formData.password !== formData.passwordConfirm) {
                                        alert("Passwörter stimmen nicht überein.")
                                    }
                                    else if (formData.name === "" || formData.password === "") {
                                        alert("Bitte alle Felder ausfüllen.")
                                    }
                                    else {
                                        alert(`Registrieren mit Name: ${formData.name} und Passwort: ${formData.password} als ${formData.role} mit dem Icon ${formData.image}`)
                                    }
                            }}>Registrieren</button>
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
                    <button className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition-colors border-2 border-gray-400">
                        Zurück zur Nutzerauswahl
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default RegisterPage