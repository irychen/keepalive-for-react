import { createContext, memo, ReactNode, useContext, useEffect, useMemo, useRef } from "react"

/**
 * The context of the cache component.
 * @interface KeepAliveContext
 * @property {boolean} active - The active state of the cache component.
 * @property {() => void} destroy - A function to destroy the cache component.
 */
export interface KeepAliveContext {
    active: boolean
    destroy: () => void
}

export const CacheComponentContext = createContext<KeepAliveContext>({
    active: false,
    destroy: () => {},
})

const useCacheComponentContext = () => {
    return useContext(CacheComponentContext)
}

function CacheComponentProvider(props: { children: ReactNode; active: boolean; destroy: () => void }) {
    const { children, active, destroy } = props

    const value = useMemo(() => {
        return { active, destroy }
    }, [active, destroy])

    return <CacheComponentContext.Provider value={value}>{children}</CacheComponentContext.Provider>
}

const MemoCacheComponentProvider = memo(CacheComponentProvider, (prevProps, nextProps) => {
    return prevProps.active === nextProps.active
})

export const useKeepAliveContext = useCacheComponentContext

export default MemoCacheComponentProvider

/**
 * a hook that executes a callback function when the active state of the cache component changes.
 * The callback can optionally return a cleanup function that will be executed on component unmount or before the callback is executed again.
 *
 * @param cb A callback function to be executed when the active state changes. It receives the current active state as a parameter. If it returns a function, that function will be used as a cleanup callback.
 * @param skipMount Optional. If true, the callback (and potentially its cleanup) is not executed on the initial component mount. Defaults to false.
 */
export const useOnActive = (cb: (active: boolean) => any, skipMount = false) => {
    const { active } = useCacheComponentContext()
    const isMount = useRef(false)
    useEffect(() => {
        let destroyCb: any
        if (skipMount) {
            if (isMount.current) {
                destroyCb = cb(active)
            }
            isMount.current = true
        } else {
            destroyCb = cb(active)
        }
        return () => {
            if (destroyCb && typeof destroyCb === "function") {
                destroyCb()
            }
        }
    }, [active, cb, skipMount])
}
