import { useEffectOnActive } from "keepalive-for-react";
import { useRef } from "react";

function Home() {
    const domRef = useRef<HTMLDivElement>(null);
    useEffectOnActive(
        () => {
            console.log("Home is active");
            const dom = domRef.current;
            if (dom) {
                // if transition is true, the dom size will be 0, because the dom is not rendered yet
                console.log(`home dom size: height ${dom.clientHeight}px  width ${dom.clientWidth}px`);
                setTimeout(() => {
                    console.log(`home dom size: height ${dom.clientHeight}px  width ${dom.clientWidth}px`);
                }, 300);
            }
        },
        [],
        true,
    );

    return (
        <div className="p-[20px]" ref={domRef}>
            <h1 className="text-center text-xl font-bold py-[10px]">Home</h1>
            <p className="text-center text-neutral-500">
                Welcome to the home page, this is a simple example of how to use keepalive-for-react with react-router-dom.
            </p>
            <h2 className="text-lg font-bold mt-[10px] mb-[5px]">Install</h2>
            <code className="block w-full bg-gray-100 p-[10px] rounded-md">
                <pre className="text-[12px] whitespace-pre-wrap">{`npm install keepalive-for-react react-router-dom`}</pre>
            </code>
            <div className=" text-neutral-500 mt-[30px]">{"./src/layout/index.tsx"}</div>
            <code className="block w-full bg-gray-100 p-[10px] rounded-md mt-[10px]">
                <pre className="text-[12px] whitespace-pre-wrap">{`<KeepAliveRouteOutlet duration={300} transition={true} />`}</pre>
            </code>
            <div className=" mt-[30px]">
                {"Github: "}
                <a className="text-blue-500" target="_blank" href="https://github.com/irychen/keepalive-for-react">
                    {"https://github.com/irychen/keepalive-for-react"}
                </a>
            </div>
            <div className="min-h-[600px]"></div>
        </div>
    );
}

export default Home;
