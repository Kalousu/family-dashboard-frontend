import type { InputHTMLAttributes } from "react"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    isDarkMode?: boolean
}

function FormInput({ isDarkMode = false, className, ...props }: FormInputProps) {
    const inputBg = isDarkMode
        ? "bg-gray-800 text-gray-200 border-white/10"
        : "bg-white text-gray-700 border-cyan-950/5"
    const inputWrapper = isDarkMode
        ? "bg-linear-to-b to-gray-700 via-gray-800/50 from-gray-700/50"
        : "bg-linear-to-b from-sky-200/50 via-slate-400/15 to-blue-400/30"

    return (
        <div className={`rounded-xl p-0.5 ${inputWrapper}`}>
            <input
                className={`px-4 py-2 rounded-xl focus:outline-none border ${inputBg} ${className ?? "text-lg"}`}
                {...props}
            />
        </div>
    )
}

export default FormInput
