<p align="center">
  <img width="180" src="./react-keepalive.png" alt="keepalive-for-react logo">
</p>

<div align="center">
  <h1 align="center">
    KeepAlive for React
  </h1>
</div>

<p align="center">A React KeepAlive component like keep-alive in vue</p>

[中文](./README.zh_CN.md) | English

[![NPM version](https://img.shields.io/npm/v/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react) [![NPM downloads](https://img.shields.io/npm/dm/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react)


**Attention!**

- DO NOT use <React.StrictMode />, it CANNOT work with keepalive-for-react in development mode. because it can lead to
some unexpected behavior when you use keepalive-for-react's useOnActive hook.

- In Router only support react-router-dom v6+

## Features

- support react 16.8+ ~ 18+
- dramatically reduce the number of dom elements in the page
- support for caching component state
- simply implement, without any extra dependencies and hacking ways
- support for custom cache rules
- high performance, no performance loss
- easy to use, just wrap the component you want to cache

## Usage

### Install

#### npm

```bash
npm install --save keepalive-for-react 
```

### APIs

#### KeepAlive

in simple tabs

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


in react-router-dom v6+

```tsx
import {useLocation, useOutlet} from 'react-router-dom';

function BasicLayoutWithCache() {
  
  const outlet = useOutlet();
  const location = useLocation();


  /**
   * to distinguish different pages to cache
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

useEffectOnActive is a hook to listen to the active state of the component which is wrapped by KeepAlive.

```tsx

import {useEffectOnActive} from 'keepalive-for-react';

useEffectOnActive((active) => {
    console.log('useOnActive', active);
}, false, []);

```

#### useKeepAliveContext

useKeepAliveContext is a hook to get the KeepAlive CacheComponent context.

```tsx
import {useKeepAliveContext} from 'keepalive-for-react';

function CachedComponent() {
  
  const { active, destroy, refresh} = useKeepAliveContext();
  // active: boolean, whether the component is active
  // destroy: () => void, destroy the component from cache
  // refresh: (name?: string) => void, refresh the component from cache
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


## Full Code Usage Example

link to [React Keepalive Demo Repo](https://github.com/irychen/react-keepalive-demo)

Preview Online Demo: [Link: https://irychen.github.io/react-keepalive-demo/](https://irychen.github.io/react-keepalive-demo/)


## Forum

- [Discord](https://discord.gg/ycf896w7eA)


