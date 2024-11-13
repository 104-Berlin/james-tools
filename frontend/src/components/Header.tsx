import { Navbar } from "flowbite-react";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "../routes/ProtectedRoute";

function Header() {
    const { setToken } = useAuth();

    return (
        <Navbar>
            <Navbar.Brand>
                FULL STACK TEMPLATE
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link href="/">
                    Home
                </Navbar.Link>
                <ProtectedRoute>
                    <Navbar.Link href="/profile">
                        Profile
                    </Navbar.Link>
                </ProtectedRoute>
                <ProtectedRoute not_authenticated>
                    <Navbar.Link href="/login">
                        Login
                    </Navbar.Link>
                    <Navbar.Link href="/register">
                        Register
                    </Navbar.Link>
                </ProtectedRoute>
                <ProtectedRoute>
                    <Navbar.Link className="cursor-pointer" onClick={async (e) => {
                        e.preventDefault();
                        // Sets the token to null
                        setToken();
                        window.location.href = "/";
                    }}>
                        Logout
                    </Navbar.Link>
                </ProtectedRoute>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;