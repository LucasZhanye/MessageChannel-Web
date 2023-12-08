import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/dark/css-vars.css'

import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import '@/assets/iconfont/iconfont.js'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(router)
    .use(pinia)
    .component('SvgIcon', SvgIcon)
    .mount('#app')
