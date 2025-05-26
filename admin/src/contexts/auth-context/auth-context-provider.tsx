import { useCallback, useState, type FC, type ReactElement } from "react";
import { AuthContext } from ".";

type Props = { children: ReactElement };

export const AuthContextProvider: FC<Props> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean>(
        Boolean(sessionStorage.getItem("accessToken"))
    );

    const setAuthToken = (token: string) => {
        sessionStorage.setItem("accessToken", token);
        setIsAuth(Boolean(sessionStorage.getItem("accessToken")));
    };

    const logout = useCallback(() => {
        sessionStorage.removeItem("accessToken");
        setIsAuth(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuth, setAuthToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
