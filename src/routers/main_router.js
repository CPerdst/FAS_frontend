import {createRouter, createMemoryHistory, createWebHistory} from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Dashboard from '../components/Dashboard.vue'
import {auth_store} from "../stores/auth_store";

const routes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {requiresAuth: true},
    },
    {
        path: "/login",
        name: 'Login',
        component: Login,
        meta: {guestOnly: true},
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {guestOnly: true},
    },
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard',
        meta: {guestOnly: true},
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 导航守卫，全局权限验证
router.beforeEach(async (to, from, next) => {
    const auth = auth_store();

    // // 如果用户未登录，但访问了需要登陆的页面
    // if(to.meta.requiresAuth && !auth.isLoggedIn){
    //     // 重定位到登录页面，并保存当前访问路径
    //     next({
    //         path: 'login',
    //         query: {redirect: to.fullPath}, // 保存目标路径
    //     });
    // }
    //
    // // 如果用户已登录，但是访问了登录/注册页（非guestOnly页面）
    // if(auth.isLoggedIn && to.meta.guestOnly) {
    //     // 重定向到主页面
    //     next({
    //         path: '/dashboard',
    //     });
    // }else {
    //     next();
    // }

    // 如果页面需要登录
    if(to.matched.some(record => record.meta.requiresAuth)){
        console.log(to);
        console.log(from);
        // console.log(next);
        // console.log(auth.token);
        // console.log(auth.isLoggedIn);
        // console.log(auth.user);
        if(!auth.isLoggedIn) {
            // 跳转到登陆页面
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        }else {
            // 正常跳转
            next();
        }
    }else if(to.matched.some(record => record.meta.guestOnly)){
        // 如果页面不需要登陆
        if (auth.isLoggedIn) {
            next('/dashboard');
        }else {
            next();
        }
    }else {
        // 其他的路由直接放行
        next();
    }
});

router.afterEach((to, from) => {
    // 如果登录页有 redirect 参数，跳转到该参数指定的路径
    if(to.name === 'Login' && to.query.redirect) {
        // auth_store().goToLogin = to.query.redirect;
    }
});

export default router