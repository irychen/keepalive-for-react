<p align="center">
  <img width="120" src="./react-keepalive.png" alt="keepalive-for-react logo">
</p>

<div align="center">
  <h1 align="center">
    React KeepAlive 组件
  </h1>
</div>

<p align="center">一个类似Vue中keep-alive的React KeepAlive组件</p>

[English](./README.md) | 中文

[![NPM版本](https://img.shields.io/npm/v/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react) [![NPM下载量](https://img.shields.io/npm/dm/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react)

## 特性

-   支持react-router-dom v6+
-   支持React v16+ ~ v18+
-   支持Suspense和懒加载导入
-   支持错误边界
-   支持自定义容器
-   支持使用className `active`和`inactive`进行切换动画过渡
-   简单实现,无需任何额外依赖和hack方式

## 注意事项

-   请勿使用 <React.StrictMode />,它在开发模式下无法与keepalive-for-react一起工作。因为它可能会导致一些意外行为。

-   在路由中仅支持react-router-dom v6+

## 安装

```bash
npm install keepalive-for-react
```

```bash
yarn add keepalive-for-react
```

```bash
pnpm add keepalive-for-react
```

## 使用

### 在react-router-dom v6+中

1. 安装react-router-dom v6+

```bash
npm install react-router-dom keepalive-for-react
```

2. 在项目中使用KeepAlive

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

或者

```tsx
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { KeepAlive, useKeepAliveRef } from "keepalive-for-react";

function Layout() {
    const location = useLocation();
    const aliveRef = useKeepAliveRef();

    const outlet = useOutlet();

    // 确定哪个路由组件处于活动状态
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

详情请参见 [examples/react-router-dom-simple-starter](./examples/react-router-dom-simple-starter)

[![在StackBlitz中打开](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/react-router-dom-simple-starter)

### 在简单标签页中

```bash
npm install keepalive-for-react
```

```tsx
const tabs = [
    {
        key: "tab1",
        label: "标签1",
        component: Tab1,
    },
    {
        key: "tab2",
        label: "标签2",
        component: Tab2,
    },
    {
        key: "tab3",
        label: "标签3",
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

详情请参见 [examples/simple-tabs-starter](./examples/simple-tabs-starter)

[![在StackBlitz中打开](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/simple-tabs-starter)

## KeepAlive 属性

类型定义

```tsx
interface KeepAliveProps {
    // 确定哪个组件处于活动状态
    activeCacheKey: string;
    children?: KeepAliveChildren;
    /**
     * 最大缓存数量 默认10
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
     * 过渡效果 默认false
     */
    transition?: boolean;
    /**
     * 过渡时间 默认200ms
     */
    duration?: number;
    aliveRef?: RefObject<KeepAliveRef | undefined>;
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
// 第三个参数是可选的,默认为true,
// 表示在首次渲染时触发useLayoutEffect时会跳过回调
```

### useKeepAliveContext

类型定义

```ts
interface KeepAliveContext {
    /**
     * 组件是否处于活动状态
     */
    active: boolean;
    /**
     * 刷新组件
     * @param {string} [cacheKey] - 组件的缓存键。如果未提供，将刷新当前缓存的组件。
     */
    refresh: (cacheKey?: string) => void;
    /**
     * 销毁组件
     * @param {string} [cacheKey] - 组件的缓存键，如果未提供，将销毁当前活动的缓存组件。
     */
    destroy: (cacheKey?: string | string[]) => Promise<void>;
    /**
     * 销毁所有组件
     */
    destroyAll: () => Promise<void>;
    /**
     * 销毁除提供的cacheKey外的其他组件
     * @param {string} [cacheKey] - 组件的缓存键。如果未提供，将销毁除当前活动缓存组件外的所有组件。
     */
    destroyOther: (cacheKey?: string) => Promise<void>;
    /**
     * 获取缓存节点
     */
    getCacheNodes: () => Array<CacheNode>;
}
```

```tsx
const { active, refresh, destroy, getCacheNodes } = useKeepAliveContext();
// active 是一个布尔值，true表示活动，false表示非活动
// refresh 是一个函数，你可以调用它来刷新组件
// destroy 是一个函数，你可以调用它来销毁组件
// ...
// getCacheNodes 是一个函数，你可以调用它来获取缓存节点
```

### useKeepAliveRef

类型定义

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
    // aliveRef.current 是一个 KeepAliveRef 对象

    // 你可以在 aliveRef.current 上调用 refresh 和 destroy
    aliveRef.current?.refresh();
    // 通常不需要手动调用 destroy,KeepAlive 会自动处理
    aliveRef.current?.destroy();

    return <KeepAlive aliveRef={aliveRef}>{/* ... */}</KeepAlive>;
}
// 或者
function AppRouter() {
    const aliveRef = useKeepAliveRef();
    // aliveRef.current 是一个 KeepAliveRef 对象

    // 你可以在 aliveRef.current 上调用 refresh 和 destroy
    aliveRef.current?.refresh();
    aliveRef.current?.destroy();
    return <KeepAliveRouteOutlet aliveRef={aliveRef} />;
}
```

## 开发

安装依赖

```bash
pnpm install
```

构建包

```bash
pnpm build
```

链接包到全局

```bash
pnpm link --global
```

在演示项目中测试

```bash
cd demo
pnpm link --global keepalive-for-react
```
