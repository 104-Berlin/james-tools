import { useNavigate } from "react-router";
import Form, { FormInputType, InputType } from "../components/Form";
import { useAuth } from "../provider/AuthProvider";
import { login } from "../api/User";

export type LoginForm = {
    emailOrUser: string;
    password: string;
}

export default function Login() {
    let { setToken } = useAuth();
    let navigate = useNavigate();

    let handleSubmit = (value: LoginForm) => {
        console.log("Logging in with", value);
        login(value).then((response) => {
            if (response.status === 200) {
                setToken(response.data);
                navigate("/profile");
            } else {
                console.log("Login failed");
            }
        })
    };

    const form: FormInputType[] = [
        {
            key: "emailOrUser",
            type: InputType.TEXT,
            label: "Email or Username",
        },
        {
            key: "password",
            type: InputType.PASSWORD,
            label: "Password",
        }
    ];

    return (
        <div className="flex justify-center">
            <Form onSubmit={handleSubmit} value_type={form} submit="Login" />
        </div>
    )
}