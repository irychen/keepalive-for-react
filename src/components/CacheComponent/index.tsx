import { ComponentType, Fragment, ReactNode, RefObject, useCallback, useLayoutEffect, useRef, useState } from "react"
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
}

function CacheComponent(props: Props) {
    const { containerDivRef, active, children, destroy, name, errorElement: ErrorBoundary = Fragment } = props
    const activatedRef = useRef(false)

    activatedRef.current = activatedRef.current || active

    const [cacheDiv] = useState(() => {
        const cacheDiv = document.createElement("div")
        cacheDiv.setAttribute("data-name", name)
        cacheDiv.className = `cache-component`
        return cacheDiv
    })

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
                  <MemoCacheComponentProvider active={active} destroy={cacheDestroy}>
                      {children}
                  </MemoCacheComponentProvider>
              </ErrorBoundary>,
              cacheDiv,
              name,
          )
        : null
}

export default CacheComponent
