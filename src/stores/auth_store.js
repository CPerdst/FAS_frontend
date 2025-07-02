import {defineStore} from "pinia";
import apiClient from "../utils/asiox_instance";
import {middle_timeout} from "../utils/constant";
import {computed, ref, watch} from "vue";


export const old_auth_store = defineStore("old_auth_store", {
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

export const auth_store = defineStore("auth_store", () => {
    const user = ref(null)
    const token = ref(null)
    const redirectPath = ref(null)
    const getUserInfo = computed(() => user.value)
    const getToken = computed(() => token.value)
    const isLoggedIn = computed(() => token.value !== undefined && token.value != null)
    const isAdmin = computed(() => user.value?.roles?.some(role => role.name === "admin"));

    function logout() {
        // localStorage.removeItem("jwtToken");
        // localStorage.removeItem("user");
        token.value = null;
        user.value = null;
    }

    function goToLogin(router) {
        router.push(redirectPath.value || '/dashboard/login');
        redirectPath.value = null;
    }

    async function updateUser(userForm) {
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
    }

    return {
        user,
        token,
        redirectPath,
        getUserInfo,
        getToken,
        isLoggedIn,
        isAdmin,
        logout,
        goToLogin,
        updateUser,
    }

},
    {
        persist: true,
    })