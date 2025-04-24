import axios from "axios";
import {auth_store} from "../stores/auth_store";
import router from "../routers/main_router";
import {useRoute} from "vue-router";

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
});

apiClient.interceptors.response.use(response => {
        const new_token = response.headers['new-token'];
        if(new_token) {
            console.log("new_token", new_token);
            const auth = auth_store()
            // 更新auth中的token
            auth.$patch({
                token:new_token
            })
        }
        return response;
    },
    error => {
        const originalRequest = error.config;
        const auth = auth_store()
        const route = useRoute()

        console.log("auth: ", auth.user)

        console.log("router: ", router)

        console.log("route: ", route)

        console.log("error: ", error)

        if(error.response) {
            if(error.response.status === 401 || error.response.data?.code === 401) {
                // 重定向到登录页面
                router.push("/dashboard/login");
                // 未授权，处理401错误
                auth.logout();
            }
        }
        return Promise.reject(error);
    });

export default apiClient