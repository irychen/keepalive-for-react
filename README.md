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

### Example for Router

```jsx
import React from 'react';
import KeepAlive, { KeepAliveRef } from "keepalive-for-react"
import { useOnActiveByName, useOnActive } from "react-keepalive"
import { useLocation, useNavigate, useRoutes } from "react-router-dom"

function Layout(){
    const keepAliveRef = useRef<KeepAliveRef>(null)
    const location = useLocation()
    const ele = useRoutes(routes, location)
    
    return <div className={'layout'}>
        <KeepAlive
            aliveRef={keepAliveRef}
            cache={matchRouteObj?.cache}
            activeName={activeKey}
            maxLen={20}
        >
            {ele}
        </KeepAlive>
    </div>
}
```

         