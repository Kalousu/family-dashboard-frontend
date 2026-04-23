import axiosInstance from "./axiosInstance"

export interface ChangeUserRoleRequest {
    userRole: 'USER' | 'FAMILY_ADMIN' | 'SYSTEM_ADMIN'
}

export const changeUserRole = async (userId: number, request: ChangeUserRoleRequest): Promise<void> => {
    await axiosInstance.patch(`/api/users/${userId}/role`, request)
}

export const deleteUser = async (userId: number): Promise<void> => {
    await axiosInstance.delete(`/api/users/${userId}`)
}

export interface UpdateUserProfileRequest {
    name: string
    color: string
    avatar: string
    avatarType: 'ICON' | 'URL'
}

export const updateUserProfile = async (userId: number, request: UpdateUserProfileRequest): Promise<void> => {
    await axiosInstance.patch(`/api/users/${userId}/profile`, request)
}

export const updateUserProfileWithAvatar = async (userId: number, name: string, color: string, avatar: File): Promise<void> => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('color', color)
    formData.append('avatar', avatar)
    
    await axiosInstance.post(`/api/users/${userId}/profile/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const setUserPin = async (userId: number, pin: string): Promise<void> => {
    await axiosInstance.patch(`/api/users/${userId}/pin`, { pin })
}

export interface UserResponse {
    id: number
    name: string
    avatar: string
    avatarType: 'ICON' | 'URL'
    color: string
    role: string
    hasPin: boolean
}

export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await axiosInstance.get<UserResponse>('/api/users/me')
    return response.data
}
