import { ComponentType, Fragment, memo, ReactNode, RefObject, useCallback, useMemo, useRef } from "react"
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
    async: boolean
    microAsync: boolean
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
        async,
        microAsync,
    } = props
    const activatedRef = useRef(false)

    activatedRef.current = activatedRef.current || active

    const cacheDiv = useMemo(() => {
        const cacheDiv = document.createElement("div")
        cacheDiv.setAttribute("data-name", name)
        cacheDiv.setAttribute("style", "height: 100%")
        cacheDiv.setAttribute("data-render-count", renderCount.toString())
        cacheDiv.className = cacheDivClassName
        return cacheDiv
    }, [renderCount])

    const containerDiv = containerDivRef.current
    cacheDiv.classList.remove("active", "inactive")

    function renderCacheDiv() {
        containerDiv?.appendChild(cacheDiv)
        cacheDiv.classList.add("active")
        cacheDiv.setAttribute("data-active", "true")
    }

    if (active) {
        // check if the containerDiv has childNodes
        if (containerDiv?.childNodes.length !== 0) {
            // remove all the childNodes
            containerDiv?.childNodes.forEach(node => {
                containerDiv?.removeChild(node)
            })
        }
        if (async) {
            if (microAsync) {
                Promise.resolve().then(() => {
                    renderCacheDiv()
                })
            } else {
                setTimeout(() => {
                    renderCacheDiv()
                }, 0)
            }
        } else {
            renderCacheDiv()
        }
    } else {
        if (containerDiv?.contains(cacheDiv)) {
            cacheDiv.setAttribute("data-active", "false")
            cacheDiv.classList.add("inactive")
            cacheDiv.remove()
        }
    }

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
