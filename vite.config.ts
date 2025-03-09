import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import IconsResolver from 'unplugin-icons/resolver'
import {VueUseComponentsResolver} from 'unplugin-vue-components/resolvers'
import Components from "unplugin-vue-components/vite"

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
        // VitePWA({
        //     registerType: 'autoUpdate',
        //     injectRegister: 'inline',
        //
        //     pwaAssets: {
        //         disabled: true,
        //         config: true,
        //     },
        //
        //     manifest: {
        //         name: 'shanti-board',
        //         short_name: 'shanti-board',
        //         description: 'shanti-board',
        //         theme_color: '#ffffff',
        //     },
        //
        //     workbox: {
        //         globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        //         cleanupOutdatedCaches: true,
        //         clientsClaim: true,
        //         navigateFallbackDenylist: [/\/api\/-\d+/],
        //         runtimeCaching: [
        //             {
        //                 //@ts-ignore
        //                 urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
        //                 handler: 'NetworkOnly', // Всегда запрашивать с сервера, без кэширования
        //                 options: {
        //                     backgroundSync: {
        //                         name: 'api-queue',
        //                         options: {
        //                             maxRetentionTime: 1 // Retry for max of 24 hours (in minutes)
        //                         }
        //                     }
        //                 }
        //             }
        //         ]
        //     }
        // })
    ]
})
