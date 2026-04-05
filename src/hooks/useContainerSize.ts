import { useState, useRef, useEffect } from "react"

function useContainerSize() {
    const containerSizeRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        if (!containerSizeRef.current) return

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            setSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            })
        })

        observer.observe(containerSizeRef.current)

        return () => {
            observer.disconnect()
        }
    }, [])

    return {
        ref: containerSizeRef,
        width: size.width,
        height: size.height
    }
}

export { useContainerSize }