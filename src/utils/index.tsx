export function isNil(value: any): value is null | undefined {
    return value === null || value === undefined
}

export function isRegExp(value: any): value is RegExp {
    return Object.prototype.toString.call(value) === "[object RegExp]"
}

export function isArr(value: any): value is Array<any> {
    return Array.isArray(value)
}

export function isFn(value: any): value is Function {
    return typeof value === "function"
}
