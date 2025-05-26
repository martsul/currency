import { useContext } from "react";
import { AuthContext } from ".";

export const useAuth = () => {
    const data = useContext(AuthContext);
    if (!data) {
        throw new Error("Auth Context Error");
    }
    return data;
};
