import { useEffect, useState } from "react";
import type { AdminData } from "../../types/admin-data";
import { api } from "../../api";
import { useLoading } from "../../contexts/loading-context/use-loading";
import { useAuth } from "../../contexts/auth-context/use-auth";

export const useAdminContainer = () => {
    const { startLoading, stopLoading } = useLoading();
    const { logout } = useAuth();
    const [adminData, setAdminData] = useState<AdminData>({
        settings: [],
        rates: [],
    });

    useEffect(() => {
        startLoading();
        api.get<AdminData>("/admin")
            .then((response) => {
                setAdminData(response.data);
            })
            .catch(() => {
                logout();
            })
            .finally(() => stopLoading());
    }, [logout, startLoading, stopLoading]);

    return adminData;
};
