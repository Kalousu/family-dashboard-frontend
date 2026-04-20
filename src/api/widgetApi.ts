import axiosInstance from "./axiosInstance"
import type { WidgetPosition, WidgetConfig } from "./familyApi"

export interface CreateWidgetRequest {
    dashboardId: number
    type: string
    widgetConfig: WidgetConfig
    widgetPosition: WidgetPosition
}

export interface UpdateWidgetPositionRequest {
    widgetPosition: WidgetPosition
}

export const createWidget = async (data: CreateWidgetRequest): Promise<void> => {
    await axiosInstance.post('/api/widgets', data)
}

export const updateWidgetPosition = async (widgetId: number, position: WidgetPosition): Promise<void> => {
    await axiosInstance.patch(`/api/widgets/${widgetId}/position`, {
        widgetPosition: position
    })
}

export const deleteWidget = async (widgetId: number): Promise<void> => {
    await axiosInstance.delete(`/api/widgets/${widgetId}`)
}

export const updateWidgetConfig = async (widgetId: number, config: WidgetConfig): Promise<void> => {
    await axiosInstance.patch(`/api/widgets/${widgetId}/config`, {
        widgetConfig: config
    })
}
