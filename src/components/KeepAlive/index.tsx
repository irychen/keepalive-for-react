import type { ComponentType, ReactNode, RefObject } from "react"
import { Fragment, memo, useImperativeHandle, useLayoutEffect, useRef, useState } from "react"
import CacheComponent from "../CacheComponent"
import KeepAliveProvider from "../KeepAliveProvider"
import { isNil } from "../../utils"

export interface ComponentReactElement {
    children?: ReactNode | ReactNode[]
}

export type KeepAliveRef = {
    getCaches: () => Array<{ name: string; ele?: ReactNode }>
    /**
     * 清除指定缓存
     * @param name
     */
    removeCache: (name: string) => void
    /**
     * 清除所有缓存
     */
    cleanAllCache: () => void
    /**
     * 清除其他缓存 除了当前的
     */
    cleanOtherCache: () => void
}

interface Props extends ComponentReactElement {
    activeName: string
    include?: Array<string>
    exclude?: Array<string>
    maxLen?: number
    cache?: boolean
    aliveRef?: RefObject<KeepAliveRef>
    errorElement?: ComponentType<any> | null
}

const KeepAlive = memo(function KeepAlive(props: Props) {
    const { errorElement, activeName, cache, children, exclude, include, maxLen, aliveRef } = props
    const containerRef = useRef<HTMLDivElement>(null)
    const [cacheReactNodes, setCacheReactNodes] = useState<
        Array<{
            name: string
            ele?: ReactNode
            cache: boolean
        }>
    >([])

    useImperativeHandle(
        aliveRef,
        () => ({
            getCaches: () => cacheReactNodes,

            removeCache: (name: string) => {
                setTimeout(() => {
                    setCacheReactNodes(cacheReactNodes => {
                        return cacheReactNodes.filter(res => res.name !== name)
                    })
                }, 0)
            },
            cleanAllCache: () => {
                setCacheReactNodes([])
            },
            cleanOtherCache: () => {
                setCacheReactNodes(cacheReactNodes => {
                    return cacheReactNodes.filter(({ name }) => name === activeName)
                })
            },
        }),
        [cacheReactNodes, setCacheReactNodes, activeName],
    )

    useLayoutEffect(() => {
        if (isNil(activeName)) {
            return
        }
        setCacheReactNodes(cacheReactNodes => {
            if (cacheReactNodes.length >= (maxLen || 20)) {
                cacheReactNodes = cacheReactNodes.slice(1, cacheReactNodes.length)
            }
            // remove exclude
            if (exclude && exclude.length > 0) {
                cacheReactNodes = cacheReactNodes.filter(({ name }) => !exclude?.includes(name))
            }
            // only keep include
            if (include && include.length > 0) {
                cacheReactNodes = cacheReactNodes.filter(({ name }) => include?.includes(name))
            }
            // remove cache false
            cacheReactNodes = cacheReactNodes.filter(({ cache }) => cache)
            const cacheReactNode = cacheReactNodes.find(res => res.name === activeName)
            if (isNil(cacheReactNode)) {
                cacheReactNodes.push({
                    cache: cache ?? true,
                    name: activeName,
                    ele: children,
                })
            } else {
                // important update children when activeName is same
                // this can trigger children onActive
                cacheReactNodes = cacheReactNodes.map(res => {
                    return res.name === activeName ? { ...res, ele: children } : res
                })
            }
            return cacheReactNodes
        })
    }, [children, cache, activeName, exclude, maxLen, include])

    return (
        <Fragment>
            <div ref={containerRef} className="keep-alive" />
            <KeepAliveProvider initialActiveName={activeName}>
                {cacheReactNodes?.map(({ name, cache, ele }) => (
                    <CacheComponent
                        errorElement={errorElement}
                        active={name === activeName}
                        renderDiv={containerRef}
                        cache={cache}
                        name={name}
                        key={name}
                    >
                        {ele}
                    </CacheComponent>
                ))}
            </KeepAliveProvider>
        </Fragment>
    )
})

export default memo(KeepAlive)
