import { ComponentType, Fragment, memo, ReactNode, RefObject, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { delayAsync, domAttrSet } from "../../utils";

export interface CacheComponentProps {
    children: ReactNode;
    errorElement?: ComponentType<{
        children: ReactNode;
    }>;
    containerDivRef: RefObject<HTMLDivElement>;
    cacheNodeClassName: string;
    renderCount: number;
    active: boolean;
    cacheKey: string;
    transition: boolean;
    duration: number;
    isCached: (cacheKey: string) => boolean;
    destroy: (cacheKey: string | string[]) => Promise<void>;
}

function getChildNodes(dom?: HTMLDivElement) {
    return dom ? Array.from(dom.children) : [];
}

function removeDivNodes(nodes: Element[]) {
    nodes.forEach(node => {
        node.remove();
    });
}

function renderCacheDiv(containerDiv: HTMLDivElement, cacheDiv: HTMLDivElement) {
    const removeNodes = getChildNodes(containerDiv);
    removeDivNodes(removeNodes);
    containerDiv.appendChild(cacheDiv);
    cacheDiv.classList.remove("inactive");
    cacheDiv.classList.add("active");
}

function switchActiveNodesToInactive(containerDiv: HTMLDivElement, cacheKey: string) {
    const nodes = getChildNodes(containerDiv);
    const activeNodes = nodes.filter(node => node.classList.contains("active") && node.getAttribute("data-cache-key") !== cacheKey);
    activeNodes.forEach(node => {
        node.classList.remove("active");
        node.classList.add("inactive");
    });
    return activeNodes;
}

const CacheComponent = memo(
    function (props: CacheComponentProps): any {
        const { errorElement: ErrorBoundary = Fragment, cacheNodeClassName, children, cacheKey, isCached } = props;
        const { active, renderCount, destroy, transition, duration, containerDivRef } = props;
        const activatedRef = useRef(false);

        const cached = isCached(cacheKey);

        activatedRef.current = activatedRef.current || active;

        const cacheDiv = useMemo(() => {
            const cacheDiv = document.createElement("div");
            domAttrSet(cacheDiv)
                .set("data-cache-key", cacheKey)
                .set("data-cached", cached.valueOf().toString())
                .set("style", "height: 100%")
                .set("data-render-count", renderCount.toString());
            cacheDiv.className = cacheNodeClassName;
            return cacheDiv;
        }, [renderCount, cacheNodeClassName]);

        useEffect(() => {
            const containerDiv = containerDivRef.current;
            if (!containerDiv) {
                console.warn(`keepalive: cache container not found`);
                return;
            }
            if (transition) {
                (async () => {
                    if (active) {
                        const inactiveNodes = switchActiveNodesToInactive(containerDiv, cacheKey);
                        // duration - 40ms is to avoid the animation effect ending too early
                        await delayAsync(duration - 40);
                        removeDivNodes(inactiveNodes);
                        if (containerDiv.contains(cacheDiv)) {
                            return;
                        }
                        renderCacheDiv(containerDiv, cacheDiv);
                    } else {
                        if (!cached) {
                            await delayAsync(duration);
                            destroy(cacheKey);
                        }
                    }
                })();
            } else {
                if (active) {
                    const inactiveNodes = switchActiveNodesToInactive(containerDiv, cacheKey);
                    removeDivNodes(inactiveNodes);
                    if (containerDiv.contains(cacheDiv)) {
                        return;
                    }
                    renderCacheDiv(containerDiv, cacheDiv);
                } else {
                    if (!cached) {
                        destroy(cacheKey);
                    }
                }
            }
        }, [active, containerDivRef, cacheKey]);

        return activatedRef.current ? createPortal(<ErrorBoundary>{children}</ErrorBoundary>, cacheDiv, cacheKey) : null;
    },
    (prevProps, nextProps) => {
        return prevProps.active === nextProps.active && prevProps.renderCount === nextProps.renderCount;
    },
);

export default CacheComponent;
