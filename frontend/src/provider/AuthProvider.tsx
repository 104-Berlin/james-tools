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
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            console.log("Setting token to: ", value);
            localStorage.setItem("token", value);
            _setToken(value);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            console.log("Removed token");
            localStorage.removeItem("token");
            _setToken(null);
        }
    }

    const contextValue = useMemo(() => ({ token, setToken }), [token]);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthProvider;