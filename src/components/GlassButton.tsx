import { ReactNode } from "react";

interface GlassButtonProps {
    onClick: () => void;
    children: ReactNode;
}

function GlassButton({ onClick, children }: GlassButtonProps) {
    return (
        <div className="rounded-xl p-0.5 bg-linear-to-b to-slate-400/50 via-gray-500/50 from-gray-400/40 hover:brightness-103 transition-all">
            <button
                className="relative border border-white/10 px-4 py-2 text-gray-600 bg-linear-to-b from-gray-200/60 via-gray-400/70 to-slate-300/40 font-semibold rounded-xl overflow-hidden"
                onClick={onClick}
            >
                <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/15 rounded-t-xl pointer-events-none" />
                {children}
            </button>
        </div>
    );
}

export default GlassButton;
