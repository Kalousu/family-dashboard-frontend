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
import useAuth from "../hooks/useAuth";
import { updateUserProfile, updateUserProfileWithAvatar, setUserPin } from "../api/userApi";

function UserProfileEditPage() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { currentUser, refreshCurrentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        color: "#3B82F6",
        icon: "user",
    });
    const [pinData, setPinData] = useState({
        currentPin: "",
        newPin: "",
        confirmPin: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [originalData, setOriginalData] = useState({
        name: "",
        color: "#3B82F6",
        icon: "user",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Load current user data
    useEffect(() => {
        if (currentUser) {
            const userData = {
                name: currentUser.name,
                color: currentUser.color || "#3B82F6",
                icon: currentUser.avatarType === 'ICON' ? currentUser.avatar : "user",
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [currentUser]);

    // Clear messages after 3 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;
        if (file.type !== "image/jpeg") {
            setError("Bitte nur JPG-Dateien hochladen");
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Foto darf maximal 5 MB groß sein");
            e.target.value = "";
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await updateUserProfileWithAvatar(currentUser.id, formData.name, formData.color, file);
            await refreshCurrentUser();
            setSuccess("Profilbild erfolgreich aktualisiert!");
            
            // Update formData to reflect the new avatar URL
            // The refreshCurrentUser will trigger the useEffect that updates formData
        } catch (error) {
            setError("Fehler beim Hochladen des Profilbilds");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    }

    async function handleSaveProfile() {
        if (!currentUser) return;

        setLoading(true);
        setError(null);
        try {
            await updateUserProfile(currentUser.id, {
                name: formData.name,
                color: formData.color,
                avatar: currentUser.avatarType === 'URL' ? currentUser.avatar : formData.icon,
                avatarType: currentUser.avatarType || 'ICON'
            });
            await refreshCurrentUser();
            setOriginalData(formData);
            setSuccess("Profil erfolgreich aktualisiert!");
        } catch (error) {
            setError("Fehler beim Speichern des Profils");
        } finally {
            setLoading(false);
        }
    }

    async function handleSetPin() {
        if (!currentUser) return;
        if (pinData.newPin !== pinData.confirmPin) {
            setError("Passwörter stimmen nicht überein");
            return;
        }
        if (pinData.newPin.length < 4) {
            setError("PIN muss mindestens 4 Zeichen lang sein");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await setUserPin(currentUser.id, pinData.newPin);
            setPinData({ currentPin: "", newPin: "", confirmPin: "" });
            setSuccess("PIN erfolgreich geändert!");
        } catch (error) {
            setError("Fehler beim Ändern der PIN");
        } finally {
            setLoading(false);
        }
    }

    function handleDiscard() {
        setFormData(originalData);
        setPinData({ currentPin: "", newPin: "", confirmPin: "" });
        setError(null);
        setSuccess(null);
    }

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    const hasPinData = pinData.newPin || pinData.confirmPin;

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
                                        icon={currentUser?.avatarType === 'URL' ? currentUser.avatar : formData.icon}
                                        avatarType={currentUser?.avatarType || 'ICON'}
                                        isDarkMode={isDarkMode}
                                        onSelect={() => {}}
                                        showName={false}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg"
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
                                {currentUser?.role !== "USER" && (
                                    <>
                                        <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                            <input
                                                className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                                type="password"
                                                placeholder="Aktuelle PIN"
                                                value={pinData.currentPin}
                                                onChange={(e) => setPinData({ ...pinData, currentPin: e.target.value })}
                                            />
                                        </div>
                                        <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                            <input
                                                className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                                type="password"
                                                placeholder="Neue PIN"
                                                value={pinData.newPin}
                                                onChange={(e) => setPinData({ ...pinData, newPin: e.target.value })}
                                            />
                                        </div>
                                        <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
                                            <input
                                                className={`px-4 py-2 rounded-xl focus:outline-none text-lg border ${inputBg}`}
                                                type="password"
                                                placeholder="PIN wiederholen"
                                                value={pinData.confirmPin}
                                                onChange={(e) => setPinData({ ...pinData, confirmPin: e.target.value })}
                                            />
                                        </div>
                                        <GlassButton
                                            isDarkMode={!isDarkMode}
                                            onClick={loading || !hasPinData ? () => {} : handleSetPin}
                                            className={`px-4 py-2 backdrop-blur-sm ${loading || !hasPinData ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? "Wird gespeichert..." : "PIN ändern"}
                                        </GlassButton>
                                    </>
                                )}
                            </div>
                            <IconSelect
                                selectedIcon={formData.icon}
                                isDarkMode={isDarkMode}
                                onSelect={(key) => setFormData({ ...formData, icon: key })}
                            />
                        </div>
                        
                        {/* Error/Success Messages */}
                        {(error || success) && (
                            <div className="flex justify-center mt-4">
                                <div className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
                                    error 
                                        ? 'bg-red-500/20 text-red-200 border border-red-500/30' 
                                        : 'bg-green-500/20 text-green-200 border border-green-500/30'
                                }`}>
                                    {error || success}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-center mt-6">
                            <GlassButton
                                isDarkMode={!isDarkMode}
                                onClick={loading || !hasChanges ? () => {} : handleSaveProfile}
                                className={`px-6 py-2 backdrop-blur-sm ${loading || !hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Wird gespeichert..." : "Speichern"}
                            </GlassButton>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default UserProfileEditPage;
