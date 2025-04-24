import {
    CircleClose,
    Setting,
    Upload,
    House,
    MostlyCloudy,
    Document
} from '@element-plus/icons-vue'

import UserSettingTab from "../components/v1/UserSettingTab.vue";

// ======================================================================================================================
// 固定常量
// ======================================================================================================================

export const AUTHOR = 'l1Akr';

export const AUTHOR_GITHUB = 'https://github.com/CPerdst';

export const ASIDE_FOOTER = {
    author: AUTHOR,
    github: AUTHOR_GITHUB
}

export const fast_timeout = 3000 // 三秒

export const middle_timeout = 5000 // 五秒

export const long_timeout = 10000 // 十秒

export const DEFAULT_USER_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

export const AVATAR_UPLOAD_URL = import.meta.env.VITE_BASE_URL + '/api/file/avatar/upload';

// ======================================================================================================================
// VUE面板路由
// ======================================================================================================================

/**
 * 主页路由
 * @type {string}
 */
export const MAIN_PANEL_URL = '/dashboard/main'

/**
 * 登录页路由
 * @type {string}
 */
export const LOGIN_PANEL_URL = '/dashboard/login';

/**
 * 注册页路由
 * @type {string}
 */
export const REGISTER_PANEL_URL = '/dashboard/register'

/**
 * 样本上传页路由
 * @type {string}
 */
export const SAMPLE_UPLOAD_PANEL_URL = '/dashboard/sampleUpload'

/**
 * 样本报告查看页路由
 * @type {string}
 */
export const SAMPLE_REPORT_VIEWING_PANEL_URL = '/dashboard/reportView'

/**
 * 设置页路由
 * @type {string}
 */
export const SETTINGS_PANEL_URL = '/dashboard/setting'

// ======================================================================================================================
// 接口路由
// ======================================================================================================================

/**
 * 后端登录接口
 * @type {string}
 */
export const LOGIN_URL = '/login';

/**
 * 后端登出接口
 * @type {string}
 */
export const LOGOUT_URL = '/logout'

export const HEADER_HEIGHT = '70px';

export const HEADER_TITLE = 'FAS';

// ======================================================================================================================
// 开关
// ======================================================================================================================

/**
 * 用于展示authStore的面板，dev环境自动打开
 * @type {boolean}
 */
export const AUTH_PANEL_SWITCH = true ? import.meta.env.MODE === 'development' : false;


// ======================================================================================================================
// 菜单栏选项
// ======================================================================================================================

export const panelMenu = [
    {
        name: 'main',
        title: '首页',
        path: MAIN_PANEL_URL,
        icon: House,
    },
    {
        name: 'virusDetect',
        title: '查杀',
        icon: MostlyCloudy,
        submenu: [
            {
                name: 'sampleUpload',
                title: '样本上传',
                path: SAMPLE_UPLOAD_PANEL_URL,
                icon: Upload
            },
            {
                name: 'reportView',
                title: '报告查看',
                path: SAMPLE_REPORT_VIEWING_PANEL_URL,
                icon: Document
            }
        ]
    }
]

export const userDropDownBoxOption = [
    {
        name: 'setting',
        title: '设置',
        icon: Setting,
        path: SETTINGS_PANEL_URL,
        clickHandle: () => {
            console.log('点击了设置')
        }
    },
    {
        name: 'logout',
        title: '退出登录',
        icon: CircleClose,
        path: LOGIN_URL,
        clickHandle: () => {
            console.log('点击了退出登录')
        }
    }
]

export const settingTableList = [
    {
        label: '用户设置',
        name: 'first',
        component: UserSettingTab
    },
    {
        label: '其他设置',
        name: 'second',
        component: UserSettingTab
    }
]