import axiosInstance from "./axiosInstance";
import type { MemeResponse } from "../widgets/meme/memeTypes";

export const getDailyMeme = async (): Promise<MemeResponse> => {
    const response = await axiosInstance.get("/api/meme/day");
    return response.data
}