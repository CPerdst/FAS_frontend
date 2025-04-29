import {computed} from "vue";
import {JSON_PANEL_PROPS} from "./constant";


export const currentDate = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

export function addPropsToJsonPanel(key, props) {
    JSON_PANEL_PROPS.data[key] = props; // 直接绑定响应式对象
}

export function removePropsFromJsonPanel(key) {
    Object.keys(JSON_PANEL_PROPS).forEach((__key) => {
        if(__key === key) {
            delete JSON_PANEL_PROPS[__key];
        }
    })
}

export function getStatusName(status) {
    switch (status) {
        case 1:
            return {
                name: '未处理',
                color: 'primary'
            };
        case 2:
            return {
                name: '处理中',
                color: 'primary'
            };
        case 3:
            return {
                name: '未发现病毒',
                color: 'success'
            };
        case 4:
            return {
                name: '发现病毒',
                color: 'danger'
            };
        case 5:
            return {
                name: '处理失败',
                color: 'warning'
            };
        default:
            return {
                name: '未知状态',
                color: 'warning'
            };
    }
}

export function getDateByArrayTimeFormat (arrayTime) {
    const year = arrayTime[0];
    const month = arrayTime[1];
    const day = arrayTime[2];
    return new Date(year, month - 1, day);
}

export function getDatetimeByArrayTimeFormat (arrayTime) {
    const year = arrayTime[0];
    const month = arrayTime[1];
    const day = arrayTime[2];
    const hour = arrayTime[3];
    const minute = arrayTime[4];
    const second = arrayTime[5];
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
}

export function getFormatedDate(date) {
    return date.toLocaleDateString();
}

export function getKBFormatedSize(size) {
    return `${(size / 1024).toFixed(2)} KB`;
}

export function getMBFormatedSize(size) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * 检查是否是日期格式的字符串
 * @param value
 */
export function checkDateType(value) {
    return /^\d{4}\/\d{2}\/\d{2}$/.test(value);
}