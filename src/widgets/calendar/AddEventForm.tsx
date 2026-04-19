import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { ChevronLeft, CirclePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HslStringColorPicker } from "react-colorful";
import GlassButton from "../../components/ui/GlassButton";
import { COLOR_OPTIONS } from "./calendarUtils";

type Props = {
    isDarkMode: boolean;
    editingEventId: string | null;
    formTitle: string;
    onTitleChange: (v: string) => void;
    formAllDay: boolean;
    onAllDayToggle: () => void;
    formTime: string;
    onTimeChange: (newTime: string) => void;
    formColor: string;
    onColorChange: (color: string) => void;
    showColorPicker: boolean;
    onPickerButtonClick: () => void;
    onColorPickerClose: () => void;
    localPickerColor: string;
    onPickerColorChange: (color: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    anchorRect?: DOMRect | null;
};

function AddEventForm({
    isDarkMode, editingEventId,
    formTitle, onTitleChange,
    formAllDay, onAllDayToggle,
    formTime, onTimeChange,
    formColor, onColorChange,
    showColorPicker, onPickerButtonClick, onColorPickerClose,
    localPickerColor, onPickerColorChange,
    onSubmit, onCancel, anchorRect,
}: Props) {
    const [hours, minutes] = formTime.split(":");
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = popupRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            console.log("AddEventForm size:", { width, height });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const x = anchorRect ? anchorRect.left + anchorRect.width / 2 : null;
    const y = anchorRect ? anchorRect.top + anchorRect.height / 2 : null;

    return createPortal(
        <div
            style={x !== null && y !== null ? { "--px": `${x}px`, "--py": `${y}px` } as React.CSSProperties : undefined}
            className={x !== null ? "fixed left-(--px) top-(--py) -translate-x-1/2 -translate-y-1/2 z-50 w-fit min-w-72" : "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-fit min-w-72"}
        >
        <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-xl backdrop-blur-md bg-linear-to-b from-teal-700/90 to-cyan-700/80 border border-white/20 flex flex-col p-4 gap-4"
            onKeyDown={e => { if (e.key === "Enter") onSubmit(); }}
        >
            <div className="flex items-center gap-2">
                <GlassButton isDarkMode={isDarkMode} onClick={onCancel} className="p-1 text-white">
                    <ChevronLeft size={18} />
                </GlassButton>
                <span className="text-white font-bold text-base flex-1">
                    {editingEventId ? "Termin bearbeiten" : "Neuer Termin"}
                </span>
                <motion.button
                    whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={onSubmit}
                    className="text-white/40 hover:text-white/80 transition-colors"
                >
                    <CirclePlus size={18} />
                </motion.button>
            </div>

            <input
                type="text"
                value={formTitle}
                onChange={e => onTitleChange(e.target.value)}
                placeholder="Titel hinzufügen"
                className="w-full bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/40 outline-none focus:ring-1 focus:ring-white/30"
            />

            <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Ganztägig</span>
                <button
                    onClick={onAllDayToggle}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${formAllDay ? "bg-cyan-400" : "bg-white/20"}`}
                >
                    <motion.div
                        animate={{ x: formAllDay ? 20 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                    />
                </button>
            </div>

            <AnimatePresence initial={false} mode="popLayout">
                {!formAllDay && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scaleY: 0.7 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.7 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{ transformOrigin: "top" }}
                        className="flex items-center justify-between"
                    >
                        <span className="text-white/80 text-sm">Uhrzeit</span>
                        <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5">
                            <input
                                type="number" min={0} max={23}
                                value={hours}
                                onChange={e => {
                                    const h = Math.min(23, Math.max(0, parseInt(e.target.value) || 0)).toString().padStart(2, "0");
                                    onTimeChange(`${h}:${minutes}`);
                                }}
                                className="w-8 bg-transparent text-white text-sm text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <span className="text-white/60 text-sm font-bold">:</span>
                            <input
                                type="number" min={0} max={59}
                                value={minutes}
                                onChange={e => {
                                    const m = Math.min(59, Math.max(0, parseInt(e.target.value) || 0)).toString().padStart(2, "0");
                                    onTimeChange(`${hours}:${m}`);
                                }}
                                className="w-8 bg-transparent text-white text-sm text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div layout className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                    {COLOR_OPTIONS.map(color => (
                        <motion.button
                            key={color}
                            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                            onClick={() => onColorChange(color)}
                            className="w-6 h-6 rounded-full border-2 transition-all"
                            style={{ backgroundColor: color, borderColor: formColor === color ? "white" : "transparent" }}
                        />
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={onPickerButtonClick}
                    className="w-6 h-6 rounded-full border-2 transition-all"
                    style={{ backgroundColor: localPickerColor, borderColor: localPickerColor === formColor ? "white" : "transparent" }}
                />
            </motion.div>

            <AnimatePresence>
                {showColorPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center justify-center z-10 rounded-xl bg-black/20 backdrop-blur-xs"
                        onClick={onColorPickerClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="rounded-xl p-2 bg-teal-900/90 border border-white/20"
                            onMouseDown={e => e.stopPropagation()}
                            onClick={e => e.stopPropagation()}
                        >
                            <HslStringColorPicker
                                color={localPickerColor}
                                onChange={onPickerColorChange}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
        </div>,
        document.body
    );
}

export default AddEventForm;
