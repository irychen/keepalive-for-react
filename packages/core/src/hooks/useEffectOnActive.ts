import { DependencyList, useEffect } from "react";
import useOnActive from "./useOnActive";

const useEffectOnActive = (cb: () => void, deps: DependencyList, skipMount = false): void => {
    useOnActive(cb, deps, skipMount, useEffect);
};

export default useEffectOnActive;
