import type { ChangeEvent } from "react"
import { Search } from "lucide-react"
import type { GeoLocation } from "./weatherTypes"

interface LocationSearchProps {
    inputCity: string
    searchResults: GeoLocation[]
    showDropdown: boolean
    compact?: boolean
    dropdownRef?: React.RefObject<HTMLDivElement | null>
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    onLocationSelect: (geo: GeoLocation) => void
}

export function LocationSearch({
    inputCity,
    searchResults,
    showDropdown,
    compact = false,
    dropdownRef,
    onInputChange,
    onLocationSelect,
}: LocationSearchProps) {
    const dropdown = showDropdown && searchResults.length > 0 && (
        <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full mt-1 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden z-50"
        >
            {searchResults.map((geo) => (
                <div
                    key={geo.latitude + "-" + geo.longitude}
                    onClick={() => onLocationSelect(geo)}
                    className="px-3 py-1.5 text-white text-xs cursor-pointer hover:bg-white/30"
                >
                    {geo.name}{geo.admin1 ? `, ${geo.admin1}` : ""}{!compact && geo.country ? `, ${geo.country}` : ""}
                </div>
            ))}
        </div>
    )

    if (compact) {
        return (
            <div className="relative w-full shrink-0">
                <div className="border-2 border-white/20 focus-within:border-white/60 rounded-xl flex flex-row items-center transition-all">
                    <input
                        value={inputCity}
                        onChange={onInputChange}
                        className="bg-transparent text-white placeholder:text-white/50 transition-all px-2 py-1.5 text-sm font-bold w-full focus:outline-none rounded-xl"
                        placeholder="Stadt..."
                    />
                </div>
                {dropdown}
            </div>
        )
    }

    return (
        <div className="relative flex flex-row items-center gap-2 mb-4 shrink-0">
            <div className="justify-between border-4 border-white/20 focus:outline-none focus:border-white/60 rounded-xl flex flex-row items-center gap-2 transition-all flex-1">
                <input
                    value={inputCity}
                    onChange={onInputChange}
                    className="bg-transparent text-white placeholder:text-white/50 transition-all p-3 text-3xl font-bold w-full max-w-xs focus:outline-none rounded-xl"
                    placeholder="Stadt eingeben..."
                />
                <Search color="white" size={32} className="p-3 rounded-xl transition-all cursor-pointer focus:outline-none" />
            </div>
            {showDropdown && searchResults.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 top-full mt-1 bg-white/20 backdrop-blur-md rounded-xl overflow-hidden z-50"
                >
                    {searchResults.map((geo) => (
                        <div
                            key={geo.latitude + "-" + geo.longitude}
                            onClick={() => onLocationSelect(geo)}
                            className="px-4 py-2 text-white cursor-pointer hover:bg-white/30"
                        >
                            {geo.name}, {geo.admin1}, {geo.country}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
