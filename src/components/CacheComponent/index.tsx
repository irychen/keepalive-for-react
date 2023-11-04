import { ComponentType, Fragment, memo, RefObject, useLayoutEffect, useRef, useState } from "react"
import { ComponentReactElement } from "../KeepAlive"
import { createPortal } from "react-dom"
import { isNil } from "../../utils"

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
        const container = document.createElement("div")
        container.setAttribute("id", name)
        container.className = "cache-component " + name + " " + (cache ? "cached" : "no-cache")
        return container
    })
    const activatedRef = useRef(false)
    activatedRef.current = activatedRef.current || active
    useLayoutEffect(() => {
        const keepAliveDiv = renderDiv.current
        if (active) {
            keepAliveDiv?.appendChild(targetElement)
        } else {
            try {
                if (keepAliveDiv?.contains(targetElement)) {
                    keepAliveDiv?.removeChild(targetElement)
                }
            } catch (e) {
                console.log(e, "removeChild error")
            }
        }
    }, [active, renderDiv, targetElement, children])

    if (!isNil(ErrorElement)) {
        return (
            <Fragment>
                {activatedRef.current && createPortal(<ErrorElement>{children}</ErrorElement>, targetElement)}
            </Fragment>
        )
    } else {
        return <Fragment>{activatedRef.current && createPortal(children, targetElement)}</Fragment>
    }
}

export default memo(CacheComponent)
