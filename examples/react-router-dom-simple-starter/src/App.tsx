import { Fragment } from "react";
import { RouterProvider } from "react-router";
import router from "./router";

function App() {
    return (
        <Fragment>
            <RouterProvider router={router}></RouterProvider>
        </Fragment>
    );
}

export default App;
