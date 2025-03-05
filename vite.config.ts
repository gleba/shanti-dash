import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import IconsResolver from 'unplugin-icons/resolver'
import {VueUseComponentsResolver} from 'unplugin-vue-components/resolvers'
import Components from "unplugin-vue-components/vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        vue(),
        VueDevTools(),
        Icons({
            compiler: 'vue3',
            autoInstall: true,
            scale: 1.5
        }),
        Components({
            dirs: ['src/*'],
            extensions: ['vue'],
            resolvers: [
                IconsResolver(),
                VueUseComponentsResolver()
            ],
        }),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'inline',

            pwaAssets: {
                disabled: true,
                config: true,
            },

            manifest: {
                name: 'shanti-board',
                short_name: 'shanti-board',
                description: 'shanti-board',
                theme_color: '#ffffff',
            },

            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
            },

            devOptions: {
                enabled: false,
                navigateFallback: 'index.html',
                suppressWarnings: true,
                type: 'module',
            },
        })
    ],
})
