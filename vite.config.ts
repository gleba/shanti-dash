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
        })
    ],
})
