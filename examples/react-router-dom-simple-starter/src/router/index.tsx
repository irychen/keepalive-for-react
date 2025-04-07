import { createBrowserRouter } from "react-router";
import Layout from "../layout";
import { lazy } from "react";
import Nested from "../pages/nested";
import NestedA from "../pages/nested/nested-a";
import NestedB from "../pages/nested/nested-b";
// import Home from "../pages/home";
// import About from "../pages/about";
// import Counter from "../pages/counter";
// import NoCacheCounter from "../pages/nocache-counter";

// lazy load
const Home = lazy(() => import("../pages/home"));
const About = lazy(() => import("../pages/about"));
const Counter = lazy(() => import("../pages/counter"));
const NoCacheCounter = lazy(() => import("../pages/nocache-counter"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/counter",
                element: <Counter />,
            },
            {
                path: "/nocache-counter",
                element: <NoCacheCounter />,
            },
            {
                path: "/nested",
                element: <Nested />,
                children: [
                    {
                        path: "nested-a",
                        element: <NestedA />,
                    },
                    {
                        path: "nested-b",
                        element: <NestedB />,
                    },
                ],
            },
        ],
    },
]);

export default router;
