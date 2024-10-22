import { useContext } from "react";
import { CacheComponentContext } from "../components/CacheContext";

const useKeepAliveContext = () => {
    return useContext(CacheComponentContext);
};

export default useKeepAliveContext;
