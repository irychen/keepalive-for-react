import {
    ComponentType,
    Fragment,
    MutableRefObject,
    ReactNode,
    RefObject,
    useCallback,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react"
import CacheComponent from "../CacheComponent"
import { isArr, isNil, isRegExp } from "../../utils"

type Strategy = "PRE" | "LRU"

interface Props {
    children: ReactNode
    /**
     * active name
     */
    activeName: string
    /**
     * max cache count default 10
     */
    max?: number
    /**
     * cache: boolean default true
     */
    cache?: boolean
    /**
     * maxRemoveStrategy: 'PRE' | 'LRU' default 'LRU'
     *
     * PRE: remove the first cacheNode
     *
     * LRU: remove the least recently used cacheNode
     */
    strategy?: Strategy
    /**
     * aliveRef: KeepAliveRef
     *
     * aliveRef is a ref to get caches, remove cache by name, clean all cache, clean other cache except current
     *
     */
    aliveRef?: RefObject<KeepAliveRef | undefined> | MutableRefObject<KeepAliveRef | undefined>

    exclude?: Array<string | RegExp> | string | RegExp

    include?: Array<string | RegExp> | string | RegExp

    /**
     * suspenseElement: Suspense Wrapper Component
     */
    suspenseElement?: ComponentType<{
        children: ReactNode
    }>

    /**
     *  errorElement: for every cacheNode's ErrorBoundary
     */
    errorElement?: ComponentType<{
        children: ReactNode
    }>

    animationWrapper?: ComponentType<{
        children: ReactNode
    }>

    /**
     * onBeforeActive: callback before active
     * @param name
     *
     * you can do something before active like set style for dropdown
     *
     * example:
     * ```tsx
     * // fix the style flashing issue when using Antd Dropdown and Select components, which occurs when the components are wrapped by Suspense and cached.
     *
     * // set .ant-select-dropdown .ant-picker-dropdown style to ''
     * const dropdowns = document.querySelectorAll('.ant-select-dropdown');
     * dropdowns.forEach(dropdown => {
     *     if (dropdown) {
     *         dropdown.setAttribute('style', '');
     *     }
     * });
     *
     * const pickerDropdowns = document.querySelectorAll('.ant-picker-dropdown');
     * pickerDropdowns.forEach(pickerDropdown => {
     *     if (pickerDropdown) {
     *         pickerDropdown.setAttribute('style', '');
     *     }
     * });
     * ```
     */
    onBeforeActive?: (name: string) => void
    /**
     *  containerDivRef: root node to mount cacheNodes
     */
    containerDivRef?: MutableRefObject<HTMLDivElement>
    /**
     *  cacheDivClassName: className set for cacheNodes
     */
    cacheDivClassName?: string
}

interface CacheNode {
    name: string
    ele?: ReactNode
    cache: boolean
    lastActiveTime: number
}

/**
 * RemoveStrategies is a strategy to remove cacheNodes
 *
 * PRE: remove the first cacheNode
 *
 * LRU: remove the least recently used cacheNode
 */
const RemoveStrategies: Record<string, (nodes: CacheNode[]) => CacheNode[]> = {
    PRE: (nodes: CacheNode[]) => {
        nodes.shift()
        return nodes
    },
    LRU: (nodes: CacheNode[]) => {
        const node = nodes.reduce((prev, cur) => {
            return prev.lastActiveTime < cur.lastActiveTime ? prev : cur
        })
        nodes.splice(nodes.indexOf(node), 1)
        return nodes
    },
}

export type KeepAliveRef = {
    getCaches: () => Array<CacheNode>

    removeCache: (name: string) => void

    cleanAllCache: () => void

    cleanOtherCache: () => void
}

export function useKeepaliveRef() {
    return useRef<KeepAliveRef>()
}

function KeepAlive(props: Props) {
    const {
        aliveRef,
        cache = true,
        strategy = "LRU",
        activeName,
        children,
        max = 10,
        errorElement,
        suspenseElement: SuspenseElement = Fragment,
        animationWrapper: AnimationWrapper = Fragment,
        onBeforeActive,
        containerDivRef: containerDivRefFromoProps,
        cacheDivClassName,
    } = props
    const containerDivRef = containerDivRefFromoProps || useRef<HTMLDivElement>(null)
    const [cacheNodes, setCacheNodes] = useState<Array<CacheNode>>([])

    useLayoutEffect(() => {
        if (isNil(activeName)) return
        setCacheNodes(prevCacheNodes => {
            // remove cacheNodes with cache false node
            prevCacheNodes = prevCacheNodes.filter(item => item.cache)

            // remove cacheNodes with exclude
            if (!isNil(props.exclude)) {
                const exclude = isArr(props.exclude) ? props.exclude : [props.exclude]
                prevCacheNodes = prevCacheNodes.filter(item => {
                    return !exclude.some(exclude => {
                        if (isRegExp(exclude)) {
                            return exclude.test(item.name)
                        } else {
                            return item.name === exclude
                        }
                    })
                })
            }

            // only keep cacheNodes with include
            if (!isNil(props.include)) {
                const include = isArr(props.include) ? props.include : [props.include]
                prevCacheNodes = prevCacheNodes.filter(item => {
                    return include.some(include => {
                        if (isRegExp(include)) {
                            return include.test(item.name)
                        } else {
                            return item.name === include
                        }
                    })
                })
            }

            const lastActiveTime = Date.now()

            const cacheNode = prevCacheNodes.find(item => item.name === activeName)

            if (cacheNode) {
                return prevCacheNodes.map(item => {
                    if (item.name === activeName) {
                        onBeforeActive && onBeforeActive(activeName)
                        return { name: activeName, cache, lastActiveTime, ele: children }
                    }
                    return item
                })
            } else {
                onBeforeActive && onBeforeActive(activeName)
                if (prevCacheNodes.length >= max) {
                    const removeStrategyFunc = RemoveStrategies[strategy]
                    if (removeStrategyFunc) {
                        prevCacheNodes = removeStrategyFunc(prevCacheNodes)
                    } else {
                        throw new Error(`strategy ${strategy} is not supported`)
                    }
                }
                return [...prevCacheNodes, { name: activeName, cache, lastActiveTime, ele: children }]
            }
        })
    }, [children, activeName, setCacheNodes, max, cache, strategy, props.exclude, props.include])

    useImperativeHandle(
        aliveRef,
        () => ({
            getCaches: () => cacheNodes,
            removeCache: (name: string) => {
                setTimeout(() => {
                    setCacheNodes(cacheNodes => {
                        return [...cacheNodes.filter(item => item.name !== name)]
                    })
                }, 0)
            },
            cleanAllCache: () => {
                setCacheNodes([])
            },
            cleanOtherCache: () => {
                setCacheNodes(cacheNodes => {
                    return [...cacheNodes.filter(item => item.name === activeName)]
                })
            },
        }),
        [cacheNodes, setCacheNodes, activeName],
    )

    const destroy = useCallback(
        (name: string) => {
            setCacheNodes(cacheNodes => {
                return cacheNodes.filter(item => item.name !== name)
            })
        },
        [setCacheNodes],
    )

    return (
        <Fragment>
            <AnimationWrapper>
                <div ref={containerDivRef} className={"keep-alive-render"} style={{ height: "100%" }}></div>
            </AnimationWrapper>
            <SuspenseElement>
                {cacheNodes.map(item => {
                    const { name, ele } = item
                    return (
                        <CacheComponent
                            containerDivRef={containerDivRef}
                            key={name}
                            errorElement={errorElement}
                            active={activeName === name}
                            name={name}
                            destroy={destroy}
                            cacheDivClassName={cacheDivClassName}
                        >
                            {ele}
                        </CacheComponent>
                    )
                })}
            </SuspenseElement>
        </Fragment>
    )
}

export default KeepAlive
