import { createContext, memo, ReactNode, useContext, useLayoutEffect, useState } from "react"

export interface KeepAliveContextProps {
    activeName: string | undefined
    setActiveName: (name: string) => void
}

const KeepAliveContext = createContext<KeepAliveContextProps>({
    activeName: undefined,
    setActiveName: (name: string) => {
        console.log(name)
    },
} as KeepAliveContextProps)

export const useKeepAliveContext = () => {
    return useContext(KeepAliveContext)
}

function KeepAliveProvider(props: { children?: ReactNode; initialActiveName?: string }) {
    const { initialActiveName, children } = props
    const [activeName, setActiveName] = useState<string | undefined>(initialActiveName)
    useLayoutEffect(() => {
        setActiveName(initialActiveName)
    }, [initialActiveName])
    return <KeepAliveContext.Provider value={{ activeName, setActiveName }}>{children}</KeepAliveContext.Provider>
}

export default memo(KeepAliveProvider)
