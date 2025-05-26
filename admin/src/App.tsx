import { AdminPage } from "./pages/admin-page";
import { AuthPage } from "./pages/auth-page";
import { Loader } from "./components/loader/loader";
import { useAuth } from "./contexts/auth-context/use-auth";

export const App = () => {
    const { isAuth } = useAuth();

    return (
        <>
            <Loader />
            {isAuth ? (
                <AdminPage />
            ) : (
                <AuthPage/>
            )}
        </>
    );
};
