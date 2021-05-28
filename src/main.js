import { createApp } from 'vue'
import { store } from '@/store'
import router from '@/router'
import i18n from '@/locale'
import directives from '@/directives'

import App from '@/App.vue'
import 'ant-design-vue/dist/antd.less'
import Button from 'ant-design-vue/lib/Button'

import './styles/main.scss'

const app = createApp(App)
// register directives
directives(app)

// register plugins
app.use(i18n)
app.use(router)
app.use(store)

// register components
app.use(Button)

// mount app
app.mount('#app')
