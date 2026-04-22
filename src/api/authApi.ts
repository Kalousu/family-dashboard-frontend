import axiosInstance from "./axiosInstance";
import type { StatusResponse, LoginRequest, UserSelectRequest, LoginResponse, RegisterRequest, AuthResponse } from "../types/authTypes";

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

export const register = async (data: RegisterRequest, avatar?: File): Promise<AuthResponse> => {
    // Always use multipart form data since the backend expects it
    const formData = new FormData()
    
    // Create a blob for the JSON data to ensure proper content type
    const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    formData.append('data', jsonBlob)
    
    // Only add avatar if provided (for profile picture uploads)
    if (avatar) {
        formData.append('avatar', avatar)
    }
    
    const response = await axiosInstance.post("/api/auth/register", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}
