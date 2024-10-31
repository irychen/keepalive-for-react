import KeepAlive, { KeepAliveRef, useKeepAliveRef } from "./components/KeepAlive";
import KeepAliveRouteOutlet from "./components/KeepAliveRouteOutlet";
import useEffectOnActive from "./hooks/useEffectOnActive";
import useKeepAliveContext from "./hooks/useKeepAliveContext";
import useLayoutEffectOnActive from "./hooks/useLayoutEffectOnActive";

/**
 * @deprecated since version 3.0.2. Use `useKeepAliveRef` instead.
 */
const useKeepaliveRef = useKeepAliveRef;

export {
    KeepAlive as default,
    KeepAliveRouteOutlet,
    KeepAlive,
    useKeepAliveRef,
    useKeepaliveRef,
    useEffectOnActive,
    useLayoutEffectOnActive,
    useKeepAliveContext,
};

export type { KeepAliveRef };
