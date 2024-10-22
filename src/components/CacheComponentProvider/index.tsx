import { memo, ReactNode, useMemo } from "react";
import { CacheComponentContext, KeepAliveContext } from "../CacheContext";

interface CacheComponentProviderProps extends KeepAliveContext {
    children?: ReactNode;
}

const CacheComponentProvider = memo(function (props: CacheComponentProviderProps) {
    const { children, active, refresh } = props;
    const value = useMemo(() => {
        return { active, refresh };
    }, [active, refresh]);
    return <CacheComponentContext.Provider value={value}>{children}</CacheComponentContext.Provider>;
});

export default CacheComponentProvider;
