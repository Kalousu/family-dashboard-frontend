import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const { config, response } = error;
        console.error(
            `[API Error] ${config?.method?.toUpperCase()} ${config?.url}`,
            `→ Status: ${response?.status}`,
            `→ Body:`, response?.data
        );
        return Promise.reject(error);
    }
)

export default axiosInstance
