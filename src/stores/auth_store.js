import {createPinia, defineStore} from "pinia";
import axios from "axios";
import {ElMessage} from "element-plus";
import apiClient from "../utils/asiox_instance";
import {long_timeout, middle_timeout} from "../utils/constant";

export const auth_store = defineStore("auth_store", {
    state: () => ({
        user: null,
        // token: localStorage.getItem("jwtToken") || null,
        token: null,
        redirectPath: null,
    }),
    persist: true,
    getters: {
        getUserInfo: state => state.user,
        getToken: state => state.token,
        isLoggedIn: state => state.token !== undefined && state.token !== null,
    },
    actions: {
        logout() {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
            this.token = null;
            this.user = null;
        },
        goToLogin() {
            this.$router.push(this.redirectPath || '/dashboard');
            this.redirectPath = null;
        },
        async updateUser(userForm) {
            const data = {
                username: userForm.username,
                oldPassword: userForm.oldPassword,
                newPassword: userForm.password,
                sex: userForm.sex
            };

            // 发送更新请求
            const response = await apiClient.post("/api/user/update", data, {
                timeout: middle_timeout,
            });

            return response?.data || null; // 返回后端数据
        },
    }
})