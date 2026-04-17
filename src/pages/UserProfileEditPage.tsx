import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GlassButton from "../components/ui/GlassButton";
import ColorPickerButton from "../components/ui/ColorPickerButton";
import ProfileCard from "../components/ProfileCard";
import IconSelect from "../components/IconSelect";
import dashboardBgLight from "../assets/dashboardbglight.png";
import dashboardBgDark from "../assets/dashboardbgdark.png";

function TextLabel({ isDarkMode, children }: { isDarkMode: boolean; children: React.ReactNode }) {
    return (
        <span className={`relative px-4 py-2 text-sm font-semibold w-40 rounded-xl border-2 ${isDarkMode ? "bg-linear-to-b from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700 border-cyan-950/5" : "bg-linear-to-b from-gray-500/50 via-gray-600/20 to-blue-400/20 text-gray-200 border-white/10"}`}>
            <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/30" : "bg-white/5"}`} />
            {children}
        </span>
    );
}

function UserProfileEditPage() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "Daniel",
        email: "daniel.example@gmail.com",
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
        <div className="relative flex flex-col h-screen overflow-hidden">
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

            {/* Top bar */}
            <div className="relative flex items-center justify-between p-4">
                <GlassButton isDarkMode={!isDarkMode} onClick={() => navigate("/dashboard")} className="px-4 py-2 backdrop-blur-sm">
                    Zurück zum Dashboard
                </GlassButton>

                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {isDarkMode ? "Dark Mode" : "Light Mode"}
                    </span>
                    <div
                        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${isDarkMode ? "bg-slate-500/50" : "bg-cyan-950/20"}`}
                        onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                        <motion.div
                            className={`w-5 h-5 rounded-full ${isDarkMode ? "bg-gray-300" : "bg-white"}`}
                            animate={{ x: isDarkMode ? 20 : 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-[8vw]">
                <div className="flex items-center justify-center gap-[2vw] w-full max-w-3xl">
                    <div className="flex flex-col items-center gap-6">
                        <div className="scale-100 lg:scale-110 xl:scale-125">
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
                    </div>

                    <div className="flex flex-col gap-4 w-[40vw] sm:w-[30vw] md:w-[25vw] lg:w-[20vw] min-w-45 max-w-72">
                        <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                            <input
                                className={`w-full px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                            <input
                                className={`w-full px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                type="email"
                                placeholder="E-Mail (optional)"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <GlassButton isDarkMode={!isDarkMode} onClick={() => {}} className="w-full px-4 py-2 backdrop-blur-sm">
                            Passwort ändern
                        </GlassButton>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-lg">
                    <div className="flex items-center gap-3">
                        <div className={`flex-1 rounded-xl p-0.5 ${inputWrapper}`}>
                            <input className={`w-full px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`} type="password" placeholder="Aktuelles Passwort" />
                        </div>
                        <TextLabel isDarkMode={!isDarkMode}>Aktuelles Passwort</TextLabel>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex-1 rounded-xl p-0.5 ${inputWrapper}`}>
                            <input className={`w-full px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`} type="password" placeholder="Neues Passwort" />
                        </div>
                        <TextLabel isDarkMode={!isDarkMode}>Neues Passwort</TextLabel>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex-1 rounded-xl p-0.5 ${inputWrapper}`}>
                            <input className={`w-full px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`} type="password" placeholder="Passwort wiederholen" />
                        </div>
                        <TextLabel isDarkMode={!isDarkMode}>Passwort wiederholen</TextLabel>
                    </div>
                </div>

                <IconSelect
                    selectedIcon={formData.icon}
                    isDarkMode={isDarkMode}
                    onSelect={(key) => setFormData({ ...formData, icon: key })}
                />
            </div>

            {/* Bottom buttons */}
            <div className="relative flex justify-center gap-4 p-6">
                <GlassButton isDarkMode={!isDarkMode} onClick={() => {}} className="px-6 py-2 backdrop-blur-sm">
                    Speichern
                </GlassButton>
                <GlassButton isDarkMode={!isDarkMode} onClick={() => {}} className="px-6 py-2 backdrop-blur-sm">
                    Verwerfen
                </GlassButton>
            </div>
        </div>
    );
}

export default UserProfileEditPage;
