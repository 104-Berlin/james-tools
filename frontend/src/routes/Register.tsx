import { AxiosResponse } from "axios";
import Form, { FormInputType, InputType } from "../components/Form"
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router";
import { register } from "../api/User";

export type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
};

const form: FormInputType[] = [
    {
        name: "username",
        type: InputType.TEXT,
        label: "Username",
    },
    {
        name: "email",
        type: InputType.EMAIL,
        label: "Email",
    },
    {
        name: "password",
        type: InputType.PASSWORD,
        label: "Password",
    },
    {
        name: "confirm_password",
        type: InputType.PASSWORD,
        label: "Confirm Password",
    }
];

export default function Register() {
    let { setToken } = useAuth();
    let navigate = useNavigate();


    let handleSubmit = (value: RegisterForm) => {
        console.log("Registering: ", value);
        register(value).then((token: AxiosResponse<string>) => {
            console.log("Registered with token: ", token);
            setToken(token.data);
            navigate("/profile");
        });
    };

    return (
        <div className="flex justify-center">
            <Form onSubmit={handleSubmit} value_type={form} submit="Register" />
        </div>
    )
}