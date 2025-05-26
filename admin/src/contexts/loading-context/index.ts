import { createContext } from "react";
import type { LoadingValue } from "../../types/loading-value";

export const LoadingContext = createContext<LoadingValue | null>(null);
