interface AdminTheme {
    glassCard: string
    shine: string
    textPrimary: string
    textSecondary: string
    border: string
    inputWrapper: string
    inputField: string
    actionButton: string
}

function useAdminTheme(isDarkMode: boolean): AdminTheme {
    return isDarkMode
        ? {
            glassCard: "bg-white/5 border-white/10",
            shine: "bg-white/5",
            textPrimary: "text-gray-200",
            textSecondary: "text-gray-400",
            border: "border-white/10",
            inputWrapper: "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50",
            inputField: "bg-gray-800 text-gray-200 border-white/10",
            actionButton: "border-white/10 text-gray-400 hover:text-gray-200",
        }
        : {
            glassCard: "bg-sky-100/40 border-cyan-950/20",
            shine: "bg-white/30",
            textPrimary: "text-gray-700",
            textSecondary: "text-gray-500",
            border: "border-cyan-950/10",
            inputWrapper: "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30",
            inputField: "bg-white text-gray-700 border-cyan-950/5",
            actionButton: "border-cyan-950/10 text-gray-500 hover:text-gray-700",
        }
}

export default useAdminTheme

