import { startTransition as reactStartTransition } from "react";
import { isFn } from "../utils";

/**
 * compatible with react version < 18 startTransition
 */
const safeStartTransition = (cb: () => void) => {
    isFn(reactStartTransition) ? reactStartTransition(cb) : cb();
};

export default safeStartTransition;
