export function isNil(value: any): value is null | undefined {
    return value === null || value === undefined;
}

export function isRegExp(value: any): value is RegExp {
    return Object.prototype.toString.call(value) === "[object RegExp]";
}

export function isArr(value: any): value is Array<any> {
    return Array.isArray(value);
}

export function isFn(value: any): value is Function {
    return typeof value === "function";
}

export function domAttrSet(dom: HTMLDivElement) {
    return {
        set: (key: string, value: string) => {
            dom.setAttribute(key, value);
            return domAttrSet(dom);
        },
    };
}

export function delayAsync(milliseconds: number = 100): Promise<void> {
    let _timeID: null | number | NodeJS.Timeout;
    return new Promise<void>((resolve, _reject) => {
        _timeID = setTimeout(() => {
            resolve();
            if (!isNil(_timeID)) {
                clearTimeout(_timeID);
            }
        }, milliseconds);
    });
}

export function isInclude(include: Array<string | RegExp> | string | RegExp | undefined, val: string) {
    const includes = isArr(include) ? include : isNil(include) ? [] : [include];
    return includes.some(include => {
        if (isRegExp(include)) {
            return include.test(val);
        } else {
            return val === include;
        }
    });
}
