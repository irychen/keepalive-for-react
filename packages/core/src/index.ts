import KeepAlive, { KeepAliveProps, KeepAliveRef, useKeepAliveRef } from "./components/KeepAlive";
import useEffectOnActive from "./hooks/useEffectOnActive";
import useKeepAliveContext from "./hooks/useKeepAliveContext";
import useLayoutEffectOnActive from "./hooks/useLayoutEffectOnActive";

/**
 * @deprecated since version 3.0.2. Use `useKeepAliveRef` instead.
 */
const useKeepaliveRef = useKeepAliveRef;

export {
    KeepAlive as default,
    KeepAlive,
    useKeepAliveRef,
    useKeepaliveRef,
    useEffectOnActive,
    useLayoutEffectOnActive,
    useKeepAliveContext,
};

export type { KeepAliveRef, KeepAliveProps };
