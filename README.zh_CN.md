# React的KeepAlive

[中文](./README.zh_CN.md) | 英文

[![NPM版本](https://img.shields.io/npm/v/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react) [![NPM下载](https://img.shields.io/npm/dm/keepalive-for-react.svg?style=flat)](https://npmjs.com/package/keepalive-for-react)

## 介绍

一个类似于Vue中keep-alive的React KeepAlive组件

### 注意！

请勿使用 `<React.StrictMode />`，它无法在开发模式下与keepalive-for-react协同工作。因为当你使用keepalive-for-react的useOnActive钩子时，它可能会导致一些意外行为。

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


在react-router-dom中

```tsx
import {useLocation, useOutlet} from 'react-router-dom';

function BasicLayoutWithCache() {
  
  const outlet = useOutlet();
  const location = useLocation();


  /**
   * 用于区分不同页面以进行缓存
   */
  const cacheKey = useMemo(() => {
    return location.pathname + location.search + location.hash;
  }, [location]);


  return <div>
    <KeepAlive activeName={cacheKey} max={10} strategy={'LRU'}>
      {outlet}
    </KeepAlive>
  </div>
}
```


#### useOnActive

useOnActive是一个钩子，用于监听被KeepAlive包装的组件的激活状态。

```tsx

import {useOnActive} from 'keepalive-for-react';

useOnActive((active) => {
    console.log('useOnActive', active);
}, false);

```

#### useKeepAliveContext

useKeepAliveContext是一个钩子，用于获取KeepAlive CacheComponent上下文。

```tsx
import {useKeepAliveContext} from 'keepalive-for-react';

function CachedComponent() {
  
  const { active, destroy} = useKeepAliveContext();
  // active: boolean, 组件是否激活
  // destroy: () => void, 从缓存中销毁组件

  // ...
}
```


## 完整代码使用示例

链接到 [React Keepalive Demo Repo](https://github.com/irychen/react-keepalive-demo)

在线预览Demo: [链接: https://irychen.github.io/react-keepalive-demo/](https://irychen.github.io/react-keepalive-demo/)