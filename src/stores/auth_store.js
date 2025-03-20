import {createPinia, defineStore} from "pinia";
import axios from "axios";
import {ElMessage} from "element-plus";

export const auth_store = defineStore("auth_store", {
    state: () => ({
        user: null,
        token: localStorage.getItem("jwtToken") || null,
    }),
    getters: {
        getUserInfo: state => state.user,
        getToken: state => state.token,
        isLoggedIn: state => !!state.token,
    },
    actions: {
        async login(username, password) {
            try{
                // 使用async/await来更清晰的处理代码
                const response = await axios.post(
                    import.meta.env.VITE_BASE_URL + "/api/user/login",
                    {username, password},
                    {
                        timeout: 3000
                    }
                )

                // 如果结果响应码不是200
                if(response && response.data.code === 400){
                    return response
                }

                // 否则，成功的时候更新 state 和 localStorage
                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem("jwtToken", JSON.stringify(response.data.token));

                // 返回成功的数据
                return response;
            }catch(err){
                throw err;
            }
        },

        logout: () => {
            localStorage.removeItem("jwtToken");
            this.$patch({
                token: null,
                user: null,
            })
        }
    }
})