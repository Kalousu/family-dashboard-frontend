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

export const setUserPin = async (userId: number, pin: string): Promise<void> => {
    await axiosInstance.patch(`/api/users/${userId}/pin`, { pin })
}
