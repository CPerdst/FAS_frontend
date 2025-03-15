import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./routers/main_router";

const app = createApp(App)

app.use(ElementPlus)
app.use(router)

app.mount('#app')
