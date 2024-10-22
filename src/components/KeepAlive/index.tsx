import {
    ComponentType,
    Fragment,
    ReactElement,
    ReactNode,
    RefObject,
    useCallback,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { isFn, isInclude, isNil } from "../../utils";
import CacheComponentProvider from "../CacheComponentProvider";
import CacheComponent from "../CacheComponent";
import safeStartTransition from "../../compat/safeStartTransition";

export type KeepAliveChildren = ReactNode | ReactElement | null | undefined | JSX.Element;

export interface KeepAliveProps {
    activeCacheKey: string;
    children?: KeepAliveChildren;
    /**
     * max cache count default 10
     */
    max?: number;
    exclude?: Array<string | RegExp> | string | RegExp;
    include?: Array<string | RegExp> | string | RegExp;
    onBeforeActive?: (activeCacheKey: string) => void;
    customContainerRef?: RefObject<HTMLDivElement>;
    cacheNodeClassName?: string;
    containerClassName?: string;
    errorElement?: ComponentType<{
        children: ReactNode;
    }>;
    /**
     * transition default false
     */
    transition?: boolean;
    /**
     * transition duration default 200
     */
    duration?: number;
    aliveRef?: RefObject<KeepAliveRef | undefined>;
}

interface CacheNode {
    cacheKey: string;
    ele?: KeepAliveChildren;
    lastActiveTime: number;
    renderCount: number;
}

export interface KeepAliveRef {
    refresh: (cacheKey?: string) => void;
    destroy: (cacheKey: string) => Promise<void>;
}

export function useKeepaliveRef() {
    return useRef<KeepAliveRef>();
}

function KeepAlive(props: KeepAliveProps) {
    const {
        activeCacheKey,
        max = 10,
        exclude,
        include,
        onBeforeActive,
        customContainerRef,
        cacheNodeClassName = `cache-component`,
        containerClassName = "keep-alive-render",
        errorElement,
        transition = false,
        duration = 200,
        children,
        aliveRef,
    } = props;

    const containerDivRef = customContainerRef || useRef<HTMLDivElement>(null);
    const [cacheNodes, setCacheNodes] = useState<Array<CacheNode>>([]);

    const isCached = useCallback(
        (cacheKey: string) => {
            if (include) {
                return isInclude(include, cacheKey);
            } else {
                if (exclude) {
                    return !isInclude(exclude, cacheKey);
                }
                return true;
            }
        },
        [exclude, include],
    );

    useLayoutEffect(() => {
        if (isNil(activeCacheKey)) return;
        safeStartTransition(() => {
            setCacheNodes(prevCacheNodes => {
                const lastActiveTime = Date.now();
                const cacheNode = prevCacheNodes.find(item => item.cacheKey === activeCacheKey);
                if (cacheNode) {
                    return prevCacheNodes.map(item => {
                        if (item.cacheKey === activeCacheKey) {
                            if (isFn(onBeforeActive)) onBeforeActive(activeCacheKey);
                            return { ...item, ele: children, lastActiveTime };
                        }
                        return item;
                    });
                } else {
                    if (isFn(onBeforeActive)) onBeforeActive(activeCacheKey);
                    if (prevCacheNodes.length > max) {
                        const node = prevCacheNodes.reduce((prev, cur) => {
                            return prev.lastActiveTime < cur.lastActiveTime ? prev : cur;
                        });
                        prevCacheNodes.splice(prevCacheNodes.indexOf(node), 1);
                    }
                    return [...prevCacheNodes, { cacheKey: activeCacheKey, lastActiveTime, ele: children, renderCount: 0 }];
                }
            });
        });
    }, [activeCacheKey]);

    const destroy = useCallback(
        (cacheKey: string) => {
            return new Promise<void>(resolve => {
                setTimeout(() => {
                    setCacheNodes(cacheNodes => {
                        return [...cacheNodes.filter(item => item.cacheKey !== cacheKey)];
                    });
                    resolve();
                }, 0);
            });
        },
        [setCacheNodes],
    );

    const refresh = useCallback(
        (cacheKey?: string) => {
            setCacheNodes(cacheNodes => {
                const targetCacheKey = cacheKey || activeCacheKey;
                return cacheNodes.map(item => {
                    if (item.cacheKey === targetCacheKey) {
                        return { ...item, renderCount: item.renderCount + 1 };
                    }
                    return item;
                });
            });
        },
        [setCacheNodes, activeCacheKey],
    );

    useImperativeHandle(aliveRef, () => ({
        refresh,
        destroy,
    }));

    return (
        <Fragment>
            <div ref={containerDivRef} className={containerClassName} style={{ height: "100%" }}></div>
            {cacheNodes.map(item => {
                const { cacheKey, ele, renderCount } = item;
                return (
                    <CacheComponentProvider key={`${cacheKey}-${renderCount}`} active={activeCacheKey === cacheKey} refresh={refresh}>
                        <CacheComponent
                            destroy={destroy}
                            isCached={isCached}
                            transition={transition}
                            duration={duration}
                            renderCount={renderCount}
                            containerDivRef={containerDivRef}
                            errorElement={errorElement}
                            active={activeCacheKey === cacheKey}
                            cacheNodeClassName={cacheNodeClassName}
                            cacheKey={cacheKey}
                        >
                            {ele}
                        </CacheComponent>
                    </CacheComponentProvider>
                );
            })}
        </Fragment>
    );
}

export default KeepAlive;
