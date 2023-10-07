import { Fragment, RefObject, useLayoutEffect, useRef, useState } from "react"
import { ComponentReactElement } from "../KeepAlive"
import { createPortal } from "react-dom"
interface CacheComponentProps extends ComponentReactElement {
    active: boolean
    name: string
    renderDiv: RefObject<HTMLDivElement>
    cache?: boolean
}

function CacheComponent({ active, cache, children, name, renderDiv }: CacheComponentProps) {
    const [targetElement] = useState(() => {
        const container = document.createElement("div")
        container.setAttribute("id", name)
        container.className = "cache-component " + name + " " + (cache ? "cached" : "no-cache")
        return container
    })
    const activatedRef = useRef(false)
    activatedRef.current = activatedRef.current || active
    useLayoutEffect(() => {
        if (active) {
            renderDiv.current?.appendChild(targetElement)
        } else {
            try {
                renderDiv.current?.removeChild(targetElement)
            } catch (e) {
                console.log(e, "removeChild error")
            }
        }
    }, [active, renderDiv, targetElement, children])
    return <Fragment>{activatedRef.current && createPortal(children, targetElement)}</Fragment>
}

export default CacheComponent
