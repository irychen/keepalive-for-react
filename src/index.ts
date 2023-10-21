import KeepAlive from "./components/KeepAlive"
import { useEffect, useRef } from "react"
import { useKeepAliveContext } from "./components/KeepAliveProvider"

export const useOnActive = (cb: () => any, skipMount = true) => {
    const domRef = useRef<HTMLDivElement>(null)
    const { activeName } = useKeepAliveContext()
    const isMount = useRef(false)
    useEffect(() => {
        let destroyCb: any
        const parent = domRef.current?.parentElement
        const name = parent?.id
        if (parent && name) {
            if (activeName === name) {
                if (skipMount) {
                    if (isMount.current) destroyCb = cb()
                } else {
                    destroyCb = cb()
                }
                isMount.current = true
                return () => {
                    if (destroyCb && typeof destroyCb === "function") {
                        destroyCb()
                    }
                }
            }
        }
    }, [activeName])
    return domRef
}

export default KeepAlive
