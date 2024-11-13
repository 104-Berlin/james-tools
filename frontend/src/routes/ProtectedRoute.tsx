import { PropsWithChildren } from "react";
import { useAuth } from "../provider/AuthProvider";

type Props = {
    not_authenticated?: boolean;
}

export function ProtectedRoute({ children, not_authenticated }: PropsWithChildren<Props>) {
    let { token } = useAuth();

    /**
     * 
     * NOT_AUTHENTICATED | TOKEN | SHOW
     * ------------------|-------|-----
     * true              | true  | null
     * true              | false | children
     * false             | true  | children
     * false             | false | null
     * 
     */
    if (!!token === !!not_authenticated) {
        return null;
    }


    return <>{children}</>;
}   