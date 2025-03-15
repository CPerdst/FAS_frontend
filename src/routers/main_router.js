import {createRouter, createMemoryHistory, createWebHistory} from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import IndexPage from '../components/IndexPage.vue'

const routes = [
    {path: '/', component: IndexPage},
    {path: "/login", component: Login},
    {path: '/register', component: Register},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router