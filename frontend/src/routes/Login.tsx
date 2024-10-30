import Form, { FormInputType, InputType } from "../components/Form";

export type LoginForm = {
    username: string;
    password: string;
}

export default function Login() {
    let handleSubmit = (value: LoginForm) => {
        console.log("Form submitted", value);
    };

    const form: FormInputType[] = [
        {
            name: "username",
            type: InputType.TEXT,
            label: "Username",
        },
        {
            name: "password",
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