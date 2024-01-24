# KeepAlive for React

[中文](./README.zh_CN.md) | English

## introduction

A React KeepAlive component like keep-alive in vue

### Attention !

DO NOT use <React.StrictMode />, it CANNOT work with keepalive-for-react in development mode. because it can lead to some unexpected behavior when you use keepalive-for-react's useOnActive hook.

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

#### yarn
```bash
yarn add keepalive-for-react 
```

#### pnpm
```bash
pnpm add keepalive-for-react 
```

### Example for Router ( complex usage )

Please see layout component [admin example](https://github.com/irychen/super-admin/blob/main/src/layout/index.tsx)

also see [super admin](https://github.com/irychen/super-admin)

### Example for Simple Usage

[Link: codesandbox Demo](https://codesandbox.io/s/keepaliev-simple-demo-8tkp63?file=/src/App.js)

![preview](./demo-simple-keepalive.gif)

```tsx
import { Card, Input, Tabs } from "antd"
import { useMemo, useState } from "react"
import KeepAlive, { useOnActive } from "keepalive-for-react"

function KeepAliveDemo() {
    const keepAliveRef = useRef<KeepAliveRef>(null)
    const [activeName, setActiveName] = useState("TabA")
    const showTabs = [
        {
            name: "TabA",
            component: TabA,
            cache: true,
        },
        {
            name: "TabB",
            component: TabB,
            cache: false,
        },
    ]
  
    const currentTab = useMemo(() => {
        return showTabs.find(item => item.name === activeName)!
    }, [activeName])
  
    const clearAllCache = () => {
        keepAliveRef.current?.cleanAllCache()
    }
    
    const getCaches = () => {
        console.log(keepAliveRef.current?.getCaches())
    }
    
    const removeCache = () => {
        keepAliveRef.current?.removeCache("TabA")
    }
    
    const cleanOtherCache = () => {
        keepAliveRef.current?.cleanOtherCache()
    }

    return (
        <Card title={"KeepAliveDemo (无Router示例)"}>
            <Tabs
                activeKey={activeName}
                onChange={activeKey => {
                    setActiveName(activeKey)
                }}
                items={showTabs.map(item => {
                    return {
                        label: item.name,
                        key: item.name,
                    }
                })}
            ></Tabs>
            <KeepAlive
              aliveRef={keepAliveRef}
              activeName={activeName} 
              cache={currentTab.cache}>
                {<currentTab.component />}
            </KeepAlive>
        </Card>
    )
}

function TabA() {
    const domRef = useOnActive(() => {
        console.log("TabA onActive") // this will be trigger when tabA is active
    })
    return (
        <div ref={domRef}>
            <h1 className={"py-[15px] font-bold"}>TabA cached</h1>
            <Input placeholder="输入一个值 然后切换tab组件不会被销毁"></Input>
        </div>
    )
}

function TabB() {
    const domRef = useOnActive(() => {
        console.log("TabB onActive") // no cache won't trigger onActive
    })
    return (
        <div ref={domRef}>
            <h1 className={"py-[15px] font-bold"}>TabB nocache</h1>
            <Input placeholder="输入一个值 然后切换tab组件会被销毁"></Input>
        </div>
    )
}

export default KeepAliveDemo
```

