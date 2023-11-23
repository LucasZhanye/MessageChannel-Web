import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/dark/css-vars.css'

import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import '@/assets/iconfont/iconfont.js'

createApp(App)
    .use(router)
    .component('SvgIcon', SvgIcon)
    .mount('#app')
