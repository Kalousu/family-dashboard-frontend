import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HslStringColorPicker } from "react-colorful";

interface ColorPickerButtonProps {
    color: string;
    isDarkMode: boolean;
    onChange: (color: string) => void;
}

function ColorPickerButton({ color, isDarkMode, onChange }: ColorPickerButtonProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showColorPicker]);

    return (
        <div className="relative" ref={colorPickerRef}>
            <div
                className={`w-11 h-11 rounded-xl cursor-pointer border-2 touch-manipulation ${isDarkMode ? "border-gray-600" : "border-gray-400"}`}
                style={{ backgroundColor: color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
                <>
                    {/* Backdrop zum Schließen — nur auf Smartphones */}
                    <div
                        className="fixed inset-0 z-40 sm:hidden"
                        onClick={() => setShowColorPicker(false)}
                    />
                    <motion.div
                        key="colorpicker"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 sm:absolute sm:translate-x-0 sm:translate-y-0 sm:top-12 sm:left-0 rounded-xl p-2 bg-linear-to-b ${isDarkMode ? "from-gray-700 to-gray-800" : "from-sky-200/60 to-blue-300/40"}`}
                    >
                        <div className={`absolute rounded-xl inset-x-0 top-0 h-1/2 rounded-t-xl pointer-events-none ${isDarkMode ? "bg-white/5" : "bg-white/30"}`} />
                        <HslStringColorPicker
                            color={color}
                            onChange={onChange}
                            className="border-2 rounded-xl border-white/40"
                        />
                    </motion.div>
                </>
            )}
        </div>
    );
}

export default ColorPickerButton;
