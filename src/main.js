import { createApp } from 'vue'

import { store } from '@/store'
import router from '@/router'
import i18n from '@/locale'
import directives from '@/directives'

import App from '@/App.vue'
import './styles/main.scss'

const app = createApp(App)
directives(app)
app.use(i18n)
app.use(router)
app.use(store)
app.mount('#app')
