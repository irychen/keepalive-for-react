<p align="center">
  <img width="120" src="./react-keepalive.png" alt="keepalive-for-react logo">
</p>

<div align="center">
  <h1 align="center">
    KeepAlive for React
  </h1>
</div>

<p align="center">一个类似 Vue keep-alive 的 React 组件</p>

[English](./README.md) | 中文

[![NPM version](https://img.shields.io/npm/v/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react) [![NPM downloads](https://img.shields.io/npm/dm/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react)

## 特性

- 支持 react-router-dom v6+
- 支持 React v16+ ~ v18+
- 支持 Suspense 和 懒加载
- 支持错误边界
- 支持自定义容器
- 支持使用 `active` 和 `inactive` className 实现切换动画
- 简单实现，无任何额外依赖和黑魔法

## 注意事项

- 不要使用 <React.StrictMode />，在开发模式下它无法与 keepalive-for-react 一起工作，会导致一些意外的行为。

- 路由部分仅支持 react-router-dom v6+

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

### 在 react-router-dom v6+ 中使用

1. 安装 react-router-dom v6+

```bash
npm install react-router-dom keepalive-for-react
```

2. 在项目中使用 KeepAlive

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

详细示例请查看 [examples/react-router-dom-simple-starter](./examples/react-router-dom-simple-starter)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/react-router-dom-simple-starter)

### 在简单的标签页中使用

```bash
npm install keepalive-for-react
```

```tsx
const tabs = [
    {
        key: "tab1",
        label: "标签页 1",
        component: Tab1,
    },
    {
        key: "tab2",
        label: "标签页 2", 
        component: Tab2,
    },
    {
        key: "tab3",
        label: "标签页 3",
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

详细示例请查看 [examples/simple-tabs-starter](./examples/simple-tabs-starter)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/simple-tabs-starter)

## KeepAlive 属性

类型定义

```tsx
interface KeepAliveProps {
    // 决定哪个组件处于激活状态
    activeCacheKey: string;
    children?: KeepAliveChildren;
    /**
     * 最大缓存数量，默认 10
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
     * 切换动画，默认 false
     */
    transition?: boolean;
    /**
     * 过渡持续时间，默认 200ms
     */
    duration?: number;
    aliveRef?: RefObject<KeepAliveRef | undefined>;
}
```

## Hooks

### useEffectOnActive

```tsx
useEffectOnActive(() => {
    console.log("激活");
}, []);
```

### useLayoutEffectOnActive

```tsx
useLayoutEffectOnActive(
    () => {
        console.log("激活");
    },
    [],
    false, 
); 
// 第三个参数是可选的，默认为 true
// 表示在首次渲染时是否跳过回调执行
```

### useKeepAliveContext

类型定义

```ts
interface KeepAliveContext {
    /**
     * 组件是否处于激活状态
     */
    active: boolean;
    /**
     * 刷新组件
     * @param cacheKey - 组件的缓存键,
     * 如果未提供，将刷新当前激活缓存的组件
     */
    refresh: (cacheKey?: string) => void;
}
```

```tsx
const { active, refresh } = useKeepAliveContext();
// active 是一个布尔值,true 表示激活,false 表示未激活
// refresh 是一个函数,可以调用它来刷新组件
```

### useKeepaliveRef 

类型定义

```ts
interface KeepAliveRef {
    refresh: (cacheKey?: string) => void;
    destroy: (cacheKey: string) => Promise<void>;
}
```

```tsx
function App() {
    const aliveRef = useKeepaliveRef();
    // aliveRef.current 是一个 KeepAliveRef 对象

    // 你可以在 aliveRef.current 上调用 refresh 和 destroy
    aliveRef.current?.refresh();
    aliveRef.current?.destroy();

    return <KeepAlive aliveRef={aliveRef}>{/* ... */}</KeepAlive>;
}
// 或者
function AppRouter() {
    const aliveRef = useKeepaliveRef(); 
    // aliveRef.current 是一个 KeepAliveRef 对象

    // 你可以在 aliveRef.current 上调用 refresh 和 destroy
    aliveRef.current?.refresh();
    // 通常不需要手动调用 destroy，KeepAlive 会自动处理
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

链接到全局

```bash
pnpm link --global
```

在 demo 项目中测试

```bash
cd demo
pnpm link --global keepalive-for-react
```