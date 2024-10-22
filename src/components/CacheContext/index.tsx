import { createContext } from "react";

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
}

export const CacheComponentContext = createContext<KeepAliveContext>({
    active: false,
    refresh: () => {},
});
