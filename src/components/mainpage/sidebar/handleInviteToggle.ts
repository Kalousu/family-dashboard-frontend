export function handleInviteToggle(
    selectedType: string | null,
    setSelectedType: (value: string | null) => void
) {
    setSelectedType(selectedType === "invite" ? null : "invite")
}
