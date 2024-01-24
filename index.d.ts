import {ReactNode,ComponentClass, ReactElement, JSXElementConstructor, RefObject, ComponentType} from 'react'

export interface ComponentReactElement {
    children?: ReactNode | ReactNode[] | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined | any
}

export type KeepAliveRef = {
    getCaches: () => Array<{ name: string; ele?: ReactNode }>
    /**
     * 清除指定缓存
     * @param name
     */
    removeCache: (name: string) => void
    /**
     * 清除所有缓存
     */
    cleanAllCache: () => void
    /**
     * 清除其他缓存 除了当前的
     */
    cleanOtherCache: () => void
}

interface KeepAliveProps extends ComponentReactElement {
    activeName: string
    include?: Array<string>
    exclude?: Array<string>
    maxLen?: number
    cache?: boolean
    aliveRef?: RefObject<KeepAliveRef>
    errorElement?:  ComponentType<any> | null
    suspenseElement?: ComponentType<any> | null
    children?: ReactNode | ReactNode[] | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined | any
}

const KeepAlive = (props: KeepAliveProps) => JSX.Element

export function useOnActive(cb: () => any, skipMount?: boolean): RefObject<HTMLDivElement>

export function useOnActiveByRef(ref: RefObject<HTMLDivElement>, cb: () => any, skipMount?: boolean): void

export default KeepAlive