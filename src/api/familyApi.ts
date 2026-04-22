import axiosInstance from "./axiosInstance"
import type { UserProfile } from "../types/authTypes"

export interface UserSelectPageResponse {
    userProfileResponses: UserProfile[]
}

export interface WidgetPosition {
    col: number
    row: number
    colSpan: number
    rowSpan: number
}

export interface WidgetConfig {
    title?: string
    color?: string
    [key: string]: unknown
}

export interface WidgetResponse {
    id: number
    type: string
    widgetConfig: WidgetConfig
    position: WidgetPosition
    createdAt: string
    data?: unknown
}

export interface Permissions {
    canEditLayout: boolean
    canAddWidgets: boolean
    canDeleteWidgets: boolean
    canEditWidgetData: boolean
}

export interface DashboardResponse {
    id: number
    familyId: number
    widgets: WidgetResponse[]
    permissions: Permissions
}

export const getUsersForFamily = async (familyId: number): Promise<UserProfile[]> => {
    const response = await axiosInstance.get<UserSelectPageResponse>(`/api/family/${familyId}/users`)
    return response.data.userProfileResponses || []
}

export const getDashboardByFamilyId = async (familyId: number): Promise<DashboardResponse> => {
    const response = await axiosInstance.get<DashboardResponse>(`/api/family/${familyId}/dashboard`)
    return response.data
}

export interface CreateFamilyRequest {
    familyName: string
    password: string
    email: string
}

export interface CreateFamilyResponse {
    familyId: number
    familyName: string
}

export const createFamily = async (data: CreateFamilyRequest): Promise<CreateFamilyResponse> => {
    const response = await axiosInstance.post<CreateFamilyResponse>('/api/family', data)
    return response.data
}
