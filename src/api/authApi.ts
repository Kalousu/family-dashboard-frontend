import axiosInstance from "./axiosInstance";
import type { StatusResponse, LoginRequest, UserSelectRequest } from "../types/authTypes";

export const getStatus = async (): Promise<StatusResponse> => {
    const response = await axiosInstance.get("/api/auth/status");
    return response.data;
}

export const login = async(data: LoginRequest) => {
    const response = await axiosInstance.post("/api/auth/login", data)
    return response.data;
}

export const selectUser = async (data: UserSelectRequest) => {
    const response = await axiosInstance.post("/api/auth/user/login", data)
    return response;
}
