import axiosInstance from "./axiosInstance";
import type { StatusResponse, LoginRequest, UserSelectRequest, LoginResponse } from "../types/authTypes";

export const getStatus = async (): Promise<StatusResponse> => {
    const response = await axiosInstance.get("/api/auth/status");
    return response.data;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/api/auth/login", data)
    return response.data;
}

export const selectUser = async (data: UserSelectRequest) => {
    const response = await axiosInstance.post("/api/auth/user/login", data)
    return response.data;
}

export const logout = async (): Promise<void> => {
    await axiosInstance.post("/api/auth/logout")
}

export const logoutFamily = async (): Promise<void> => {
    await axiosInstance.post("/api/auth/logout/family")
}
