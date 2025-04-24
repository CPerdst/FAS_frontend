import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./routers/main_router";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia({});
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(pinia);

app.mount('#app');
