import { createContext } from "react";
import type { AuthValue } from "../../types/auth-value";

export const AuthContext = createContext<AuthValue | null>(null);
