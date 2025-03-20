import axios from "axios";
import {auth_store} from "../stores/auth_store";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
});

apiClient.interceptors.request.use(config => {
    const auth = auth_store()
    const token = auth.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default apiClient