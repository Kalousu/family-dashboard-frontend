import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import GlassButton from "../components/ui/GlassButton"
import FormInput from "../components/ui/FormInput"
import DarkModeBackground from "../components/ui/DarkModeBackground"
import useDarkMode from "../hooks/useDarkMode"
import IconSelect from "../components/IconSelect"
import ColorPickerButton from "../components/ui/ColorPickerButton"
import ProfileCard from "../components/ProfileCard"
import { fadeSlideUp } from "../constants/animations"
import { register } from "../api/authApi"
import useAuth from "../hooks/useAuth"

interface LocationState {
    familyId: number
    familyName: string
    isAddingMember?: boolean
}

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        pin: "",
        pinWiederholen: "",
        pfpIcon: "user",
        color: "#3B82F6"
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [useCustomAvatar, setUseCustomAvatar] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<"profil" | "icon">("profil")
    const { isDarkMode, toggleDarkMode } = useDarkMode()
    const { setFamilyId, setUserId, setCurrentUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const state = location.state as LocationState

    if (!state?.familyId) {
        navigate("/newfamily")
        return null
    }

    const text = isDarkMode ? "text-white" : "text-gray-900"
    const muted = isDarkMode ? "text-gray-400" : "text-gray-500"
    const isAddingMember = state.isAddingMember || false

    function validate(): string | null {
        if (!formData.name) return "Bitte einen Namen eingeben."
        if (!isAddingMember) {
            if (!formData.pin) return "PIN ist erforderlich für Familienadministratoren."
            if (formData.pin.length < 3) return "PIN muss mindestens 3 Zeichen lang sein."
            if (formData.pin !== formData.pinWiederholen) return "PINs stimmen nicht überein."
        }
        return null
    }

    function handleChange(field: keyof typeof formData) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [field]: e.target.value })
            setError(null)
        }
    }

    async function handleCreateUser() {
        const err = validate()
        if (err) {
            setError(err)
            return
        }

        setLoading(true)
        setError(null)

        try {
            await register({
                name: formData.name,
                pin: isAddingMember ? undefined : formData.pin,
                email: "",
                familyId: state.familyId,
                pfpIcon: formData.pfpIcon,
                color: formData.color
            }, avatarFile || undefined)

            if (!isAddingMember) {
                setFamilyId(state.familyId)
            }
            setUserId(null)
            setCurrentUser(null)
            navigate("/home")
        } catch (error) {
            console.error("Fehler bei der Benutzererstellung:", error)
            setError("Benutzererstellung fehlgeschlagen. Bitte versuchen Sie es erneut.")
        } finally {
            setLoading(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.type !== "image/jpeg") {
            setError("Bitte nur JPG-Dateien hochladen")
            e.target.value = ""
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Foto darf maximal 5 MB groß sein")
            e.target.value = ""
            return
        }
        setAvatarFile(file)
        setUseCustomAvatar(true)
        const reader = new FileReader()
        reader.onload = (ev) => {
            setAvatarPreview(ev.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const currentIcon = useCustomAvatar && avatarPreview ? avatarPreview : formData.pfpIcon
    const currentAvatarType = useCustomAvatar ? "URL" : "ICON"

    return (
        <div className="relative flex flex-col items-center justify-center h-screen gap-8 overflow-hidden">
            <DarkModeBackground />

            {/* Back button — top left */}
            <div className="fixed top-4 left-4 z-50">
                <GlassButton
                    isDarkMode={!isDarkMode}
                    onClick={() => isAddingMember ? navigate("/dashboard") : navigate("/register-family")}
                    className="px-3 py-2 backdrop-blur-sm"
                >
                    <ArrowLeft size={20} className="sm:hidden" />
                    <span className="hidden sm:inline">
                        {isAddingMember ? "Zurück zum Dashboard" : "Zurück zur Familienregistrierung"}
                    </span>
                </GlassButton>
            </div>

            {/* Dark/Light Mode toggle — top right */}
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

            <div className="relative flex flex-col items-center w-full h-full overflow-y-auto pt-20 pb-8">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key="user-creation"
                        {...fadeSlideUp}
                        className="flex flex-col items-center gap-4 w-full px-4 my-auto"
                        onKeyDown={(e) => e.key === "Enter" && handleCreateUser()}
                    >
                        <h1 className={`text-2xl font-bold tracking-tight ${text}`}>
                            {isAddingMember ? "Neues Familienmitglied hinzufügen" : "Familienadministrator erstellen"}
                        </h1>

                        <p className={`text-center ${muted} mb-2`}>
                            {isAddingMember
                                ? `Neues Mitglied zur Familie "${state.familyName}" hinzufügen.`
                                : `Familie "${state.familyName}" wurde erfolgreich erstellt!\nErstelle jetzt den ersten Benutzer als Familienadministrator.`
                            }
                        </p>

                        {/* Tab bar — mobile only */}
                        <div className="sm:hidden flex gap-2 mb-2">
                            {(["profil", "icon"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation min-h-11 capitalize ${
                                        activeTab === tab
                                            ? isDarkMode ? "bg-indigo-500/30 text-white border border-white/20" : "bg-sky-300/50 text-gray-800 border border-sky-400/20"
                                            : isDarkMode ? "bg-white/5 text-gray-400 border border-white/10" : "bg-white/30 text-gray-500 border border-gray-200/30"
                                    }`}
                                >
                                    {tab === "profil" ? "Profil" : "Icon"}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
                            {/* Left column: profile form */}
                            <div className={`${activeTab === "profil" ? "flex" : "hidden"} sm:flex flex-col gap-4 items-center`}>
                                {/* Profile preview */}
                                <div className="scale-100 lg:scale-110 xl:scale-125 mb-2">
                                    <ProfileCard
                                        name={formData.name || "Neues Mitglied"}
                                        color={formData.color}
                                        icon={currentIcon}
                                        avatarType={currentAvatarType}
                                        onSelect={() => {}}
                                        isDarkMode={isDarkMode}
                                        showName={false}
                                    />
                                </div>

                                {/* Upload + color row */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/jpeg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="avatar-upload"
                                    />
                                    <label htmlFor="avatar-upload">
                                        <GlassButton
                                            isDarkMode={!isDarkMode}
                                            onClick={() => document.getElementById("avatar-upload")?.click()}
                                            className="px-4 py-2 backdrop-blur-sm"
                                        >
                                            {avatarFile ? "Bild ändern" : "Hochladen"}
                                        </GlassButton>
                                    </label>
                                    <ColorPickerButton
                                        color={formData.color}
                                        isDarkMode={isDarkMode}
                                        onChange={(newColor) => setFormData({ ...formData, color: newColor })}
                                    />
                                </div>

                                <FormInput
                                    isDarkMode={isDarkMode}
                                    type="text"
                                    placeholder={isAddingMember ? "Name des neuen Mitglieds" : "Dein Name"}
                                    value={formData.name}
                                    onChange={handleChange("name")}
                                />

                                {!isAddingMember && (
                                    <>
                                        <FormInput
                                            isDarkMode={isDarkMode}
                                            type="password"
                                            placeholder="PIN (erforderlich für Admin)"
                                            value={formData.pin}
                                            onChange={handleChange("pin")}
                                        />
                                        <FormInput
                                            isDarkMode={isDarkMode}
                                            type="password"
                                            placeholder="PIN wiederholen"
                                            value={formData.pinWiederholen}
                                            onChange={handleChange("pinWiederholen")}
                                        />
                                    </>
                                )}

                                {error && (
                                    <div className="px-4 py-2 rounded-lg backdrop-blur-sm text-sm bg-red-500/20 text-red-200 border border-red-500/30">
                                        {error}
                                    </div>
                                )}

                                {!isAddingMember && (
                                    <p className={`text-xs ${muted} text-center max-w-xs`}>
                                        Als Familienadministrator benötigst du eine PIN für den sicheren Zugang.
                                    </p>
                                )}

                                <GlassButton
                                    isDarkMode={!isDarkMode}
                                    onClick={loading ? undefined : handleCreateUser}
                                    className={`px-4 py-2 backdrop-blur-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {loading
                                        ? "Wird erstellt..."
                                        : isAddingMember
                                            ? "Mitglied hinzufügen"
                                            : "Administrator erstellen"
                                    }
                                </GlassButton>
                            </div>

                            {/* Right column: icon selector */}
                            <div className={`${activeTab === "icon" ? "flex" : "hidden"} sm:flex flex-col items-center gap-4`}>
                                {/* Preview on icon tab — mobile only */}
                                <div className="sm:hidden">
                                    <ProfileCard
                                        name={formData.name || "Neues Mitglied"}
                                        color={formData.color}
                                        icon={currentIcon}
                                        avatarType={currentAvatarType}
                                        onSelect={() => {}}
                                        isDarkMode={isDarkMode}
                                        showName={false}
                                    />
                                </div>
                                <IconSelect
                                    selectedIcon={formData.pfpIcon}
                                    isDarkMode={isDarkMode}
                                    onSelect={(iconCode) => {
                                        setFormData({ ...formData, pfpIcon: iconCode })
                                        setUseCustomAvatar(false)
                                        setAvatarFile(null)
                                        setAvatarPreview(null)
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default RegisterPage
