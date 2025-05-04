import {
    CircleClose,
    Setting,
    Upload,
    House,
    MostlyCloudy,
    Document, Lock, Download
} from '@element-plus/icons-vue'

import {
    h,
    reactive
} from "vue";

import UserSettingTab from "../components/v1/UserSettingTab.vue";
import {
    faGithub
} from "@fortawesome/free-brands-svg-icons";
import {ElButton, ElTag} from "element-plus";
import VuePdfApp from "vue3-pdf-app"

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

export const SAMPLE_UPLOAD_URL = import.meta.env.VITE_BASE_URL + '/api/file/sample/upload';

export const FETCH_SAMPLE_URL = import.meta.env.VITE_BASE_URL + '/api/sample/list';

export const FETCH_SAMPLE_REPORT_URL = import.meta.env.VITE_BASE_URL + '/api/report/list';

export const MAX_SAMPLE_SIZE = 1024 * 1024 * 50; // 50MB

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

export const JSON_VIEW_SWITCH = false ? import.meta.env.MODE === 'development' : false;

export const USER_SETTING_PANEL_SWITCH = false ? import.meta.env.MODE === 'development' : false;

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
];

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
];

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
];

// ======================================================================================================================
// 自定义 VNode 组件
// ======================================================================================================================

const ReportTableDownloadVNode = (row) => h(
    ElButton,
    {
        type: 'primary',
        size: 'small',
        icon: Download,
        onClick: () => {
            console.log(`点击了下载 ${JSON.stringify(row, null, 2)}`);
            const a = document.createElement('a');
            a.href = row.pdfPath;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.click();
        }
    },
    () => {return '下载';}
);

const ReportTableViewVNode = () =>  h(
    ElButton,
    {
        type: 'warning',
        size: 'small',
        icon: Document,
        onClick: () => {
            console.log('点击了查看')
        }
    },
    () => {return '查看';}
)

const ReportTableOperationVNode = (row, index, column) => h(
    'div',
    {
        class: 'report-table-operation',
        style: "display: flex; align-items: center;  justify-content: center;"
    },
    [ReportTableDownloadVNode(row), ReportTableViewVNode()]
);

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
};

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
};

// ======================================================================================================================
// 其他组件的参数
// ======================================================================================================================

export const SAMPLE_UPLOAD_FORM_PROPS = {
    'http-request':     null,
    'auto-upload':      false,
    'before-upload':    null,
    'on-success':       null,
    'on-remove':        null,
    'on-change':        null,
    'on-preview':       null,
    'on-exceed':        null,
    limit: 10,              // 默认限制上传数量
    'file-list': []
};

export const JSON_PANEL_PROPS = reactive({
    data: {}
});





// ======================================================================================================================
// 列表
// ======================================================================================================================

export const TABLE_SHOWN_COLUMNS = [
    {
        prop: 'id',
        label: 'ID',
        open: true,
        otherProps: {
            'show-overflow-tooltip': true,
            width: '60',
            'header-align': 'center'
        },
        render: ({row}) => {
            return h(
                'div',
                {
                    style: 'display: flex; align-items: center;  justify-content: center;'
                },
                row.id
            )
        }
    },
    {
        prop: 'name',
        label: '文件名',
        open: false,
    },
    {
        prop: 'date',
        label: '上传时间',
        open: true,
        otherProps: {
            'show-overflow-tooltip': true,
            width: '150',
            'header-align': 'center'
        },
        render: ({row}) => {
            return h(
                'div',
                {
                    style: 'display: flex; align-items: center;  justify-content: center;'
                },
                row.date
            )
        }
    },
    {
        prop: 'hash',
        label: '文件哈希值',
        open: true,
    },
    {
        prop: 'status',
        label: '状态',
        open: true,
        otherProps: {
            'show-overflow-tooltip': true,
            width: '120',
            'header-align': 'center'
        },
        render: ({row}) => {
            return h(
                'div',
                {
                    style: 'display: flex; align-items: center;  justify-content: center;'
                },
                h(
                    ElTag,
                    {
                        type: row.status.color,
                    },
                    row.status.name
                )
            )
        }
    },
    {
        prop: 'size',
        label: '文件大小',
        open: true,
        otherProps: {
            'show-overflow-tooltip': true,
            width: '150',
            'header-align': 'center'
        },
        render: ({row}) => {
            return h(
                'div',
                {
                    style: 'display: flex; align-items: center;  justify-content: center;'
                },
                row.size
            )
        }
    },
    {
        prop: 'type',
        label: '文件类型',
        open: false,
        rowList: []
    },
    {
        prop: 'download_url',
        label: '下载地址',
        open: false,
    },

]

