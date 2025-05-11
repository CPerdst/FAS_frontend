import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./routers/main_router";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faGithub, faWeibo
} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import ECharts from 'vue-echarts'

const pinia = createPinia({});
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(pinia);
library.add(faGithub);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('v-chart', ECharts);

app.mount('#app');
