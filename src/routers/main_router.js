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
import Main from '../page/Main.vue';
import Management from '../page/Management.vue';
import ManagementHome from "../components/v1/management/ManagementHome.vue";
import UsersManagement from "../components/v1/management/UsersManagement.vue";
import RolesManagement from "../components/v1/management/RolesManagement.vue";
import PermissionsManagement from "../components/v1/management/PermissionsManagement.vue";
import SamplesManagement from "../components/v1/management/SamplesManagement.vue";
import ReportsManagement from "../components/v1/management/ReportsManagement.vue";

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
                name: 'dashboardMain',
                component: Main,
                meta: {userPage: true},
            },
            {
                path: 'sampleUpload',
                name: 'sampleUpload',
                component: SampleUpload,
                meta: {userPage: true},
            },
            {
                path: 'reportView',
                name: 'reportView',
                component: SampleReportView,
                meta: {userPage: true},
            },
            {
                path: 'userSettings',
                name: 'userSettings',
                component: UserSettings,
                meta: {userPage: true},
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
            {
                path: 'management',
                name: 'management',
                component: Management,
                meta: {adminPage: true},
                children: [
                    {
                        path: '',
                        name: 'managementEmpty',
                        redirect: '/dashboard/management/main',
                    },
                    {
                        path: 'main',
                        name: 'managementMain',
                        component: ManagementHome,
                        meta: {adminPage: true},
                    },
                    {
                        path: 'users',
                        name: 'users',
                        component: UsersManagement,
                        meta: {adminPage: true},
                    },
                    {
                        path: 'roles',
                        name: 'roles',
                        component: RolesManagement,
                        meta: {adminPage: true},
                    },
                    {
                        path: 'permissions',
                        name: 'permissions',
                        component: PermissionsManagement,
                        meta: {adminPage: true},
                    },
                    {
                        path: 'samples',
                        name: 'samples',
                        component: SamplesManagement,
                        meta: {adminPage: true},
                    },
                    {
                        path: 'reports',
                        name: 'reports',
                        component: ReportsManagement,
                        meta: {adminPage: true},
                    }
                ]
            }
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
    if(to.matched.some(record => record.meta.userPage)){
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
        } else if (auth.isAdmin) {
            // 如果是管理员跳转到用户页面，重定向到管理员页面
            next({
                path: '/dashboard/management',
            });
        } else {
            // 普通用户跳转到普通用户页面，直接放行
            next();
        }
    } else if (to.matched.some(record => record.meta.adminPage)) {
        if (!auth.isLoggedIn) {
            next({
                path: '/dashboard/login',
                query: { redirect: to.fullPath }
            });
        } else if (!auth.isAdmin) {
            // 普通用户跳转到管理员页面
            next({
                path: '/dashboard/main',
            });
        } else {
            // 管理员跳转到管理员页面，直接放行
            next();
        }
    }
    else if(to.matched.some(record => record.meta.guestOnly)){
        // 如果页面不需要登陆
        if (auth.isLoggedIn) {
            // 如果用户登录了
            if(auth.isAdmin) {
                // 如果用户是管理员
                next({
                    path: '/dashboard/management',
                });
            } else {
                // 如果是普通用户
                next('/dashboard/main');
            }
        }else {
            next();
        }
    } else {
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