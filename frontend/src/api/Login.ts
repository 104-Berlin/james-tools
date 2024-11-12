import axios, { AxiosResponse } from "axios";
import { LoginForm } from "../routes/Login";

export function login(input: LoginForm): Promise<AxiosResponse<string>> {
    return axios.post("/api/user/login", { email_or_user: input.email_or_user, password: input.password });
}