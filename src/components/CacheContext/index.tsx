import { createContext } from "react";
import { CacheNode } from "../KeepAlive";

export interface KeepAliveContext {
    /**
     * whether the component is active
     */
    active: boolean;
    /**
     * refresh the component
     * @param cacheKey - the cache key of the component, if not provided, current cached component will be refreshed
     */
    refresh: (cacheKey?: string) => void;
    /**
     * refresh the component
     * @param cacheKey - the cache key of the component,
     * if not provided, current active cached component will be refreshed
     */
    destroy: (cacheKey: string | string[]) => Promise<void>;
    /**
     * destroy all components
     */
    destroyAll: () => Promise<void>;
    /**
     * destroy other components
     */
    destroyOther: (cacheKey?: string) => Promise<void>;
    /**
     * get the cache nodes
     */
    getCacheNodes: () => Array<CacheNode>;
}

export const CacheComponentContext = createContext<KeepAliveContext>({
    active: false,
    refresh: () => {},
    destroy: () => Promise.resolve(),
    destroyAll: () => Promise.resolve(),
    destroyOther: () => Promise.resolve(),
    getCacheNodes: () => [],
});
