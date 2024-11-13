import axios from "axios";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

export type AuthContextType = {
    token: string | null;
    setToken: (value?: string) => void;
};

export const AuthContext = createContext<AuthContextType>({ token: localStorage.getItem("token"), setToken: () => { } });

export function AuthProvider({ children }: PropsWithChildren<{}>) {
    const [token, _setToken] = useState(localStorage.getItem("token"));

    let setToken = (value?: string) => {
        if (value) {
            _setToken(value);
        } else {
            _setToken(null);
        }
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token])

    const contextValue = useMemo(() => ({ token, setToken }), [token]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthProvider;