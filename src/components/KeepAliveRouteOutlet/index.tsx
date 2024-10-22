import { ComponentType, Fragment, ReactNode, useMemo, ReactElement } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import KeepAlive, { KeepAliveProps } from "../KeepAlive";

export interface KeepAliveRouteOutletProps extends Omit<KeepAliveProps, "activeCacheKey"> {
    wrapperComponent?: ComponentType<{ children: ReactNode }>;
}

function KeepAliveRouteOutlet(props: KeepAliveRouteOutletProps) {
    const { wrapperComponent, ...rest } = props;
    const location = useLocation();
    const outlet = useOutlet();
    const WrapperComponent = wrapperComponent || Fragment;

    const activeCacheKey = useMemo(() => {
        return location.pathname + location.search;
    }, [location.pathname, location.search]);

    return (
        <KeepAlive {...rest} activeCacheKey={activeCacheKey}>
            <WrapperComponent>{outlet}</WrapperComponent>
        </KeepAlive>
    );
}

export default KeepAliveRouteOutlet;
