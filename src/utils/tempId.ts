let tempCounter = 0

export function generateTempWidgetId(): string {
    return String(-(++tempCounter))
}

export function isTempWidget(id: string): boolean {
    return Number(id) < 0
}
