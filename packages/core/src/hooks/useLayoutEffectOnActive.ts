import { DependencyList, useLayoutEffect } from "react";
import useOnActive from "./useOnActive";

const useLayoutEffectOnActive = (cb: () => any, deps: DependencyList, skipMount = false): void => {
    useOnActive(cb, deps, skipMount, useLayoutEffect);
};

export default useLayoutEffectOnActive;
