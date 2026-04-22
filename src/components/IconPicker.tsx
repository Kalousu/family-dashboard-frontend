import imageIcons from "../constants/imageIcons";

interface IconPickerProps {
    selectedIcon: string;
    onSelect: (key: string) => void;
}

function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {Object.entries(imageIcons).map(([key, Icon]) => (
                <div key={key} className="border border-slate-700/20 rounded-2xl hover:scale-105 hover:brightness-103 ease-in-out transition-all">
                    <div className="relative border border-white/10 p-1 text-gray-600 bg-linear-to-b from-gray-400/60 via-gray-500/70 to-slate-400/40 font-semibold rounded-2xl overflow-hidden">
                        <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-xl pointer-events-none" />
                        <div
                            className={`relative border border-slate-700/20 w-24 h-24 rounded-xl flex items-center justify-center cursor-pointer bg-linear-to-b to-slate-300/50 via-gray-100/50 from-gray-300/40
                            ${selectedIcon === key ? "bg-gray-400/50" : "bg-gray-200/70"}`}
                            onClick={() => onSelect(key)}
                        >
                            <div className="absolute rounded-xl inset-x-0 top-0 h-1/2 bg-white/7 pointer-events-none" />
                            <Icon size={48} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default IconPicker;
