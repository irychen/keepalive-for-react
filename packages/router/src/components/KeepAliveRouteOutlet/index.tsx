import { ComponentType, Fragment, ReactNode, useMemo } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import KeepAlive, { KeepAliveProps } from "keepalive-for-react";

export interface KeepAliveRouteOutletProps extends Omit<KeepAliveProps, "activeCacheKey"> {
    wrapperComponent?: ComponentType<{ children: ReactNode }>;
    activeCacheKey?: string;
}

function KeepAliveRouteOutlet(props: KeepAliveRouteOutletProps) {
    const { wrapperComponent, activeCacheKey: propsActiveCacheKey, ...rest } = props;
    const location = useLocation();
    const outlet = useOutlet();
    const WrapperComponent = wrapperComponent || Fragment;

    const activeCacheKey = useMemo(() => {
        return propsActiveCacheKey || location.pathname + location.search;
    }, [location.pathname, location.search, propsActiveCacheKey]);

    return (
        <KeepAlive {...rest} activeCacheKey={activeCacheKey}>
            <WrapperComponent>{outlet}</WrapperComponent>
        </KeepAlive>
    );
}

export default KeepAliveRouteOutlet;
