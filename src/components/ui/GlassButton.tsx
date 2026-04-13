interface GlassButtonProps {
    isDarkMode: boolean
    onClick?: () => void
    children: React.ReactNode
    className?: string
}

function GlassButton({ isDarkMode, onClick, children, className = "" }: GlassButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`relative font-semibold rounded-xl border-2 hover:scale-102 hover:brightness-110 transition-all ease-in-out duration-200
                ${isDarkMode
                    ? "bg-linear-to-b from-sky-200/30 via-slate-400/15 to-blue-400/20 text-gray-700 border-cyan-950/5"
                    : "bg-linear-to-b from-gray-500/50 via-gray-600/20 to-blue-400/20 text-gray-200 border-white/10"
                } ${className}`}
        >
            <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/30" : "bg-white/5"}`} />
            {children}
        </button>
    )
}

export default GlassButton
