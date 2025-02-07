import { DependencyList, useEffect, useLayoutEffect, useRef } from "react";
import useKeepAliveContext from "./useKeepAliveContext";
import { isFn } from "../utils";

function useOnActive(cb: () => any, deps: DependencyList, skipMount = false, effect: typeof useEffect | typeof useLayoutEffect) {
    const { active } = useKeepAliveContext();
    const isMount = useRef<boolean>(false);
    effect(() => {
        if (!active) return;
        if (skipMount && !isMount.current) {
            isMount.current = true;
            return;
        }
        const destroyCb = cb();
        return () => {
            if (isFn(destroyCb)) {
                destroyCb();
            }
        };
    }, [active, ...deps]);
}

export default useOnActive;
