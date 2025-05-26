import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { LoadingContextProvider } from "./contexts/loading-context/loading-context-providr";
import { AuthContextProvider } from "./contexts/auth-context/auth-context-provider";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LoadingContextProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </LoadingContextProvider>
    </StrictMode>
);
