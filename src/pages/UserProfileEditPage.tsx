import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GlassButton from "../components/ui/GlassButton";
import ColorPickerButton from "../components/ui/ColorPickerButton";
import ProfileCard from "../components/ProfileCard";
import IconSelect from "../components/IconSelect";
import dashboardBgLight from "../assets/dashboardbglight.png";
import dashboardBgDark from "../assets/dashboardbgdark.png";
import useDarkMode from "../hooks/useDarkMode";

function UserProfileEditPage() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [formData, setFormData] = useState({
        name: "",
        color: "hsl(50, 100%, 50%)",
        icon: "sun",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) alert(`Datei ausgewählt: ${file.name}`);
        e.target.value = "";
    }

    useEffect(() => {
        const img1 = new Image();
        const img2 = new Image();
        img1.src = dashboardBgDark;
        img2.src = dashboardBgLight;
    }, []);

    const inputWrapper = isDarkMode
        ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50"
        : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30";
    const inputBg = isDarkMode
        ? "bg-gray-800 text-gray-200 border-white/10"
        : "bg-white text-gray-700 border-cyan-950/5";

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

            <div className="fixed top-4 left-4 z-50">
                <GlassButton isDarkMode={!isDarkMode} onClick={() => navigate("/dashboard")} className="px-4 py-2 backdrop-blur-sm">
                    Zurück zum Dashboard
                </GlassButton>
            </div>

            <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
                <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <div
                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${isDarkMode ? "bg-slate-500/50" : "bg-cyan-950/20"}`}
                    onClick={toggleDarkMode}
                >
                    <motion.div
                        className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-gray-300" : "bg-white"}`}
                        animate={{ x: isDarkMode ? 20 : 0 }}
                        transition={{ duration: 0.2 }}
                    />
                </div>
            </div>

            <div className="relative flex flex-col items-center justify-center w-full h-full gap-8 pb-16">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center gap-4 justify-center"
                    >
                        <div className="flex flex-row items-center gap-8">
                            <div className="px-8 flex flex-col gap-4 items-center">
                                <div className="scale-100 lg:scale-110 xl:scale-125 mb-2">
                                    <ProfileCard
                                        name={formData.name || "User"}
                                        color={formData.color}
                                        icon={formData.icon}
                                        isDarkMode={isDarkMode}
                                        onSelect={() => {}}
                                        showName={false}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <GlassButton isDarkMode={!isDarkMode} onClick={() => fileInputRef.current?.click()} className="px-4 py-2 backdrop-blur-sm">
                                        Hochladen
                                    </GlassButton>
                                    <ColorPickerButton
                                        color={formData.color}
                                        isDarkMode={isDarkMode}
                                        onChange={(newColor) => setFormData({ ...formData, color: newColor })}
                                    />
                                </div>
                                <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                    <input
                                        className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                        type="text"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                    <input className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`} type="password" placeholder="Aktuelles Passwort" />
                                </div>
                                <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                    <input className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`} type="password" placeholder="Neues Passwort" />
                                </div>
                                <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                    <input className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`} type="password" placeholder="Passwort wiederholen" />
                                </div>
                                <GlassButton isDarkMode={!isDarkMode} onClick={() => {}} className="px-4 py-2 backdrop-blur-sm">
                                    Passwort ändern
                                </GlassButton>
                            </div>
                            <IconSelect
                                selectedIcon={formData.icon}
                                isDarkMode={isDarkMode}
                                onSelect={(key) => setFormData({ ...formData, icon: key })}
                            />
                        </div>
                        <div className="flex justify-center gap-4 mt-10">
                            <GlassButton isDarkMode={!isDarkMode} onClick={() => {}} className="px-6 py-2 backdrop-blur-sm">
                                Speichern
                            </GlassButton>
                            <GlassButton isDarkMode={!isDarkMode} onClick={() => {}} className="px-6 py-2 backdrop-blur-sm">
                                Verwerfen
                            </GlassButton>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default UserProfileEditPage;
