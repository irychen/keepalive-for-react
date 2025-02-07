import { createContext } from "react";
import { KeepAliveAPI } from "../KeepAlive";

export interface KeepAliveContext extends KeepAliveAPI {
    /**
     * whether the component is active
     */
    active: boolean;
}

export const CacheComponentContext = createContext<KeepAliveContext>({
    active: false,
    refresh: () => {},
    destroy: () => Promise.resolve(),
    destroyAll: () => Promise.resolve(),
    destroyOther: () => Promise.resolve(),
    getCacheNodes: () => [],
});
