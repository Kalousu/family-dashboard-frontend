import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import GlassButton from "../components/ui/GlassButton"
import DarkModeToggle from "../components/ui/DarkModeToggle"
import useDarkMode from "../hooks/useDarkMode"
import logo from "../assets/logo.png"
import imageIcons from "../constants/imageIcons"

const ICON_CONFIGS: {
    key: keyof typeof imageIcons
    color: string
    x: number
    y: number
    duration: number
    delay: number
}[] = [
    { key: "gamepad", color: "#6366f1", x: 12, y: 15, duration: 3.2, delay: 0.0 },
    { key: "dog",     color: "#f97316", x: 65, y: 10, duration: 2.8, delay: 0.5 },
    { key: "sun",     color: "#eab308", x: 75, y: 55, duration: 3.6, delay: 1.0 },
    { key: "flower",  color: "#ec4899", x: 8,  y: 60, duration: 3.0, delay: 0.3 },
    { key: "cat",     color: "#22c55e", x: 42, y: 68, duration: 2.6, delay: 0.8 },
]

function FloatingIconTile({ iconKey, color, initialX, initialY, duration, delay }: {
    iconKey: keyof typeof imageIcons
    color: string
    initialX: number
    initialY: number
    duration: number
    delay: number
}) {
    const Icon = imageIcons[iconKey]
    const [pos, setPos] = useState({ x: initialX, y: initialY })

    const handleClick = () => {
        setPos({ x: 5 + Math.random() * 72, y: 5 + Math.random() * 72 })
    }

    return (
        // Outer div: handles position — springs to new position on click
        <motion.div
            className="absolute cursor-pointer"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            transition={{ type: "spring", stiffness: 160, damping: 16 }}
            onClick={handleClick}
            whileTap={{ scale: 0.82 }}
        >
            {/* Inner div: entry fade-in + continuous float */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: [-8, 8, -8],
                    rotate: [-2, 2, -2],
                }}
                transition={{
                    opacity:  { duration: 0.4, delay },
                    scale:    { duration: 0.4, delay },
                    y:        { duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
                    rotate:   { duration: duration * 1.3, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
                }}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 hover:bg-white/14 transition-colors"
            >
                <Icon
                    size={28}
                    className="rounded-lg p-1"
                    style={{ backgroundColor: color, color: "white" }}
                />
            </motion.div>
        </motion.div>
    )
}

function LandingPage() {
    const { isDarkMode } = useDarkMode()
    const navigate = useNavigate()

    const bg = isDarkMode ? "bg-[#111316]" : "bg-[#f5f3ee]"
    const text = isDarkMode ? "text-white" : "text-gray-900"
    const muted = isDarkMode ? "text-gray-400" : "text-gray-500"
    const navBorder = isDarkMode ? "border-white/8" : "border-black/8"
    const cardBg = isDarkMode ? "bg-[#1a1d21]" : "bg-[#1a1d21]"

    return (
        <div className={`min-h-screen ${bg} transition-colors duration-500`}>

            {/* ── NAVBAR ── */}
            <nav className={`flex items-center justify-between px-6 sm:px-10 py-4 border-b ${navBorder}`}>
                <div className="flex items-center gap-2.5">
                    <img src={logo} alt="FamilyConnect" className="w-7 h-7 object-contain" />
                    <span className={`font-semibold text-sm tracking-tight ${text}`}>FamilyConnect</span>
                </div>

                <div className="flex items-center gap-3">
                    <DarkModeToggle />
                </div>
            </nav>

            {/* ── HERO ── */}
            <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-20 pb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                {/* Left — text */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 flex flex-col gap-6"
                >
                    <h1 className={`text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight ${text}`}>
                        Dein digitales Zuhause für die ganze Familie
                    </h1>

                    <p className={`text-base sm:text-lg max-w-md leading-relaxed ${muted}`}>
                        Termine, Aufgaben und Routinen – einfach eingerichtet, intuitiv bedienbar.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <GlassButton
                            isDarkMode={!isDarkMode}
                            onClick={() => navigate("/login")}
                            className="px-6 py-2.5 text-sm font-semibold"
                        >
                            Jetzt starten
                        </GlassButton>
                        <GlassButton
                            isDarkMode={!isDarkMode}
                            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                            className="px-6 py-2.5 text-sm font-semibold"
                        >
                            Mehr erfahren
                        </GlassButton>
                    </div>
                </motion.div>

                {/* Right — dark card with floating icons */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                    className={`flex-1 w-full max-w-xl aspect-[4/3] rounded-3xl ${cardBg} relative overflow-hidden`}
                >
                    {/* Beam / glow in center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 rounded-full bg-sky-500/10 blur-3xl" />
                        <div className="absolute w-40 h-96 bg-white/4 rotate-[30deg] blur-2xl" />
                        <div className="absolute w-40 h-96 bg-sky-300/5 -rotate-[20deg] blur-2xl" />
                    </div>

                    {/* Floating icon tiles */}
                    {ICON_CONFIGS.map((item) => (
                        <FloatingIconTile
                            key={item.key}
                            iconKey={item.key}
                            color={item.color}
                            initialX={item.x}
                            initialY={item.y}
                            duration={item.duration}
                            delay={item.delay}
                        />
                    ))}
                </motion.div>
            </main>

            {/* ── FEATURES ── */}
            <section id="features" className={`border-t ${navBorder} px-6 sm:px-10 py-24`}>
                <div className="max-w-7xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-16"
                    >
                        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${text}`}>
                            Alles was deine Familie braucht
                        </h2>
                        <p className={`mt-3 text-base max-w-lg ${muted}`}>
                            Ein Dashboard. Alle Familienmitglieder. Keine Zettelwirtschaft mehr.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: "📅", title: "Familienkalender", desc: "Alle Termine auf einen Blick – von der Schule bis zum Zahnarzt." },
                            { icon: "✅", title: "Aufgaben", desc: "Verteilt und verfolgt To-Dos gemeinsam als Familie." },
                            { icon: "🔁", title: "Routinen", desc: "Tägliche Abläufe für Kinder und Erwachsene strukturiert festhalten." },
                            { icon: "👨‍👩‍👧", title: "Familienprofile", desc: "Jedes Mitglied hat sein eigenes Profil und seine eigene Ansicht." },
                        ].map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className={`rounded-2xl p-6 border ${navBorder} hover:border-sky-400/40 transition-colors`}
                            >
                                <span className="text-3xl">{f.icon}</span>
                                <h3 className={`mt-4 font-semibold text-base ${text}`}>{f.title}</h3>
                                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ── */}
            <section className={`border-t ${navBorder} px-6 sm:px-10 py-24`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
                >
                    <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${text}`}>
                        Bereit loszulegen?
                    </h2>
                    <p className={`text-base ${muted}`}>
                        Erstelle dein Familienprofil in wenigen Minuten und starte noch heute.
                    </p>
                    <GlassButton
                        isDarkMode={!isDarkMode}
                        onClick={() => navigate("/login")}
                        className="px-8 py-3 text-sm font-semibold"
                    >
                        Kostenlos starten
                    </GlassButton>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer className={`border-t ${navBorder} px-6 sm:px-10 py-6 flex items-center justify-between text-sm ${muted}`}>
                <div className="flex items-center gap-2">
                    <img src={logo} alt="" className="w-5 h-5 object-contain opacity-60" />
                    <span>FamilyConnect</span>
                </div>
                <span>© 2025</span>
            </footer>
        </div>
    )
}

export default LandingPage
