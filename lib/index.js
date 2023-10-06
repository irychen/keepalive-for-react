import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useLayoutEffect, Fragment, memo, useImperativeHandle, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';

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
            return cacheReactNodes;
        });
    }, [children, cache, activeName, exclude, maxLen, include]);
    return (jsxs(Fragment, { children: [jsx("div", { ref: containerRef, className: "keep-alive" }), cacheReactNodes === null || cacheReactNodes === void 0 ? void 0 : cacheReactNodes.map(function (_a) {
                var name = _a.name, cache = _a.cache, ele = _a.ele;
                return (jsx(CacheComponent, { cache: cache, active: name === activeName, renderDiv: containerRef, name: name, children: ele }, name));
            })] }));
});

function useOnActive(cb, skipMount) {
    if (skipMount === void 0) { skipMount = true; }
    var domRef = useRef(null);
    var location = useLocation();
    var isMount = useRef(false);
    useEffect(function () {
        var _a;
        var destroyCb;
        if (domRef.current) {
            var parent_1 = (_a = domRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
            if (parent_1) {
                var id = parent_1.id;
                var fullPath = location.pathname + location.search;
                if (id === fullPath) {
                    if (skipMount) {
                        if (isMount.current)
                            destroyCb = cb();
                    }
                    else {
                        destroyCb = cb();
                    }
                }
            }
        }
        isMount.current = true;
        return function () {
            if (destroyCb && typeof destroyCb === "function") {
                destroyCb();
            }
        };
    }, [location]);
    return domRef;
}

export { KeepAlive as default, useOnActive };
