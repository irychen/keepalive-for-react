import { useMemo, useState } from "react";
import { useEffectOnActive, useKeepAliveContext, KeepAlive } from "keepalive-for-react";

const tabs = [
    {
        key: "tab1",
        label: "Tab 1",
        component: Tab1,
    },
    {
        key: "tab2",
        label: "Tab 2",
        component: Tab2,
    },
    {
        key: "tab3",
        label: "Tab 3",
        component: Tab3,
    },
];

function App() {
    const [currentTab, setCurrentTab] = useState<string>("tab1");

    const tab = useMemo(() => {
        return tabs.find(tab => tab.key === currentTab);
    }, [currentTab]);

    const activeClass = "tab-item cursor-pointer text-blue-500";
    const inactiveClass = "tab-item cursor-pointer";

    return (
        <div className="text-neutral-700 text-[16px] overflow-hidden max-w-[600px] mx-auto my-[20px] border border-neutral-200 rounded-md">
            <div className="tabs bg-gray-50 h-[40px] w-full flex gap-2 justify-around items-center">
                {tabs.map(tab => (
                    <div
                        key={tab.key}
                        className={currentTab == tab.key ? activeClass : inactiveClass}
                        onClick={() => setCurrentTab(tab.key)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className="tab-content min-h-[200px]">
                <KeepAlive transition={true} activeCacheKey={currentTab} exclude={["tab3"]}>
                    {tab && <tab.component />}
                </KeepAlive>
            </div>
        </div>
    );
}

function Tab1() {
    const [text, setText] = useState("Hello KeepAlive for React");
    const { refresh } = useKeepAliveContext();
    return (
        <div className="p-[20px]">
            <div className="text-center text-lg font-bold">Tab1</div>
            <p className="text-center text-neutral-500 text-sm mt-[10px]">
                This is a demo for keepalive-for-react,
                <br /> you can use it to keep the component alive when switching tabs.
            </p>
            <textarea
                value={text}
                onChange={e => {
                    setText(e.target.value);
                }}
                className="w-full h-[100px] border border-neutral-200 rounded-md p-[10px] mt-[10px]"
            ></textarea>

            <div className="buttons text-[14px] flex gap-2 justify-center mt-[10px]">
                <button onClick={() => refresh()} className="btn bg-green-500 active:bg-green-600 px-4 py-2 rounded-md text-white">
                    Reset
                </button>
                <button onClick={() => setText("")} className="btn bg-red-500 active:bg-red-600 px-4 py-2 rounded-md text-white">
                    Clear
                </button>
            </div>
            <div className=" mt-[20px] text-[12px] text-center">
                {"Github: "}
                <a className="text-gray-500" target="_blank" href="https://github.com/irychen/keepalive-for-react">
                    {"https://github.com/irychen/keepalive-for-react"}
                </a>
            </div>
        </div>
    );
}

function Tab2() {
    const [count, setCount] = useState(0);
    const { refresh, active } = useKeepAliveContext();

    useEffectOnActive(() => {
        console.log("Tab2 Counter is active", count);
    }, [count]);
    return (
        <div className="p-[20px]">
            <div className="text-center text-lg font-bold mb-[10px]">Tab2</div>
            <div className="status text-[12px] mb-[20px] text-center text-white ">
                <span className={active ? "bg-green-600 rounded-md px-[5px] py-[2px]" : "bg-red-500 rounded-md px-[5px] py-[2px]"}>
                    Active: {active ? "true" : "false"}
                </span>
            </div>
            <div className="text-center text-xl py-[10px] rounded-md bg-neutral-50 p-[10px]">{count}</div>
            <div className="flex gap-4 justify-center mt-[20px] text-[14px]">
                <button
                    className="px-[10px] py-[5px] bg-blue-500 active:bg-blue-600 text-white rounded-md"
                    onClick={() => setCount(count + 1)}
                >
                    Increase
                </button>
                <button
                    className="px-[10px] py-[5px] bg-pink-500 active:bg-pink-600 text-white rounded-md"
                    onClick={() => setCount(count - 1)}
                >
                    Decrease
                </button>
                <button className="px-[10px] py-[5px] bg-green-500 active:bg-green-600 text-white rounded-md" onClick={() => refresh()}>
                    Refresh
                </button>
            </div>
        </div>
    );
}

function Tab3() {
    const [count, setCount] = useState(0);
    const { refresh, active } = useKeepAliveContext();

    useEffectOnActive(() => {
        console.log("Tab3 Counter is active", count, active);
    }, [count]);
    return (
        <div className="p-[20px]">
            <div className="text-center text-lg font-bold mb-[10px]">Tab3 (no cache)</div>
            <div className="text-center text-xl py-[10px] rounded-md bg-neutral-50 p-[10px]">{count}</div>
            <div className="flex gap-4 justify-center mt-[20px] text-[14px]">
                <button
                    className="px-[10px] py-[5px] bg-blue-500 active:bg-blue-600 text-white rounded-md"
                    onClick={() => setCount(count + 1)}
                >
                    Increase
                </button>
                <button
                    className="px-[10px] py-[5px] bg-pink-500 active:bg-pink-600 text-white rounded-md"
                    onClick={() => setCount(count - 1)}
                >
                    Decrease
                </button>
                <button className="px-[10px] py-[5px] bg-green-500 active:bg-green-600 text-white rounded-md" onClick={() => refresh()}>
                    Refresh
                </button>
            </div>
        </div>
    );
}

export default App;
