<p align="center">
  <img width="180" src="./react-keepalive.png" alt="keepalive-for-react logo">
</p>

<div align="center">
  <h1 align="center">
    KeepAlive for React
  </h1>
</div>

<p align="center">A React KeepAlive component like keep-alive in vue</p>

中文 | [English](./README.md)

[![NPM版本](https://img.shields.io/npm/v/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react) [![NPM下载](https://img.shields.io/npm/dm/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react)

## 介绍

一个类似于Vue中keep-alive的React KeepAlive组件

### 注意！

- 请勿使用 `<React.StrictMode />`，它无法在开发模式下与keepalive-for-react协同工作。因为当你使用keepalive-for-react的useOnActive钩子时，它可能会导致一些意外行为。

- 在Router中仅支持react-router-dom v6+ 版本

## 特性

- 支持react 16.8+ ~ 18+
- 显著减少页面中的DOM元素数量
- 支持缓存组件状态
- 简单实现，无需任何额外依赖和黑客方法
- 支持自定义缓存规则
- 高性能，无性能损失
- 易于使用，只需包装你想要缓存的组件

## 使用方法

### 安装

#### npm

```bash
npm install --save keepalive-for-react 
```

### API

#### KeepAlive

在简单的标签页中

```tsx
import KeepAlive from 'keepalive-for-react';

function TabsPage() {
  const tabs = [
    {name: 'Tab1', cache: true, component: Tab1,},
    {name: 'Tab2', cache: true, component: Tab2,},
    {name: 'Tab3', cache: false, component: Tab3,},
  ];
  const [activeTab, setActiveTab] = useState('Tab1');

  const page = useMemo(() => {
    return tabs.find(tab => tab.name === activeTab);
  }, [activeTab]);

  return   <div>
    <KeepAlive
      max={20} strategy={'PRE'} activeName={activeTab} cache={page?.cache}
    >
      {page && <page.component name={page.name} />}
    </KeepAlive>
  </div>
}
```


在react-router-dom中 v6+

```tsx
import {useLocation, useOutlet} from 'react-router-dom';

function BasicLayoutWithCache() {
  
  const outlet = useOutlet();
  const location = useLocation();


  /**
   * 用于区分不同页面以进行缓存
   */
  const cacheKey = useMemo(() => {
    return location.pathname + location.search;
  }, [location]);


  return <div>
    <KeepAlive activeName={cacheKey} max={10} strategy={'LRU'}>
      {outlet}
    </KeepAlive>
  </div>
}
```


#### useEffectOnActive / useLayoutEffectOnActive

useEffectOnActive是一个钩子，用于监听被KeepAlive包装的组件的激活状态。

```tsx

import {useEffectOnActive} from 'keepalive-for-react';

useEffectOnActive((active) => {
    console.log('useOnActive', active);
}, false, []);

```

#### useKeepAliveContext

useKeepAliveContext是一个钩子，用于获取KeepAlive CacheComponent上下文。

```tsx
import {useKeepAliveContext} from 'keepalive-for-react';

function CachedComponent() {
  
  const { active, destroy, refresh} = useKeepAliveContext();
  // active: boolean, 组件是否激活
  // destroy: () => void, 从缓存中销毁组件
  // refresh: (name?: string) => void, 刷新缓存中的组件

  // ...
}
```

### KeepAlive Props

```tsx
interface Props {
    children: ReactNode;
    /**
     * active name
     */
    activeName: string;
    /**
     * max cache count default 10
     */
    max?: number;
    /**
     * cache: boolean default true
     */
    cache?: boolean;
    /**
     * maxRemoveStrategy: 'PRE' | 'LRU' default 'PRE'
     *
     * PRE: remove the first cacheNode
     *
     * LRU: remove the least recently used cacheNode
     */
    strategy?: "PRE" | "LRU";
    /**
     * aliveRef: KeepAliveRef
     *
     * aliveRef is a ref to get caches, remove cache by name, clean all cache, clean other cache except current
     *
     */
    aliveRef?: RefObject<KeepAliveRef | undefined> | MutableRefObject<KeepAliveRef | undefined>;

    exclude?: Array<string | RegExp> | string | RegExp;

    include?: Array<string | RegExp> | string | RegExp;

    /**
     * suspenseElement: Suspense Wrapper Component
     */
    suspenseElement?: ComponentType<{
        children: ReactNode,
    }>;

    /**
     *  errorElement: for every cacheNode's ErrorBoundary
     */
    errorElement?: ComponentType<{
        children: ReactNode,
    }>;
    animationWrapper?: ComponentType<{
        children: ReactNode
    }>

    /**
     * onBeforeActive: callback before active
     * @param name
     *
     * you can do something before active like set style for dropdown
     *
     * example:
     * ```tsx
     * // if your react version is 18 or higher, you don't need to use onBeforeActive fix the style flashing issue
     * // fix the style flashing issue when using Antd Dropdown and Select components, which occurs when the components are wrapped by Suspense and cached.
     *
     * // set .ant-select-dropdown .ant-picker-dropdown style to ''
     * const dropdowns = document.querySelectorAll('.ant-select-dropdown');
     * dropdowns.forEach(dropdown => {
     *     if (dropdown) {
     *         dropdown.setAttribute('style', '');
     *     }
     * });
     *
     * const pickerDropdowns = document.querySelectorAll('.ant-picker-dropdown');
     * pickerDropdowns.forEach(pickerDropdown => {
     *     if (pickerDropdown) {
     *         pickerDropdown.setAttribute('style', '');
     *     }
     * });
     * ```
     */
    onBeforeActive?: (name: string) => void
    /**
     *  containerDivRef: root node to mount cacheNodes
     */
    containerDivRef?: MutableRefObject<HTMLDivElement>
    /**
     *  cacheDivClassName: className set for cacheNodes
     */
    cacheDivClassName?: string
    /**
     * async: whether to use async to render current cacheNode default false
     */
    async?: boolean
    /**
     * microAsync: whether to use microAsync to render current cacheNode default true
     */
    microAsync?: boolean
}

type KeepAliveRef = {
    getCaches: () => Array<CacheNode>

    /**
     * remove cacheNode by name
     * @param name cacheNode name to remove
     * @returns
     */
    removeCache: (name: string) => Promise<void>

    /**
     * clean all cacheNodes
     */
    cleanAllCache: () => void

    /**
     * clean other cacheNodes except current active cacheNode
     */
    cleanOtherCache: () => void

    /**
     * refresh cacheNode by name
     * @param name cacheNode name to refresh if name is not provided, refresh current active cacheNode
     */
    refresh: (name?: string) => void
}
```

#### useKeepaliveRef

```tsx
import { useKeepaliveRef } from "keepalive-for-react"

function Example() {

    const aliveRef = useKeepaliveRef()
    
    function clean(){
        aliveRef.current?.cleanAllCache()
    }
    // ...
    
    return <KeepAlive aliveRef={aliveRef} >
        ...
    </KeepAlive>
}

```


## 完整代码使用示例

链接到 [React Keepalive Demo Repo](https://github.com/irychen/react-keepalive-demo)

在线预览Demo: [链接: https://irychen.github.io/react-keepalive-demo/](https://irychen.github.io/react-keepalive-demo/)
