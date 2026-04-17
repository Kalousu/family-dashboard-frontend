import type { Dispatch, SetStateAction } from "react"

export function handleToggle(setter: Dispatch<SetStateAction<boolean>>) {
    setter(prev => !prev)
}
