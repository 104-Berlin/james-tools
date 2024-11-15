import axios, { AxiosResponse } from "axios";

export type Monthly = {
    id: string;
    position: string;
    debit: number;
    credit: number;
}

export type AddMonthly = {
    position: string;
    debit?: number;
    credit?: number;
}

export type UpdateMonthly = {
    id: string;
    position?: string;
    debit?: number;
    credit?: number;
}

export function getMonthly(): Promise<AxiosResponse<Monthly[]>> {
    return axios.get("/api/budget/monthly");
}

export function addMonthly(body: AddMonthly) {
    return axios.post("/api/budget/monthly", body);
}

export function updateMonthly(body: UpdateMonthly) {
    return axios.patch("/api/budget/monthly", body);
}

export function deleteMonthly(ids: string[]) {
    return axios.delete(`/api/budget/monthly`, { data: { delete: ids } });
}