import axios, { AxiosResponse } from "axios";

export function updateRooms() {
    return axios.post("/api/htw/rooms/update");
}

export type Room = {
    name: string;
}

export function getEmptyRooms(weekday: number, startTime: string, endTime: string): Promise<AxiosResponse<Room[]>> {
    return axios.get(`/api/htw/rooms/empty?weekday=${weekday}&from=${startTime}&to=${endTime}`);
}