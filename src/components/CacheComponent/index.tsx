import { ComponentType, Fragment, memo, ReactNode, RefObject, useCallback, useLayoutEffect, useMemo, useRef } from "react"
import { createPortal } from "react-dom"
import MemoCacheComponentProvider from "../KeepAliveProvider"

interface Props {
    containerDivRef: RefObject<HTMLDivElement>
    active: boolean
    name: string
    errorElement?: ComponentType<{
        children: ReactNode
    }>
    children: ReactNode
    destroy: (name: string) => void
    refresh: (name?: string) => void
    cacheDivClassName?: string
    renderCount: number
}

function CacheComponent(props: Props) {
    const {
        containerDivRef,
        active,
        children,
        destroy,
        name,
        refresh,
        errorElement: ErrorBoundary = Fragment,
        cacheDivClassName = `cache-component`,
        renderCount,
    } = props
    const activatedRef = useRef(false)

    activatedRef.current = activatedRef.current || active

    const cacheDiv = useMemo(() => {
        const cacheDiv = document.createElement("div")
        cacheDiv.setAttribute("data-name", name)
        cacheDiv.setAttribute("style", "height: 100%")
        cacheDiv.className = cacheDivClassName
        return cacheDiv
    }, [renderCount])

    useLayoutEffect(() => {
        const containerDiv = containerDivRef.current
        cacheDiv.classList.remove("active", "inactive")
        if (active) {
            containerDiv?.appendChild(cacheDiv)
            cacheDiv.classList.add("active")
            cacheDiv.setAttribute("data-active", "true")
        } else {
            if (containerDiv?.contains(cacheDiv)) {
                cacheDiv.setAttribute("data-active", "false")
                cacheDiv.classList.add("inactive")
                containerDiv?.removeChild(cacheDiv)
            }
        }
    }, [active, containerDivRef, cacheDiv])

    const cacheDestroy = useCallback(() => {
        destroy(name)
    }, [destroy, name])

    return activatedRef.current
        ? createPortal(
              <ErrorBoundary>
                  <MemoCacheComponentProvider active={active} destroy={cacheDestroy} refresh={refresh}>
                      {children}
                  </MemoCacheComponentProvider>
              </ErrorBoundary>,
              cacheDiv,
              name,
          )
        : null
}

export default memo(CacheComponent)
