import { KeepAliveRouteOutlet, useKeepaliveRef } from "keepalive-for-react";
import { ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Layout() {
    const location = useLocation();
    const activePath = location.pathname + location.search;
    const aliveRef = useKeepaliveRef();
    return (
        <div className="text-neutral-700 overflow-hidden max-w-[600px] mx-auto my-[20px] border border-neutral-200 rounded-md">
            <div className="flex md:text-[16px] text-[12px] gap-4 h-[40px] justify-around items-center  px-4 bg-gray-100">
                <Link to="/" className={activePath === "/" ? "text-blue-500" : ""}>
                    Home
                </Link>
                <Link to="/about" className={activePath === "/about" ? "text-blue-500" : ""}>
                    About
                </Link>
                <Link to="/counter" className={activePath === "/counter" ? "text-blue-500" : ""}>
                    Counter
                </Link>
                <Link to="/nocache-counter" className={activePath === "/nocache-counter" ? "text-blue-500" : ""}>
                    Counter2
                </Link>
            </div>
            <div>
                <CustomSuspense>
                    <KeepAliveRouteOutlet
                        wrapperComponent={MemoScrollTopWrapper}
                        duration={300}
                        transition={true}
                        exclude={["/nocache-counter"]}
                        aliveRef={aliveRef}
                    />
                </CustomSuspense>
            </div>
        </div>
    );
}

// remember the scroll position of the page when switching routes
function MemoScrollTopWrapper(props: { children: ReactNode }) {
    const { children } = props;
    const domRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const scrollHistoryMap = useRef<Map<string, number>>(new Map());

    const activeKey = useMemo(() => {
        return location.pathname + location.search;
    }, [location.pathname, location.search]);

    useEffect(() => {
        const divDom = domRef.current;
        if (!divDom) return;
        setTimeout(() => {
            divDom.scrollTo(0, scrollHistoryMap.current.get(activeKey) || 0);
        }, 300); // 300 milliseconds to wait for the animation transition ending
        const onScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            if (!target) return;
            scrollHistoryMap.current.set(activeKey, target?.scrollTop || 0);
        };
        divDom?.addEventListener("scroll", onScroll, {
            passive: true,
        });
        return () => {
            divDom?.removeEventListener("scroll", onScroll);
        };
    }, [activeKey]);

    return (
        <div
            className="animation-wrapper scrollbar w-full overflow-auto"
            style={{
                height: "calc(100vh - 82px)",
            }}
            ref={domRef}
        >
            {children}
        </div>
    );
}

function CustomSuspense(props: { children: ReactNode }) {
    const { children } = props;
    return <Suspense fallback={<div className="text-center text-red-400 text-[12px] mt-[10px]">Loading...</div>}>{children}</Suspense>;
}

export default Layout;
