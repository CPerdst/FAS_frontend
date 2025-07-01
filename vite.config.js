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
                    target: `http://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}`,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => {
                        return path.replace(/^\/api/, '')
                    },
                },
                '/ws': {
                    target: `http://${env.VITE_BACKEND_HOST}:${env.VITE_BACKEND_PORT}`,
                    changeOrigin: true,
                    secure: false,
                    ws: true,
                }
            }
        },
        plugins: [
            vue(),
            vueDevTools(),
        ]
    }
})
