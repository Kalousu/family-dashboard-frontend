import axiosInstance from "./axiosInstance"
import type { UserProfile } from "../types/authTypes"

export interface UserSelectPageResponse {
    userProfiles: UserProfile[]
}

export const getUsersForFamily = async (familyId: number): Promise<UserProfile[]> => {
    const response = await axiosInstance.get<UserSelectPageResponse>(`/api/family/${familyId}/users`)
    return response.data.userProfiles
}
