import KeepAlive, { KeepAliveRef, useKeepaliveRef } from "./components/KeepAlive";
import KeepAliveRouteOutlet from "./components/KeepAliveRouteOutlet";
import useEffectOnActive from "./hooks/useEffectOnActive";
import useKeepAliveContext from "./hooks/useKeepAliveContext";
import useLayoutEffectOnActive from "./hooks/useLayoutEffectOnActive";

export {
    KeepAlive as default,
    KeepAliveRouteOutlet,
    KeepAlive,
    useKeepaliveRef,
    useEffectOnActive,
    useLayoutEffectOnActive,
    useKeepAliveContext,
};

export type { KeepAliveRef };
