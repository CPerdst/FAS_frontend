import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        // resolve: {
        //   '@': resolve(process.cwd(), 'src'),
        // },
        server: {
            host: env.VITE_HOST,
            port: env.VITE_PORT,
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => {
                        return path.replace(/^\/api/, '')
                    },
                }
            }
        },
        plugins: [
            vue(),
            vueDevTools(),
        ]
    }
})
