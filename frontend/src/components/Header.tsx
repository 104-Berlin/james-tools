import { Dropdown, Navbar } from "flowbite-react";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { useTranslation } from "react-i18next";

function Header() {
    const { setToken } = useAuth();
    const { t, i18n } = useTranslation();


    return (
        <Navbar>
            <Navbar.Brand>
                FULL STACK TEMPLATE
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link href="/">
                    {t("Home")}
                </Navbar.Link>
                <ProtectedRoute>
                    <Navbar.Link href="/budget">
                        {t("Budget")}
                    </Navbar.Link>
                    <Navbar.Link href="/profile">
                        {t("Profile")}
                    </Navbar.Link>
                </ProtectedRoute>
                <ProtectedRoute not_authenticated>
                    <Navbar.Link href="/login">
                        {t("Login")}
                    </Navbar.Link>
                    <Navbar.Link href="/register">
                        {t("Register")}
                    </Navbar.Link>
                </ProtectedRoute>
                <ProtectedRoute>
                    <Navbar.Link className="cursor-pointer" onClick={async (e) => {
                        e.preventDefault();
                        // Sets the token to null
                        setToken();
                        window.location.href = "/";
                    }}>
                        {t("Logout")}
                    </Navbar.Link>
                </ProtectedRoute>
                <Dropdown label={i18n.language}>
                    <Dropdown.Item onClick={() => { i18n.changeLanguage("en") }}>
                        en
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => { i18n.changeLanguage("de") }}>
                        de
                    </Dropdown.Item>
                </Dropdown>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;