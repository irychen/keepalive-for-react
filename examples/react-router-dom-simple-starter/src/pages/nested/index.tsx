import { Outlet } from "react-router";

function Nested() {
    return (
        <div>
            <h1 className="text-center text-xl font-bold py-[10px]">Nested</h1>
            <Outlet />
        </div>
    );
}

export default Nested;
