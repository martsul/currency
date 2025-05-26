import { useCallback, useState, type FC, type ReactElement } from "react";
import { LoadingContext } from ".";

type Props = { children: ReactElement };

export const LoadingContextProvider: FC<Props> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <LoadingContext.Provider
            value={{ isLoading, startLoading, stopLoading }}
        >
            {children}
        </LoadingContext.Provider>
    );
};
