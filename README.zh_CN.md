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
- 支持 Suspense 和懒加载导入
- 支持错误边界
- 支持自定义容器
- 支持切换动画过渡(使用 `active` 和 `inactive` 类名)
- 实现简单,无需任何额外依赖和 hack 方式

## 注意事项

- 请勿使用 <React.StrictMode />,它在开发模式下将无法与 keepalive-for-react 一起工作,因为这可能导致一些意外行为。

- 在路由中只支持 react-router-dom v6+

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

## 使用方法

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

详情请参考 [examples/react-router-dom-simple-starter](./examples/react-router-dom-simple-starter)

[![在 StackBlitz 中打开](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/react-router-dom-simple-starter)

### 在简单的 tabs 中使用

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

详情请参考 [examples/simple-tabs-starter](./examples/simple-tabs-starter)

[![在 StackBlitz 中打开](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/irychen/keepalive-for-react/tree/main/examples/simple-tabs-starter)

## KeepAlive Props

类型定义

```tsx
interface KeepAliveProps {
    // 决定哪个组件处于激活状态
    activeCacheKey: string;
    children?: KeepAliveChildren;
    /**
     * 最大缓存数量,默认 10
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
     * 过渡效果,默认 false
     */
    transition?: boolean;
    /**
     * 过渡持续时间,默认 200
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
// 第三个参数可选,默认为 true
// 表示当 useLayoutEffect 在第一次渲染时触发时,回调函数是否会被跳过
```

### useKeepAliveContext

类型定义

```ts
interface KeepAliveContext {
    /**
     * 判断组件是否处于激活状态
     */
    active: boolean;
    /**
     * 刷新组件
     * @param cacheKey - 组件的缓存键,如果未提供,则刷新当前缓存的组件
     */
    refresh: (cacheKey?: string) => void;
    /**
     * 销毁组件
     * @param cacheKey - 组件的缓存键,如果未提供,则销毁当前激活的缓存组件
     */
    destroy: (cacheKey: string | string[]) => Promise<void>;
    /**
     * 销毁所有组件
     */
    destroyAll: () => Promise<void>;
    /**
     * 销毁其他组件
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
// active 是一个布尔值,true 表示激活,false 表示未激活
// refresh 是一个函数,你可以调用它来刷新组件
// destroy 是一个函数,你可以调用它来销毁组件
// ...
// getCacheNodes 是一个函数,你可以调用它来获取缓存节点
```

### useKeepaliveRef

类型定义

```ts
interface KeepAliveRef {
    refresh: (cacheKey?: string) => void;
    destroy: (cacheKey: string | string[]) => Promise<void>;
    destroyAll: () => Promise<void>;
    destroyOther: (cacheKey?: string) => Promise<void>;
    getCacheNodes: () => Array<CacheNode>;
}
```

```tsx
function App() {
    const aliveRef = useKeepaliveRef();
    // aliveRef.current 是一个 KeepAliveRef 对象
    
    // 你可以在 aliveRef.current 上调用 refresh 和 destroy
    aliveRef.current?.refresh();
    // 不需要手动调用 destroy,KeepAlive 会自动处理
    aliveRef.current?.destroy();
    
    return <KeepAlive aliveRef={aliveRef}>{/* ... */}</KeepAlive>
}
// 或者
function AppRouter() {
    const aliveRef = useKeepaliveRef();
    // aliveRef.current 是一个 KeepAliveRef 对象
    
    // 你可以在 aliveRef.current 上调用 refresh 和 destroy  
    aliveRef.current?.refresh();
    aliveRef.current?.destroy();
    return <KeepAliveRouteOutlet aliveRef={aliveRef} />
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

全局链接包

```bash
pnpm link --global
```

在示例项目中测试

```bash
cd demo
pnpm link --global keepalive-for-react
```