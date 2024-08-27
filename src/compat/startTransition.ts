import { startTransition as reactStartTransition } from "react"

export const safeStartTransition = (callback: () => void) => {
    if (typeof reactStartTransition === "function") {
        reactStartTransition(callback)
    } else {
        // if reactStartTransition is not available, just call the callback
        callback()
    }
}
