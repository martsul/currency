export type AuthValue = {
    isAuth: boolean;
    setAuthToken: (token: string) => void;
    logout: () => void;
};
