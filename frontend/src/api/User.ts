import axios, { AxiosResponse } from "axios";
import { RegisterForm } from "../routes/Register";
import { LoginForm } from "../routes/Login";

export type User = {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
}

export type UpdateCurrentUser = {
    firstName?: string;
    lastName?: string;
}

export function getCurrentUser(): Promise<AxiosResponse<User>> {
    return axios.get("/api/user/current");
}

export function updateCurrentUser(update: UpdateCurrentUser): Promise<AxiosResponse<any>> {
    return axios.patch("/api/user/current", update);
}

export function getProfilePicture(): Promise<AxiosResponse<File>> {
    return axios.get("/api/user/profile-picture");
}

export function register(input: RegisterForm): Promise<AxiosResponse<string>> {
    return axios.post("/api/user/register", { email: input.email, password: input.password, username: input.username });
}

export function login(input: LoginForm): Promise<AxiosResponse<string>> {
    return axios.post("/api/user/login", { emailOrUser: input.emailOrUser, password: input.password });
}