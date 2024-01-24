import { ComponentType, Fragment, memo, RefObject, useLayoutEffect, useRef, useState } from "react"
import { ComponentReactElement } from "../KeepAlive"
import { createPortal } from "react-dom"
import { isNil } from "fortea"

interface CacheComponentProps extends ComponentReactElement {
    active: boolean
    name: string
    renderDiv: RefObject<HTMLDivElement>
    cache?: boolean
    errorElement?: ComponentType<any> | null
}

function CacheComponent({ active, errorElement, cache, children, name, renderDiv }: CacheComponentProps) {
    const ErrorElement = errorElement as ComponentType<any>
    const [targetElement] = useState(() => {
        const cacheDiv = document.createElement("div")
        cacheDiv.setAttribute("id", name)
        cacheDiv.className = "cache-component " + name + " " + (cache ? "cached" : "no-cache")
        return cacheDiv
    })
    const activatedRef = useRef(false)
    activatedRef.current = activatedRef.current || active
    useLayoutEffect(() => {
        const containerDiv = renderDiv.current
        if (active) {
            containerDiv?.appendChild(targetElement)
        } else {
            try {
                if (containerDiv?.contains(targetElement)) {
                    containerDiv?.removeChild(targetElement)
                }
            } catch (e) {
                console.log(e, "removeChild error")
            }
        }
    }, [active, renderDiv, targetElement, children])

    if (isNil(ErrorElement)) {
        return <Fragment>{activatedRef.current && createPortal(children, targetElement)}</Fragment>
    } else {
        return (
            <Fragment>
                {activatedRef.current && createPortal(<ErrorElement>{children}</ErrorElement>, targetElement)}
            </Fragment>
        )
    }
}

export default memo(CacheComponent, (prevProps, nextProps) => {
    return prevProps.active === nextProps.active
})
