import { useContext } from "react";
import { LoadingContext } from ".";

export const useLoading = () => {
    const data = useContext(LoadingContext);

    if (!data) {
        throw new Error("Loading Context Error");
    }

    return data;
};
