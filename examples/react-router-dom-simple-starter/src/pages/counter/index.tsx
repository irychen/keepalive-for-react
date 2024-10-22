import { useEffectOnActive, useKeepAliveContext } from "keepalive-for-react";
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);
    const { refresh, active } = useKeepAliveContext();

    useEffectOnActive(() => {
        console.log("Counter is active", count);
    }, [count]);

    return (
        <div className="p-[20px]">
            <h1 className="text-center text-xl font-bold py-[10px]">Counter</h1>
            <div className="status text-[12px] mb-[10px] text-center text-white ">
                <span className={active ? "bg-green-600 rounded-md px-[5px] py-[2px]" : "bg-red-500 rounded-md px-[5px] py-[2px]"}>Active: {active ? "true" : "false"}</span>
            </div>
            <div className="text-center text-xl py-[10px] rounded-md bg-neutral-50 p-[10px]">{count}</div>
            <div className="flex gap-4 justify-center mt-[15px]">
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

export default Counter;
