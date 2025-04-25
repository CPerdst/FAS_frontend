import {computed} from "vue";
import * as constant from "./constant";



export const currentDate = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

export function addPropsToJsonPanel(key, props) {
    constant.JSON_PANEL_PROPS.data.push({'key': key, 'value': props})
}

export function removePropsFromJsonPanel(key) {
    for(let item of constant.JSON_PANEL_PROPS.data) {
        if (item.key === key) {
            constant.JSON_PANEL_PROPS.data.splice(constant.JSON_PANEL_PROPS.data.indexOf(item), 1);
         }
    }
}