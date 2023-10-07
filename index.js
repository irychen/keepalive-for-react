import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useLayoutEffect, Fragment, createContext, useContext, memo, useImperativeHandle, useEffect } from 'react';
import { createPortal } from 'react-dom';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function CacheComponent(_a) {
    var active = _a.active, cache = _a.cache, children = _a.children, name = _a.name, renderDiv = _a.renderDiv;
    var targetElement = useState(function () {
        var container = document.createElement("div");
        container.setAttribute("id", name);
        container.className = "cache-component " + name + " " + (cache ? "cached" : "no-cache");
        return container;
    })[0];
    var activatedRef = useRef(false);
    activatedRef.current = activatedRef.current || active;
    useLayoutEffect(function () {
        var _a, _b;
        if (active) {
            (_a = renderDiv.current) === null || _a === void 0 ? void 0 : _a.appendChild(targetElement);
        }
        else {
            try {
                (_b = renderDiv.current) === null || _b === void 0 ? void 0 : _b.removeChild(targetElement);
            }
            catch (e) {
                console.log(e, "removeChild error");
            }
        }
    }, [active, renderDiv, targetElement, children]);
    return jsx(Fragment, { children: activatedRef.current && createPortal(children, targetElement) });
}

var KeepAliveContext = createContext({
    activeName: undefined,
    setActiveName: function (name) {
        console.log(name);
    },
});
var useKeepAliveContext = function () {
    return useContext(KeepAliveContext);
};
function KeepAliveProvider(props) {
    var initialActiveName = props.initialActiveName, children = props.children;
    var _a = useState(initialActiveName), activeName = _a[0], setActiveName = _a[1];
    useLayoutEffect(function () {
        setActiveName(initialActiveName);
    }, [initialActiveName]);
    return jsx(KeepAliveContext.Provider, { value: { activeName: activeName, setActiveName: setActiveName }, children: children });
}

function isNil(value) {
    return value === null || value === undefined;
}
var KeepAlive = memo(function KeepAlive(props) {
    var activeName = props.activeName, cache = props.cache, children = props.children, exclude = props.exclude, include = props.include, maxLen = props.maxLen, aliveRef = props.aliveRef;
    var containerRef = useRef(null);
    var _a = useState([]), cacheReactNodes = _a[0], setCacheReactNodes = _a[1];
    useImperativeHandle(aliveRef, function () { return ({
        getCaches: function () { return cacheReactNodes; },
        removeCache: function (name) {
            setTimeout(function () {
                setCacheReactNodes(function (cacheReactNodes) {
                    return cacheReactNodes.filter(function (res) { return res.name !== name; });
                });
            }, 0);
        },
        cleanAllCache: function () {
            setCacheReactNodes([]);
        },
        cleanOtherCache: function () {
            setCacheReactNodes(function (cacheReactNodes) {
                return cacheReactNodes.filter(function (_a) {
                    var name = _a.name;
                    return name === activeName;
                });
            });
        },
    }); }, [cacheReactNodes, setCacheReactNodes, activeName]);
    useLayoutEffect(function () {
        if (isNil(activeName)) {
            return;
        }
        setCacheReactNodes(function (cacheReactNodes) {
            if (cacheReactNodes.length >= (maxLen || 20)) {
                cacheReactNodes = cacheReactNodes.slice(1, cacheReactNodes.length);
            }
            // remove exclude
            if (exclude && exclude.length > 0) {
                cacheReactNodes = cacheReactNodes.filter(function (_a) {
                    var name = _a.name;
                    return !(exclude === null || exclude === void 0 ? void 0 : exclude.includes(name));
                });
            }
            // only keep include
            if (include && include.length > 0) {
                cacheReactNodes = cacheReactNodes.filter(function (_a) {
                    var name = _a.name;
                    return include === null || include === void 0 ? void 0 : include.includes(name);
                });
            }
            // remove cache false
            cacheReactNodes = cacheReactNodes.filter(function (_a) {
                var cache = _a.cache;
                return cache;
            });
            var cacheReactNode = cacheReactNodes.find(function (res) { return res.name === activeName; });
            if (isNil(cacheReactNode)) {
                cacheReactNodes.push({
                    cache: cache !== null && cache !== void 0 ? cache : true,
                    name: activeName,
                    ele: children,
                });
            }
            else {
                // important update children when activeName is same
                // this can trigger children onActive
                cacheReactNodes = cacheReactNodes.map(function (res) {
                    return res.name === activeName ? __assign(__assign({}, res), { ele: children }) : res;
                });
            }
            return cacheReactNodes;
        });
    }, [children, cache, activeName, exclude, maxLen, include]);
    return (jsxs(Fragment, { children: [jsx("div", { ref: containerRef, className: "keep-alive" }), jsx(KeepAliveProvider, { initialActiveName: activeName, children: cacheReactNodes === null || cacheReactNodes === void 0 ? void 0 : cacheReactNodes.map(function (_a) {
                    var name = _a.name, cache = _a.cache, ele = _a.ele;
                    return (jsx(CacheComponent, { active: name === activeName, renderDiv: containerRef, cache: cache, name: name, children: ele }, name));
                }) })] }));
});

var useOnActive = function (cb, skipMount) {
    if (skipMount === void 0) { skipMount = true; }
    var domRef = useRef(null);
    var activeName = useKeepAliveContext().activeName;
    var isMount = useRef(false);
    useEffect(function () {
        var _a;
        var destroyCb;
        var parent = (_a = domRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
        var name = parent === null || parent === void 0 ? void 0 : parent.id;
        if (parent && name) {
            if (activeName === name) {
                if (skipMount) {
                    if (isMount.current)
                        destroyCb = cb();
                }
                else {
                    destroyCb = cb();
                }
                isMount.current = true;
                return function () {
                    if (destroyCb && typeof destroyCb === "function") {
                        destroyCb();
                    }
                };
            }
        }
    }, [activeName]);
    return domRef;
};

export { KeepAlive as default, useOnActive };
