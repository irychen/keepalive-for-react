# KeepAlive for React

[中文](./README.zh_CN.md) | English

## introduction

React KeepAlive is a component that can cache the state of the component and reuse it when needed.

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

```tsx
import { Card, Input, Tabs } from "antd"
import { useMemo, useState } from "react"
import KeepAlive, { useOnActive } from "keepalive-for-react"

function KeepAliveDemo() {
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
            <KeepAlive activeName={activeName} cache={currentTab.cache}>
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

