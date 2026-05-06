import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error)
        if (error.response?.status === 401) {
            useAuthStore.setState({ user: null, isAuthenticated: false });
        }
        return Promise.reject(error);
    }
)

export default apiClient
