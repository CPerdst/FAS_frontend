import {defineStore} from "pinia";
import apiClient from "../utils/asiox_instance";
import {middle_timeout} from "../utils/constant";


export const auth_store = defineStore("auth_store", {
    state: () => ({
        user: null,
        token: null,
        redirectPath: null,
    }),
    persist: true,
    getters: {
        getUserInfo: state => state.user,
        getToken: state => state.token,
        isLoggedIn: state => state.token !== undefined && state.token !== null,
        isAdmin: state => state.user?.roles.some(role => role.name === "admin"),
    },
    computed: {
        getUserInfo: function () {
            return this.user;
        },
        getToken: function () {
            return this.token;
        },
        isLoggedIn: function () {
            return this.token !== undefined && this.token !== null;
        },
        isAdmin: function () {
            return this.user?.roles.some(role => role.name === "admin");
        }
    },
    actions: {
        logout() {
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
            this.token = null;
            this.user = null;
        },
        goToLogin(router) {
            router.push(this.redirectPath || '/dashboard/login');
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
});