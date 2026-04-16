import type { Dispatch, SetStateAction } from "react"

export function handleToggle(setter: Dispatch<SetStateAction<boolean>>) {
    setter(prev => !prev)
}

export function handleInviteToggle(
    selectedType: string | null,
    setSelectedType: (value: string | null) => void
) {
    setSelectedType(selectedType === "invite" ? null : "invite")
}
