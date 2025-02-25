import { startTransition as reactStartTransition } from "react";
import { isFn } from "../utils";

/**
 * Compatible with React versions < 18 startTransition
 * @param cb Callback function to be executed in transition
 */
const safeStartTransition = (cb: () => void): void => {
    if (typeof reactStartTransition !== "undefined" && isFn(reactStartTransition)) {
        reactStartTransition(cb);
    } else {
        cb();
    }
};

export default safeStartTransition;
