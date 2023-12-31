import KeepAlive from "./components/KeepAlive"
import {RefObject, useEffect, useRef} from "react"
import { useKeepAliveContext } from "./components/KeepAliveProvider"

export function useOnActive  (cb: () => any, skipMount = true) {
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


export function useOnActiveByRef(ref: RefObject<HTMLDivElement>, cb: () => any, skipMount = true) {
    const { activeName } = useKeepAliveContext()
    const isMount = useRef(false)
    useEffect(() => {
        let destroyCb: any
        const parent = ref.current?.parentElement
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
}

export default KeepAlive
