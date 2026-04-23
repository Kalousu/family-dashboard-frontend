import axiosInstance from "./axiosInstance"
import type { PictureResponse } from "../widgets/picture/pictureTypes"

export async function getPicture(widgetId: number): Promise<PictureResponse | null> {
    try {
        const response = await axiosInstance.get<PictureResponse>(`/api/widgets/picture/${widgetId}`)
        return response.data
    } catch (error: any) {
        const status = error?.response?.status
        if (status === 404 || status === 500) return null
        throw error
    }
}

export async function uploadPicture(widgetId: number, familyId: number, file: File): Promise<PictureResponse> {
    const formData = new FormData()
    formData.append("file", file)
    const response = await axiosInstance.post<PictureResponse>(
        `/api/widgets/picture/${widgetId}?familyId=${familyId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    )
    return response.data
}

export async function deletePicture(widgetId: number): Promise<void> {
    await axiosInstance.delete(`/api/widgets/picture/${widgetId}`)
}
