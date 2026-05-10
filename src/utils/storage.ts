export function createStorageManager<T>(key: string) {
    return {
        get: (): T | null => {
            try {
                const item = localStorage.getItem(key)
                return item ? JSON.parse(item) : null
            } catch {
                localStorage.removeItem(key)
                return null
            }
        },
        set: (value: T | null) => {
            if (value === null) {
                localStorage.removeItem(key)
            } else {
                localStorage.setItem(key, JSON.stringify(value))
            }
        },
        clear: () => localStorage.removeItem(key),
    }
}
