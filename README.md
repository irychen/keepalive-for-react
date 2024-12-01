<p align="center">
  <img width="120" src="./react-keepalive.png" alt="keepalive-for-react logo">
</p>

<div align="center">
  <h1 align="center">
    KeepAlive for React
  </h1>
</div>

<p align="center">A React KeepAlive component like keep-alive in vue</p>

[中文](./README.zh_CN.md) | English

[![NPM version](https://img.shields.io/npm/v/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react) [![NPM downloads](https://img.shields.io/npm/dm/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react)

## Features

-   Support react-router-dom v6+
-   Support React v16+ ~ v18+
-   Support Suspense and Lazy import
-   Support ErrorBoundary
-   Support Custom Container
-   Support Switching Animation Transition with className `active` and `inactive`
-   Simply implement, without any extra dependencies and hacking ways

## Attention

-   DO NOT use <React.StrictMode />, it CANNOT work with keepalive-for-react in development mode. because it can lead to
    some unexpected behavior.

-   In Router only support react-router-dom v6+

## Install

```bash
npm install keepalive-for-react
```

```bash
yarn add keepalive-for-react
```

```bash
pnpm add keepalive-for-react
```

## Usage

### in react-router-dom v6+

1. install react-router-dom v6+

```bash
npm install react-router-dom keepalive-for-react
```

2. use KeepAlive in your project

```tsx
import { KeepAliveRouteOutlet } from "keepalive-for-react";

function Layout() {
    return (
        <div className="layout">
            <KeepAliveRouteOutlet />
        </div>
    );
}
```

or

```tsx
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { KeepAlive, useKeepAliveRef } from "keepalive-for-react";

function Layout() {
    const location = useLocation();
    const aliveRef = useKeepAliveRef();

    const outlet = useOutlet();

    // determine which route component to is active
    const currentCacheKey = useMemo(() => {
        return location.pathname + location.search;
    }, [location.pathname, location.search]);

    return (
        <div className="layout">
            <MemoizedScrollTop>
                <KeepAlive transition aliveRef={aliveRef} activeCacheKey={currentCacheKey} max={18}>
                    <Suspense fallback={<LoadingArea />}>
                        <SpreadArea>{outlet}</SpreadArea>
                    </Suspense>
                </KeepAlive>
            </MemoizedScrollTop>
        </div>
    );
}
```

details see [examples/react-router-dom-simple-starter](./examples/react-router-dom-simple-starter)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/react-router-dom-simple-starter)

### in simple tabs

```bash
npm install keepalive-for-react
```

```tsx
const tabs = [
    {
        key: "tab1",
        label: "Tab 1",
        component: Tab1,
    },
    {
        key: "tab2",
        label: "Tab 2",
        component: Tab2,
    },
    {
        key: "tab3",
        label: "Tab 3",
        component: Tab3,
    },
];

function App() {
    const [currentTab, setCurrentTab] = useState<string>("tab1");

    const tab = useMemo(() => {
        return tabs.find(tab => tab.key === currentTab);
    }, [currentTab]);

    return (
        <div>
            {/* ... */}
            <KeepAlive transition={true} activeCacheKey={currentTab} exclude={["tab3"]}>
                {tab && <tab.component />}
            </KeepAlive>
        </div>
    );
}
```

details see [examples/simple-tabs-starter](./examples/simple-tabs-starter)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/simple-tabs-starter)

## KeepAlive Props

type definition

```tsx
interface KeepAliveProps {
    // determine which component to is active
    activeCacheKey: string;
    children?: KeepAliveChildren;
    /**
     * max cache count default 10
     */
    max?: number;
    exclude?: Array<string | RegExp> | string | RegExp;
    include?: Array<string | RegExp> | string | RegExp;
    onBeforeActive?: (activeCacheKey: string) => void;
    customContainerRef?: RefObject<HTMLDivElement>;
    cacheNodeClassName?: string;
    containerClassName?: string;
    errorElement?: ComponentType<{
        children: ReactNode;
    }>;
    /**
     * transition default false
     */
    transition?: boolean;
    /**
     * transition duration default 200
     */
    duration?: number;
    aliveRef?: RefObject<KeepAliveRef | undefined>;
    /**
     * max alive time for cache node (second)
     * @default 0 (no limit)
     */
    maxAliveTime?: number | MaxAliveConfig[];
}

interface MaxAliveConfig {
    match: string | RegExp;
    expire: number;
}
```

## Hooks

### useEffectOnActive

```tsx
useEffectOnActive(() => {
    console.log("active");
}, []);
```

### useLayoutEffectOnActive

```tsx
useLayoutEffectOnActive(
    () => {
        console.log("active");
    },
    [],
    false,
);
// the third parameter is optional, default is true,
// which means the callback will be skipped when the useLayoutEffect is triggered in first render
```

### useKeepAliveContext

type definition

```ts
interface KeepAliveContext {
    /**
     * whether the component is active
     */
    active: boolean;
    /**
     * refresh the component
     * @param {string} [cacheKey] - The cache key of the component. If not provided, the current cached component will be refreshed.
     */
    refresh: (cacheKey?: string) => void;
    /**
     * destroy the component
     * @param {string} [cacheKey] - the cache key of the component, if not provided, current active cached component will be destroyed
     */
    destroy: (cacheKey?: string | string[]) => Promise<void>;
    /**
     * destroy all components
     */
    destroyAll: () => Promise<void>;
    /**
     * destroy other components except the provided cacheKey
     * @param {string} [cacheKey] - The cache key of the component. If not provided, destroy all components except the current active cached component.
     */
    destroyOther: (cacheKey?: string) => Promise<void>;
    /**
     * get the cache nodes
     */
    getCacheNodes: () => Array<CacheNode>;
}
```

```tsx
const { active, refresh, destroy, getCacheNodes } = useKeepAliveContext();
// active is a boolean, true is active, false is inactive
// refresh is a function, you can call it to refresh the component
// destroy is a function, you can call it to destroy the component
// ...
// getCacheNodes is a function, you can call it to get the cache nodes
```

### useKeepAliveRef

type definition

```ts
interface KeepAliveRef {
    refresh: (cacheKey?: string) => void;
    destroy: (cacheKey?: string | string[]) => Promise<void>;
    destroyAll: () => Promise<void>;
    destroyOther: (cacheKey?: string) => Promise<void>;
    getCacheNodes: () => Array<CacheNode>;
}
```

```tsx
function App() {
    const aliveRef = useKeepAliveRef();
    // aliveRef.current is a KeepAliveRef object

    // you can call refresh and destroy on aliveRef.current
    aliveRef.current?.refresh();
    // it is not necessary to call destroy manually, KeepAlive will handle it automatically
    aliveRef.current?.destroy();

    return <KeepAlive aliveRef={aliveRef}>{/* ... */}</KeepAlive>;
}
// or
function AppRouter() {
    const aliveRef = useKeepAliveRef();
    // aliveRef.current is a KeepAliveRef object

    // you can call refresh and destroy on aliveRef.current
    aliveRef.current?.refresh();
    aliveRef.current?.destroy();
    return <KeepAliveRouteOutlet aliveRef={aliveRef} />;
}
```

## Development

install dependencies

```bash
pnpm install
```

build package

```bash
pnpm build
```

link package to global

```bash
pnpm link --global
```

test in demo project

```bash
cd demo
pnpm link --global keepalive-for-react
```
