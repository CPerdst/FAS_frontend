import {
    CircleClose,
    Setting,
    Upload,
    House,
    MostlyCloudy,
    Document, Lock
} from '@element-plus/icons-vue'

import UserSettingTab from "../components/v1/UserSettingTab.vue";
import {
    faGithub
} from "@fortawesome/free-brands-svg-icons";

// ======================================================================================================================
// 固定常量
// ======================================================================================================================

/**
 * 作者
 * @type {string}
 */
export const AUTHOR = 'l1Akr';

/**
 * 作者GitHub
 * @type {string}
 */
export const AUTHOR_GITHUB = 'https://github.com/CPerdst/FAS_frontend';

export const fast_timeout = 3000 // 三秒

export const middle_timeout = 5000 // 五秒

export const long_timeout = 10000 // 十秒

export const DEFAULT_USER_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

export const AVATAR_UPLOAD_URL = import.meta.env.VITE_BASE_URL + '/api/file/avatar/upload';

export const UPDATE_USER_URL = import.meta.env.VITE_BASE_URL + '/api/user/update';

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
export const AUTH_PANEL_SWITCH = false ? import.meta.env.MODE === 'development' : false;

export const USER_SETTING_PANEL_SWITCH = true ? import.meta.env.MODE === 'development' : false;

export const ASIDE_FOOTER_SWITCH = false;


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
        component: UserSettingTab,
        props: {
            userForm: {
                username: "",
                oldPassword: "",
                password: "",
                sex: true
            },
            rules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
                ],
                oldPassword: [
                    // 只有当新密码不为空时，旧密码才需要验证
                    {
                        validator: (rule, value, callback) => {
                            // if (this.userForm.password && !value) {
                            //     callback(new Error("修改密码时必须填写旧密码"));
                            // } else {
                            //     callback();
                            // }
                        },
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        // 允许留空，但若填写则需符合规则
                        validator: (rule, value, callback) => {
                            // if (value && !/^[a-zA-Z0-9]{1,32}$/.test(value)) {
                            //     callback(new Error("密码必须为1-32位字母或数字"));
                            // } else {
                            //     callback();
                            // }
                        },
                        trigger: "blur",
                    },
                ],
                gender: [
                    { required: true, message: "请选择性别", trigger: "change" },
                ],
            },
            formItems: {
                username: {
                    label: "用户名",
                    component: "el-input",
                    props: { size: 'large', 'prefix-icon': House},
                    placeholder: "请输入用户名",
                },
                oldPassword: {
                    label: "旧密码",
                    component: "el-input",
                    props: { type: "password", 'show-password': true, size: 'large', 'prefix-icon': Lock},
                    placeholder: "请输入原来的密码（留空则不修改）",
                },
                password: {
                    label: "新密码",
                    component: "el-input",
                    props: { type: "password", 'prefix-icon': Lock, maxlength: 32, size: 'large', 'show-password': true},
                    placeholder: "请输入新密码（留空则不修改）",
                },
                sex: {
                    label: "性别",
                    component: "el-radio-group",
                    placeholder: "",
                    children: [
                        { label: "男", value: true },
                        { label: "女", value: false },
                    ],
                },
            },
            errors: {}
        }
    },
    {
        label: '其他设置',
        name: 'second',
        component: UserSettingTab
    }
]

// ======================================================================================================================
// 页脚信息
// ======================================================================================================================

/**
 * Aside 页脚信息
 * @type {{author: string, github: string}}
 */
export const ASIDE_FOOTER = {
    author: AUTHOR,
    github: AUTHOR_GITHUB
}

/**
 * 页脚信息
 * @type {{author: string, socialLinks: [{icon: IconDefinition, title: string, url: string}], time: boolean}}
 */
export const FOOTER = {
    author: AUTHOR,
    socialLinks: [
        {
            icon: faGithub,
            title: 'github',
            url: AUTHOR_GITHUB
        }
    ],
    time: true // 用于开启时间戳
}