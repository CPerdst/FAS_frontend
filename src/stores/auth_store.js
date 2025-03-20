import {createPinia, defineStore} from "pinia";
import axios from "axios";
import {ElMessage} from "element-plus";
import apiClient from "../utils/asiox_instance";

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
        async login(username, password) {
            try{
                // 使用async/await来更清晰的处理代码
                const response = await apiClient.post(
                    "/api/user/login",
                    {username, password},
                    {
                        timeout: 3000
                    }
                )

                // console.log(response)

                // 如果结果响应码不是200
                if(response && response.data.code === 400){
                    return response
                }

                // 否则，成功的时候更新 state 和 localStorage
                this.$patch({
                    user: response.data.data.user,
                    token: response.data.data.token,
                })
                // this.user = response.data.data.user;
                // this.token = response.data.data.token;
                // localStorage.setItem("jwtToken", response.data.data.token);

                // 返回成功的数据
                return response;
            }catch(err){
                throw err;
            }
        },

        logout() {
            localStorage.removeItem("jwtToken");
            this.token = null;
            this.user = null;
        },

        goToLogin() {
            this.$router.push(this.redirectPath || '/dashboard');
            this.redirectPath = null;
        }
    }
})