// ======================================================================================================================
// 页面属性响应变量
// ======================================================================================================================

/**
 * 样本报告页表格属性
 * @type {{pagination: {}, tableCol: [{otherProps: {type: string}, render: (function(*): VNode<RendererNode, RendererElement, {[p: string]: any}>)},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean, width: string, "header-align": string}, render: (function({row: *}): VNode<RendererNode, RendererElement, {[p: string]: any}>)},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean}},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean, width: string, "header-align": string}, render: (function({row: *}): VNode<RendererNode, RendererElement, {[p: string]: any}>)},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean, width: string, "header-align": string}, render: (function({row: *}): VNode<RendererNode, RendererElement, {[p: string]: any}>)},null], otherTableProps: {stripe: boolean, border: boolean, style: string}}}
 */
const SAMPLE_REPORT_TABLE_PROPS = {
    tableCol: [
        {
            otherProps: {
                type: 'expand'
            },
            render: (scope) => {
                return h(
                    'div',
                    {
                        class: "pdf-container"
                    },
                    h(
                        VuePdfApp,
                        {
                            class: "pdf-box",
                            pdf: scope.row.pdfPath
                        }
                    )
                );
            }
        },
        {
            label: 'ID',
            prop: 'id',
            otherProps: {
                'show-overflow-tooltip': true,
                width: '60',
                'header-align': 'center'
            },
            render: ({row}) => {
                return h(
                    'div',
                    {
                        style: 'display: flex; align-items: center;  justify-content: center;'
                    },
                    row.id
                )
            }
        },
        {
            label: '样本哈希',
            prop: 'fileMd5',
            otherProps: {
                'show-overflow-tooltip': true
            }
        },
        {
            label: '报告大小',
            prop: 'pdfSize',
            otherProps: {
                'show-overflow-tooltip': true,
                width: '100',
                'header-align': 'center'
            },
            render: ({row}) => {
                return h(
                    'div',
                    {
                        style: 'display: flex; align-items: center;  justify-content: center;'
                    },
                    row.pdfSize
                )
            }
        },
        {
            label: '报告生成时间',
            prop: 'pdfCreateTime',
            otherProps: {
                'show-overflow-tooltip': true,
                width: '155',
                'header-align': 'center'
            },
            render: ({row}) => {
                return h(
                    'div',
                    {
                        style: 'display: flex; align-items: center;  justify-content: center;'
                    },
                    row.pdfCreateTime
                )
            }
        },
        {
            label: '操作',
            prop: 'action',
            otherProps: {
                width: '200',
                'header-align': 'center'
            },
            render: (scope) => {
                return ReportTableOperationVNode(scope.row, scope.$index, scope.column);
            }
        }
    ],
    otherTableProps: {
        stripe: true,
        border: true,
        style: "width: 100%",
    },
    tableData: []
};

/**
 * 样本报告页页脚属性
 * @type {*[]}
 */
const SAMPLE_REPORT_FOOTER_PROPS = {
    paginationProps: {
        pageNum: 1,
        pageSize: 10,
        totalPages: 0
    },
};

/**
 * 样本报告页全局响应性属性
 * @type {Reactive<{"sample-report-table-props": {pagination: {}, tableCol: [{otherProps: {type: string}, render: (function(*): VNode<RendererNode, RendererElement, {[p: string]: *}>)},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean, width: string, "header-align": string}, render: (function({row: *}): VNode<RendererNode, RendererElement, {[p: string]: *}>)},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean}},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean, width: string, "header-align": string}, render: (function({row: *}): VNode<RendererNode, RendererElement, {[p: string]: *}>)},{label: string, prop: string, otherProps: {"show-overflow-tooltip": boolean, width: string, "header-align": string}, render: (function({row: *}): VNode<RendererNode, RendererElement, {[p: string]: *}>)},null], otherTableProps: {stripe: boolean, border: boolean, style: string}}, "sample-report-footer-props"}>}
 */
export const SAMPLE_REPORT_VIEW_REACTIVE_PROPS = reactive({
    sampleReportTableProps: SAMPLE_REPORT_TABLE_PROPS,
    sampleReportFooterProps: SAMPLE_REPORT_FOOTER_PROPS
});