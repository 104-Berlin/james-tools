import axios, { AxiosResponse } from "axios";
import { RegisterForm } from "../routes/Register";
import { LoginForm } from "../routes/Login";

export type User = {
    email: string;
    username: string;
}

export function getCurrentUser(): Promise<AxiosResponse<User>> {
    return axios.get("/api/user/current");
}

export function register(input: RegisterForm): Promise<AxiosResponse<string>> {
    return axios.post("/api/user/register", { email: input.email, password: input.password, username: input.username });
}

export function login(input: LoginForm): Promise<AxiosResponse<string>> {
    return axios.post("/api/user/login", { email_or_user: input.email_or_user, password: input.password });
}