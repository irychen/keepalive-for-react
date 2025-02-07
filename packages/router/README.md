# KeepAlive for React Router

## Installation

```bash
npm install keepalive-for-react keepalive-for-react-router
```

### v6+

```bash
npm install react-router-dom keepalive-for-react keepalive-for-react-router@1.x.x
```

### v7+

```bash
npm install react-router keepalive-for-react keepalive-for-react-router@2.x.x
```

## Usage

```tsx
// v6+ keepalive-for-react-router@1.x.x
// v7+ keepalive-for-react-router@2.x.x
import KeepAliveRouteOutlet from "keepalive-for-react-router";

function Layout() {
    return (
        <div className="layout">
            <KeepAliveRouteOutlet />
        </div>
    );
}
```
