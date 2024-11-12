import axios, { AxiosResponse } from "axios";
import { RegisterForm } from "../routes/Register";

export function register(input: RegisterForm): Promise<AxiosResponse<string>> {
    return axios.post("/api/user/register", { email: input.email, password: input.password, username: input.username });
}