import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import GlassButton from "../components/ui/GlassButton"
import FormInput from "../components/ui/FormInput"
import AuthPageLayout from "../components/layout/AuthPageLayout"
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
        pfpIcon: "user", // Icon code instead of emoji
        color: "#3B82F6" // Default blue color
    })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [useCustomAvatar, setUseCustomAvatar] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { isDarkMode } = useDarkMode()
    const { setFamilyId, setUserId, setCurrentUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    
    const state = location.state as LocationState
    
    // Redirect if no family data is available
    if (!state?.familyId) {
        navigate("/newfamily")
        return null
    }

    const text = isDarkMode ? "text-white" : "text-gray-900"
    const muted = isDarkMode ? "text-gray-400" : "text-gray-500"
    const isAddingMember = state.isAddingMember || false

    function validate(): string | null {
        if (!formData.name) return "Bitte einen Namen eingeben."
        
        // Only require PIN for admin registration (not when adding regular members)
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
                email: "", // Not needed for user creation
                familyId: state.familyId,
                pfpIcon: formData.pfpIcon,
                color: formData.color
            }, avatarFile || undefined)

            // The register endpoint switches the backend session to the new user.
            // Clear stale user state and go to profile select so the correct user
            // can re-establish their session (admin re-selects themselves with PIN,
            // or new member logs in for the first time).
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
        if (file) {
            setAvatarFile(file)
            setUseCustomAvatar(true)
            
            // Create preview URL
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    function switchToIcon() {
        setUseCustomAvatar(false)
        setAvatarFile(null)
        setAvatarPreview(null)
    }

    function switchToCustomAvatar() {
        setUseCustomAvatar(true)
    }

    return (
        <AuthPageLayout>
            <motion.div 
                key="user-creation" 
                {...fadeSlideUp} 
                className="flex flex-col items-center gap-4"
                onKeyDown={(e) => e.key === "Enter" && handleCreateUser()}
            >
                <h1 className={`text-2xl font-bold tracking-tight ${text}`}>
                    {isAddingMember ? "Neues Familienmitglied hinzufügen" : "Familienadministrator erstellen"}
                </h1>
                
                <p className={`text-center ${muted} mb-4`}>
                    {isAddingMember 
                        ? `Neues Mitglied zur Familie "${state.familyName}" hinzufügen.`
                        : `Familie "${state.familyName}" wurde erfolgreich erstellt!\nErstelle jetzt den ersten Benutzer als Familienadministrator.`
                    }
                </p>

                <div className="flex flex-row gap-8 h-96">
                    <div className="px-8 flex flex-col gap-4 items-center justify-center">
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
                        
                        <div className="flex flex-row items-center gap-2">
                            <ColorPickerButton
                                color={formData.color}
                                isDarkMode={isDarkMode}
                                onChange={(newColor) => setFormData({...formData, color: newColor})}
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4">
                        {/* Avatar Type Selection */}
                        <div className="flex flex-row gap-2 mb-2">
                            <button
                                type="button"
                                onClick={switchToIcon}
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                    !useCustomAvatar 
                                        ? (isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white")
                                        : (isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700")
                                }`}
                            >
                                Icon
                            </button>
                            <button
                                type="button"
                                onClick={switchToCustomAvatar}
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                    useCustomAvatar 
                                        ? (isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white")
                                        : (isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700")
                                }`}
                            >
                                Eigenes Bild
                            </button>
                        </div>

                        <div className="flex flex-row items-center gap-6">
                            {!useCustomAvatar ? (
                                <IconSelect
                                    selectedIcon={formData.pfpIcon}
                                    isDarkMode={isDarkMode}
                                    onSelect={(iconCode) => setFormData({...formData, pfpIcon: iconCode})}
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="avatar-upload"
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        className={`cursor-pointer px-4 py-2 rounded-lg border-2 border-dashed transition-colors ${
                                            isDarkMode
                                                ? "border-gray-600 hover:border-gray-500 text-gray-300"
                                                : "border-gray-300 hover:border-gray-400 text-gray-600"
                                        }`}
                                    >
                                        {avatarFile ? "Bild ändern" : "Bild hochladen"}
                                    </label>
                                    {avatarFile && (
                                        <span className={`text-xs ${muted}`}>
                                            {avatarFile.name}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Profile Preview */}
                            <div className="flex flex-col items-center gap-2">
                                <span className={`text-xs ${muted}`}>Vorschau:</span>
                                <ProfileCard
                                    name={formData.name || "Dein Name"}
                                    color={formData.color}
                                    icon={useCustomAvatar && avatarPreview ? avatarPreview : formData.pfpIcon}
                                    avatarType={useCustomAvatar ? "URL" : "ICON"}
                                    onSelect={() => {}}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {!isAddingMember && (
                    <div className={`text-xs ${muted} text-center max-w-md`}>
                        <p>Als Familienadministrator benötigst du eine PIN für den sicheren Zugang.</p>
                        <p>Andere Familienmitglieder mit Benutzerrolle benötigen keine PIN.</p>
                    </div>
                )}

                <p className={`text-sm font-semibold ${error ? "text-red-500" : "text-transparent"}`}>
                    {error || "Platzhalter"}
                </p>

                <GlassButton 
                    isDarkMode={!isDarkMode} 
                    onClick={loading ? undefined : handleCreateUser} 
                    className={`px-4 py-2 backdrop-blur-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading 
                        ? "Wird erstellt..." 
                        : isAddingMember 
                            ? "Mitglied hinzufügen" 
                            : "Administrator erstellen"
                    }
                </GlassButton>

                <div className="flex flex-col items-center gap-2 mt-2">
                    <span className={`text-xs ${muted}`}>
                        {isAddingMember ? "Zurück zur Familie verwalten?" : "Zurück zur Familienregistrierung?"}
                    </span>
                    <GlassButton 
                        isDarkMode={!isDarkMode} 
                        onClick={() => isAddingMember ? navigate("/dashboard") : navigate("/register-family")} 
                        className="px-4 py-1.5 text-sm backdrop-blur-sm"
                    >
                        Zurück
                    </GlassButton>
                </div>
            </motion.div>
        </AuthPageLayout>
    )
}

export default RegisterPage
