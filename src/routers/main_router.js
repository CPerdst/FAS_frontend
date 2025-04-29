import {createRouter, createMemoryHistory, createWebHistory} from 'vue-router'
import Login from '../page/Login.vue'
import Register from '../page/Register.vue'
import Dashboard from "../page/Dashboard.vue"
import {auth_store} from "../stores/auth_store";
import MainPage from "../components/dashboard/MainPage.vue";
import reportView from "../components/v1/ReportView.vue";
import SampleReportView from "../components/v1/SampleReportView.vue";
import UserSettings from "../components/dashboard/UserSettings.vue";
import SampleUpload from '../components/v1/SampleUpload.vue';
import SampleUploadOld from '../components/dashboard/SampleUpload.vue';

/**

 const oldRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {requiresAuth: true, showFooter: true},
        redirect: '/dashboard/main',
        children: [
            {   // 空路径表示默认路由
                path: '',
                redirect: '/dashboard/main',
            },
            {
                path: 'main',
                name: 'Main',
                component: MainPage
            },
            {
                path: 'sampleUpload',
                name: 'SampleUpload',
                component: SampleUpload
            },
            {
                path: 'reportSummary',
                name: 'ReportSummary',
                component: ReportSummary
            },
            {
                path: 'userSettings',
                name: 'UserSettings',
                component: UserSettings
            },
            {
                path: 'settings',
                name: 'Settings',
                component: Settings
            },
            // {
            //     path: 'pathMatch(.*)*',
            //     redirect: '/mainPage',
            // }
        ]
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
     */

const routes = [
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        children: [
            {
                path: '',
                name: 'empty',
                redirect: '/dashboard/main',
            },
            {
                path: 'main',
                name: 'main',
                component: MainPage,
                meta: {requiresAuth: true},
            },
            {
                path: 'sampleUpload',
                name: 'sampleUpload',
                component: SampleUpload,
                meta: {requiresAuth: true},
            },
            {
                path: 'reportView',
                name: 'reportView',
                component: SampleReportView,
                meta: {requiresAuth: true},
            },
            {
                path: 'userSettings',
                name: 'userSettings',
                component: UserSettings,
                meta: {requiresAuth: true},
            },
            {
                path: 'login',
                name: 'login',
                component: Login,
                meta: {guestOnly: true},
            },
            {
                path: 'register',
                name: 'register',
                component: Register,
                meta: {guestOnly: true},
            },
        ],

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
        // console.log(JSON.stringify(to, null, 2));
        // console.log(JSON.stringify(from, null, 2));
        // console.log(next);
        // console.log(auth.token);
        // console.log(auth.isLoggedIn);
        // console.log(auth.user);
        if(!auth.isLoggedIn) {
            // 跳转到登陆页面
            next({
                path: '/dashboard/login',
                query: { redirect: to.fullPath }
            });
        } else {
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

export default router;